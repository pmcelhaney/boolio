const Boolio = require("./Boolio");
const table = require("table").table;

const expression = process.argv[2];

const truthTable = new Boolio(expression).truthTable();

console.log(
  table(
    [
      [...truthTable.atoms, "="],
      ...truthTable.rows.map(row => row.map(cell => (cell ? "T" : "F")))
    ],
    {
      columns: new Array(4).fill({
        width: 10,
        alignment: "center"
      })
    }
  )
);
