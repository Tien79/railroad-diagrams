/********************************************************************************************************************************/ 
  Show(Sequence(Title('RailRoad'),OneOrMore(NonTerminal('Show'),Terminal(';')),Comment('END Railroad'))); 
 /* Railroad */ 
 /********************************************************************************************************************************/ 
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
 /********************************************************************************************************************************/ 
  Show( 
  Sequence(Title('string'), 
  Choice(0, 
   		Terminal("/'(?:[^\']|\.)*'/"), 
         Terminal('/"(?:[^\"]|\.)*"/'), 
         Terminal("/[^'\"]+/") 
  	   ), 
  Comment('END string') 
  ) 
  ); 
 /* string */ 
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('ordinal'), 
             Choice(0, 
                 Terminal('0'), 
             	Sequence(Terminal('/[1-9]/'),Terminal('/[0-9]*/')) 
             ), 
             Comment('END ordinal')) 
      ); 
 /* ordinal */ 
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('Title'), 
             Sequence(Terminal('Title'),Terminal('('),NonTerminal('string'),Terminal(')')), 
             Comment('END Title')) 
      ); 
 /* Title */ 
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('Comment'), 
             Sequence(Terminal('Comment'),Terminal('('),NonTerminal('string'),Terminal(')')), 
             Comment('END Comment')) 
      ); 
 /* Comment */
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('Title Stack'), 
             Stack(Sequence(Terminal('Stack'),Terminal('('),NonTerminal('Title')),
                    Optional(Sequence(Terminal(','),NonTerminal('Childs'))),Terminal(')')), 
             Comment('END Title Stack')) 
      ); 
 /* Title Stack */
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('Title Sequence'), 
             Stack(Sequence(Terminal('Sequence'),Terminal('('),NonTerminal('Title')),
                   Optional(Sequence(Terminal(','),NonTerminal('Childs'))),Terminal(')')), 
             Comment('END Title Sequence')) 
      ); 
 /* Title Sequence */
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('Childs'),OneOrMore(NonTerminal('Child'),Terminal(',')),Comment('END Childs'))); 
  /* Childs */
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('TwoOrMoreChilds'),NonTerminal('Child'),Terminal(','),OneOrMore(NonTerminal('Child'),Terminal(',')),Comment('END TwoOrMoreChilds'))); 
  /* TwoOrMoreChilds */
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('Sequence'),Terminal('Sequence'),Terminal('('),NonTerminal('Childs'),Terminal(')'),Comment('END Sequence'))); 
  /* Sequence */
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('Stack'),Terminal('Stack'),Terminal('('),NonTerminal('Childs'),Terminal(')'),Comment('END Stack'))); 
  /* Stack */ 
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('Choice'),Terminal('Choice'),Terminal('('),NonTerminal('ordinal'),Terminal(','),NonTerminal('TwoOrMoreChilds'),Terminal(')'),Comment('END Choice'))); 
  /* Choice */
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('Optional'),Terminal('Optional'),Terminal('('),NonTerminal('Child'),Terminal(')'),Comment('END Optional'))); 
  /* Optional */
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('OneOrMore'),Terminal('OneOrMore'),Terminal('('),NonTerminal('Child'),Terminal(','),NonTerminal('Child'),Terminal(')'),Comment('END OneOrMore'))); 
  /* OneOrMore */
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('ZeroOrMore'),Terminal('ZeroOrMore'),Terminal('('),NonTerminal('Child'),Terminal(','),NonTerminal('Child'),Terminal(')'),Comment('END ZeroOrMore'))); 
  /* ZeroOrMore */
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('Terminal'), 
             Sequence(Terminal('Terminal'),Terminal('('),NonTerminal('string'),Terminal(')')), 
             Comment('END Terminal')) 
      ); 
 /* Terminal */
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('NonTerminal'), 
             Sequence(Terminal('NonTerminal'),Terminal('('),NonTerminal('string'),Terminal(')')), 
             Comment('END NonTerminal')) 
      ); 
 /* NonTerminal */ 
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('NonImplemented'), 
             Sequence(Terminal('NonImplemented'),Terminal('('),NonTerminal('string'),Terminal(')')), 
             Comment('END NonImplemented')) 
      ); 
 /* NonImplemented */ 
 /********************************************************************************************************************************/ 
  Show(Sequence(Title('Skip'), 
             Sequence(Terminal('Skip'),Terminal('('),Terminal(')')), 
             Comment('END Skip')) 
      ); 
 /* Skip */ 
 /********************************************************************************************************************************/
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
