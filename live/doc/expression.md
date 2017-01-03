```javascript
/**************************************************************************************************************/ 
  Show(Sequence(Title('expression'),OneOrMore(NonTerminal('term'),Terminal('+')), Comment('END expression')) 
       /* Sequence */ 
  ); /* expression */ 
/**************************************************************************************************************/ 
Show(Sequence(Title('term'),OneOrMore(NonTerminal('factor'),Terminal('*')), Comment('END term')) 
               /* Sequence */ 
  ); /* term */ 
/**************************************************************************************************************/ 
Show(Stack(Title('factor'),Sequence(Choice(0, 
                                    NonTerminal('constant'), 
                                    NonTerminal('variable'), 
                                    Sequence(Terminal('('),NonTerminal('expression'),Terminal(')')) 
                                   )) 
             , Comment('END factor')) /* Stack */ 
  ); /* factor */ 
/**************************************************************************************************************/ 
Show(Sequence(Title('variable'),Terminal('/[A-Z][A-Za-z0-9_]*/'), Comment('END variable')) /* Sequence */ 
  ); /* variable */ 
/**************************************************************************************************************/ 
Show(Sequence(Title('constant'),Terminal('/[+-]?[0-9]+/'), Comment('END constant')) /* Sequence */ 
  ); /* constant */ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/expression.svg)
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/factor.svg)
