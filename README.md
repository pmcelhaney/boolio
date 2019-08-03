# Boolio

Boolio is a little app that will take a boolean expression

```js
(isRaining && !has("umbrella")) ||
  (!isRaining && temperature < 50 && (age < 7 || age > 18));
```

and turn it into a truth table.

> [insert truth table]

You will then be able to inspect the truth table, fix any results that are wrong, and automatically update the boolean expression to match the truth table.

It will also simplify the expression (if possible), using the [Quine-McCluskly algorithm](https://en.wikipedia.org/wiki/Quine%E2%80%93McCluskey_algorithm) and provide a head start on filling in missing tests.

```js
function myFunction(a,b,c,d,e) {
    return isRaining && !has("umbrella")) || (!isRaining && temperature < 50 && (age < 7 || age > 18);
}

expect.each([/*truth table*/], (`Given isRaining === %s, has('umbrella') === %s, temperature < 50 === %s, age < 7 === %s, and age > 18 === %s, result is %s`))(a, b, c, d, e, result) {
    return myFunction(a, b, c, d, e ) === result;
}
```

The first iteration will work with JavaScript. Support for other languages and unit test frameworks will follow.

This is mostly just for fun. I dunno, maybe it will lead to something useful.
