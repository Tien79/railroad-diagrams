```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('RailRoad'),OneOrMore(NonTerminal('Show'),Terminal(';')),Comment('END Railroad'))); 
 /* Railroad */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/RailRoad.svg)
```javascript
/**************************************************************************************************************/ 
  Show( 
  Sequence(Title('Show'),
            Sequence(Terminal('Show'),Terminal('('),
                    Choice(0,Sequence(NonTerminal('Title'),
                                      Optional(Sequence(Terminal(','),NonTerminal('Childs'))), 
                                      Terminal(','),NonTerminal('Comment') 
                                     ), 
                           NonTerminal('Title Stack'),NonTerminal('Title Sequence')), 
                    Terminal(')') 
                   ), 
           Comment('END Show')) 
      ); 
 /* Show */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Show.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('string'), 
  Choice(0, 
   		Terminal("/'(?:[^\']|\.)*'/"), 
         Terminal('/"(?:[^\"]|\.)*"/'), 
         Terminal("/[^'\"]+/") 
  	   ), 
  Comment('END string') 
  ) 
  ); 
 /* string */
 ```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/string.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('ordinal'), 
             Choice(0, 
                 Terminal('0'), 
             	Sequence(Terminal('/[1-9]/'),Terminal('/[0-9]*/')) 
             ), 
             Comment('END ordinal')) 
      ); 
 /* ordinal */ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/ordinal.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('Title'), 
             Sequence(Terminal('Title'),Terminal('('),NonTerminal('string'),Terminal(')')), 
             Comment('END Title')) 
      ); 
 /* Title */ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Title.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('Comment'), 
             Sequence(Terminal('Comment'),Terminal('('),NonTerminal('string'),Terminal(')')), 
             Comment('END Comment')) 
      ); 
 /* Comment */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Comment.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('Title Stack'), 
             Stack(Sequence(Terminal('Stack'),Terminal('('),NonTerminal('Title')),
                    Optional(Sequence(Terminal(','),NonTerminal('Childs'))),Terminal(')')), 
             Comment('END Title Stack')) 
      ); 
 /* Title Stack */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Title Stack.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('Title Sequence'), 
             Stack(Sequence(Terminal('Sequence'),Terminal('('),NonTerminal('Title')),
                   Optional(Sequence(Terminal(','),NonTerminal('Childs'))),Terminal(')')), 
             Comment('END Title Sequence')) 
      ); 
 /* Title Sequence */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Title Sequence.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('Childs'),OneOrMore(NonTerminal('Child'),Terminal(',')),Comment('END Childs'))); 
  /* Childs */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Childs.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('TwoOrMoreChilds'),NonTerminal('Child'),Terminal(','),OneOrMore(NonTerminal('Child'),
		Terminal(',')),Comment('END TwoOrMoreChilds'))); 
  /* TwoOrMoreChilds */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/TwoOrMoreChilds.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('Sequence'),Terminal('Sequence'),Terminal('('),NonTerminal('Childs'),Terminal(')'),
		Comment('END Sequence'))); 
  /* Sequence */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Sequence.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('Stack'),Terminal('Stack'),Terminal('('),NonTerminal('Childs'),Terminal(')'),
  		Comment('END Stack'))); 
  /* Stack */ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Stack.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('Choice'),Terminal('Choice'),Terminal('('),NonTerminal('ordinal'),Terminal(','),
		NonTerminal('TwoOrMoreChilds'),Terminal(')'),Comment('END Choice'))); 
  /* Choice */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Choice.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('Optional'),Terminal('Optional'),Terminal('('),NonTerminal('Child'),Terminal(')'),
		Comment('END Optional'))); 
  /* Optional */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Optional.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('OneOrMore'),Terminal('OneOrMore'),Terminal('('),NonTerminal('Child'),Terminal(','),
		NonTerminal('Child'),Terminal(')'),Comment('END OneOrMore'))); 
  /* OneOrMore */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/OneOrMore.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('ZeroOrMore'),Terminal('ZeroOrMore'),Terminal('('),NonTerminal('Child'),Terminal(','),
		NonTerminal('Child'),Terminal(')'),Comment('END ZeroOrMore'))); 
  /* ZeroOrMore */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/ZeroOrMore.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('Terminal'), 
             Sequence(Terminal('Terminal'),Terminal('('),NonTerminal('string'),Terminal(')')), 
             Comment('END Terminal')) 
      ); 
 /* Terminal */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Terminal.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('NonTerminal'), 
             Sequence(Terminal('NonTerminal'),Terminal('('),NonTerminal('string'),Terminal(')')), 
             Comment('END NonTerminal')) 
      ); 
 /* NonTerminal */ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/NonTerminal.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('NonImplemented'), 
             Sequence(Terminal('NonImplemented'),Terminal('('),NonTerminal('string'),Terminal(')')), 
             Comment('END NonImplemented')) 
      ); 
 /* NonImplemented */ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/NonImplemented.svg)
```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('Skip'), 
             Sequence(Terminal('Skip'),Terminal('('),Terminal(')')), 
             Comment('END Skip')) 
      ); 
 /* Skip */ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Skip.svg)
```javascript
/********************************************************************************************************************/ 
 Show(Sequence(Title('Child'), 
               Choice(0, 
                      NonTerminal('Sequence'), 
                      NonTerminal('Stack'), 
                      NonTerminal('Choice'), 
                      NonTerminal('Optional'), 
                      NonTerminal('OneOrMore'), 
                      NonTerminal('ZeroOrMore'), 
                      NonTerminal('Terminal'), 
                      NonTerminal('NonTerminal'), 
                      NonTerminal('Comment'), 
                      NonTerminal('Skip'), 
                      NonTerminal('NonImplemented') 
                     ), 
  Comment('END Child')) 
      ); 
 /* Child */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/Child.svg
