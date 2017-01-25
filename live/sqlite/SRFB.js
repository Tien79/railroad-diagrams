/* SRFB.js CopyRight Gilbert Brault 2016,2017 */
var SRFB={};
/*
* inject a string script in the current document
* works only in browser
* content: script string
* error html element where to display errors
*/
SRFB.injectjs = function(content,error){
    var scriptref=window.document.createElement('script');
    scriptref.setAttribute("type","text/javascript");
	var source = "try {\n"+content+"\n} catch(e) {\n";
	source +="    error.innerHTML='<pre>'+\n   e.stack+\n   '<\pre>'\n}";
    scriptref.innerText= source;
	window.error=error;
    if ((typeof scriptref!="undefined") && scriptref!=null){
    	try{
        	window.document.getElementsByTagName("head")[0].appendChild(scriptref);
    	} 	catch(e){
		error.innerHTML="<pre>"+
					    e.stack+"\n"+
						"</pre>";
	    }    
    }
    return scriptref;
};

/*
* root function for railroad
*/
SRFB.Show = function() {
	if(this.state==="graphing"){
		try{		
			this.graph.push ((new Diagram([].slice.call(arguments))).format());
		}  	catch(e){
			this.error.innerHTML="<pre>"+
					    e.stack+"\n"+
						"</pre>";
	    }    
		this.title.push(this.context.title);
		this.context.title="notset";
	} else if(this.state==="walking"){
		this.walk.push (Diagram(arguments[0]));
	} else if(this.state==="generating"){
		var res = Diagram(arguments[0]);
		var fname=SRFB.normalize(this.context.fname); // we have to have a title in a Diagram! 
		eval("var "+fname+"=function(){return "+res+";}")
		this.context.language[fname]=eval(fname);
	} else if(this.state==="bnf"){
		var res = Diagram(arguments[0]);
		var tmp = {};
		tmp[this.context.fname]=res;
		this.context.bnf.push(tmp);
	}
};


/*
* setting of namespace RR_ for generated functions
*/
SRFB.normalize = function(str){
	str=str.replace(/\s/g,'_');
	str=str.replace(/\-/g,'_');
	return "RR_"+str;
};

SRFB.tokenizer = function(str){
/* add characters if more needed*/
const regex = /\/\*.*\*\/|`(?:[^`]|[\s\t])+`|'[^']*'|\/\*(?:[^/]*\n?)*\*\/|"[^"]*"|[A-Za-z][A-Za-z0-9_]*|:=|[,;\+\-\\\*\/()=\[\]\{\}\|.\?\:<>&!]|[0-9]+/gm;
var m;
var results=[];
var tokens=[];
var lineschars=[];

while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        // console.log(`Found match, group ${groupIndex}: ${match}`);		
        if(!match.startsWith('/*')){
        		tokens.push({value:match,index:results.length});
        }
		results.push(match);
    });
}
/* list lines and start char */
var strindex=0;
var line=1;
var more=true;
var startline=0;

for(var resultsindex=0;resultsindex<results.length;resultsindex++){
	lineschars.push({line:line,char:(strindex-startline+1)});
	// I need to count \n in the token (else line numbers are wrong)
	line+=SRFB.occurrences(str.substr(strindex,results[resultsindex].length-1), '\n', false);
	strindex+=results[resultsindex].length;
	more=true;
	while(more){
		if(strindex<str.length-1){
			switch(str.substr(strindex)[0]){
				case '\r':
				case '\t':
				case ' ':
			   		strindex++;
			   		break;
				case '\n':
			   		strindex++;
			   		line++;
			   		startline=strindex;
			   		break;
				default:
			   more=false;
			} 
		} else {
		  more=false;
		}		
	}
}

return {results,tokens,lineschars};	
}

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 *
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
SRFB.occurrences = function(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

SRFB.validate = function(rule, results, error, expression, graphelt, graphing, ebnf){
	error.innerHTML="";
	var tokenizerout = SRFB.tokenizer(expression);
	var tokens=tokenizerout.tokens;
	var i;
	var walk;
	// now check if the path i.e. the tokens list is compatible with the selected graph
	// find the entry graph
	var item = rule;
	for(i=0; i<results.title.length;i++){
		if(item===results.title[i]) break;
	}
	if(i<results.title.length){
		root.Railroad.SetExports(root.Railroad.validating,root.Railroad.fnames);
		var funame = SRFB.normalize(item);
		var fun = results.context.language[funame];
		if((fun!==undefined)&&(typeof fun ==='function')){
			results.context.path=tokens;
			results.context.pathindex=0;
			results.context.lineschars=tokenizerout.lineschars;
			results.context.compiled=[];
			results.context.compiledindex=0;
			results.context.stack=[item];
			var result=root.Railroad.execute(fun);
			if(result.error===undefined){
				// displayed 'compiled' structure as a vis graph		
				SRFB.displaygraph(graphelt,results.context,graphing);	
				if(ebnf){
					// generate SRFB grammar from EBNF				
					context.SRFBfromEBNF = SRFB.generateSRFB(results.context.result_tree);
				}
			} else{
					// display error and errorstack
					error.innerHTML=result.error;				
			}
		}
	}	
}

SRFB.generateSRFB = function(EBFNtree){
	var ctx = {tree:EBFNtree,node:EBFNtree[0],result:""};
	SRFB.walkEBNF(ctx);
	return ctx.result;
}

SRFB.walkEBNF = function(ctx){
	var node = ctx.node;
	var count = ctx.result.length;
	var args =[];
	switch(node.name){
	case 'syntax_':
		for(var i=0;i<node.childs.length;i++){
			if(node.childs[i].name==='production_'){
				ctx.node=node.childs[i];
				SRFB.walkEBNF(ctx);
			}
		}
		ctx.node=node;
		break;
	case "expression_":
		ctx.node=node.childs[0];  // which is a choice
		SRFB.walkEBNF(ctx);
		ctx.node=node;
		break;
	case "term_":
		ctx.node=node.childs[0];  // which is a sequence
		SRFB.walkEBNF(ctx);
		ctx.node=node;		
		break;
	case "group_":
		ctx.node=node.childs[1];  // which is a sequence or a choice
		SRFB.walkEBNF(ctx);
		ctx.node=node;		
		break;
	case "oneormore_":
		for(var i=0; i< node.childs.length; i+=3){
			count = ctx.result.length;
			ctx.node=node.childs[i+1]; 
			SRFB.walkEBNF(ctx);
			ctx.node=node;
			var send=ctx.result;
			if(count!=0){
				if(ctx.result.length>count){
					send= ctx.result.substr(count);
				} else {
					send ="";
				}				
				ctx.result=ctx.result.substr(0,count);				
			} else {
				ctx.result="";
			}
			if(i>0){
				ctx.result+=",";
			}
			ctx.result+= "ZeroOrMore("+send+")";  // in fact it's ZeroOrMore
		}
		break;
	case "optional_":
		for(var i=0; i< node.childs.length; i+=3){
			count = ctx.result.length;
			ctx.node=node.childs[i+1]; 
			SRFB.walkEBNF(ctx);
			ctx.node=node;
			var send=ctx.result;
			if(count!=0){
				if(ctx.result.length>count){
					send= ctx.result.substr(count);
				} else {
					send ="";
				}				
				ctx.result=ctx.result.substr(0,count);				
			} else {
				ctx.result="";
			}
			if(i>0){
				ctx.result+=",";
			}
			ctx.result+= "Optional("+send+")";
		}
		break;
	case 'production_':
		for(var i=0; i<node.childs.length; i+=4){
			for(j=0;j<4;j++){
				ctx.node=node.childs[i+j];					
				args.push(ctx.result.length);
				SRFB.walkEBNF(ctx);
			}
			var production = node.childs[i].childs[0].name;
			var arguments=ctx.result.substr(args[2],args[3]-args[2]);
			ctx.result=ctx.result.substr(0,args[0]);
			ctx.result+="/*****************************************************************/\n";
			ctx.result+="Show(Stack(Title('"+production+"'),\n";
			ctx.result+=arguments+",\n";
			ctx.result+="Comment('END "+production+"' )\n)\n";
			ctx.result+="); /* "+production+" */\n";
			args =[];
			count = ctx.result.length;
		}
		ctx.node=node;
		break;
	case "sequence_":
		if(node.childs[0].childs.length==1){  // look for factor_ childs
			ctx.node=node.childs[0].childs[0];
			SRFB.walkEBNF(ctx);
			break;
		} else {
			args.push(ctx.result.length);
			for(var i=0; i<node.childs[0].childs.length; i++){			
				ctx.node=node.childs[0].childs[i];
				SRFB.walkEBNF(ctx);
				args.push(ctx.result.length);
			}
			ctx.node=node;
			var arguments='Sequence(';
			for(var i=0; i<node.childs[0].childs.length; i++){
				arguments+=(ctx.result.substr(args[i],args[i+1]-args[i]));
				if(i<node.childs[0].childs.length-1) 
						arguments+=',';
			}
			arguments+=')\n';
			if(count==0){
				ctx.result="";
			} else {
				ctx.result=ctx.result.substr(0,count);
			}
			ctx.result += arguments;			
		}		
		ctx.node=node;
		break;
	case "choice_":
		if(node.childs.length==1){
			ctx.node=node.childs[0];
			SRFB.walkEBNF(ctx);
			break;
		} else {
			args.push(ctx.result.length);
			for(var i=0; i<node.childs.length; i++){
				if(i%2==0){					
					ctx.node=node.childs[i];
					SRFB.walkEBNF(ctx);
					args.push(ctx.result.length);
				}
			}
			ctx.node=node;
			var arguments='Choice(0,\n';
			for(var i=0; i<node.childs.length; i++){
			    if(i%2==0){
					arguments+=(ctx.result.substr(args[i/2],args[i/2+1]-args[i/2]));
					if(i<node.childs.length-1) 
						arguments+=',\n';
				}
			}
			arguments+=')';
			if(count==0){
				ctx.result="";
			} else {
				ctx.result=ctx.result.substr(0,count);
			}
			ctx.result += arguments;
		}
		break;
	case "factor_":
	case "identifier_":
	case "literal_":
	case "title_":
	case "comment_":
		var index = ctx.result.length;
		for(var i=0; i<node.childs.length; i++){
			ctx.node=node.childs[i];			
			args.push(ctx.result.length);
			SRFB.walkEBNF(ctx);
			var send=ctx.result;
			if(count!=0){
				if(ctx.result.length>count){
					send= ctx.result.substr(count);
				} else {
					send ="";
				}				
				ctx.result=ctx.result.substr(0,count);				
			} else {
				ctx.result="";
			}
			switch(node.name){
				case "factor_":
					ctx.result+=send;
					break;
				case "identifier_":
					ctx.result+="NonTerminal('"+send+"')";
					break;
				case "literal_":
					ctx.result+="Terminal("+send+")";
					break;
				case "comment_":
					ctx.result+="Comment("+send+")";
					break;
				case "title_":
					break;
			}
			if(i<node.childs.length-1) ctx.result+=",";	
			count = ctx.result.length;			
		}
		if(node.childs.length>1){
			var send=ctx.result;
			if(index!=0){
				if(ctx.result.length>index){
					send= ctx.result.substr(index);
				} else {
					send ="";
				}				
				ctx.result=ctx.result.substr(0,index);				
			} else {
				ctx.result="";
			}
			ctx.result+="Sequence("+send+")";
		}
		ctx.node=node;
		break;
	default:
		ctx.result += ctx.node.name;
		ctx.node=node;
	}
}

SRFB.addtotree = function(ctx){
    if((ctx.pparent==null)||(ctx.pparent.name!=ctx.datanodes[ctx.j])){
		var title="t:"+ctx.i+" l:"+ctx.data[ctx.i].line+" c:"+ctx.data[ctx.i].char;
		var node = {id:(ctx.id++),name:ctx.datanodes[ctx.j],parent:ctx.pparent,childs:[]};
		node.title=title;
		ctx.ptree.push(node);
		ctx.pparent=node;
		ctx.ptree=node.childs;
	}
	SRFB.addTerminaltoTree(ctx);
}

SRFB.addTerminaltoTree = function(ctx){
	if(ctx.j==(ctx.datanodes.length-1)){
		var title="t:"+ctx.i+" l:"+ctx.data[ctx.i].line+" c:"+ctx.data[ctx.i].char;
		var node = {id:(ctx.id++),name:ctx.data[ctx.i].PathItem,parent:ctx.pparent};
		node.title=title;
		ctx.ptree.push(node);
	}
}

SRFB.dtreewalk = function(ctx){
	if(ctx.node===undefined) return;
	ctx.nodes.push({id:ctx.node.id,label:ctx.node.name,hidden: false,title:ctx.node.title});
	if(ctx.node.parent!=null){
		var id=""+ctx.node.parent.id+"-"+ctx.node.id;
		ctx.edges.push({id:id,from:ctx.node.parent.id,to:ctx.node.id,label:ctx.node.id,hidden: false});
	} 
	if(ctx.node.childs!==undefined){
		for(var i=0; i<ctx.node.childs.length; i++){
			SRFB.dtreewalk({tree:ctx.tree,nodes:ctx.nodes,edges:ctx.edges,node:ctx.node.childs[i]});
		}
	}
}

SRFB.displaygraph = function(elt,context,graphing){
	// build nodes and edges
	var data = context.compiled
	var tree=[];
	var edges=[];
	var nodes=[];
	var ctx={ptree:null, pparent:null, datanodes:null,j:0,data:data,i:0, id:1};
	context.result_tree=tree;
	for(var i=0; i<data.length; i++){
		ctx.datanodes = data[i].level.split(":");
		ctx.ptree = tree;
		ctx.pparent=null;
		for(var j=0; j<ctx.datanodes.length; j++){  // j is the level		
			if(ctx.ptree.length==0){
				ctx.i=i;ctx.j=j;
				SRFB.addtotree(ctx);				
			} else if(ctx.ptree[ctx.ptree.length-1].name==ctx.datanodes[j]){
				ctx.pparent=ctx.ptree[ctx.ptree.length-1];
				ctx.ptree=ctx.pparent.childs;
				if(ctx.ptree[ctx.ptree.length-1].childs==undefined){  // terminal node
					ctx.i=i;ctx.j=j;
					SRFB.addtotree(ctx);				
				} else {
					if(j==(ctx.datanodes.length-1)){
						ctx.i=i;ctx.j=j;
						SRFB.addtotree(ctx);										
					}
				}
			} else {
					ctx.i=i;ctx.j=j;
					SRFB.addtotree(ctx);				
			}
		}		
	}
	
	SRFB.dtreewalk({tree:tree,nodes:nodes,edges:edges,node:tree[0]});
	
	var options={
		layout: {
                    hierarchical: {
			sortMethod:'directed',
                        direction: 'LR', //'UD'
			parentCentralization: true
                    }
                }
	};
	
	if(elt!==null && graphing && nodes.length<1000){
		nodes = new vis.DataSet(nodes);
		edges = new vis.DataSet(edges);
		var datanetwork={nodes,edges};
		var network=new vis.Network(elt,datanetwork,options);
		
		network.on("click", function(e) {
			var node = SRFB.dtreefind(e.nodes[0],tree);
			if((node!==undefined)&&(node!=null)){
				if(node.hidden==undefined){
					node.hidden=true;
				} else {
					node.hidden=!node.hidden;
				}
				var ctx={current:node,parent:node,nodes:[],edges:[]};
				SRFB.dtreehide(ctx);
				nodes.update(ctx.nodes);
				edges.update(ctx.edges);
			}
		});
	}
}

SRFB.dtreehide = function(ctx){
	if(ctx.current!=ctx.parent){
		// build nodes and edges
		ctx.nodes.push({id:ctx.current.id, hidden:ctx.parent.hidden});
		var id=""+ctx.current.parent.id+"-"+ctx.current.id;
		ctx.edges.push({id:id,hidden:ctx.parent.hidden});
	} else {
		if(ctx.parent.hidden){
			ctx.nodes.push({id:ctx.parent.id,label:ctx.parent.name+"+"});
		} else {
			ctx.nodes.push({id:ctx.parent.id,label:ctx.parent.name});
		}
	}
	// do it for all childs as well
	var current = ctx.current;
	if(current.childs!==undefined){
		for(var i=0; i< current.childs.length; i++){		
			ctx.current=current.childs[i];
			SRFB.dtreehide(ctx);		
		}
	}
	ctx.current = current;
}

SRFB.dtreefind = function(id,tree){
	for(var i=0; i<tree.length; i++){
		if(tree[i].id==id){
			return tree[i];
		} else {
			if(tree[i].childs!==undefined){
				var node = SRFB.dtreefind(id,tree[i].childs);
				if(node!==null)
					return node;
			}
		}
	}
	return null;
}