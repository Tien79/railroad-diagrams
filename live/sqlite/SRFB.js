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
	line+=occurrences(str.substr(strindex,results[resultsindex].length-1), '\n', false);
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

