This is an example of using the railroad library. It provides the SQLITE CREATE TABLE case.

![ScreenShot](https://github.com/gbrault/railroad-diagrams/blob/gh-pages/SQLITE%20CREATE%20TABLE.html")
<iframe width="854" height="480" src="https://www.youtube.com/embed/yrRPLBYiiEc" frameborder="0" allowfullscreen></iframe>

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
),Sequence(NonTerminal('schema-name'),Terminal("."),NonTerminal('table-name')), // sequence
Sequence(
 Choice(0,
  Sequence(Terminal("("),OneOrMore(NonTerminal("column-def"),Terminal(",")),ZeroOrMore(Terminal(","),NonTerminal("table-constraint")),Terminal(")"),Optional(Sequence(Terminal("WITHOUT"),Terminal("ROWID")))),
  Sequence(Terminal("AS"),NonTerminal("select-stm"))
 ) // choice
)
) // Stack
)
```
