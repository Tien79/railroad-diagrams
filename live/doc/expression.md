```javascript
/**************************************************************************************************************/ 
  Show(Sequence(  Title('expression'),
                  OneOrMore(NonTerminal('term'),Terminal('+')), 
                  Comment('END expression')
               ) /* Sequence */        
  ); /* expression */
``` 
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/expression.svg)
```javascript
/**************************************************************************************************************/ 
Show(Sequence(Title('term'),OneOrMore(NonTerminal('factor'),Terminal('*')), Comment('END term')) 
               /* Sequence */ 
  ); /* term */
``` 
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/term.svg)
```javascript  
/**************************************************************************************************************/ 
Show(Stack(Title('factor'),Sequence(Choice(0, 
                                    NonTerminal('constant'), 
                                    NonTerminal('variable'), 
                                    Sequence(Terminal('('),NonTerminal('expression'),Terminal(')')) 
                                   )) 
             , Comment('END factor')) /* Stack */ 
  ); /* factor */
```  
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/factor.svg)
```javascript
/**************************************************************************************************************/ 
Show(Sequence(Title('variable'),Terminal('/[A-Z][A-Za-z0-9_]*/'), Comment('END variable')) /* Sequence */ 
  ); /* variable */
```  
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/variable.svg) 
```javascript  
/**************************************************************************************************************/ 
Show(Sequence(Title('constant'),Terminal('/[+-]?[0-9]+/'), Comment('END constant')) /* Sequence */ 
  ); /* constant */ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/constant.svg)
