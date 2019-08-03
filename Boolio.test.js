function api() {
  const boolio = new Boolio("foo && bar");

  boolio.atoms(); // ['foo', 'bar']
  boolio.evaluate({ foo: true, bar: true }); // true

  boolio.truthTable(); /*
{
   atoms: ['foo', 'bar'],
   rows: [
       [true, true, true],
       [true, false, true],
       [false, true, true],
       [false, false, false]
   ]
}
*/
}

const Boolio = require("./Boolio");

function evaluate(expression, values) {
  return new Boolio(expression).evaluate(values);
}

function evaluateNode(ast, values) {
  return new Boolio().evaluateNode(ast, values);
}

const T = true;
const F = false;

it.each([[T, T, T], [T, F, F], [F, T, F], [F, F, F]])(
  "given a = %s, b = %s: a and b === %s",
  (a, b, result) => {
    const ast = {
      type: "and",
      left: { type: "atom", name: "a" },
      right: { type: "atom", name: "b" }
    };
    expect(evaluateNode(ast, { a, b })).toEqual(result);
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
    expect(evaluateNode(ast, { a, b })).toEqual(result);
  }
);

it.each([[T, F], [F, T]])("given a = %s, not a === %s", (a, result) => {
  const ast = {
    type: "not",
    argument: { type: "atom", name: "a" }
  };
  expect(evaluateNode(ast, { a })).toEqual(result);
});

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
  expect(evaluateNode(ast, { a, b, c })).toEqual(result);
});

it.each([[T, T, T], [T, F, F], [F, T, F], [F, F, F]])(
  "given a = %s, b = %s: a && b === %s",
  (a, b, result) => {
    expect(evaluate("a && b", { a, b })).toEqual(result);
  }
);

it("finds the unique atoms in an expression", () => {
  const boolio = new Boolio("foo && bar(1) || (bar(2) && !foo)");
  expect(boolio.atoms()).toEqual(new Set(["foo", "bar(1)", "bar(2)"]));
});

it("generates a truth table for an expression", () => {
  const boolio = new Boolio("foo && bar || foo && baz");
  expect(boolio.truthTable()).toEqual({
    atoms: ["foo", "bar", "baz"],
    rows: [
      [true, true, true, true],
      [true, true, false, true],
      [true, false, true, true],
      [true, false, false, false],
      [false, true, true, false],
      [false, true, false, false],
      [false, false, true, false],
      [false, false, false, false]
    ]
  });
});