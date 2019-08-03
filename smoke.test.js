const acorn = require("acorn");

it("parses a simple expression", () => {
  const tree = acorn.parse("a && b");
  expect(tree.body[0].type).toEqual("ExpressionStatement");
});
