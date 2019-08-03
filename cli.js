const Boolio = require("./Boolio");
const AsciiTable = require("ascii-table");

const expression = process.argv[2];

const truthTable = new Boolio(expression).truthTable();

const asciiTable = AsciiTable.factory({
  heading: [...truthTable.atoms, " = "],
  rows: truthTable.rows.map(cols => cols.map(cell => (cell ? "T" : "F")))
});

for (let i = 0; i <= truthTable.atoms.length; i++) {
  asciiTable.setAlign(i, AsciiTable.CENTER);
}

console.log(expression);
console.log(asciiTable.toString());
