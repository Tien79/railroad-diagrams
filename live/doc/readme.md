# Outline

- [Introduction](#introduction): Why?
- [Multiple representations](#multiple-representations): It's not new stuff, what is new?
  - [A basic example](#a-basic-example)
  - [Showing equivalence of representation](#showing-equivalence-of-representation)
- [Software functional view](#software-functional-view): What is the live demo (**[here](https://gbrault.github.io/railroad-diagrams/live/live.html)**) actually doing?
- [The Core Functional Basis composition](#the-core-functional-basis-composition): how to write SRFB grammars?
- [Translating SRFB to EBNF](#translating-srfb-to-ebnf): EBNF translation set of core SRFB functions
- [Translating SRFB to Trees](#translating-srfb-to-trees): Core SRFB functions to generate parsing trees 
- [Translating SRFB to Generating Functions](#translating-srfb-to-generating-functions): Core SRFB functions to generate 'walking' functions
- [Core Validating functions](#core-validating-functions): Core function to validate an expression of the language based on the underlying grammar.
- [Results Analysis](#results-analysis): How to interpret results?

# Introduction

I always have been fascinated by formal languages... I mean computer languages! I just discovered a new way of "representing" those languages and want to share that. 

By representing I mean learn and test if language expressions I can produce are matching the grammar rules.

For those who are more experimental than theoritical, one can jump to the live tool accessible    **[here](https://gbrault.github.io/railroad-diagrams/live/live.html)**, 

hit the help button to learn how to use the tool and what are the results.

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
- Written a tree walker (above mentionned tree) to validate expressions as well (2nd form of acceptor)

I also have written the RailRoad grammar in SFRB ([here](https://github.com/gbrault/railroad-diagrams/blob/gh-pages/live/doc/RailRoad.md)), which is explained in the next paragraph and also two other grammars

- expressions grammar as a tutorial [here](https://github.com/gbrault/railroad-diagrams/blob/gh-pages/live/doc/expression.md)
- sqlite CREATE TABLE as this was one of my orginial needs for this work [here](https://github.com/gbrault/railroad-diagrams/blob/gh-pages/live/doc/CREATE%20TABLE.md)
- EBNF (according to Niklaus Wirth favor) grammar (see the live tool)

# Software functional view

![alt-tag](https://gbrault.github.io/railroad-diagrams/live/images/architecture.png)
Click to get a full screen view.

## Refresh phase

During the refresh phase, using the current grammar input in the editor and the various definition of the Core Functions

- Syntax Graph
- EBNF
- Tree
- Genarating

The various output are delivered

- svg Syntax Diagrams
- ENBF array of nonTerminals
- Tree structure corresponding to walking calls of the input grammar
- Generating functions (one per nonTerminal like EBNF) which allow walking for expression validation

## Validate phase

- The input expression is tokenized with a general purpose tokeniser (strings, special chars...)
- Depending upon the value of the parameters variable "validating" one of the two validation scheme is applied
 - Tree validation
 - Function validation
- Tree validation deliver a tree structure
- Function validation is taging the tokenized input telling which token correspond to which grammar construct 


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
# Translating SRFB to Trees

They are all the same except Title which put the title string into a context store.
When the calls will be made, the returning sequence of object embedded one into the other as the calls are, will make a tree (path of calls) which can be used as a walking tree to validate expression (interpreter way of validating expressions).

| Core Function   | Implementation | Code                                                                                        | 
| --------------- |--------------- | --------------------------------------------------------------------------------------------| 
| Title           | pTitle         | `{context.title=arguments[0];return {Title:arguments};};`                                   | 
| Diagram         | pDiagram       | ` {return {Diagram:arguments};};`                                                           | 
| Sequence        | pSequence      | ` {return {Sequence:arguments};};`                                                          | 
| Stack           | pStack         | ` {return {Stack:arguments};};`                                                             | 
| Choice          | pChoice        | ` {return {Choice:arguments};};`                                                            | 
| Optional        | pOptional      | ` {return {Optional:arguments};};`                                                          | 
| OneOrMore       | pOneOrMore     | ` {return {OneOrMore:arguments};};`                                                         | 
| ZeroOrMore      | pZeroOrMore    | ` {return {ZeroOrMore:arguments};};`                                                        | 
| Terminal        | pTerminal      | ` {return {Terminal:arguments};};`                                                          | 
| NonTerminal     | pfNonTerminal  | ` {return {NonTerminal:arguments};};`                                                       | 
| Comment         | pComment       | ` {return {Comment:arguments};};`                                                           | 
| Skip            | pSkip          | ` {return {Skip:arguments};};`                                                              | 


# Translating SRFB to Generating Functions

We are going to use those generating functions to traverse the grammar graph, using the tokens as a guide through the path.
Those functions don't know the tokens in advance, so, arguments of the generating functions cannot be solved before execution: they must be functions which are going to be selected using the tokens path at execution time by the validating functions.

We are using the bind javascript capability to transform all calls to function pointers. 

Those functions are quite simple and belong two categories: intermediate or structure functions which use the va_args transformation and the terminal functions which will use quoted string argument (single).

| Core Function   | Implementation | Code                                                                                        | 
| --------------- |--------------- | --------------------------------------------------------------------------------------------| 
| Title           | gTitle         | `{context.fname=arguments[0];return "Title.bind(this,"+quote(arguments[0])+")";};`          | 
| Diagram         | gDiagram       | ` {return "Diagram.bind(this,"+va_args(arguments)+")";};`                                   | 
| Sequence        | gSequence      | ` {return "Sequence.bind(this,"+va_args(arguments)+")";};`                                  | 
| Stack           | gStack         | ` {return "Stack.bind(this,"+va_args(arguments)+")";};`                                     | 
| Choice          | gChoice        | ` {return "Choice.bind(this,"+va_args(arguments)+")";};`                                    | 
| Optional        | gOptional      | ` {return "Optional.bind(this,"+va_args(arguments)+")";};`                                  | 
| OneOrMore       | gOneOrMore     | ` {return "OneOrMore.bind(this,"+va_args(arguments)+")";};`                                 | 
| ZeroOrMore      | gZeroOrMore    | ` {return "ZeroOrMore.bind(this,"+va_args(arguments)+")";};`                                | 
| Terminal        | gTerminal      | ` {return "Terminal.bind(this,"+quote(arguments[0])+")";};`                                 | 
| NonTerminal     | gfNonTerminal  | ` {return "NonTerminal.bind(this,"+quote(arguments[0])+")";};`                              | 
| Comment         | gComment       | ` {return "Comment.bind(this,"+quote(arguments[0])+")";};`                                  | 
| Skip            | gSkip          | ` {return "Skip";};`                                                                        | 

## va_args function

This function just returns a string composed of the arguments, separated by a comma, like the original call, but arguments are bounded to form a function pointer...

```javascript
function va_args(args){  
    	var res="";
    	for(var i=0;i<args.length;i++){
		res +=args[i];
		if(i<args.length-1){
			res+=",";
		}
    	} 
	return res;   /* exact same patern as the calling arguments */	
}
```
## quote

Terminal, NonTerminal, title and Comment are terminals and then have strings as arguments (single). As original strings may have " in their content, special care must be taken to escape this potential " characters. The returned string is surrounded by two enclosing ".

```javascript
function quote(str){
	str=str.replace(/\\"/g,'"');
	str=str.replace(/"/g,'\\"');
	str='"'+str+'"';
	return str;
}
```

## storing the generating functions

For each Show call, a generating function is calculated with the following code. The name of the generating function is determine from the grammar name (Title) normalized to fit javascript syntax and make sure their is no "namespce" conflict.

```javascript
var fname=normalize(this.context.fname); // we have to have a title in a Diagram! 
eval("var "+fname+"=function(){return "+res+";}")
this.context.language[fname]=eval(fname);
```
The generating function are stored in a user structure which is embedded in the results structure used for interraction with the railroad.js script: results.context.language.

### normalize function

```javascript
function normalize(str){
	str=str.replace(/\s/g,'_');
	str=str.replace(/\-/g,'_');
	return "RR_"+str;
}
```
## Conclusion

The core of the validating functions are then generated, it's what we call the language structure. This array is an array of function pointers which parameters are function pointers. It means that the actual work (what to compute) is going to take place during the validating phase and will be acheived by the core validating functions.

# Core Validating functions

| Core Function         | Implementation          | Description                                                                     | 
| --------------------- |------------------------ | --------------------------------------------------------------------------------| 
| Title                 | [vTitle](#vtitle)       | just return the type                                                            | 
| VSSD                  | [vSSD](#vssd)           | Helper function for Sequence, Stack, Diagram                                    | 
| Diagram               | [vDiagram](#vdiagram)   |                                                                                 | 
| Sequence              | [vSequence](#vsequence) |                                                                                 |
| Stack                 | [vStack](#vstack)       |                                                                                 |
| Choice                | [vChoice](#vchoice)     |                                                                                 | 
| Optional              | [vOptional](#voptional) |                                                                                 |
| vOrMore               | [vOrMore](#vormore)     | Helper function for OneOrMore and ZeroOrMore                                    | 
| OneOrMore             | [vOneOrMore](#vfoneormore) |                                                                              |
| ZeroOrMore            | [vZeroOrMore](#vzeroormore) |                                                                             |
| getpath               | [getpath](#getpath)     | helper function for Terminal                                                    | 
| Terminal              | [vTerminal](#vterminal) |                                                                                 |
| NonTerminal           | [vNonTerminal](#vnonterminal) |                                                                           |
| Comment               | [vComment](#vcomment)   |                                                                                 |
| Skip                  | [vSkip](#vskip)         |                                                                                 | 
| execute               | [execute](#execute)     | Helper function                                                                 | 

- VSSD, vOrMore, getpath and execute are Core function helpers.
- context is the global variable passed during railroad creation which holds results and errors.
- every function returns an object with type attribute
- if the returned object holds an error attribute, this trigger either backtracking or an error

## vTitle
```javascript
function vTitle(){
	return {type:'Title'};			
};
```
## vSSD
```javascript
function vSSD(type,_arguments){
	/*  All must return no error */
	var res = {type:type};
	var tres;
	var pathindex=context.pathindex;
	var compiledindex=context.compiledindex;
	for(var i=0; i<_arguments.length; i++){		
		tres=execute(_arguments[i]);
		if(tres.error!==undefined){
			res.error=tres.error;
			context.pathindex=pathindex;
			if(compiledindex>0)
				context.compiled=context.compiled.slice(0,compiledindex);
			else
				context.compiled=[];
			context.compiledindex=compiledindex;
			break;
		} 
	}
	return res;
};
```
## vDiagram
```javascript
function vDiagram(){
	var _arguments=arguments;
	return vSSD('Diagram',arguments);
};
```
## vSequence
```javascript
function vSequence(){
	var _arguments=arguments;
	return vSSD('Sequence',arguments);
};
```
## vStack
```javascript
function vStack(){
	var _arguments=arguments;
	return vSSD('Stack',_arguments);
};
```
## vChoice
```javascript
function vChoice(){
	/* One at least must return no error (or skip)*/
	var tres;
	var skip=false;
	var pathindex=context.pathindex;
	var compiledindex=context.compiledindex;
	for(var i=1; i<arguments.length; i++){ // don't care about arguments[0]
		tres = execute(arguments[i]);
		if(tres.error===undefined){
			if(tres.type=='skip'){
				skip=true;
			} else {
				return tres;
			}			
		}
		context.pathindex=pathindex;
		if(compiledindex>0)
			context.compiled=context.compiled.slice(0,compiledindex);
		else
			context.compiled=[];
		context.compiledindex=compiledindex;
	}
	if(skip){
		context.pathindex=pathindex;
		if(compiledindex>0)
			context.compiled=context.compiled.slice(0,compiledindex);
		else
			context.compiled=[];
		context.compiledindex=compiledindex;
		return {type:'choice'};
	} else {
		context.pathindex=pathindex;
		if(compiledindex>0)
			context.compiled=context.compiled.slice(0,compiledindex);
		else
			context.compiled=[];
		context.compiledindex=compiledindex;
		var error="choice with("+context.path[context.pathindex].value+") not possible";
		error+= "-lines:"+context.lineschars[context.path[context.pathindex].index].line+" chars:"+context.lineschars[context.path[context.pathindex].index].char+"-";
		return {type:'choice',error};		
	}		
};
```
##vOptional
```javascript
function vOptional(){
	var res = {type:'Optional'};
	var tres;
	var pathindex=context.pathindex;
	var compiledindex=context.compiledindex;
	if(context.pathindex<context.path.length){
		tres=execute(arguments[0]);
		if(tres.error!==undefined){
			// res.error=tres.error;
			context.pathindex=pathindex;
			if(compiledindex>0)
				context.compiled=context.compiled.slice(0,compiledindex);
			else
				context.compiled=[];
			context.compiledindex=compiledindex;
		} else {
			res.type=tres.type;
		}
	}
	return res;		
};
```
## vOrMore
```javascript
function vOrMore(zero,_arguments){
	var tres;
	var more=true;
	var error = false;
	var pathindex=context.pathindex;
	var compiledindex=context.compiledindex;
	var first=true;
	var i=0;
	do{
		if(context.pathindex>=context.path.length){
			error=false;
			more=false;
		} else {
			tres = execute(_arguments[i]);
			i++;
			if(i>=_arguments.length) i=0;
			if(tres.error!==undefined){
				if((first)&&(!zero)){
					error=true;
					more=false;
				} else {
					error=false;
					more=false;					
				}
				context.pathindex=pathindex;
				if(compiledindex>0)
					context.compiled=context.compiled.slice(0,compiledindex);
				else
					context.compiled=[];
				context.compiledindex=compiledindex;
			} else{
				first=false;
				pathindex=context.pathindex;
				compiledindex=context.compiledindex;
			}
		}
	} while(more);
	if(!error){
		return {type:'oneORmore'};
	} else{
		return {type:'oneORmore',error:tres.error};
	}		
}
```
## vOneOrMore
```javascript
function vOneOrMore(){
	var _arguments=arguments;
	return vOrMore(false,_arguments);
};
```
## vZeroOrMore
```javascript
function vZeroOrMore(){
	var _arguments=arguments;
	return vOrMore(true,_arguments);
};
```
## vTerminal
```javascript
function vTerminal(){
	var error = false;
	if(arguments.length==1){
		if(arguments[0].startsWith("/")){
			var l = arguments[0].length;
			const regex = new RegExp(arguments[0].substring(1,l-1));
			var m;
			if ((m = regex.exec(context.path[context.pathindex].value)) === null) {
				error=true;
			}
		} else {
			if(arguments[0]!==context.path[context.pathindex].value){
				error=true;
			}			
		}
	} else {
		error=true;
	}
	if(error){
		var error="In "+context.stack[context.stack.length-1]+" Terminal("+context.path[context.pathindex].value+") not fitting ";
		if(arguments.length>0)
			error += "("+arguments[0]+")";
		error+= "-lines:"+context.lineschars[context.path[context.pathindex].index].line+" chars:"+context.lineschars[context.path[context.pathindex].index].char+"-";
		return {type:'terminal',error};
	} else {
		if (arguments[0]==context.path[context.pathindex].value){
			context.compiled.push({	PathItem:context.path[context.pathindex].value,										
									line:context.lineschars[context.path[context.pathindex].index].line,
									char:context.lineschars[context.path[context.pathindex].index].char,
									level:getpath(context.stack)									
								  });
		} else{
			context.compiled.push({	Terminal:arguments[0],
									PathItem:context.path[context.pathindex].value,										
									line:context.lineschars[context.path[context.pathindex].index].line,
									char:context.lineschars[context.path[context.pathindex].index].char,
									level:getpath(context.stack)									
								  });
			
		}
		context.compiledindex++;
		context.pathindex++;
		return {type:'Terminal'};
	}
};

```
## getpath
```javascript
function getpath(stack){
	var stmp="";
	for(var i=0; i<stack.length;i++){
		if(i>0) stmp +=":";
		stmp +=stack[i];
	}
	return stmp;
}
```
## vNonTerminal
```javascript
function vNonTerminal(){
	if(context.language[context.normalize(arguments[0])]!==undefined){
		context.stack.push(arguments[0]);
		var res= execute(context.language[context.normalize(arguments[0])]);
		context.stack.pop();
		return res;
	} else {
		var error="NonTerminal("+context.path[context.pathindex].value+") not fitting ";
		if(arguments.length>0)
			error += "("+arguments[0]+")";
		error+= "-lines:"+context.lineschars[context.path[context.pathindex].index].line+" chars:"+context.lineschars[context.path[context.pathindex].index].char+"-";
		return {type:'NonTerminal',error};			
	}
};
```
## vComment
```javascript	
function vComment(){
	return {type:'Comment'};	
};
```
## vSkip
```javascript	
function vSkip(){
	return {type:'Skip'};	
};
```
## execute
```javascript
function execute(fun){  /* execute fun until result is not a function */
	var tmp=fun;
	do{
		if(typeof tmp ==='function'){
			tmp=tmp();
		} else {
			return tmp;
		}
	} while(true);
};

```

# Results Analysis

Just to give a simple example. To get there with the live tool:

- select the expression grammar - click refresh button
- switch to validate
- click on the expression grammar to know load the example expression
- click validate button

You get that screen

- Top is the expression
- Down left is the graph made with vis.js excellent graphic library
- Right: the litteral format of the same tree, node by node

![alt-tab](https://gbrault.github.io/railroad-diagrams/live/doc/svg/expression-results.png)
