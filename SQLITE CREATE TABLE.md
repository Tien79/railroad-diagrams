This is an example of using the railroad library. It provides the SQLITE CREATE TABLE case.

[Result ScreenShot](http://htmlpreview.github.com/?https://github.com/gbrault/railroad-diagrams/blob/gh-pages/SQLITE CREATE TABLE.html)

or test it live [live](http://htmlpreview.github.com/?https://github.com/gbrault/railroad-diagrams/blob/gh-pages/CREATE%20TABLE%20rail-road.html)

```javascript
Diagram(
Stack(Sequence(
 Terminal('CREATE',"/doc/create"),
  Choice(0,
    Skip(),
    Terminal('TEMP'),
    Terminal('TEMPORARY')
  ),
 Terminal('TABLE'),
  Choice(0,Skip(),Sequence(Terminal('IF',"javascript:doc('if')"),Terminal('NOT'),Terminal('EXISTS'))
 ) // sequence
),Sequence(Optional(Sequence(NonTerminal('schema-name'),Terminal("."))),NonTerminal('table-name')), // sequence
Sequence(
 Choice(0,
  Sequence(Terminal("("),OneOrMore(NonTerminal("column-def"),Terminal(",")),ZeroOrMore(Terminal(","),NonTerminal("table-constraint")),Terminal(")"),Optional(Sequence(Terminal("WITHOUT"),Terminal("ROWID")))),
  Sequence(Terminal("AS"),NonTerminal("select-stm"))
 ) // choice
)
) // Stack
)
```
