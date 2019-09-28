# Boolio

Boolio is a little app that will take a boolean expression

```js
(isRaining && !has("umbrella")) ||
  (!isRaining && temperature < 50 && (age < 7 || age > 18));
```

and turn it into a truth table.

<table>
   <thead><th scope="col">isRaining</th><th scope="col">has("umbrella")</th><th scope="col">temperature &lt; 50</th><th scope="col">age &lt; 7</th><th scope="col">age &gt; 18</th><th scope="col">=</th></thead>
      <tbody><tr><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td></tr><tr><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td><td>F</td></tr><tr><td>T</td><td>T</td><td>T</td><td>F</td><td>T</td><td>F</td></tr><tr><td>T</td><td>T</td><td>T</td><td>F</td><td>F</td><td>F</td></tr><tr><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td><td>F</td></tr><tr><td>T</td><td>T</td><td>F</td><td>T</td><td>F</td><td>F</td></tr><tr><td>T</td><td>T</td><td>F</td><td>F</td><td>T</td><td>F</td></tr><tr><td>T</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td></tr><tr><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>T</td><td>F</td><td>T</td><td>T</td><td>F</td><td>T</td></tr><tr><td>T</td><td>F</td><td>T</td><td>F</td><td>T</td><td>T</td></tr><tr><td>T</td><td>F</td><td>T</td><td>F</td><td>F</td><td>T</td></tr><tr><td>T</td><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td></tr><tr><td>T</td><td>F</td><td>F</td><td>T</td><td>F</td><td>T</td></tr><tr><td>T</td><td>F</td><td>F</td><td>F</td><td>T</td><td>T</td></tr><tr><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td></tr><tr><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>F</td><td>T</td><td>T</td><td>T</td><td>F</td><td>T</td></tr><tr><td>F</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td></tr><tr><td>F</td><td>T</td><td>T</td><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>T</td><td>F</td><td>T</td><td>T</td><td>F</td></tr><tr><td>F</td><td>T</td><td>F</td><td>T</td><td>F</td><td>F</td></tr><tr><td>F</td><td>T</td><td>F</td><td>F</td><td>T</td><td>F</td></tr><tr><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>F</td><td>F</td><td>T</td><td>T</td><td>F</td><td>T</td></tr><tr><td>F</td><td>F</td><td>T</td><td>F</td><td>T</td><td>T</td></tr><tr><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>F</td><td>F</td><td>T</td><td>T</td><td>F</td></tr><tr><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td></tr><tr><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td></tr><tr><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td></tr></tbody>
</table>

You will\* then be able to inspect the truth table, fix any results that are wrong, and automatically update the boolean expression to match the truth table.

It will\* also simplify the expression (if possible), using the [Quine-McCluskly algorithm](https://en.wikipedia.org/wiki/Quine%E2%80%93McCluskey_algorithm) and provide a head start on filling in missing tests.

```js
function myFunction(a,b,c,d,e) {
    return isRaining && !has("umbrella") || (!isRaining && temperature < 50 && (age < 7 || age > 18));
}

expect.each([
      [ true, true, true, true, true, false ],
      [ true, true, true, true, false, false ],
      [ true, true, true, false, true, false ],
      [ true, true, true, false, false, false ],
      [ true, true, false, true, true, false ],
      [ true, true, false, true, false, false ],
      [ true, true, false, false, true, false ],
      [ true, true, false, false, false, false ],
      [ true, false, true, true, true, true ],
      [ true, false, true, true, false, true ],
      [ true, false, true, false, true, true ],
      [ true, false, true, false, false, true ],
      [ true, false, false, true, true, true ],
      [ true, false, false, true, false, true ],
      [ true, false, false, false, true, true ],
      [ true, false, false, false, false, true ],
      [ false, true, true, true, true, true ],
      [ false, true, true, true, false, true ],
      [ false, true, true, false, true, true ],
      [ false, true, true, false, false, false ],
      [ false, true, false, true, true, false ],
      [ false, true, false, true, false, false ],
      [ false, true, false, false, true, false ],
      [ false, true, false, false, false, false ],
      [ false, false, true, true, true, true ],
      [ false, false, true, true, false, true ],
      [ false, false, true, false, true, true ],
      [ false, false, true, false, false, false ],
      [ false, false, false, true, true, false ],
      [ false, false, false, true, false, false ],
      [ false, false, false, false, true, false ],
      [ false, false, false, false, false, false ]
    ], `Given isRaining === %s, has('umbrella') === %s, temperature < 50 === %s, age < 7 === %s, and age > 18 === %s, result is %s`)(a, b, c, d, e, result) {
    expect(myFunction(a, b, c, d, e)).toEqual(result);
}
```

The first iteration will work with JavaScript. Support for other languages and unit test frameworks will follow.

This is mostly just for fun. I dunno, maybe it will lead to something useful.

<small>\* Not implmeted yet</small>
