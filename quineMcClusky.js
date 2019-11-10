// Get the minterms from the truth table
// essentialExpressions = quineMcClusky(minterms)
// map essentialExpression to AND-expressions and join them with OR

function quineMcClusky(minTerms) {
  const setOfGroups = initializeSetOfGroups(minTerms[0].length); //  stairstep array of empty arrays (..., [ [],[],[] ], [ [],[] ], [ [] ])
  placePrimeImplicantsInCountOfOneGroups(
    primeImplicantsFormMinterms(minTerms),
    setOfGroups[0]
  );
  const essentialPIs = [];
  for (let iteration = 0; iteration < setOfGroups.length - 1; iteration++) {
    for (
      let countOfOnes = 0;
      i < setOfGroups[iteration].length - 1;
      countOfOnes++
    ) {
      for (a in setOfGroups[iteration][countOfOnes]) {
        for (b in setOfGroups[iteration][countOfOnes + 1]) {
          if (canCombine(a, b)) {
            a.isUsed = true;
            b.isUsed = true;
            setOfGroups[iteration + 1][countOfOnes].push(combine(a, b));
          }
        }
      }
    }
  }
  // essentialPIs = all unused in setOfGroups
  // sort essentialPIs by count of minterms descending
  // for each essentialPI (working backwards)
  //     if all of its minterms can be covered by other remaining PIs
  //         remove it

  return essentialPIs.map(pi => pi.expression);
}

function initializeSetOfGroups(count) {
  // return stairstep array of empty arrays (..., [ [],[],[] ], [ [],[] ], [ [] ])
}

function primeImplicantsFromMinterms(minterms) {
  return minterms.map(minterm => ({
    expression: minterm,
    minterms: [minterm],
    isUsed: false
  }));
}

function placePrimeImplicantsInCountOfOneGroups(primeImplicants, groups) {
  primeImplicants.forEach(pi => {
    const countOfOnes = pi.expression.replace(/[^1]/, "").length;
    groups[countOfOnes].push(pi);
  });
}

function canCombine(a, b) {}

function combine(a, b) {}

// expression: e.g. "1001" or "1_01"
// PrimeImplicant
// - isUsed (boolean)
// - minTerms (array of expressions that do not have underscores)
// - expression
