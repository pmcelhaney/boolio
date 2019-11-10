// Get the minterms from the truth table
// essentialExpressions = quineMcClusky(minterms)
// map essentialExpression to AND-expressions and join them with OR

function quineMcClusky(minTerms) {
  const setOfGroups = initializeSetOfGroups(minTerms[0].length + 1);
  console.log(setOfGroups[0].length);
  placePrimeImplicantsInCountOfOneGroups(
    primeImplicantsFromMinterms(minTerms),
    setOfGroups[0]
  );
  for (let iteration = 0; iteration < setOfGroups.length - 1; iteration++) {
    for (let index = 0; index < setOfGroups[iteration].length - 1; index++) {
      for (a of setOfGroups[iteration][index]) {
        for (b of setOfGroups[iteration][index + 1]) {
          if (canCombine(a, b)) {
            a.isUsed = true;
            b.isUsed = true;
            const c = combine(a, b);
            const targetGroup = setOfGroups[iteration + 1][index];
            if (!targetGroup.some(x => x.value === c.value)) {
              setOfGroups[iteration + 1][index].push(combine(a, b));
            }
          }
        }
      }
    }
  }
  const essentialPIs = setOfGroups
    .flat(2)
    .filter(x => !x.isUsed)
    .sort((a, b) => b.minterms.size - a.minterms.size);

  for (let i = essentialPIs.length - 1; i >= 0; i--) {
    const thisPI = essentialPIs[i];
    const mintermsInOtherPIs = essentialPIs
      .filter(pi => pi.value !== thisPI.value)
      .map(pi => [...pi.minterms])
      .flat();
    if (
      [...thisPI.minterms].every(minterm =>
        mintermsInOtherPIs.includes(minterm)
      )
    ) {
      essentialPIs.splice(i, 1);
    }
  }

  return essentialPIs.map(pi => pi.value);
}

function initializeSetOfGroups(count) {
  const result = [];
  for (let size = 1; size <= count; size++) {
    result.unshift(new Array(size).fill(null).map(x => []));
  }

  return result;
}

function primeImplicantsFromMinterms(minterms) {
  return minterms.map(minterm => ({
    value: minterm,
    minterms: new Set([minterm]),
    isUsed: false
  }));
}

function placePrimeImplicantsInCountOfOneGroups(primeImplicants, groups) {
  primeImplicants.forEach(pi => {
    const countOfOnes = pi.value.replace(/[^1]/g, "").length;
    groups[countOfOnes].push(pi);
  });
}

function canCombine(primeImplicantA, primeImplicantB) {
  const a = primeImplicantA.value;
  const b = primeImplicantB.value;
  let alreadyFoundADifference = false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) {
      continue;
    }
    if (a[i] === "_" || b[i] === "_") {
      return false;
    }
    if (alreadyFoundADifference) {
      return false;
    }
    alreadyFoundADifference = true;
  }
  return true;
}

function combine(primeImplicantA, primeImplicantB) {
  const a = primeImplicantA.value;
  const b = primeImplicantB.value;
  let c = "";

  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) {
      c += a[i];
    } else {
      c += "_";
    }
  }
  return {
    value: c,
    isUsed: false,
    minterms: new Set([
      ...primeImplicantA.minterms,
      ...primeImplicantB.minterms
    ])
  };
}

// value: e.g. "1001" or "1_01"
// PrimeImplicant
// - isUsed (boolean)
// - minTerms (array of expressions that do not have underscores)
// - value (expression that can have underscores)

// quineMcClusky(['10100', '10101', '10110', '10111', '11001', '11111', '11011']) => ["110_1", "11_11", "101__"]
