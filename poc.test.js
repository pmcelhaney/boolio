const acorn = require("acorn");

function atomFromAcorn(node) {
  if (node.raw) {
    return node.raw;
  }
  if (node.type === "Identifier") {
    return node.name;
  }
  if (node.type === "CallExpression") {
    return `${node.callee.name}(${node.arguments.map(atomFromAcorn)})`;
  }

  if (node.type === "LogicalExpression") {
    return `${atomFromAcorn(node.left)} ${node.operator} ${atomFromAcorn(
      node.right
    )}`;
  }

  return `?${node.type}?`;
}

function fromAcorn(node) {
  if (node.type === "Program") {
    return fromAcorn(node.body[0]);
  }

  if (node.type === "ExpressionStatement") {
    return fromAcorn(node.expression);
  }

  if (node.type === "LogicalExpression") {
    return {
      type: node.operator === "||" ? "or" : "and",
      left: fromAcorn(node.left),
      right: fromAcorn(node.right)
    };
  }

  if (node.type === "Identifier") {
    return {
      type: "atom",
      name: node.name
    };
  }

  if (node.type === "CallExpression") {
    return {
      type: "atom",
      name: atomFromAcorn(node)
    };
  }

  throw new Error(`Unrecognized node type: ${node.type}`);
}

describe("builds a boolio tree from an acorn tree", () => {
  it("simple or expression", () => {
    const tree = acorn.parse("a || b");
    expect(fromAcorn(tree)).toEqual({
      type: "or",
      left: { type: "atom", name: "a" },
      right: { type: "atom", name: "b" }
    });
  });

  it("simple and expression", () => {
    const tree = acorn.parse("a && b");
    expect(fromAcorn(tree)).toEqual({
      type: "and",
      left: { type: "atom", name: "a" },
      right: { type: "atom", name: "b" }
    });
  });

  it("multiple operators", () => {
    const tree = acorn.parse("a || b && c");
    expect(fromAcorn(tree)).toEqual({
      type: "or",
      left: { type: "atom", name: "a" },
      right: {
        type: "and",
        left: { type: "atom", name: "b" },
        right: { type: "atom", name: "c" }
      }
    });
  });

  it("grouping", () => {
    const tree = acorn.parse("(a || b)");
    expect(fromAcorn(tree)).toEqual({
      type: "or",
      left: { type: "atom", name: "a" },
      right: { type: "atom", name: "b" }
    });
  });

  it("grouping with multiple operators", () => {
    const tree = acorn.parse("(a || b) && c");
    expect(fromAcorn(tree)).toEqual({
      type: "and",
      left: {
        type: "or",
        left: { type: "atom", name: "a" },
        right: { type: "atom", name: "b" }
      },
      right: { type: "atom", name: "c" }
    });
  });

  it("call expression", () => {
    const tree = acorn.parse("foo() && bar(1,2,x)");
    expect(fromAcorn(tree)).toEqual({
      type: "and",
      left: { type: "atom", name: "foo()" },
      right: { type: "atom", name: "bar(1,2,x)" }
    });
  });

  it("nested call expression", () => {
    const tree = acorn.parse("foo(bar(1)) && x");
    expect(fromAcorn(tree)).toEqual({
      type: "and",
      left: { type: "atom", name: "foo(bar(1))" },
      right: { type: "atom", name: "x" }
    });
  });

  it("call with operator", () => {
    const tree = acorn.parse("foo(a && b)");
    expect(fromAcorn(tree)).toEqual({
      type: "atom",
      name: "foo(a && b)"
    });
  });
});
