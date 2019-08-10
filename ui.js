document
  .getElementById("expression")
  .addEventListener("keyup", e => evaluateExpression(e.target.value));

function evaluateExpression(expression) {
  const boolio = new Boolio(expression);
  renderTruthTable(boolio.truthTable(), document.getElementById("truth-table"));
}

function renderTruthTable(truthTable, htmlTable) {
  const thead = htmlTable.querySelector("thead");
  const tbody = htmlTable.querySelector("tbody");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  truthTable.atoms.forEach(atom => thead.appendChild(createTh(atom)));
  thead.appendChild(createTh("="));

  truthTable.rows.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(col => {
      const td = document.createElement("td");
      td.innerText = col ? "T" : "F";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function createTh(text) {
  const th = document.createElement("th");
  th.setAttribute("scope", "col");
  th.innerText = text;
  return th;
}
