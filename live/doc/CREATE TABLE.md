```javascript
/**************************************************************************************************************/ 
 Show(Stack(Title('CREATE TABLE'), 
   Sequence(Terminal('CREATE'),Choice(0,Skip(),Terminal('TEMP'),Terminal('TEMPORARY')),Terminal('TABLE'), 
            Optional(Sequence(Terminal('IF'),Terminal('NOT'),Terminal('EXISTS')) 
   ) /* sequence */ 
 ),Sequence(Optional(Sequence(NonTerminal('schema-name'),Terminal('.'))),NonTerminal('table-name')), 
 /* sequence */ 
 Sequence( 
  Choice(0, 
   Sequence(Terminal('('),OneOrMore(NonTerminal('column-def'),Terminal(',')), 
            ZeroOrMore(Terminal(','),NonTerminal('table-constraint')), 
            Terminal(')'),Optional(Sequence(Terminal('WITHOUT'),Terminal('ROWID')))), 
   Sequence(Terminal('AS'),NonImplemented('select-stm')) 
  ) /* choice */ 
 ), 
 Comment('END CREATE TABLE')) /* Stack */ 
 ); /* Create Table */ 
``` 
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/CREATE TABLE.svg)
``` 
CREATE TABLE:"(`CREATE TABLE` , \n
('CREATE' , ('TEMP' | 'TEMPORARY')? , 'TABLE' , ('IF' , 'NOT' , 'EXISTS')?) , \n
(( schema-name  , '.')? ,  table-name ) , \n
((('(' ,  column-def (',' column-def )* , (',' table-constraint )* , ')' , ('WITHOUT' , 'ROWID')?)
 | ('AS' , select-stm))) , \n
 `END CREATE TABLE`)"
``` 
