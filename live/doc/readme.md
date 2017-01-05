# Introduction

I always have been fascinated by formal languages... I mean computer languages! I just discovered a new way of "representing" those languages and want to share that. By representing I mean learn and test if expression match with grammar rules.

# Multiple representations

Representing grammars is a rich field of work since 8 or 7 decades or so (the present article is written in January 2017) and many existing forms have been released so far. You can go and see articles dealing with this matter googleing or wikipediaing... Here is a list of articles to learn more about that (valid 1/5/2017)

- [Syntax](http://cs.lmu.edu/~ray/notes/syntax/)
- [Context Free Grammar](https://en.wikipedia.org/wiki/Context-free_grammar)
- [EBNF](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form)
- [Syntax Diagram](https://en.wikipedia.org/wiki/Syntax_diagram)

To benefit further reading of this article, understanding of basic formal grammar concepts are necessary: EBNF and Syntax Diagram.

The guy whom made the syntax diagram popular is **Niklaus Wirth** [see Pascal User manual](https://books.google.fr/books?isbn=0387976493) in the late 70's.

![alt-tag](https://gbrault.github.io/railroad-diagrams/live/doc/svg/Pascal1.png)
![alt-tag](https://gbrault.github.io/railroad-diagrams/live/doc/svg/pascal2.png)

My 'discovery' is just to add one more representation, which I call a '**S**yntax **R**epresentation by a **F**unction **B**asis' (SRFB) of grammars. I will show (not proof) that this representation is equivalent to EBNF and Syntax Diagram.

In fact, I have made this 'discovery', looking to tabakins code which was generating 'syntax diagrams' from a description of it by such a kind of basis. I am not sure this 'discovery' is genuine, but so far, I didn't found anything googleing... This might change!

Here is a simple example of the three equivalent representation of a grammar 'chunck' which meaning is: an expression is a sequence of term(s) separated by '+' sign.

- Syntax Diagram
![alt tag](https://gbrault.github.io/railroad-diagrams/live/doc/svg/expression.svg)
- EBNF
```
expression:"(`expression` ,  term ('+' term )* , `END expression`)"
```
- SRFB
```javascript
/***************************************************************************************************************/ 
  Show(
        Sequence( Title('expression'),
                  OneOrMore(NonTerminal('term'),Terminal('+')), 
                  Comment('END expression')
                 ) /* Sequence */ 
  ); /* expression */ 
```

Of course, the latest representation SRFB is kind of heavy... Compared to the first two! 

But most of the benefits of SRFB is that a javascript compiler understands the syntax, and depending upon the definition of the Function Basis, one can produce different transformation of the grammar. So, from a practical standpoint it's not that stupid!

What tabatkins is actually doing is using a basis definition which allows to move from SRFB to Syntax Diagram representation: he has defined a set of function which allows to draw graphs from an SRFB input! Cleaver!

My discovery was just to move one step forward: changing the basis definition to get different jobs done. I have implemented Function Basis to

- Generate the EBNF format of the SRFB
- Generate a tree representation of the grammar (guess it's an AST somehow)
- Generate a function basis to parse the grammar language and the associated core function basis to actually validate any corresponding statements

# The Core Functional Basis composition

The following table, providing one entry by core function, explains the syntax for composing those functions to represent a grammar. Names in italic are not functions of the basis per say, as they are composed of core functions, but they enable to better understand the grammar of to generate SFRB expressions. Any grammar represented according to the following rules defined in this table are likely to be processed by the live tool accessible [here](https://gbrault.github.io/railroad-diagrams/live/live.html).

| Function              | Description                                                                                            | 
| --------------------- |--------------------------------------------------------------------------------------------------------| 
| RailRoad              | RailRoad: This is the topmost function                                                                 |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/RailRoad.svg)                     |
|                       | ``` RailRoad:"(`RailRoad` ,  Show (';' Show )* , `END Railroad`)" ```                                  |       
| Show                  | Show: Processing a Diagram                                                                             |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/Show.svg)                         |
|                       | ``` Show:"(`Show` , ('Show' , '(' , (( Title  , (',' ,  Childs )? , ',' ,  Comment ) |  Title Stack  |  Title Sequence ) , ')') , `END Show`)" ```   |
| string                | string: Check against a string regexp pattern (similar to javascript strings)                                  |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/string.svg)                       |
|                       | ``` string:"(`string` , ('/\'(?:[^\']|.)*\'/' | '/"(?:[^"]|.)*"/' | '/[^\'"]+/') , `END string`)" ```  |
| ordinal               | Ordinal: check against an ordinal number i.e. Natural number                                           |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/ordinal.svg)                      |
|                       | ``` ordinal:"(`ordinal` , ('0' | ('/[1-9]/' , '/[0-9]*/')) , `END ordinal`)" ```                       |
| Title                 | Title: naming the Diagram  (only one Title per Show)                                                   |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Title.svg)                       |
|                       | ``` Title:"(`Title` , ('Title' , '(' ,  string  , ')') , `END Title`)" ```                             |
| Comment               | Comment: Add comment anywhere in a Diagram and required as a last Child                                |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/Comment.svg)                      |
|                       | ``` Comment:"(`Comment` , ('Comment' , '(' ,  string  , ')') , `END Comment`)" ```                     |
| _Title Sequence_      | Title Sequence: a sequence of Childs, rendered Left to Right, first Child being Title                  |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Title Sequence.svg)              |
|                       | ``` Title Sequence:"(`Title Sequence` , (('Sequence' , '(' ,  Title ) , \n(',' ,  Childs )? , \n')') , `END Title Sequence` ``` |
| _Title Stack_         | Title Stack: same as Sequence, but rendering top to bottom: one Child per line                         |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/Title Stack.svg)                  |
|                       | ``` Title Stack:"(`Title Stack` , (('Stack' , '(' ,  Title ) , \n(',' ,  Childs )? , \n')') , `END Title Stack`)" ```                     |
| _TwoOrMoreChilds_     | TwoOrMoreChilds: a Child and ZeroOrMore Child separated by commas                                      |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/TwoOrMoreChilds.svg)              |
|                       | ``` TwoOrMoreChilds:"(`TwoOrMoreChilds` ,  Child  , ',' ,  Child (',' Child )* , `END TwoOrMoreChilds`)" ``` |
| Sequence              | Sequence: a sequence of Childs separated by commas, rendered Left to Right                             |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/Sequence.svg)                     |
|                       | ``` Sequence:"(`Sequence` , 'Sequence' , '(' ,  Childs  , ')' , `END Sequence`)" ```                   |
| Stack                 | Stack: OneOrMore Child separated by commas, rendered Top to bottom                                     |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/Stack.svg)                        |
|                       | ``` Stack:"(`Stack` , 'Stack' , '(' ,  Childs  , ')' , `END Stack`)" ```                               |
| Choice                | Choice: Selecting one Child among a list or Skip . The ordinal designate which child in the list is the 'normal' selection         |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/Choice.svg)                       |
|                       | ``` Choice:"(`Choice` , 'Choice' , '(' ,  ordinal  , ',' ,  TwoOrMoreChilds  , ')' , `END Choice`)" ```  |
| Optional              | Optional: Select a Child or Skip                                                                       |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/Optional.svg)                     |
|                       | ``` Optional:"(`Optional` , 'Optional' , '(' ,  Child  , ')' , `END Optional`)" ```                    |
| OneOrMore             | OneOrMore: A Child followed by an optional sequence of The same kind of Child, separated by a second Child  |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/OneOrMore.svg)                    |
|                       | ``` OneOrMore:"(`OneOrMore` , 'OneOrMore' , '(' ,  Child  , ',' ,  Child  , ')' , `END OneOrMore`)" ``` |
| ZeroOrMore            | ZeroOrMore: an optional sequence of a given Child, separated by a second Child                         |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/OneOrMore.svg)                    |
|                       | ``` ZeroOrMore:"(`ZeroOrMore` , 'ZeroOrMore' , '(' ,  Child  , ',' ,  Child  , ')' , `END ZeroOrMore`)" ``` |
| Terminal              | Terminal: one string literal or Regex matching                                                         |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/Terminal.svg)                     |
|                       | ``` Terminal:"(`Terminal` , ('Terminal' , '(' ,  string  , ')') , `END Terminal`)" ```                 |
| NonTerminal           | NonTerminal: one string literal                                                      |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/NonTerminal.svg)                  |
|                       | ``` NonTerminal:"(`NonTerminal` , ('NonTerminal' , '(' ,  string  , ')') , `END NonTerminal`)" ```     |
| NonImplemented        | NonImplemented: one string literal to tell this branch of the grammar is still to complete             |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/NonImplemented.svg)               |
|                     | ``` NonImplemented:"(`NonImplemented` , ('NonImplemented' , '(' ,  string  , ')') , `END NonImplemented`)" ``` |
| Skip                  | Skip: to tell this choice branch is optional                                                           |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/Skip.svg)                         |
|                       | ``` Skip:"(`Skip` , ('Skip' , '(' , ')') , `END Skip`)" ```                                            |
| Child                 | Child: list of core functions except Title and Show which can be included as a child                   |
|                       | ![RailRoad](https://gbrault.github.io/railroad-diagrams/live/doc/svg/Child.svg)                        |
|                       | ``` Child:"(`Child` , ( Sequence  |  Stack  |  Choice  |  Optional  |  OneOrMore  |  ZeroOrMore  |  Terminal  |  NonTerminal  |  Comment  |  Skip  |  NonImplemented ) , `END Child`)" ``` |

