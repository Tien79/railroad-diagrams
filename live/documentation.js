var documentation='# RailRoad Live (SRFB): How to use?\n\
\n\
<img src="images/expression.png" alt="" usemap="#Map" />\n\
<small>the number of 'default' grammars may vary upon time</small>\n\
<map name="Map" id="Map">\n\
    <area alt="" title="Show/Hide unchecked Diagrams" href="#a-showhide-unchecked-diagrams" shape="poly" coords="2,46,161,49,158,124,7,123" />\n\
    <area alt="" title="Help" href="#b-help" shape="poly" coords="1,136,157,136,159,181,3,189" />\n\
    <area alt="" title="Set Parameters" href="#c-set-parameters" shape="poly" coords="4,201,194,201,194,250,8,249" />\n\
    <area alt="" title="Select Grammars Or default associated expression" href="#d-select-grammars-or-default-associated-expression" shape="poly" coords="7,270,189,271,185,384,8,379" />\n\
    <area alt="" title="Select grammar expression type to validate" href="#e-select-grammar-expression-type-to-validate" shape="poly" coords="5,413,303,421,301,477,2,477" />\n\
    <area alt="" title="Switch from grammar to expression editor" href="#f-switch-from-grammar-to-expression-editor" shape="poly" coords="3,504,289,506,293,560,6,559" />\n\
    <area alt="" title="Refresh grammar or Validate expression" href="#g-refresh-grammar-or-validate-expression" shape="poly" coords="4,607,241,612,242,667,5,667" />\n\
    <area alt="" title="Screen zones function mapping" href="#9-screen-zones-function-mapping" shape="poly" coords="1,685,218,683,218,849,1,852" />\n\
    <area alt="" title="Banner" href="#1-banner" shape="poly" coords="1328,83,1504,83,1503,131,1331,133" />\n\
    <area alt="" title="Navigation" href="#2-navigation" shape="poly" coords="1332,146,1506,147,1506,189,1337,191" />\n\
    <area alt="" title="Grammar or Expression Editor" href="#3-grammar-and-expression-editor" shape="poly" coords="1333,337,1503,340,1502,407,1336,413" />\n\
    <area alt="" title="Tree & Syntax Diagram" href="#4-tree-and-syntax-diagram" shape="poly" coords="1333,534,1499,533,1502,628,1340,637" />\n\
    <area alt="" title="EBNF" href="#5-ebnf" shape="poly" coords="1332,731,1501,734,1505,782,1333,787" />\n\
    <area alt="" title="Footer" href="#6-footer" shape="poly" coords="1333,807,1501,812,1501,855,1336,855" />\n\
    <area alt="" title="Show/Hide sections" href="#7-showhide-items" shape="poly" coords="638,716,804,717,809,796,649,795" />\n\
    <area alt="" title="Show/Hide tree nodes" href="#8-showhide-tree-nodes" shape="poly" coords="443,760,566,757,571,816,443,812" />\n\
</map>\n\
\n\
\n\
# Page Structure\n\
\n\
## 1 Banner\n\
A very simple banner\n\
## 2 Navigation\n\
Navigation is possible using a serie of buttons. please see the specific [Navigation](#navigation) paragraph for more information\n\
## 3 Grammar and Expression editor\n\
When the last button label is **refresh** (button g), the input editor is the grammar editor. When the label is **validate**, this is the expression editor\n\
\n\
\n\
A Grammar must be entered using the SRFB format and the refresh button must be used to compute the associated results\n\
- Tree and Syntax Diagrams\n\
- EBNF translation\n\
\n\
\n\
An expression must follow the rules of the grammar under edition to be accepted\n\
- Errors are reported\n\
- A section with the compiled object show-up just next to the editor, which "explains" the various part of the expression under validation\n\
\n\
\n\
\n\
When the grammar editor mode is selected, hitting one of the pre-canned grammar button (buttons "d"), the associated grammar is loaded in the editor\n\
When the expression editor mode is selected, hitting one of the pre-canned grammar button (buttons "d"), a default expression is loaded in the editor\n\
## 4 Tree and Syntax Diagram\n\
For each Show call in the SRFB grammar definition, a Tree an a Diagram are produced\n\
- On the right part one can see the svg representation (use the show/hide check box to view or hide the section)\n\
- On the left part, with a tree view, the tree representation of the grammer item (click on the small triangle to expand/contract a particular node) \n\
## 5 EBNF\n\
A treeview with one line per Grammar section (Show): this is corresponding to the pull-down Grammar token identifier\n\
\n\
## 6 Footer\n\
A footer advertising intellectual property rights and refering to the original work\n\
## 7 Show/Hide Items\n\
When the check box is checked, the corresponding item is hidden\n\
To show all items, use the show/hide navigation button which will toggle the state of all the show/hide section of the Tree & Syntax Diagram division\n\
## 8 Show/Hide tree nodes\n\
Clicking on the small triangle just deploy or contract the associated tree node\n\
Clicking on the upper level node will reset the whole branch\n\
## 9 Screen zones function mapping\n\
- Orange zones are part of the page structure(banner and footer)\n\
- Green zones are user input zones: Grammar editor or Expression Editor\n\
- Light Blue are results zones\n\
- Blue is the navigation\n\
\n\
## 10 Other screen zones\n\
When errors are found, they are reported in the error section, not visible at startup.\n\
Error pane is cleared when they are corrected.\n\
Error reporting to be improved.\n\
\n\
\n\
A small arrow on the complete left of a Tree/Diagram section allows to jump to the begining of the page\n\
# Navigation\n\
\n\
\n\
## a Show/Hide unchecked Diagrams\n\
All Tree/Diagram which are checked will be displayed, all unchecked will be hidden (see zone 4)\n\
## b Help\n\
Open the present help file in a new tab\n\
## c Set Parameters\n\
Currently only one: {"validating":"function"} the other value of the "validating" attribute is tree (in place of function).\n\
\n\
The format of the parameter structure is a JSON object with a sequence of attribute:value between brackets {}.\n\
The new parameter values are stored and effective when closing the section, clicking on the setup button again\n\
## d Select Grammars Or default associated expression\n\
Three default grammars are currently supported and loaded in the grammar editor when the refresh button is present (grammar mode)\n\
- RailRoad: this is the SRFB language\n\
- Create Table: the sqlite "Create Table" grammar [sqlite](https://www.sqlite.org/lang_createtable.html)\n\
- expression: a "Tutorial" grammar to start learning SRFB language\n\
\n\
## e Select grammar expression type to validate\n\
When a grammar is input and the refresh button activated, the drop-down is filled with all the grammar NonTerminal being declared\n\
This drop-down has two function\n\
- Check that all the grammar NonTerminal are present\n\
- Select the type of expression to be validated against the current grammar (expression mode)\n\
\n\
\n\
The order is the one of grammar input.\n\
## f Switch from grammar to expression editor\n\
When the last button label is refresh, in the grammar mode, hitting the switch button enter the expression mode and the last button lable is validate\n\
\n\
- In the grammar mode, the default grammar buttons fill the editor with the default corresponding grammar\n\
- In the expression mode, a default expression corresponding to the grammar is loaded\n\
\n\
\n\
Don\'t forget to hit refresh before switching, else the expression will be evaluated against the last "refreshed" grammar\n\
\n\
\n\
At startup, the sqlite CREATE TABLE grammar is preloaded\n\
## g Refresh grammar or Validate expression\n\
- When the label is refresh, this is the grammar mode and the grammar results are computed\n\
- When the label is validate, the expression in the editor is validated against the last refreshed grammar\n\
\n';
