const T = true;
const F = false;

function evaluate(node, values) {
  if (node.type === "atom") {
    return values[node.name];
  }

  if (node.type === "and") {
    return evaluate(node.left, values) && evaluate(node.right, values);
  }

  if (node.type === "or") {
    return evaluate(node.left, values) || evaluate(node.right, values);
  }

  throw new error(`Cannot evaluate type: ${node.type}`);
}

it.each([[T, T, T], [T, F, F], [F, T, F], [F, F, F]])(
  "given a = %s, b = %s: a and b === %s",
  (a, b, result) => {
    const ast = {
      type: "and",
      left: { type: "atom", name: "a" },
      right: { type: "atom", name: "b" }
    };
    expect(evaluate(ast, { a, b })).toEqual(result);
  }
);

it.each([[T, T, T], [T, F, T], [F, T, T], [F, F, F]])(
  "given a = %s, b = %s: a or b === %s",
  (a, b, result) => {
    const ast = {
      type: "or",
      left: { type: "atom", name: "a" },
      right: { type: "atom", name: "b" }
    };
    expect(evaluate(ast, { a, b })).toEqual(result);
  }
);

it.each([
  [T, T, T, T],
  [T, T, F, T],
  [T, F, F, F],
  [T, F, T, T],
  [F, F, T, T],
  [F, T, T, T],
  [F, T, F, F],
  [F, F, F, F]
])("given a = %s, b = %s, c = %s: a and b or c === %s", (a, b, c, result) => {
  const ast = {
    type: "or",
    left: {
      type: "and",
      left: { type: "atom", name: "a" },
      right: { type: "atom", name: "b" }
    },
    right: { type: "atom", name: "c" }
  };
  expect(evaluate(ast, { a, b, c })).toEqual(result);
});
