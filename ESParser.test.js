const ESParser = require("./ESParser");

const parser = new ESParser();

function parse(expression) {
  return parser.parse(expression);
}

describe("builds a boolio tree from a JS expression", () => {
  it("simple or expression", () => {
    expect(parse("a || b")).toEqual({
      type: "or",
      left: { type: "atom", name: "a" },
      right: { type: "atom", name: "b" }
    });
  });

  it("simple and expression", () => {
    expect(parse("a && b")).toEqual({
      type: "and",
      left: { type: "atom", name: "a" },
      right: { type: "atom", name: "b" }
    });
  });

  it("simple not expression", () => {
    expect(parse("!a")).toEqual({
      type: "not",
      argument: { type: "atom", name: "a" }
    });
  });

  it("multiple operators", () => {
    expect(parse("a || b && c")).toEqual({
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
    expect(parse("(a || b)")).toEqual({
      type: "or",
      left: { type: "atom", name: "a" },
      right: { type: "atom", name: "b" }
    });
  });

  it("grouping with multiple operators", () => {
    expect(parse("(a || b) && c")).toEqual({
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
    expect(parse("foo() && bar(1,2,x)")).toEqual({
      type: "and",
      left: { type: "atom", name: "foo()" },
      right: { type: "atom", name: "bar(1,2,x)" }
    });
  });

  it("nested call expression", () => {
    expect(parse("foo(bar(1)) && x")).toEqual({
      type: "and",
      left: { type: "atom", name: "foo(bar(1))" },
      right: { type: "atom", name: "x" }
    });
  });

  it("call with operator", () => {
    expect(parse("foo(a && b)")).toEqual({
      type: "atom",
      name: "foo(a && b)"
    });
  });

  it("member and binary expressions", () => {
    expect(
      parse(
        "wire.frequency.type !== 'OneTime' && (!wire.beneficiary.isInternational)"
      )
    ).toEqual({
      type: "and",
      left: { type: "atom", name: "wire.frequency.type !== 'OneTime'" },
      right: {
        type: "not",
        argument: {
          type: "atom",
          name: "wire.beneficiary.isInternational"
        }
      }
    });
  });
});
