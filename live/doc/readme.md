# Outline

- [Introduction](#introduction): Why?
- [Multiple representations](#multiple-representations): It's not new stuff, what is new?
  - [A basic example](#a-basic-example)
  - [Showing equivalence of representation](#showing-equivalence-of-representation)
- [The Core Functional Basis composition](#the-core-functional-basis-composition): how to write SRFB grammars?
- [Translating SRFB to EBNF](#translating-srfb-to-ebnf): EBNF translation set of core SRFB functions

# Introduction

I always have been fascinated by formal languages... I mean computer languages! I just discovered a new way of "representing" those languages and want to share that. 

By representing I mean learn and test if language expressions I can produce are matching the grammar rules.

For those who are more experimental than theoritical, one can jump to the live tool accessible [here](https://gbrault.github.io/railroad-diagrams/live/live.html), hit the documentation button to learn how to use the tool and interpret the results.

The others can proceed reading!

# Multiple representations

Representing grammars is a rich field of work since 7 or 8 decades or so (the present article is written in January 2017) and many existing forms have been released so far. You can go and see articles dealing with this matter googleing or wikipediaing... Here is a list of articles to learn more about that (valid 1/5/2017)

- [Syntax](http://cs.lmu.edu/~ray/notes/syntax/)
- [Context Free Grammar](https://en.wikipedia.org/wiki/Context-free_grammar)
- [EBNF](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form)
- [Syntax Diagram](https://en.wikipedia.org/wiki/Syntax_diagram)

To benefit further reading of this article, understanding of basic formal grammar concepts are necessary: EBNF and Syntax Diagram.

One of the guys whom made the syntax diagram popular is **Niklaus Wirth** [see Pascal User manual](https://books.google.fr/books?isbn=0387976493) in the late 70's.

![alt-tag](https://gbrault.github.io/railroad-diagrams/live/doc/svg/Pascal1.png)
![alt-tag](https://gbrault.github.io/railroad-diagrams/live/doc/svg/pascal2.png)

My 'discovery' is just to add one more representation, which I call a '**S**yntax **R**epresentation by a **F**unction **B**asis' (SRFB) of grammars. I will show (not proof) that this representation is equivalent to EBNF and Syntax Diagram.

In fact, I have made this 'discovery', looking to tabakins code which was generating 'syntax diagrams' from an SRFB description. I am not sure this 'discovery' is genuine, but so far, I didn't found anything googleing... This might change! 

Of course, tabatkins is the genuine inventor as he created the first SRFB translator (SRFB -> SVG Syntax Diagram). I have just extended the concept

- By creating some more implementation of core functions for different translating purpose.
- Giving a wider scope abstraction (i.e.: write translators not only for svg Syntax Graph representation)

## A basic example

Here is a simple example of the three equivalent representation of a grammar 'chunck' which meaning, in 'current' language, is: 

``` 
an expression is a sequence of term(s) separated by '+' sign. 
```

- Syntax Diagram
![alt tag](https://gbrault.github.io/railroad-diagrams/live/doc/svg/expression.svg)
- EBNF
```
expression:"( expression ,  term ('+' term )* , END expression )"
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

What tabatkins is actually doing is using a basis definition which allows to 'translate' an SRFB representation to a Syntax Diagram representation in svg: to do so, he has defined a set of functions (the basis) which allows to draw graphs from an SRFB input! Cleaver!

## Showing equivalence of representation

In fact, we just need to 'prove' that all the different representations "hold" the same kind of information. 

This can be acheived by creating a way to transform mechanically one form to the other, regardless of the actual content of the grammar, but just with the knowledge of the syntax of the three forms.

```
SRFB <=> EBNF <=> Syntax Diagram
```

- tabatkins has written the SRFB => Syntax Diagram
- I have written the SRFB => EBNF translator (much easier...)

The final proof would come by writing 

- Syntax Diagram => SRFB translator
- EBNF => SRFB translator

One can see as well that SRFB and Syntax Diagram (as defined in this article context) have one piece of information which is not explicitly sated in EBFN: layout (The 'Stack'). I have imperfectly translated that adding '\\n' in the EBNF version of the translated SRFB.

Writing those two latest translator is a pending work and a last step to come to a final 'proof' (practical not theoritical).

## Conclusion

My discovery was just to move one step forward: changing the basis definition to get different jobs done. I have implemented Function Basis to

- Generate the EBNF format of the SRFB
- Generate a tree representation of the grammar (guess it's an AST somehow)
- Generate a function basis to parse the grammar language and the associated core function basis to actually validate any corresponding statements

I also have written the RailRoad grammar in SFRB ([here](https://github.com/gbrault/railroad-diagrams/blob/gh-pages/live/doc/RailRoad.md)), which is explained in the next paragraph and also two other grammars

- expressions grammar as a tutorial [here](https://github.com/gbrault/railroad-diagrams/blob/gh-pages/live/doc/expression.md)
- sqlite CREATE TABLE as this was one of my orginial needs for this work [here](https://github.com/gbrault/railroad-diagrams/blob/gh-pages/live/doc/CREATE%20TABLE.md)

# The Core Functional Basis composition

The following table, providing one entry by core function, explains the syntax for composing those functions to represent a grammar. Names in italic are not functions of the basis per say, as they are composed of core functions, but they enable to better understand the grammar to generate SFRB expressions. Any grammar represented according to the following rules defined in this table are likely to be processed by the live tool accessible [here](https://gbrault.github.io/railroad-diagrams/live/live.html).

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

# Translating SRFB to EBNF

| Core Function         | Implementation          | Description                                                                     | 
| --------------------- |------------------------ | --------------------------------------------------------------------------------| 
| Title                 | [bnfTitle](#bnftitle)   | Returns the title string between ticks quote                                    | 
| Diagram               | [bnfDiagram](#bnfdiagram) | Returns the result string                                                     | 
| Sequence              | [bnfSequence](#bnfsequence)| Returns Childs separated by commas between parenthesis                       | 
| Stack                 | [bnfStack](#bnfstack)   | Returns Childs separated by commas and linefeed between parenthesis             | 
| Choice                | [bnfChoice](#bnfchoice) | Returns Childs separated by vertical line and linefeed between parenthesis      | 
| Optional              | [bnfOptional](#bnfoptional) | Returns Child with appended ?                                               | 
| OneOrMore             | [bnfOneOrMore](#bnfoneormore) | Returns Child1 ( Child2 Child1 )\*   or  Child+                           | 
| ZeroOrMore            | [bnfZeroOrMore](#bnfzeroormore) | Returns Child1 ( Child2 Child1 )\* or  Child\*                          | 
| Terminal              | [bnfTerminal](#bnfterminal) | Returns single quoted Child                                                 | 
| NonTerminal           | [bnfNonTerminal](#bnfnonterminal) | Returns Child between leading and trailing space                      | 
| Comment               | [bnfComment](#bnfcomment) | Returns string between ticks                                                  | 
| Skip                  | [bnfSkip](#bnfskip) | Returns &lt;Skip&gt;                                                                | 

## bnfTitle
```javascript
function bnfTitle(){
		context.fname=arguments[0];  	/* saves the Diagram Title */
		return "`"+arguments[0]+"`";	/* returns the title between ticks quote */
};
```
## bnfDiagram
```javascript
function bnfDiagram(){
		return arguments[0];		/* just return the whole result */
};
```
## bnfSequence
```javascript
function bnfSequence(){
	var result="(";				/* opening round bracket */	
	for(var i=0;i<arguments.length;i++){
		if(i>0) result+=" , ";		/* comma separated list */
		result+=arguments[i];
	}
	return result+")";			/* closing round bracket */
};
```
## bnfStack
```javascript
function bnfStack(){
	var result="(";				/* opening round bracket */
	for(var i=0;i<arguments.length;i++){
		if(i>0) result+=" , \\n";	/* comma separated list with linefeed */
		result+=arguments[i];			
	}
	return result+")";			/* closing round bracket */
};
```
## bnfChoice
```javascript
function bnfChoice(){
	var result="(";				/* opening round bracket */
	var skip=false;
	for(var i=1;i<arguments.length;i++){
	if(arguments[i]=="<Skip>"){		/* checking if choice is optional */
		skip=true;
	} else {
		if(!(result=="(")) result+=" | ";  /* vertical line separated list */
			var temp=arguments[i];
			if (temp.length>50) temp+="\n";	/* with linefeed if line too big */
			result+=temp;
		}
	}
	result+=")";				/* closing round bracket */
	if(skip){
		result+="?";			/* if skip makes it optional */
	}
	return result;
};
```
## bnfOptional
```javascript
function bnfOptional(){
		return arguments[0]+"?"		/* add a ? to make it optional */
};
```
## bnfOneOrMore
```javascript
function bnfOneOrMore(){
		var result;
		if(arguments.length>1){
			result=arguments[0]+"("+arguments[1]+arguments[0]+")*"; /* if two Childs, use the * iteration */
		} else {
			result="("+arguments[0]+")+";			/* if only one Child, use the + iteration */
		}
		return result;
};
```
## bnfZeroOrMore
```javascript
function bnfZeroOrMore(){
		var result;
		if(arguments.length>1){ 						/* if two Childs, use the * iteration */
			result=arguments[0]+"?"+"("+arguments[1]+arguments[0]+")*"; 	/* makes first Child optional */
		} else {
			result="("+arguments[0]+")*";		/* if only one Child, use the * iteration */
		}
		return result;
};
```
## bnfTerminal
```javascript
function bnfTerminal(){
	return singlequote(arguments[0]);
};
```
## bnfNonTerminal
```javascript	
function bnfNonTerminal(){
	return " "+arguments[0]+" ";
};
```
## bnfComment
```javascript	
function bnfComment(){
	return "`"+arguments[0]+"`";
};
```
## bnfSkip
```javascript	
function bnfSkip(){
	return "<Skip>";
};
```	

