const ExpressionBuilder = require("./ExpressionBuilder");

describe("ExpressionBuilder", () => {
  const eb = new ExpressionBuilder();

  it("finds all of the non-empty subsets of a set (Array)", () => {
    expect(eb.nonEmptySubsets(new Set([1]))).toEqual(new Set([[1]]));
  });

  it("finds all of the non-empty subsets of a set (Array)", () => {
    expect(new Set(eb.nonEmptySubsets([1, 2, 3]))).toEqual(
      new Set([[1], [2], [3], [1, 2], [2, 3], [1, 3], [1, 2, 3]])
    );
  });

  it("arrayEquals", () => {
    expect(eb.arrayEquals([], [])).toEqual(true);
    expect(eb.arrayEquals([true, false], [true, false])).toEqual(true);
    expect(eb.arrayEquals([true, false], [true, true])).toEqual(false);
    expect(eb.arrayEquals([true, true], [true, true, true])).toEqual(false);
  });

  it("containsAllMinterms", () => {
    expect(
      eb.containsAllMinterms(
        [
          { minterms: [[true, true], [true, false]] },
          { minterms: [[true, true], [false, false]] }
        ],
        [[true, true], [true, false], [false, false]]
      )
    ).toEqual(true);

    expect(
      eb.containsAllMinterms(
        [
          { minterms: [[true, true], [true, false]] },
          { minterms: [[true, true]] }
        ],
        [[true, true], [true, false], [false, false]]
      )
    ).toEqual(false);
  });

  it("moreConcisePrimeImplicant", () => {
    const big = [
      { term: [true, null, null] },
      { term: [true, null, false] },
      { term: [false, null, false] }
    ];

    const small = [
      { term: [true, true, true] },
      { term: [false, false, false] }
    ];

    const smallWithSmallerTerms = [
      { term: [true, true, true] },
      { term: [false, false, null] }
    ];

    expect(eb.moreConcisePrimeImplicantSet(big, small)).toEqual(small);
    expect(
      eb.moreConcisePrimeImplicantSet(small, smallWithSmallerTerms)
    ).toEqual(smallWithSmallerTerms);
  });
});
