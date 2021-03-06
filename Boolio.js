const ESParser = require("./ESParser");

const parser = new ESParser();

function booleanPairCombinations(n) {
  if (n === 1) {
    return [[true], [false]];
  }

  const combinationsMinusOne = booleanPairCombinations(n - 1);
  return combinationsMinusOne
    .map(rows => [true, ...rows])
    .concat(combinationsMinusOne.map(rows => [false, ...rows]));
}

module.exports = class Boolio {
  constructor(expression) {
    this.ast = this.parse(expression);
  }

  parse(expression) {
    return parser.parse(expression);
  }

  evaluate(values) {
    return this.evaluateNode(this.ast, values);
  }

  evaluateNode(node, values) {
    if (node.type === "atom") {
      return values[node.name];
    }

    if (node.type === "and") {
      return (
        this.evaluateNode(node.left, values) &&
        this.evaluateNode(node.right, values)
      );
    }

    if (node.type === "or") {
      return (
        this.evaluateNode(node.left, values) ||
        this.evaluateNode(node.right, values)
      );
    }

    if (node.type === "not") {
      return !this.evaluateNode(node.argument, values);
    }

    throw new Error(`Cannot evaluate type: ${node.type}`);
  }

  atoms() {
    function findAtoms(node) {
      if (node.type === "atom") {
        return [node.name];
      }
      if (node.type === "or" || node.type === "and") {
        return findAtoms(node.left).concat(findAtoms(node.right));
      }
      if (node.type === "not") {
        return findAtoms(node.argument);
      }
    }

    return new Set(findAtoms(this.ast));
  }

  truthTable() {
    const atoms = Array.from(this.atoms());
    return {
      atoms,
      rows: booleanPairCombinations(atoms.length).map(row => {
        const values = {};
        atoms.forEach((atom, i) => {
          values[atom] = row[i];
        });
        return [...row, this.evaluate(values)];
      })
    };
  }
};
