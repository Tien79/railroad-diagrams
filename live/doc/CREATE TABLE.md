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
Show(Stack( 
   Title('column-constraint'), 
   Optional(Sequence(Terminal('CONSTRAINT'),NonTerminal('name'))), 
   Sequence(Choice(0, 
          Sequence(Terminal('PRIMARY'),Terminal('KEY'),Choice(0,Skip(),Terminal('ASC'),Terminal('DESC')),NonTerminal('conflict-clause'),Optional(Terminal('AUTOINCREMENT'))), 
          Sequence(Optional(Terminal('NOT')),Terminal('NULL'),NonTerminal('conflict-clause')), 
          Sequence(Terminal('UNIQUE'),NonTerminal('conflict-clause')), 
          Sequence(Terminal('CHECK'),Terminal('('),NonImplemented('expr'),Terminal(')')), 
          Sequence(Terminal('DEFAULT'),Choice(0,NonTerminal('signed-number'),NonTerminal('literal-value'),Sequence(Terminal('('),NonImplemented('expr'),Terminal(')')))), 
          Sequence(Terminal('COLLATE'),Terminal('collation-name')), 
          NonTerminal('foreign-key-clause') 
         )), 
   Comment('END column-constraint') 
   ) 
 ); /* column-constraint */ 
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/column-constraint.svg)
```
column-constraint:"(`column-constraint` , \n('CONSTRAINT' ,  name )? , \n((('PRIMARY' , 'KEY' , ('ASC' | 'DESC')? ,  conflict-clause  , 'AUTOINCREMENT'?)
 | ('NOT'? , 'NULL' ,  conflict-clause ) | ('UNIQUE' ,  conflict-clause ) | ('CHECK' , '(' , expr , ')') | ('DEFAULT' , ( signed-number  |  literal-value  | ('(' , expr , ')')))
 | ('COLLATE' , 'collation-name') |  foreign-key-clause )) , \n`END column-constraint`)"
```

```javascript
/**************************************************************************************************************/
Show(Sequence(Title('conflict-clause'), 
      Optional(Sequence(Terminal('ON'),Terminal('CONFLICT'), 
                                                 Choice(0, 
                                                        Terminal('ROLLBACK'), 
                                                        Terminal('ABORT'), 
                                                        Terminal('FAIL'), 
                                                        Terminal('IGNORE'), 
                                                        Terminal('REPLACE')) 
                                                ) 
                                       ),Comment('END conflict-clause')) 
     ); /* conflict-clause */
```
![alt tag](https://gbrault.github.io/railroad-diagrams//live/doc/svg/conflict-clause.svg)
```
conflict-clause:"(`conflict-clause` , ('ON' , 'CONFLICT' , ('ROLLBACK' | 'ABORT' | 'FAIL' | 'IGNORE' | 'REPLACE'))? , `END conflict-clause`)"
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
