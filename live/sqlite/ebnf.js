/*
"EBNF" {
syntax     = [ title ] "{" { production } "}" [ comment ].
production = identifier "=" expression ( "." | ";" ) .
expression = term { "|" term } .
term       = factor { factor } .
factor     = identifier
           | literal
           | "[" expression "]"
           | "(" expression ")"
           | "{" expression "}" .
identifier = character { character } .
title      = literal .
comment    = literal .
literal    = "'" character { character } "'"
           | '"' character { character } '"' .
}
*/
/********************************************************************************************************************************/
Show(Stack( 
			Title('syntax_'),
  			Comment('[ title ] "{" { production } "}" [ comment ]'),
			Sequence(
                    Optional(Sequence(NonTerminal('identifier_'),Terminal('='))),
					Optional(NonTerminal('title_')),
					Terminal("{"), 
              		ZeroOrMore(NonTerminal('production_')),
              		Terminal("}"),
					Optional(NonTerminal('comment_'))
				),
			Comment('END syntax_')
		)
	); /* syntax_ */
/********************************************************************************************************************************/
 Show(Stack( 
   			Title('production_'),
   			Comment('production = identifier "=" expression ( "." | ";" ) '),
   			Sequence(
              	Optional(Sequence(NonTerminal('identifier_'),Terminal('='))),
              	NonTerminal('expression_'),
              	Choice(0,Terminal('.'),Terminal(';'))
            ), 
   			Comment('END Production_')
 		)
 	); /* production_ */
/********************************************************************************************************************************/
 Show(Stack( 
   			Title('expression_'),
   			Comment('expression = choice'),
   			Sequence(
              	Optional(Sequence(NonTerminal('identifier_'),Terminal('='))),
				NonTerminal('choice_')
            ), 
   			Comment('END expression_')
 		)
 	); /* expression_ */
/********************************************************************************************************************************/
 Show(Stack( 
   			Title('choice_'),
   			Comment('term { "|" term }'),
   			Sequence(
				OneOrMore(
					NonTerminal('term_'),
					Terminal('|')
				)
            ), 
   			Comment('END choice_')
 		)
 	); /* choice_ */ 
/********************************************************************************************************************************/
 Show(Stack( 
   			Title('term_'),
   			Comment('term  = factor { factor }'),
   			Sequence(
              	Optional(Sequence(NonTerminal('identifier_'),Terminal('='))),
				NonTerminal('sequence_')
            ), 
   			Comment('END term_')
 		)
 	); /* term_ */
/********************************************************************************************************************************/
 Show(Stack( 
   			Title('sequence_'),
   			Comment('factor { factor }'),
			OneOrMore(
					NonTerminal('factor_')
				),
   			Comment('END sequence_')
 		)
 	); /* sequence_ */	
/********************************************************************************************************************************/
 Show(Stack( 
   			Title('optional_'),
   			Comment('[ expression ]'),
			Sequence(Terminal('['),NonTerminal('expression_'),Terminal(']')),
   			Comment('END optional_')
 		)
 	); /* optional_ */
/********************************************************************************************************************************/
 Show(Stack( 
   			Title('group_'),
   			Comment('( expression )'),
			Sequence(Terminal('('),NonTerminal('expression_'),Terminal(')')),
   			Comment('END group_')
 		)
 	); /* group */
/********************************************************************************************************************************/
 Show(Stack( 
   			Title('oneormore_'),
   			Comment('{ expression }'),
			Sequence(Terminal('{'),NonTerminal('expression_'),Terminal('}')),
   			Comment('END oneormore_')
 		)
 	); /* oneormore_ */	
/********************************************************************************************************************************/
 Show(Stack(
   			Title('factor_'),
   			Comment("factor = identifier| literal| '[' expression ']'| '(' expression ')'| '{' expression '}'"),
   			Sequence(
              	Optional(Sequence(NonTerminal('identifier_'),Terminal('='))),
				Choice(0,
					NonTerminal('identifier_'),
					NonTerminal('literal_'),
					NonTerminal('optional_'),
					NonTerminal('group_'),
					NonTerminal('oneormore_')
				)
            ), 
   			Comment('END factor_')
	       )
	); /* factor_ */
/********************************************************************************************************************************/
Show( 
Sequence(Title('identifier_'),
         Comment('identifier = character { character }'),
		Terminal('/(^[A-Za-z][A-Za-z0-9_]*)/'),
		Comment('END identifier_')
)
); /* identifier */
/********************************************************************************************************************************/
Show( /* literal    = "'" character { character } "'" | '"' character { character } '"' . */
Sequence(Title('literal_'),
Choice(0,
	Terminal('/(^"[^\"]*)"/'),
        Terminal("/(^\'[^\']*)\'/")
),
Comment('END literal_')
)
); /* literal_ */
/********************************************************************************************************************************/
Show( /* title  = literal . */
Sequence(Title('title_'),
		NonTerminal('literal_'),
		Comment('END title_')
)
); /* title_ */
/********************************************************************************************************************************/
Show( /* comment    = literal . */
Sequence(Title('comment_'),
		NonTerminal('literal_'),
		Comment('END comment_')
)
); /* comment_ */
