# Introduction

I always have been fascinated by formal languages... I mean computer languages! I just discovered a new way of "representing" those languages and want to share that.

# Multiple representations

Representing grammars is a rich field of work since 6 or so decades and many existing forms have been released so far. You can go and see articles dealing with this matter googleing or wikipediaing... Here is a list of article to learn more about that

- [Syntax](http://cs.lmu.edu/~ray/notes/syntax/)
- [Context Free Grammar](https://en.wikipedia.org/wiki/Context-free_grammar)
- [EBNF](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form)
- [Syntax Diagram](https://en.wikipedia.org/wiki/Syntax_diagram)

To benefit further reading, understanding of basic formal grammar concepts are necessary.
My 'discovery' is just to add one more representation, which I call a 'Syntax representation by a Function Basis' (SRFB) of grammars. I will show that this representation is equivallent of EBNF and Syntax Diagram.

In fact, I have discovered that, looking to tabakins code which was generating 'syntax diagrams' from a description of it by such a kind of basis.

Here is a simple example of the three equivalent representation of a grammar 'chunck'

- Syntax Diagram
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/expression.svg)
- EBNF
```
expression:"(`expression` ,  term ('+' term )* , `END expression`)"
```
- SRFB
```javascript
/************************************************************************************************************************/ 
  Show(
        Sequence( Title('expression'),
                  OneOrMore(NonTerminal('term'),Terminal('+')), 
                  Comment('END expression')
                 ) /* Sequence */ 
  ); /* expression */ 
```

Off course, the latest representation SRFB is kind of heavy... Compared to the first two! 

But most of the benefits of SRFB is that a javascript compiler understands the syntax, and depending upon the definition of the Function Basis, one can produce different transformation of the grammar. So, from a practical standpoint it's not that stupid!

What tabatkins is actually doing is using a basis definition which allows to move from SRFB to Syntax Diagram representation: he has defined a set of function which allows to draw graphs fro the SRFB input! Cleaver!

My discovery was just to move one step forward: changing the basis definition to get different jobs done. I have implemented Function Basis to

- Generate the EBNF format of the SRFB
- Generate a tree representation of the grammar (guess it's an AST somehow)
- Generate a function basis to parse the grammar laguage and the associated core function basis to actually validate any corresponding statements

## The Core Functional Basis definition

| Function              | Description                                                                                            | 
| --------------------- |--------------------------------------------------------------------------------------------------------| 
| RailRoad              | This is the topmost function: oneOrMore "Show" Constructs                                               |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams//live/doc/svg/RailRoad.svg)                    |
|
