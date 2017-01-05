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
CREATE TABLE: "(`CREATE TABLE` , \n
              ('CREATE' , ('TEMP' | 'TEMPORARY')? , 'TABLE' , ('IF' , 'NOT' , 'EXISTS')?) , \n
              (( schema-name  , '.')? ,  table-name ) , \n
              ((('(' ,  column-def (',' column-def )* , (',' table-constraint )* , ')' , ('WITHOUT' , 'ROWID')?)
              | ('AS' , select-stm))) , \n
              `END CREATE TABLE`)"
```

```javascript
/**************************************************************************************************************/ 
Show( 
 Sequence(Title('schema-name'), 
 NonTerminal('name'),Comment('END schema-name') 
 )  
 ); /* schema name */ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/schema-name.svg)
```
schema-name:"(`schema-name` ,  name  , `END schema-name`)"
```

```javascript
/**************************************************************************************************************/ 
Show( 
 Sequence(Title('table-name'),NonTerminal('name'),Comment('END table-name') 
 ) 
 ); /* table name */ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/table-name.svg)
```
table-name:"(`table-name` ,  name  , `END table-name`)"
```

```javascript
/**************************************************************************************************************/ 
 Show( 
 Sequence(Title('column-def'),NonTerminal('column-name'),Optional(NonTerminal('type-name')),ZeroOrMore(NonTerminal('column-constraint')), 
 Comment('END column-def') 
 ) 
 ); /* column def */ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/column-def.svg)
```
column-def:"(`column-def` ,  column-name  ,  type-name ? , ( column-constraint )* , `END column-def`)"
```

```javascript
/**************************************************************************************************************/
Show( 
 Sequence(Title('column-name'),NonTerminal('name'),Comment('END column-name') 
 ) 
 ); /* column name */ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/column-name.svg)
```
column-name:"(`column-name` ,  name  , `END column-name`)"
```

```javascript
/**************************************************************************************************************/ 
 Show( 
 Sequence(Title('name'), 
 Choice(0, 
 	Terminal('/(^[A-Za-z][A-Za-z0-9_]*)/'), 
 	Terminal('/(^\"[A-Za-z][A-Za-z0-9_\s]*)\"/'), 
         Terminal("/(^\'[A-Za-z][A-Za-z0-9_\s]*)\'/") 
 ), 
 Comment('END name') 
 ) 
 ); /* name */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/name.svg)
```
name:"(`name` , ('/(^[A-Za-z][A-Za-z0-9_]*)/' | '/(^"[A-Za-z][A-Za-z0-9_s]*)"/' | '/(^\'[A-Za-z][A-Za-z0-9_s]*)\'/') , `END name`)"
```

```javascript
/**************************************************************************************************************/ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/.svg)
```

```

```javascript
/**************************************************************************************************************/ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/.svg)
```

```

```javascript
/**************************************************************************************************************/ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/.svg)
```

```
