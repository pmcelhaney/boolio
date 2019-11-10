module.exports = class ExpressionBuilder {
  nonEmptySubsets(set) {
    function nonEmptySubsetsArray(arr) {
      if (arr.length === 0) {
        return [];
      }

      const first = arr[0];
      const others = nonEmptySubsetsArray(arr.slice(1));

      return [[first], ...others, ...others.map(o => [first, ...o])];
    }
    return new Set(nonEmptySubsetsArray(Array.from(set)));
  }

  arrayEquals(a, b) {
    return a.length === b.length && a.every((_, i) => a[i] === b[i]);
  }

  containsAllMinterms(primeImplicants, minterms) {
    return minterms.every(minterm =>
      primeImplicants.some(pi =>
        pi.minterms.some(mt => this.arrayEquals(mt, minterm))
      )
    );
  }

  essentialPrimeImplicants(allPrimeImplicants, minterms) {
    return nonEmptySubsets(allPrimeImplicants)
      .filter(subset => this.containsAllMinterms(subset, minterms))
      .reduce(this.moreConcisePrimeImplicantSet, allPrimeImplicants);
  }

  mintermsFromTruthTable(truthTable) {
    return truthTable.rows
      .filter(row => row.slice(-1)[0])
      .map(row => row.slice(0, -1));
  }

  primeImplicantsFromMinterms(minterms) {
    return this.reducePrimeImplicantGroups(
      this.createPrimeImplicantGroups(minterms),
      []
    );
  }

  createPrimeImplicantGroups(minterms) {
    return this.nonEmptySubsets(minterms);
  }

  combinePrimeImplicants(a, b) {
    const newTerm = [];
    for (const i = 0; i < a.term.length; i++) {
      if (a.term[i] === b.term[i]) {
        newTerm.push(a.term[i]);
        break;
      }
      if (a.term[i] === null || b.term[i] === null) {
        return null;
      }
      if (isFirstDifference) {
        newTerm.push(null);
        isFirstDifference = true;
      } else {
        return null;
      }
    }
    return {
      term: newTerm,
      minterms: [...a.terms, ...b.terms],
      used: false
    };
  }

  moreConcisePrimeImplicantSet(a, b) {
    function countElements(set) {
      return set
        .map(pi => {
          return pi.term.filter(element => element !== null).length;
        })
        .reduce((count, acc) => acc + count, 0);
    }

    if (a.length < b.length) {
      return a;
    }
    if (b.length < a.length) {
      return b;
    }

    if (countElements(a) < countElements(b)) {
      return a;
    }

    if (countElements(b) < countElements(a)) {
      return b;
    }
    return a;
  }

  reducePrimeImplicantGroups(groups, previousIrreduciblePrimeImplicants) {
    const reducedGroups = [];
    for (const i = 0; i < groups.length - 1; i++) {
      const newGroup = [];
      reducedGroups.push(newGroup);
      for (const a in groups[i]) {
        for (const b in groups[i + 1]) {
          const reducedPrimeImplicant = this.combinePrimeImplicants(a, b);
          if (reducedPrimeImplicant) {
            a.used = true;
            b.used = true;
            newGroup.push(reducedPrimeImplicant);
          }
        }
      }
    }

    console.log(groups);
    const irreduciblePrimeImplicants = [
      ...previousIrreduciblePrimeImplicants,
      ...groups.flat().filter(pi => !pi.used)
    ];

    if (reducedGroups.flat().length > 0) {
      return this.reducePrimeImplicantGroups(
        reducedGroups,
        irreduciblePrimeImplicants
      );
    }

    return irreduciblePrimeImplicants;
  }
};

/*
minterm = [ true, false, null, true]

primeImplicant = { minterms: [...], used: true, combinedMinterm: [true, null, null, true]}

pi = new PrimeImplicant(reducedMinterm, minterms)
pi.combine(otherPi)
   pi.combinedMinterm(mt);
pi.isUsed();
pi.minterms();
pi.toString() => "1_01"

mt = new minterm([true, false, false, true])
mt.combine(otherMt)
mt.equals(otherMinterm)



*/
