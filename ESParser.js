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

  if (node.type === "MemberExpression") {
    return `${atomFromAcorn(node.object)}.${atomFromAcorn(node.property)}`;
  }

  if (node.type === "BinaryExpression") {
    return `${atomFromAcorn(node.left)} ${node.operator} ${atomFromAcorn(
      node.right
    )}`;
  }

  return `?${node.type}?`;
}

module.exports = class AcornTransformer {
  parse(expression) {
    return this.fromAcorn(acorn.parse(expression));
  }

  fromAcorn(node) {
    if (node.type === "Program") {
      return this.fromAcorn(node.body[0]);
    }

    if (node.type === "ExpressionStatement") {
      return this.fromAcorn(node.expression);
    }

    if (node.type === "LogicalExpression") {
      return {
        type: node.operator === "||" ? "or" : "and",
        left: this.fromAcorn(node.left),
        right: this.fromAcorn(node.right)
      };
    }

    if (node.type === "UnaryExpression" && node.operator === "!") {
      return {
        type: "not",
        argument: this.fromAcorn(node.argument)
      };
    }

    if (node.type === "Identifier") {
      return {
        type: "atom",
        name: node.name
      };
    }

    if (
      node.type === "CallExpression" ||
      node.type === "BinaryExpression" ||
      node.type === "MemberExpression"
    ) {
      return {
        type: "atom",
        name: atomFromAcorn(node)
      };
    }

    throw new Error(`Unrecognized node type: ${node.type}`);
  }
};
