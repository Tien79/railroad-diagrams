var grammars=[];
(function(){
var expressionsource="/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('expression'),OneOrMore(NonTerminal('term'),Terminal('+')), Comment('END expression')) /* Sequence */ \n\
 ); /* expression */ \n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('term'),OneOrMore(NonTerminal('factor'),Terminal('*')), Comment('END term')) /* Sequence */ \n\
 ); /* term */ \n\
/********************************************************************************************************************************/ \n\
 Show(Stack(Title('factor'),Sequence(Choice(0, \n\
                                   NonTerminal('constant'), \n\
                                   NonTerminal('variable'), \n\
                                   Sequence(Terminal('('),NonTerminal('expression'),Terminal(')')) \n\
                                  )) \n\
            , Comment('END factor')) /* Stack */ \n\
 ); /* factor */ \n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('variable'),Terminal('/[A-Z][A-Za-z0-9_]*/'), Comment('END variable')) /* Sequence */ \n\
 ); /* variable */ \n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('constant'),Terminal('/[+-]?[0-9]+/'), Comment('END constant')) /* Sequence */ \n\
 ); /* constant */ \n";
var expressionexample="(Z+315)*(22+A)";
var createtablesource= "/********************************************************************************************************************************/ \n\
Show(Stack(Title('CREATE TABLE'), \n\
  Sequence(Terminal('CREATE'),Choice(0,Skip(),Terminal('TEMP'),Terminal('TEMPORARY')),Terminal('TABLE'), \n\
           Optional(Sequence(Terminal('IF'),Terminal('NOT'),Terminal('EXISTS')) \n\
  ) /* sequence */ \n\
),Sequence(Optional(Sequence(NonTerminal('schema-name'),Terminal('.'))),NonTerminal('table-name')), /* sequence */ \n\
Sequence( \n\
 Choice(0, \n\
  Sequence(Terminal('('),OneOrMore(NonTerminal('column-def'),Terminal(',')), \n\
           ZeroOrMore(Terminal(','),NonTerminal('table-constraint')), \n\
           Terminal(')'),Optional(Sequence(Terminal('WITHOUT'),Terminal('ROWID')))), \n\
  Sequence(Terminal('AS'),NonImplemented('select-stm')) \n\
 ) /* choice */ \n\
), \n\
Comment('END CREATE TABLE')) /* Stack */ \n\
); /* Create Table */ \n\
/********************************************************************************************************************************/ \n\
Show( \n\
Sequence(Title('schema-name'), \n\
NonTerminal('name'),Comment('END schema-name') \n\
)  \n\
); /* schema name */ \n\
/********************************************************************************************************************************/ \n\
Show( \n\
Sequence(Title('table-name'),NonTerminal('name'),Comment('END table-name') \n\
) \n\
); /* tables name */ \n\
/********************************************************************************************************************************/ \n\
Show( \n\
Sequence(Title('column-def'),NonTerminal('column-name'),Optional(NonTerminal('type-name')),ZeroOrMore(NonTerminal('column-constraint')), \n\
Comment('END column-def') \n\
) \n\
); /* column def */ \n\
/********************************************************************************************************************************/ \n\
Show( \n\
Sequence(Title('column-name'),NonTerminal('name'),Comment('END column-name') \n\
) \n\
); /* column name */ \n\
/********************************************************************************************************************************/ \n\
Show( \n\
Sequence(Title('name'), \n\
Choice(0, \n\
	Terminal('/(^[A-Za-z][A-Za-z0-9_]*)/'), \n\
	Terminal('/(^\\\"[A-Za-z][A-Za-z0-9_\\s]*)\\\"/'), \n\
        Terminal(\"/(^\\'[A-Za-z][A-Za-z0-9_\\s]*)\\'/\") \n\
), \n\
Comment('END name') \n\
) \n\
); /* name */ \n\
/********************************************************************************************************************************/ \n\
Show(Stack( \n\
  Title('column-constraint'), \n\
  Optional(Sequence(Terminal('CONSTRAINT'),NonTerminal('name'))), \n\
  Sequence(Choice(0, \n\
         Sequence(Terminal('PRIMARY'),Terminal('KEY'),Choice(0,Skip(),Terminal('ASC'),Terminal('DESC')),NonTerminal('conflict-clause'),Optional(Terminal('AUTOINCREMENT'))), \n\
         Sequence(Optional(Terminal('NOT')),Terminal('NULL'),NonTerminal('conflict-clause')), \n\
         Sequence(Terminal('UNIQUE'),NonTerminal('conflict-clause')), \n\
         Sequence(Terminal('CHECK'),Terminal('('),NonImplemented('expr'),Terminal(')')), \n\
         Sequence(Terminal('DEFAULT'),Choice(0,NonTerminal('signed-number'),NonTerminal('literal-value'),Sequence(Terminal('('),NonImplemented('expr'),Terminal(')')))), \n\
         Sequence(Terminal('COLLATE'),Terminal('collation-name')), \n\
         NonTerminal('foreign-key-clause') \n\
        )), \n\
  Comment('END column-constraint') \n\
  ) \n\
); /* column-constraint */ \n\
/********************************************************************************************************************************/ \n\
Show(Sequence(Title('conflict-clause'), \n\
     Optional(Sequence(Terminal('ON'),Terminal('CONFLICT'), \n\
                                                Choice(0, \n\
                                                       Terminal('ROLLBACK'), \n\
                                                       Terminal('ABORT'), \n\
                                                       Terminal('FAIL'), \n\
                                                       Terminal('IGNORE'), \n\
                                                       Terminal('REPLACE')) \n\
                                               ) \n\
                                      ),Comment('END conflict-clause')) \n\
    ); /* conflict-clause */ \n\
/********************************************************************************************************************************/ \n\
Show(Stack(Title('table-constraint'),Stack(Optional(Sequence(Terminal('CONSTRAINT'),NonTerminal('name'))), \n\
                                     Choice(0,Sequence(Choice(0,Sequence(Terminal('PRIMARY'),Terminal('Key')),Terminal('UNIQUE')),Terminal('('), \n\
                                                       OneOrMore(NonTerminal('indexed-column'),Terminal(',')),Terminal(')'),NonTerminal('conflict-clause')), \n\
                                            Sequence(Terminal('CHECK'),Terminal('('),NonImplemented('expr'),Terminal(')')), \n\
                                            Sequence(Terminal('FOREIGN'),Terminal('KEY'),Terminal('('), \n\
                                                     OneOrMore(NonTerminal('column-name'),Terminal(',')),Terminal(')'), \n\
                                                     NonTerminal('foreign-key-clause')) \n\
                                           )                                           \n\
     ), \n\
     Comment('END table-constrainte')) \n\
); /* table-constraint */ \n\
/********************************************************************************************************************************/ \n\
Show(Stack(Title('indexed-column'), \n\
     Sequence(Choice(0,NonTerminal('column-name'),NonImplemented('expr')), \n\
              Optional(Sequence(Terminal('COLLATE'),NonTerminal('collation-name'))), \n\
              Choice(0,Skip(),Terminal('ASC'),Terminal('DESC'))), \n\
     Comment('END indexed-column')) \n\
    ); /* indexed-column */ \n\
/********************************************************************************************************************************/ \n\
Show(Stack(Title('type-name'), \n\
           Sequence(NonTerminal('name'),Choice(0, \n\
                                                Skip(), \n\
                                                Sequence(Terminal('('),NonTerminal('signed-number'),Terminal(')')), \n\
                                                Sequence(Terminal('('),NonTerminal('signed-number'),Terminal(','),NonTerminal('signed-number'),Terminal(')')) \n\
                                               ) \n\
                   ), \n\
           Comment('END type-name')) \n\
    ); /* type-name */  \n\
/********************************************************************************************************************************/ \n\
Show(Stack(Title('numeric-literal'), \n\
           Sequence(Choice(0,Choice(0,Sequence(Choice(0,Sequence(Terminal('/[0-9]+/'),Optional(Sequence(Terminal('.'),Terminal('/[0-9]+/')))), \n\
                                                      Sequence(Terminal('.'),Terminal('/[0-9]+/')) \n\
                                                     ), \n\
                                               Optional(Sequence(Terminal('E'), \n\
                                                                 Choice(0,Skip(),Terminal('+'),Terminal('-')),Terminal('/[0-9]+/'))) \n\
                                              ) \n\
                                   ), \n\
                           Sequence(Terminal('0x'),Terminal('/[A-Za-z0-9]+)/')) \n\
                          ) \n\
                   ), \n\
           Comment('END numeric-literal')) \n\
    ); /* numeric-literal */ \n\
/********************************************************************************************************************************/ \n\
Show(Sequence(Title('signed-number'),Optional(Choice(0,Terminal('+'),Terminal('-'))),NonTerminal('numeric-literal'),Comment('END signed-number')) \n\
    ); /* signed-number */  \n\
/********************************************************************************************************************************/ \n\
Show(Stack(Title('foreign-key-clause'), \n\
           Sequence(Terminal('REFERENCES'),NonTerminal('foreign-table'), \n\
                    Optional(Sequence(Terminal('('),OneOrMore(NonTerminal('column-name'),Terminal(',')),Terminal(')')))), \n\
           Stack(ZeroOrMore( \n\
                          Choice(0, \n\
                                 Sequence(Terminal('ON'), \n\
                                          Choice(0,Terminal('DELETE'),Terminal('UPDATE')), \n\
                                          Choice(0, \n\
                                                 Sequence(Terminal('SET'),Choice(0,Terminal('NULL'),Terminal('DEFAULT'))), \n\
                                                 Terminal('CASCADE'), \n\
                                                 Terminal('RESTRICT'), \n\
                                                 Sequence(Terminal('NO'),Terminal('ACTION')) \n\
                                                ) \n\
                                         ), \n\
                                 Sequence(Terminal('MATCH'),NonTerminal('name')) \n\
                                ) \n\
                          ), \n\
                          Optional(Sequence(Optional(Terminal('NOT')),Terminal('DEFERRABLE'), \n\
                                           Choice(0,Skip(),Sequence(Terminal('INITIALLY'), \n\
                                                                    Choice(0,Terminal('DEFFERED'),Terminal('IMMEDIATE')) \n\
                                                                   ) \n\
                                                 ) \n\
                                           ) \n\
                                  ) \n\
                   ), \n\
           Comment('END foreign-key-clause') \n\
          ) \n\
    ); /* foreign-key-clause */ \n\
/********************************************************************************************************************************/ \n\
Show(Sequence(Title('foreign-table'),NonTerminal('table-name'),Comment('END foreign-table')) \n\
    ); /* foreign-table */ ";

var createtableexample= "CREATE TABLE \"Customer\" ( \n\
  \"IdCustomer\" text NULL PRIMARY KEY, \n\
  \"CompanyName\" text NULL, \n\
  \"ContactName\" text NULL, \n\
  \"ContactTitle\" text NULL, \n\
  \"Address\" text NULL, \n\
  \"City\" text NULL, \n\
  \"Region\" text NULL, \n\
  \"PostalCode\" text NULL, \n\
  \"Country\" text NULL, \n\
  \"Phone\" text NULL, \n\
  \"Fax\" text NULL \n\
) \n";

var railroadsource = "/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('RailRoad'),OneOrMore(NonTerminal('Show'),Terminal(';')),Comment('END Railroad'))); \n\
/* Railroad */ \n\
/********************************************************************************************************************************/ \n\
 Show( \n\
 Sequence(Title('Show'),\n\
           Sequence(Terminal('Show'),Terminal('('),\n\
                   Choice(0,Sequence(NonTerminal('Title'),\n\
                                     Optional(Sequence(Terminal(','),NonTerminal('Childs'))), \n\
                                     Terminal(','),NonTerminal('Comment') \n\
                                    ), \n\
                          NonTerminal('Title Stack'),NonTerminal('Title Sequence')), \n\
                   Terminal(')') \n\
                  ), \n\
          Comment('END Show')) \n\
     ); \n\
/* Show */ \n\
/********************************************************************************************************************************/ \n\
 Show( \n\
 Sequence(Title('string'), \n\
 Choice(0, \n\
  		Terminal(\"/'(?:[^\\']|\\.)*'/\"), \n\
        Terminal('/\"(?:[^\\\"]|\\.)*\"/'), \n\
        Terminal(\"/[^'\\\"]+/\") \n\
 	   ), \n\
 Comment('END string') \n\
 ) \n\
 ); \n\
/* string */ \n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('ordinal'), \n\
            Choice(0, \n\
                Terminal('0'), \n\
            	Sequence(Terminal('/[1-9]/'),Terminal('/[0-9]*/')) \n\
            ), \n\
            Comment('END ordinal')) \n\
     ); \n\
/* ordinal */ \n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('Title'), \n\
            Sequence(Terminal('Title'),Terminal('('),NonTerminal('string'),Terminal(')')), \n\
            Comment('END Title')) \n\
     ); \n\
/* Title */ \n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('Comment'), \n\
            Sequence(Terminal('Comment'),Terminal('('),NonTerminal('string'),Terminal(')')), \n\
            Comment('END Comment')) \n\
     ); \n\
/* Comment */\n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('Title Stack'), \n\
            Stack(Sequence(Terminal('Stack'),Terminal('('),NonTerminal('Title')),\n\
                   Optional(Sequence(Terminal(','),NonTerminal('Childs'))),Terminal(')')), \n\
            Comment('END Title Stack')) \n\
     ); \n\
/* Title Stack */\n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('Title Sequence'), \n\
            Stack(Sequence(Terminal('Sequence'),Terminal('('),NonTerminal('Title')),\n\
                  Optional(Sequence(Terminal(','),NonTerminal('Childs'))),Terminal(')')), \n\
            Comment('END Title Sequence')) \n\
     ); \n\
/* Title Sequence */\n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('Childs'),OneOrMore(NonTerminal('Child'),Terminal(',')),Comment('END Childs'))); \n\
 /* Childs */\n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('TwoOrMoreChilds'),NonTerminal('Child'),Terminal(','),OneOrMore(NonTerminal('Child'),Terminal(',')),Comment('END TwoOrMoreChilds'))); \n\
 /* TwoOrMoreChilds */\n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('Sequence'),Terminal('Sequence'),Terminal('('),NonTerminal('Childs'),Terminal(')'),Comment('END Sequence'))); \n\
 /* Sequence */\n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('Stack'),Terminal('Stack'),Terminal('('),NonTerminal('Childs'),Terminal(')'),Comment('END Stack'))); \n\
 /* Stack */ \n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('Choice'),Terminal('Choice'),Terminal('('),NonTerminal('ordinal'),Terminal(','),NonTerminal('TwoOrMoreChilds'),Terminal(')'),Comment('END Choice'))); \n\
 /* Choice */\n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('Optional'),Terminal('Optional'),Terminal('('),NonTerminal('Child'),Terminal(')'),Comment('END Optional'))); \n\
 /* Optional */\n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('OneOrMore'),Terminal('OneOrMore'),Terminal('('),NonTerminal('Child'),Terminal(','),NonTerminal('Child'),Terminal(')'),Comment('END OneOrMore'))); \n\
 /* OneOrMore */\n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('ZeroOrMore'),Terminal('ZeroOrMore'),Terminal('('),NonTerminal('Child'),Terminal(','),NonTerminal('Child'),Terminal(')'),Comment('END ZeroOrMore'))); \n\
 /* ZeroOrMore */\n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('Terminal'), \n\
            Sequence(Terminal('Terminal'),Terminal('('),NonTerminal('string'),Terminal(')')), \n\
            Comment('END Terminal')) \n\
     ); \n\
/* Terminal */\n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('NonTerminal'), \n\
            Sequence(Terminal('NonTerminal'),Terminal('('),NonTerminal('string'),Terminal(')')), \n\
            Comment('END NonTerminal')) \n\
     ); \n\
/* NonTerminal */ \n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('NonImplemented'), \n\
            Sequence(Terminal('NonImplemented'),Terminal('('),NonTerminal('string'),Terminal(')')), \n\
            Comment('END NonImplemented')) \n\
     ); \n\
/* NonImplemented */ \n\
/********************************************************************************************************************************/ \n\
 Show(Sequence(Title('Skip'), \n\
            Sequence(Terminal('Skip'),Terminal('('),Terminal(')')), \n\
            Comment('END Skip')) \n\
     ); \n\
/* Skip */ \n\
/********************************************************************************************************************************/\n\
Show(Sequence(Title('Child'), \n\
              Choice(0, \n\
                     NonTerminal('Sequence'), \n\
                     NonTerminal('Stack'), \n\
                     NonTerminal('Choice'), \n\
                     NonTerminal('Optional'), \n\
                     NonTerminal('OneOrMore'), \n\
                     NonTerminal('ZeroOrMore'), \n\
                     NonTerminal('Terminal'), \n\
                     NonTerminal('NonTerminal'), \n\
                     NonTerminal('Comment'), \n\
                     NonTerminal('Skip'), \n\
                     NonTerminal('NonImplemented') \n\
                    ), \n\
 Comment('END Child')) \n\
     ); \n\
/* Child */";
var ebnfsource=" \n\
/*\n\
\"EBNF\" {\n\
syntax     = [ title ] \"{\" { production } \"}\" [ comment ].\n\
production = identifier \"=\" expression ( \".\" | \";\" ) .\n\
expression = term { \"|\" term } .\n\
term       = factor { factor } .\n\
factor     = identifier\n\
           | literal\n\
           | \"[\" expression \"]\"\n\
           | \"(\" expression \")\"\n\
           | \"{\" expression \"}\" .\n\
identifier = character { character } .\n\
title      = literal .\n\
comment    = literal .\n\
literal    = \"'\" character { character } \"'\"\n\
           | '\"' character { character } '\"' .\n\
}\n\
*/\n\
/********************************************************************************************************************************/\n\
Show(Stack( \n\
			Title('syntax_'),\n\
  			Comment('[ title ] \"{\" { production } \"}\" [ comment ]'),\n\
			Sequence(\n\
                    Optional(Sequence(NonTerminal('identifier_'),Terminal('='))),\n\
					Optional(NonTerminal('title_')),\n\
					Terminal(\"{\"), \n\
              		ZeroOrMore(NonTerminal('production_')),\n\
              		Terminal(\"}\"),\n\
					Optional(NonTerminal('comment_'))\n\
				),\n\
			Comment('END syntax_')\n\
		)\n\
	); /* syntax_ */\n\
/********************************************************************************************************************************/\n\
 Show(Stack( \n\
   			Title('production_'),\n\
   			Comment('production = identifier \"=\" expression ( \".\" | \";\" ) '),\n\
   			Sequence(\n\
              	Optional(Sequence(NonTerminal('identifier_'),Terminal('='))),\n\
              	NonTerminal('expression_'),\n\
              	Choice(0,Terminal('.'),Terminal(';'))\n\
            ), \n\
   			Comment('END Production_')\n\
 		)\n\
 	); /* production_ */\n\
/********************************************************************************************************************************/\n\
 Show(Stack( \n\
   			Title('expression_'),\n\
   			Comment('expression = choice'),\n\
   			Sequence(\n\
              	Optional(Sequence(NonTerminal('identifier_'),Terminal('='))),\n\
				NonTerminal('choice_')\n\
            ), \n\
   			Comment('END expression_')\n\
 		)\n\
 	); /* expression_ */\n\
/********************************************************************************************************************************/\n\
 Show(Stack( \n\
   			Title('choice_'),\n\
   			Comment('term { \"|\" term }'),\n\
   			Sequence(\n\
				OneOrMore(\n\
					NonTerminal('term_'),\n\
					Terminal('|')\n\
				)\n\
            ), \n\
   			Comment('END choice_')\n\
 		)\n\
 	); /* choice_ */ \n\
/********************************************************************************************************************************/\n\
 Show(Stack( \n\
   			Title('term_'),\n\
   			Comment('term  = factor { factor }'),\n\
   			Sequence(\n\
              	Optional(Sequence(NonTerminal('identifier_'),Terminal('='))),\n\
				NonTerminal('sequence_')\n\
            ), \n\
   			Comment('END term_')\n\
 		)\n\
 	); /* term_ */\n\
/********************************************************************************************************************************/\n\
 Show(Stack( \n\
   			Title('sequence_'),\n\
   			Comment('factor { factor }'),\n\
			OneOrMore(\n\
					NonTerminal('factor_')\n\
				),\n\
   			Comment('END sequence_')\n\
 		)\n\
 	); /* sequence_ */	\n\
/********************************************************************************************************************************/\n\
 Show(Stack( \n\
   			Title('optional_'),\n\
   			Comment('[ expression ]'),\n\
			Sequence(Terminal('['),NonTerminal('expression_'),Terminal(']')),\n\
   			Comment('END optional_')\n\
 		)\n\
 	); /* optional_ */\n\
/********************************************************************************************************************************/\n\
 Show(Stack( \n\
   			Title('group_'),\n\
   			Comment('( expression )'),\n\
			Sequence(Terminal('('),NonTerminal('expression_'),Terminal(')')),\n\
   			Comment('END group_')\n\
 		)\n\
 	); /* group */\n\
/********************************************************************************************************************************/\n\
 Show(Stack( \n\
   			Title('oneormore_'),\n\
   			Comment('{ expression }'),\n\
			Sequence(Terminal('{'),NonTerminal('expression_'),Terminal('}')),\n\
   			Comment('END oneormore_')\n\
 		)\n\
 	); /* oneormore_ */	\n\
/********************************************************************************************************************************/\n\
 Show(Stack(\n\
   			Title('factor_'),\n\
   			Comment(\"factor = identifier| literal| '[' expression ']'| '(' expression ')'| '{' expression '}'\"),\n\
   			Sequence(\n\
              	Optional(Sequence(NonTerminal('identifier_'),Terminal('='))),\n\
				Choice(0,\n\
					NonTerminal('identifier_'),\n\
					NonTerminal('literal_'),\n\
					NonTerminal('optional_'),\n\
					NonTerminal('group_'),\n\
					NonTerminal('oneormore_')\n\
				)\n\
            ), \n\
   			Comment('END factor_')\n\
	       )\n\
	); /* factor_ */\n\
/********************************************************************************************************************************/\n\
Show( \n\
Sequence(Title('identifier_'),\n\
         Comment('identifier = character { character }'),\n\
		Terminal('/(^[A-Za-z][A-Za-z0-9_]*)/'),\n\
		Comment('END identifier_')\n\
)\n\
); /* identifier */\n\
/********************************************************************************************************************************/\n\
Show( /* literal    = \"'\" character { character } \"'\" | '\"' character { character } '\"' . */\n\
Sequence(Title('literal_'),\n\
Choice(0,\n\
	Terminal('/(^\"[^\\\"]*)\"/'),\n\
        Terminal(\"/(^\\'[^\\']*)\\'/\")\n\
),\n\
Comment('END literal_')\n\
)\n\
); /* literal_ */\n\
/********************************************************************************************************************************/\n\
Show( /* title  = literal . */\n\
Sequence(Title('title_'),\n\
		NonTerminal('literal_'),\n\
		Comment('END title_')\n\
)\n\
); /* title_ */\n\
/********************************************************************************************************************************/\n\
Show( /* comment    = literal . */\n\
Sequence(Title('comment_'),\n\
		NonTerminal('literal_'),\n\
		Comment('END comment_')\n\
)\n\
); /* comment_ */\n\
";
var ebnfexample="\"Arithmetic Expressions\" {\n\
expression = term  { (\"+\" | \"-\") term} .\n\
term       = factor  { (\"*\"|\"/\") factor} .\n\
factor     = constant | variable | \"(\"  expression  \")\" .\n\
variable   = \"/[A-Za-z]/\" .\n\
constant   = \"[0-9]+\" .\n\
}";
window.grammars={
	expression : {source:expressionsource,example:expressionexample},
	createtable : {source:createtablesource,example:createtableexample},
	railroad: {source:railroadsource,example:createtablesource},
	ebnf: {source:ebnfsource,example:ebnfexample}	
};
}());
