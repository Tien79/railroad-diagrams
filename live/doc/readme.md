# Introduction

I always have been fascinated by formal languages... I mean computer languages! I just discovered a new way of "representing" those languages and want to share that.

# Multiple representations

Representing grammars is a rich field of work since 6 or so decades and many existing forms have been released so far. You can go and see articles dealing with this matter googleing or wikipediaing... Here is a list of article to learn more about that

- [Syntax](http://cs.lmu.edu/~ray/notes/syntax/)
- [Context Free Grammar](https://en.wikipedia.org/wiki/Context-free_grammar)
- [EBNF](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form)
- [Syntax Diagram](https://en.wikipedia.org/wiki/Syntax_diagram)

My 'discovery' is just to add one more representation, which I call a 'Syntax representation by a Function Basis' of grammars. I will show that this representation is equivallent of EBNF and Syntax Diagram.

In fact, I have discovered that, looking to tabakins code which was generating 'syntax diagrams' from a description of it by such a kind of basis.

Here is two simple examples of the three equivalent representation of a grammar contruct

Syntax Diagram
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/expression.svg)
EBNF
```
```
expression:"(`expression` ,  term ('+' term )* , `END expression`)"
```javascript
/********************************************************************************************************************************/ 
  Show(Sequence(Title('expression'),OneOrMore(NonTerminal('term'),Terminal('+')), Comment('END expression')) /* Sequence */ 
  ); /* expression */ 
```

## 
