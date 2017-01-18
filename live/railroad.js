"use strict";
/*
Railroad Diagrams 
by Tab Atkins Jr. (and others)
http://xanthir.com
http://twitter.com/tabatkins
http://github.com/tabatkins/railroad-diagrams
This document and all associated files in the github project are licensed under CC0: http://creativecommons.org/publicdomain/zero/1.0/
This means you can reuse, remix, or otherwise appropriate this project for your own use WITHOUT RESTRICTION.
(The actual legal meaning can be found at the above link.)
Don't ask me for permission to use any part of this project, JUST USE IT.
I would appreciate attribution, but that is not required by the license.
*/

/*
This file uses a module pattern to avoid leaking names into the global scope.
The only accidental leakage is the name "temp".
The exported names can be found at the bottom of this file;
simply change the names in the array of strings to change what they are called in your application.
As well, several configuration constants are passed into the module function at the bottom of this file.
At runtime, these constants can be found on the Diagram class.
*/

var root;

if (typeof define === 'function' && define.amd) {
	// AMD. Register as an anonymous module.
	root = {};
	define([], function() {
		return root;
	});
} else if (typeof exports === 'object') {
	// CommonJS for node
	root = exports;
} else {
	// Browser globals (root is window)
	root = this;
}


root.Railroad = function(root, options, context) {

	function subclassOf(baseClass, superClass) {
		baseClass.prototype = Object.create(superClass.prototype);
		baseClass.prototype.$super = superClass.prototype;
	}

	function unnull(/* children */) {
		return [].slice.call(arguments).reduce(function(sofar, x) { return sofar !== undefined ? sofar : x; });
	}

	function determineGaps(outer, inner) {
		var diff = outer - inner;
		switch(Diagram.INTERNAL_ALIGNMENT) {
			case 'left': return [0, diff]; break;
			case 'right': return [diff, 0]; break;
			case 'center':
			default: return [diff/2, diff/2]; break;
		}
	}

	function wrapString(value) {
		return ((typeof value) == 'string') ? new Terminal(value) : value;
	}

	function sum(iter, func) {
		if(!func) func = function(x) { return x; };
		return iter.map(func).reduce(function(a,b){return a+b}, 0);
	}

	function max(iter, func) {
		if(!func) func = function(x) { return x; };
		return Math.max.apply(null, iter.map(func));
	}

	function SVG(name, attrs, text) {
		attrs = attrs || {};
		text = text || '';
		var el = document.createElementNS("http://www.w3.org/2000/svg",name);
		for(var attr in attrs) {
			if(attr === 'xlink:href')
				el.setAttributeNS("http://www.w3.org/1999/xlink", 'href', attrs[attr]);
			else
				el.setAttribute(attr, attrs[attr]);
		}
		el.textContent = text;
		return el;
	}

	function FakeSVG(tagName, attrs, text){
		if(!(this instanceof FakeSVG)) return new FakeSVG(tagName, attrs, text);
		if(text) this.children = text;
		else this.children = [];
		this.tagName = tagName;
		this.attrs = unnull(attrs, {});
		return this;
	};
	FakeSVG.prototype.format = function(x, y, width) {
		// Virtual
	};
	FakeSVG.prototype.addTo = function(parent) {
		if(parent instanceof FakeSVG) {
			parent.children.push(this);
			return this;
		} else {
			var svg = this.toSVG();
			parent.appendChild(svg);
			return svg;
		}
	};
	FakeSVG.prototype.escapeString = function(string) {
		// Escape markdown and HTML special characters
		return string.replace(/[*_\`\[\]<&]/g, function(charString) {
			return '&#' + charString.charCodeAt(0) + ';';
		});
	};
	FakeSVG.prototype.toSVG = function() {
		var el = SVG(this.tagName, this.attrs);
		if(typeof this.children == 'string') {
			el.textContent = this.children;
		} else {
			this.children.forEach(function(e) {
				el.appendChild(e.toSVG());
			});
		}
		return el;
	};
	FakeSVG.prototype.toString = function() {
		var str = '<' + this.tagName;
		var group = this.tagName == "g" || this.tagName == "svg";
		for(var attr in this.attrs) {
			str += ' ' + attr + '="' + (this.attrs[attr]+'').replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"';
		}
		str += '>';
		if(group) str += "\n";
		if(typeof this.children == 'string') {
			str += FakeSVG.prototype.escapeString(this.children);
		} else {
			this.children.forEach(function(e) {
				str += e;
			});
		}
		str += '</' + this.tagName + '>\n';
		return str;
	}

	function Path(x,y) {
		if(!(this instanceof Path)) return new Path(x,y);
		FakeSVG.call(this, 'path');
		this.attrs.d = "M"+x+' '+y;
	}
	subclassOf(Path, FakeSVG);
	Path.prototype.m = function(x,y) {
		this.attrs.d += 'm'+x+' '+y;
		return this;
	}
	Path.prototype.h = function(val) {
		this.attrs.d += 'h'+val;
		return this;
	}
	Path.prototype.right = Path.prototype.h;
	Path.prototype.left = function(val) { return this.h(-val); }
	Path.prototype.v = function(val) {
		this.attrs.d += 'v'+val;
		return this;
	}
	Path.prototype.down = Path.prototype.v;
	Path.prototype.up = function(val) { return this.v(-val); }
	Path.prototype.arc = function(sweep){
		var x = Diagram.ARC_RADIUS;
		var y = Diagram.ARC_RADIUS;
		if(sweep[0] == 'e' || sweep[1] == 'w') {
			x *= -1;
		}
		if(sweep[0] == 's' || sweep[1] == 'n') {
			y *= -1;
		}
		if(sweep == 'ne' || sweep == 'es' || sweep == 'sw' || sweep == 'wn') {
			var cw = 1;
		} else {
			var cw = 0;
		}
		this.attrs.d += "a"+Diagram.ARC_RADIUS+" "+Diagram.ARC_RADIUS+" 0 0 "+cw+' '+x+' '+y;
		return this;
	}
	Path.prototype.format = function() {
		// All paths in this library start/end horizontally.
		// The extra .5 ensures a minor overlap, so there's no seams in bad rasterizers.
		this.attrs.d += 'h.5';
		return this;
	}

	function Diagram(items) {
		if(!(this instanceof Diagram)) {
			return new Diagram([].slice.call(arguments));
		}
		FakeSVG.call(this, 'svg', {class: Diagram.DIAGRAM_CLASS});
		this.items = items.map(wrapString);
		this.items.unshift(new Start);
		this.items.push(new End);
		this.up = this.down = this.height = this.width = 0;
		for(var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			this.width += item.width + (item.needsSpace?20:0);
			this.up = Math.max(this.up, item.up - this.height);
			this.height += item.height;
			this.down = Math.max(this.down - item.height, item.down);
		}
		this.formatted = false;
	}
	subclassOf(Diagram, FakeSVG);
	for(var option in options) {
		Diagram[option] = options[option];
	}
	Diagram.prototype.format = function(paddingt, paddingr, paddingb, paddingl) {
		paddingt = unnull(paddingt, 20);
		paddingr = unnull(paddingr, paddingt, 20);
		paddingb = unnull(paddingb, paddingt, 20);
		paddingl = unnull(paddingl, paddingr, 20);
		var x = paddingl;
		var y = paddingt;
		y += this.up;
		var g = FakeSVG('g', Diagram.STROKE_ODD_PIXEL_LENGTH ? {transform:'translate(.5 .5)'} : {});
		for(var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			if(item.needsSpace) {
				Path(x,y).h(10).addTo(g);
				x += 10;
			}
			item.format(x, y, item.width).addTo(g);
			x += item.width;
			y += item.height;
			if(item.needsSpace) {
				Path(x,y).h(10).addTo(g);
				x += 10;
			}
		}
		this.attrs.width = this.width + paddingl + paddingr;
		this.attrs.height = this.up + this.height + this.down + paddingt + paddingb;
		this.attrs.viewBox = "0 0 " + this.attrs.width + " " + this.attrs.height;
		g.addTo(this);
		this.formatted = true;
		return this;
	}
	Diagram.prototype.addTo = function(parent) {
		if(!parent) {
			var scriptTag = document.getElementsByTagName('script');
			scriptTag = scriptTag[scriptTag.length - 1];
			parent = scriptTag.parentNode;
		}
		return this.$super.addTo.call(this, parent);
	}
	Diagram.prototype.toSVG = function() {
		if (!this.formatted) {
			this.format();
		}
		return this.$super.toSVG.call(this);
	}
	Diagram.prototype.toString = function() {
		if (!this.formatted) {
			this.format();
		}
		return this.$super.toString.call(this);
	}

	function ComplexDiagram() {
		var diagram = new Diagram([].slice.call(arguments));
		var items = diagram.items;
		items.shift();
		items.pop();
		items.unshift(new Start("complex"));
		items.push(new End("complex"));
		diagram.items = items;
		return diagram;
	}

	function Sequence(items) {
		if(!(this instanceof Sequence)) return new Sequence([].slice.call(arguments));
		FakeSVG.call(this, 'g');
		this.items = items.map(wrapString);
		var numberOfItems = this.items.length;
		this.needsSpace = true;
		this.up = this.down = this.height = this.width = 0;
		for(var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			this.width += item.width + (item.needsSpace?20:0);
			this.up = Math.max(this.up, item.up - this.height);
			this.height += item.height;
			this.down = Math.max(this.down - item.height, item.down);
		}
		if(this.items[0].needsSpace) this.width -= 10;
		if(this.items[this.items.length-1].needsSpace) this.width -= 10;
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "sequence"
		}
	}
	subclassOf(Sequence, FakeSVG);
	Sequence.prototype.format = function(x,y,width) {
		// Hook up the two sides if this is narrower than its stated width.
		var gaps = determineGaps(width, this.width);
		Path(x,y).h(gaps[0]).addTo(this);
		Path(x+gaps[0]+this.width,y+this.height).h(gaps[1]).addTo(this);
		x += gaps[0];

		for(var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			if(item.needsSpace && i > 0) {
				Path(x,y).h(10).addTo(this);
				x += 10;
			}
			item.format(x, y, item.width).addTo(this);
			x += item.width;
			y += item.height;
			if(item.needsSpace && i < this.items.length-1) {
				Path(x,y).h(10).addTo(this);
				x += 10;
			}
		}
		return this;
	}

	function Stack(items) {
		if(!(this instanceof Stack)) return new Stack([].slice.call(arguments));
		FakeSVG.call(this, 'g');
		if( items.length === 0 ) {
			throw new RangeError("Stack() must have at least one child.");
		}
		this.items = items.map(wrapString);
		this.width = Math.max.apply(null, this.items.map(function(e) { return e.width + (e.needsSpace?20:0); }));
		if(this.items[0].needsSpace) this.width -= 10;
		if(this.items[this.items.length-1].needsSpace) this.width -= 10;
		if(this.items.length > 1){
			this.width += Diagram.ARC_RADIUS*2;
		}
		this.needsSpace = true;
		this.up = this.items[0].up;
		this.down = this.items[this.items.length-1].down;

		this.height = 0;
		for(var i = 0; i < this.items.length; i++) {
			this.height += this.items[i].height;
			if(i !== this.items.length-1) {
				this.height += Math.max(this.items[i].down + Diagram.VERTICAL_SEPARATION, Diagram.ARC_RADIUS*2) + Math.max(this.items[i+1].up + Diagram.VERTICAL_SEPARATION, Diagram.ARC_RADIUS*2);
			}
		}
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "stack"
		}
	}
	subclassOf(Stack, FakeSVG);
	Stack.prototype.format = function(x,y,width) {
		var gaps = determineGaps(width, this.width);
		Path(x,y).h(gaps[0]).addTo(this);
		x += gaps[0];
		var xInitial = x;
		if(this.items.length > 1) {
			Path(x, y).h(Diagram.ARC_RADIUS).addTo(this);
			x += Diagram.ARC_RADIUS;
		}

		for(var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			var innerWidth = this.width - (this.items.length>1 ? Diagram.ARC_RADIUS*2 : 0);
			item.format(x, y, innerWidth).addTo(this);
			x += innerWidth;
			y += item.height;
            
			if(i !== this.items.length-1) {
				/* this patch comes from Gilbert Brault to avoid href not properly working (hidden by the return path)
				Path(x, y)
					.arc('ne').down(Math.max(0, item.down + Diagram.VERTICAL_SEPARATION - Diagram.ARC_RADIUS*2))
					.arc('es').left(innerWidth)
					.arc('nw').down(Math.max(0, this.items[i+1].up + Diagram.VERTICAL_SEPARATION - Diagram.ARC_RADIUS*2))
					.arc('ws').addTo(this);
				*/
				var temp =y;
				Path(x, y).arc('ne').down(Math.max(0, item.down + Diagram.VERTICAL_SEPARATION - Diagram.ARC_RADIUS*2)).addTo(this);
				y+=Diagram.ARC_RADIUS+Math.max(0, item.down + Diagram.VERTICAL_SEPARATION - Diagram.ARC_RADIUS*2); 
				x+=Diagram.ARC_RADIUS;
				Path(x, y).arc('es').left(innerWidth).addTo(this);
				y+=Diagram.ARC_RADIUS;x=x-innerWidth-Diagram.ARC_RADIUS;;
				Path(x, y).arc('nw').down(Math.max(0, this.items[i+1].up + Diagram.VERTICAL_SEPARATION - Diagram.ARC_RADIUS*2)).addTo(this);
				y+=Diagram.ARC_RADIUS+Math.max(0, this.items[i+1].up + Diagram.VERTICAL_SEPARATION - Diagram.ARC_RADIUS*2);
				x=x-Diagram.ARC_RADIUS;
				Path(x, y).arc('ws').addTo(this);
				y = temp + Math.max(item.down + Diagram.VERTICAL_SEPARATION, Diagram.ARC_RADIUS*2) + Math.max(this.items[i+1].up + Diagram.VERTICAL_SEPARATION, Diagram.ARC_RADIUS*2);
				//y += Math.max(Diagram.ARC_RADIUS*4, item.down + Diagram.VERTICAL_SEPARATION*2 + this.items[i+1].up)
				x = xInitial+Diagram.ARC_RADIUS;
			}

		}

		if(this.items.length > 1) {
			Path(x,y).h(Diagram.ARC_RADIUS).addTo(this);
			x += Diagram.ARC_RADIUS;
		}
		Path(x,y).h(gaps[1]).addTo(this);

		return this;
	}

	function OptionalSequence(items) {
		if(!(this instanceof OptionalSequence)) return new OptionalSequence([].slice.call(arguments));
		FakeSVG.call(this, 'g');
		if( items.length === 0 ) {
			throw new RangeError("OptionalSequence() must have at least one child.");
		}
		if( items.length === 1 ) {
			return new Sequence(items);
		}
		this.items = items.map(wrapString);
		this.needsSpace = false;
		this.width = Diagram.ARC_RADIUS *4;
		this.up = 0;
		this.height = sum(this.items, function(x){return x.height});
		this.down = this.items[0].down;
		var heightSoFar = 0;
		for(var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			this.up = Math.max(this.up, Math.max(Diagram.ARC_RADIUS*2, item.up + Diagram.VERTICAL_SEPARATION) - heightSoFar);
			heightSoFar += item.height;
			if(i > 0) {
				this.down = Math.max(this.height + this.down, heightSoFar + Math.max(Diagram.ARC_RADIUS*2, item.down + Diagram.VERTICAL_SEPARATION)) - this.height;
			}
			this.width += Math.max(Diagram.ARC_RADIUS*2, item.width + (item.needsSpace?20:0));
			if(i == 0) this.width += Diagram.ARC_RADIUS;
			else if(i == 1) this.width += Diagram.ARC_RADIUS*2;
			else if(i < this.items.length - 1) this.width += Diagram.ARC_RADIUS*3;
		}
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "optseq"
		}
	}
	subclassOf(OptionalSequence, FakeSVG);
	OptionalSequence.prototype.format = function(x, y, width) {
		var gaps = determineGaps(width, this.width)
		Path(x, y).h(gaps[0]).addTo(this)
		Path(x + gaps[0] + this.width, y + this.height).h(gaps[1]).addTo(this)
		x += gaps[0]
		var upperLineY = y - this.up;
		var last = this.items.length - 1;
		Path(x,y)
			.arc('se')
			.up(Math.max(0, this.up - Diagram.ARC_RADIUS*2))
			.arc('wn')
			.right(this.width - Diagram.ARC_RADIUS*5 - this.items[last].width - (this.items[last].needsSpace?20:0))
			.arc('ne')
			.down(Math.max(0, this.up + this.height - this.items[last].height - Diagram.ARC_RADIUS*2))
			.arc('ws')
			.addTo(this);
		for(var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			var itemWidth = item.width + (item.needsSpace?20:0);
			if(i == 0) var spaceSize = Diagram.ARC_RADIUS;
			else if(i == 1) var spaceSize = Diagram.ARC_RADIUS*2;
			else var spaceSize = Diagram.ARC_RADIUS*3;
			if(i > 0) {
				if(i < last) {
					Path(x + spaceSize - Diagram.ARC_RADIUS*2, upperLineY)
						.arc('ne')
						.down(Math.abs(upperLineY - y) - Diagram.ARC_RADIUS*2)
						.arc('ws')
						.addTo(this);
				}
				Path(x + spaceSize - Diagram.ARC_RADIUS*2, y)
					.arc('ne')
					.down(item.height + Math.max(0, item.down + Diagram.VERTICAL_SEPARATION - Diagram.ARC_RADIUS*2))
					.arc('ws')
					.right(itemWidth - Diagram.ARC_RADIUS)
					.arc('se')
					.up(Math.max(0, item.down + Diagram.VERTICAL_SEPARATION - Diagram.ARC_RADIUS*2))
					.arc('wn')
					.addTo(this);
			}
			Path(x, y).right(spaceSize).addTo(this);
			x += spaceSize;
			item.format(x, y, itemWidth).addTo(this);
			x += itemWidth;
			y += item.height;
		}
		Path(x, y).right(Diagram.ARC_RADIUS*2).addTo(this);
		return this;
	};

	function Choice(normal, items) {
		if(!(this instanceof Choice)) return new Choice(normal, [].slice.call(arguments,1));
		FakeSVG.call(this, 'g');
		if( typeof normal !== "number" || normal !== Math.floor(normal) ) {
			throw new TypeError("The first argument of Choice() must be an integer.");
		} else if(normal < 0 || normal >= items.length) {
			throw new RangeError("The first argument of Choice() must be an index for one of the items.");
		} else {
			this.normal = normal;
		}
		var first = 0;
		var last = items.length - 1;
		this.items = items.map(wrapString);
		this.width = Math.max.apply(null, this.items.map(function(el){return el.width})) + Diagram.ARC_RADIUS*4;
		this.height = this.items[normal].height;
		this.up = this.items[first].up;
		for(var i = first; i < normal; i++) {
			if(i == normal-1) var arcs = Diagram.ARC_RADIUS*2;
			else var arcs = Diagram.ARC_RADIUS;
			this.up += Math.max(arcs, this.items[i].height + this.items[i].down + Diagram.VERTICAL_SEPARATION + this.items[i+1].up);
		}
		this.down = this.items[last].down;
		for(var i = normal+1; i <= last; i++) {
			if(i == normal+1) var arcs = Diagram.ARC_RADIUS*2;
			else var arcs = Diagram.ARC_RADIUS;
			this.down += Math.max(arcs, this.items[i-1].height + this.items[i-1].down + Diagram.VERTICAL_SEPARATION + this.items[i].up);
		}
		this.down -= this.items[normal].height; // already counted in Choice.height
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "choice"
		}
	}
	subclassOf(Choice, FakeSVG);
	Choice.prototype.format = function(x,y,width) {
		// Hook up the two sides if this is narrower than its stated width.
		var gaps = determineGaps(width, this.width);
		Path(x,y).h(gaps[0]).addTo(this);
		Path(x+gaps[0]+this.width,y+this.height).h(gaps[1]).addTo(this);
		x += gaps[0];

		var last = this.items.length -1;
		var innerWidth = this.width - Diagram.ARC_RADIUS*4;

		// Do the elements that curve above
		for(var i = this.normal - 1; i >= 0; i--) {
			var item = this.items[i];
			if( i == this.normal - 1 ) {
				var distanceFromY = Math.max(Diagram.ARC_RADIUS*2, this.items[this.normal].up + Diagram.VERTICAL_SEPARATION + item.down + item.height);
			}
			Path(x,y)
				.arc('se')
				.up(distanceFromY - Diagram.ARC_RADIUS*2)
				.arc('wn').addTo(this);
			item.format(x+Diagram.ARC_RADIUS*2,y - distanceFromY,innerWidth).addTo(this);
			Path(x+Diagram.ARC_RADIUS*2+innerWidth, y-distanceFromY+item.height)
				.arc('ne')
				.down(distanceFromY - item.height + this.height - Diagram.ARC_RADIUS*2)
				.arc('ws').addTo(this);
			distanceFromY += Math.max(Diagram.ARC_RADIUS, item.up + Diagram.VERTICAL_SEPARATION + (i == 0 ? 0 : this.items[i-1].down+this.items[i-1].height));
		}

		// Do the straight-line path.
		Path(x,y).right(Diagram.ARC_RADIUS*2).addTo(this);
		this.items[this.normal].format(x+Diagram.ARC_RADIUS*2, y, innerWidth).addTo(this);
		Path(x+Diagram.ARC_RADIUS*2+innerWidth, y+this.height).right(Diagram.ARC_RADIUS*2).addTo(this);

		// Do the elements that curve below
		for(var i = this.normal+1; i <= last; i++) {
			var item = this.items[i];
			if( i == this.normal + 1 ) {
				var distanceFromY = Math.max(Diagram.ARC_RADIUS*2, this.height + this.items[this.normal].down + Diagram.VERTICAL_SEPARATION + item.up);
			}
			Path(x,y)
				.arc('ne')
				.down(distanceFromY - Diagram.ARC_RADIUS*2)
				.arc('ws').addTo(this);
			item.format(x+Diagram.ARC_RADIUS*2, y+distanceFromY, innerWidth).addTo(this);
			Path(x+Diagram.ARC_RADIUS*2+innerWidth, y+distanceFromY+item.height)
				.arc('se')
				.up(distanceFromY - Diagram.ARC_RADIUS*2 + item.height - this.height)
				.arc('wn').addTo(this);
			distanceFromY += Math.max(Diagram.ARC_RADIUS, item.height + item.down + Diagram.VERTICAL_SEPARATION + (i == last ? 0 : this.items[i+1].up));
		}

		return this;
	}

	function MultipleChoice(normal, type, items) {
		if(!(this instanceof MultipleChoice)) return new MultipleChoice(normal, type, [].slice.call(arguments,2));
		FakeSVG.call(this, 'g');
		if( typeof normal !== "number" || normal !== Math.floor(normal) ) {
			throw new TypeError("The first argument of MultipleChoice() must be an integer.");
		} else if(normal < 0 || normal >= items.length) {
			throw new RangeError("The first argument of MultipleChoice() must be an index for one of the items.");
		} else {
			this.normal = normal;
		}
		if( type != "any" && type != "all" ) {
			throw new SyntaxError("The second argument of MultipleChoice must be 'any' or 'all'.");
		} else {
			this.type = type;
		}
		this.needsSpace = true;
		this.items = items.map(wrapString);
		this.innerWidth = max(this.items, function(x){return x.width});
		this.width = 30 + Diagram.ARC_RADIUS + this.innerWidth + Diagram.ARC_RADIUS + 20;
		this.up = this.items[0].up;
		this.down = this.items[this.items.length-1].down;
		this.height = this.items[normal].height;
		for(var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			if(i == normal - 1 || i == normal + 1) var minimum = 10 + Diagram.ARC_RADIUS;
			else var minimum = Diagram.ARC_RADIUS;
			if(i < normal) {
				this.up += Math.max(minimum, item.height + item.down + Diagram.VERTICAL_SEPARATION + this.items[i+1].up);
			} else if(i > normal) {
				this.down += Math.max(minimum, item.up + Diagram.VERTICAL_SEPARATION + this.items[i-1].down + this.items[i-1].height);
			}
		}
		this.down -= this.items[normal].height; // already counted in this.height
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "multiplechoice"
		}
	}
	subclassOf(MultipleChoice, FakeSVG);
	MultipleChoice.prototype.format = function(x, y, width) {
		var gaps = determineGaps(width, this.width);
		Path(x, y).right(gaps[0]).addTo(this);
		Path(x + gaps[0] + this.width, y + this.height).right(gaps[1]).addTo(this);
		x += gaps[0];

		var normal = this.items[this.normal];

		// Do the elements that curve above
		for(var i = this.normal - 1; i >= 0; i--) {
			var item = this.items[i];
			if( i == this.normal - 1 ) {
				var distanceFromY = Math.max(10 + Diagram.ARC_RADIUS, normal.up + Diagram.VERTICAL_SEPARATION + item.down + item.height);
			}
			Path(x + 30,y)
				.up(distanceFromY - Diagram.ARC_RADIUS)
				.arc('wn').addTo(this);
			item.format(x + 30 + Diagram.ARC_RADIUS, y - distanceFromY, this.innerWidth).addTo(this);
			Path(x + 30 + Diagram.ARC_RADIUS + this.innerWidth, y - distanceFromY + item.height)
				.arc('ne')
				.down(distanceFromY - item.height + this.height - Diagram.ARC_RADIUS - 10)
				.addTo(this);
			if(i != 0) {
				distanceFromY += Math.max(Diagram.ARC_RADIUS, item.up + Diagram.VERTICAL_SEPARATION + this.items[i-1].down + this.items[i-1].height);
			}
		}

		Path(x + 30, y).right(Diagram.ARC_RADIUS).addTo(this);
		normal.format(x + 30 + Diagram.ARC_RADIUS, y, this.innerWidth).addTo(this);
		Path(x + 30 + Diagram.ARC_RADIUS + this.innerWidth, y + this.height).right(Diagram.ARC_RADIUS).addTo(this);

		for(var i = this.normal+1; i < this.items.length; i++) {
			var item = this.items[i];
			if(i == this.normal + 1) {
				var distanceFromY = Math.max(10+Diagram.ARC_RADIUS, normal.height + normal.down + Diagram.VERTICAL_SEPARATION + item.up);
			}
			Path(x + 30, y)
				.down(distanceFromY - Diagram.ARC_RADIUS)
				.arc('ws')
				.addTo(this);
			item.format(x + 30 + Diagram.ARC_RADIUS, y + distanceFromY, this.innerWidth).addTo(this)
			Path(x + 30 + Diagram.ARC_RADIUS + this.innerWidth, y + distanceFromY + item.height)
				.arc('se')
				.up(distanceFromY - Diagram.ARC_RADIUS + item.height - normal.height)
				.addTo(this);
			if(i != this.items.length - 1) {
				distanceFromY += Math.max(Diagram.ARC_RADIUS, item.height + item.down + Diagram.VERTICAL_SEPARATION + this.items[i+1].up);
			}
		}
		var text = FakeSVG('g', {"class": "diagram-text"}).addTo(this)
		FakeSVG('title', {}, (this.type=="any"?"take one or more branches, once each, in any order":"take all branches, once each, in any order")).addTo(text)
		FakeSVG('path', {
			"d": "M "+(x+30)+" "+(y-10)+" h -26 a 4 4 0 0 0 -4 4 v 12 a 4 4 0 0 0 4 4 h 26 z",
			"class": "diagram-text"
			}).addTo(text)
		FakeSVG('text', {
			"x": x + 15,
			"y": y + 4,
			"class": "diagram-text"
			}, (this.type=="any"?"1+":"all")).addTo(text)
		FakeSVG('path', {
			"d": "M "+(x+this.width-20)+" "+(y-10)+" h 16 a 4 4 0 0 1 4 4 v 12 a 4 4 0 0 1 -4 4 h -16 z",
			"class": "diagram-text"
			}).addTo(text)
		FakeSVG('path', {
			"d": "M "+(x+this.width-13)+" "+(y-2)+" a 4 4 0 1 0 6 -1 m 2.75 -1 h -4 v 4 m 0 -3 h 2",
			"style": "stroke-width: 1.75"
		}).addTo(text)
		return this;
	};

	function Optional(item, skip) {
		if( skip === undefined )
			return Choice(1, Skip(), item);
		else if ( skip === "skip" )
			return Choice(0, Skip(), item);
		else
			throw "Unknown value for Optional()'s 'skip' argument.";
	}

	function OneOrMore(item, rep) {
		if(!(this instanceof OneOrMore)) return new OneOrMore(item, rep);
		FakeSVG.call(this, 'g');
		rep = rep || (new Skip);
		this.item = wrapString(item);
		this.rep = wrapString(rep);
		this.width = Math.max(this.item.width, this.rep.width) + Diagram.ARC_RADIUS*2;
		this.height = this.item.height;
		this.up = this.item.up;
		this.down = Math.max(Diagram.ARC_RADIUS*2, this.item.down + Diagram.VERTICAL_SEPARATION + this.rep.up + this.rep.height + this.rep.down);
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "oneormore"
		}
	}
	subclassOf(OneOrMore, FakeSVG);
	OneOrMore.prototype.needsSpace = true;
	OneOrMore.prototype.format = function(x,y,width) {
		// Hook up the two sides if this is narrower than its stated width.
		var gaps = determineGaps(width, this.width);
		Path(x,y).h(gaps[0]).addTo(this);
		Path(x+gaps[0]+this.width,y+this.height).h(gaps[1]).addTo(this);
		x += gaps[0];

		// Draw item
		Path(x,y).right(Diagram.ARC_RADIUS).addTo(this);
		this.item.format(x+Diagram.ARC_RADIUS,y,this.width-Diagram.ARC_RADIUS*2).addTo(this);
		Path(x+this.width-Diagram.ARC_RADIUS,y+this.height).right(Diagram.ARC_RADIUS).addTo(this);

		// Draw repeat arc
		var distanceFromY = Math.max(Diagram.ARC_RADIUS*2, this.item.height+this.item.down+Diagram.VERTICAL_SEPARATION+this.rep.up);
		Path(x+Diagram.ARC_RADIUS,y).arc('nw').down(distanceFromY-Diagram.ARC_RADIUS*2).arc('ws').addTo(this);
		this.rep.format(x+Diagram.ARC_RADIUS, y+distanceFromY, this.width - Diagram.ARC_RADIUS*2).addTo(this);
		Path(x+this.width-Diagram.ARC_RADIUS, y+distanceFromY+this.rep.height).arc('se').up(distanceFromY-Diagram.ARC_RADIUS*2+this.rep.height-this.item.height).arc('en').addTo(this);

		return this;
	}

	function ZeroOrMore(item, rep, skip) {
		return Optional(OneOrMore(item, rep), skip);
	}

	function Start(type) {
		if(!(this instanceof Start)) return new Start();
		FakeSVG.call(this, 'path');
		this.width = 20;
		this.height = 0;
		this.up = 10;
		this.down = 10;
		this.type = type || "simple";
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "start"
		}
	}
	subclassOf(Start, FakeSVG);
	Start.prototype.format = function(x,y) {
		if (this.type === "complex") {
			this.attrs.d = 'M '+x+' '+(y-10)+' v 20 m 0 -10 h 20.5';
		} else {
			this.attrs.d = 'M '+x+' '+(y-10)+' v 20 m 10 -20 v 20 m -10 -10 h 20.5';
		}
		return this;
	}

	function End(type) {
		if(!(this instanceof End)) return new End();
		FakeSVG.call(this, 'path');
		this.width = 20;
		this.height = 0;
		this.up = 10;
		this.down = 10;
		this.type = type || "simple";
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "end"
		}
	}
	subclassOf(End, FakeSVG);
	End.prototype.format = function(x,y) {
		if (this.type === "complex") {
			this.attrs.d = 'M '+x+' '+y+' h 20 m 0 -10 v 20';
		} else {
			this.attrs.d = 'M '+x+' '+y+' h 20 m -10 -10 v 20 m 10 -20 v 20';
		}
		return this;
	}

	function Terminal(text, href) {
		if((href===undefined)&&context.href){
			href="javascript:"+context.dochref+"('Terminal','"+text+"')";
		}
		if(!(this instanceof Terminal)) return new Terminal(text, href);
		FakeSVG.call(this, 'g', {'class': 'terminal'});
		this.text = text;
		this.href = href;
		this.width = text.length * 8 + 20; /* Assume that each char is .5em, and that the em is 16px */
		this.height = 0;
		this.up = 11;
		this.down = 11;
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "terminal"
		}
	}
	subclassOf(Terminal, FakeSVG);
	Terminal.prototype.needsSpace = true;
	Terminal.prototype.format = function(x, y, width) {
		// Hook up the two sides if this is narrower than its stated width.
		var gaps = determineGaps(width, this.width);
		Path(x,y).h(gaps[0]).addTo(this);
		Path(x+gaps[0]+this.width,y).h(gaps[1]).addTo(this);
		x += gaps[0];

		FakeSVG('rect', {x:x, y:y-11, width:this.width, height:this.up+this.down, rx:10, ry:10}).addTo(this);
		var text = FakeSVG('text', {x:x+this.width/2, y:y+4}, this.text);
		if(this.href)
			FakeSVG('a', {'xlink:href': this.href}, [text]).addTo(this);
		else
			text.addTo(this);
		return this;
	}

	function NonTerminal(text, href) {
		if((href===undefined)&&context.href){
			href="javascript:"+context.dochref+"('NonTerminal','"+text+"')";
		}
		if(!(this instanceof NonTerminal)) return new NonTerminal(text, href);
		FakeSVG.call(this, 'g', {'class': 'non-terminal'});
		this.text = text;
		this.href = href;
		this.width = text.length * 8 + 20;
		this.height = 0;
		this.up = 11;
		this.down = 11;
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "nonterminal"
		}
	}
	subclassOf(NonTerminal, FakeSVG);
	NonTerminal.prototype.needsSpace = true;
	NonTerminal.prototype.format = function(x, y, width) {
		// Hook up the two sides if this is narrower than its stated width.
		var gaps = determineGaps(width, this.width);
		Path(x,y).h(gaps[0]).addTo(this);
		Path(x+gaps[0]+this.width,y).h(gaps[1]).addTo(this);
		x += gaps[0];

		FakeSVG('rect', {x:x, y:y-11, width:this.width, height:this.up+this.down}).addTo(this);
		var text = FakeSVG('text', {x:x+this.width/2, y:y+4}, this.text);
		if(this.href)
			FakeSVG('a', {'xlink:href': this.href}, [text]).addTo(this);
		else
			text.addTo(this);
		return this;
	}

	function NonImplemented(text, href) {
		if((href===undefined)&&context.href){
			href="javascript:"+context.dochref+"('NonImplemented','"+text+"')";
		}
		if(!(this instanceof NonImplemented)) return new NonImplemented("<"+text+">", href);
		FakeSVG.call(this, 'g', {'class': 'non-terminal'});
		this.text = text;
		this.href = href;
		this.width = text.length * 8 + 20;
		this.height = 0;
		this.up = 11;
		this.down = 11;
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "nonterminal"
		}
	}
	subclassOf(NonImplemented, FakeSVG);
	NonImplemented.prototype.needsSpace = true;
	NonImplemented.prototype.format = function(x, y, width) {
		// Hook up the two sides if this is narrower than its stated width.
		var gaps = determineGaps(width, this.width);
		Path(x,y).h(gaps[0]).addTo(this);
		Path(x+gaps[0]+this.width,y).h(gaps[1]).addTo(this);
		x += gaps[0];

		FakeSVG('rect', {x:x, y:y-11, width:this.width, height:this.up+this.down}).addTo(this);
		var text = FakeSVG('text', {x:x+this.width/2, y:y+4}, this.text);
		if(this.href)
			FakeSVG('a', {'xlink:href': this.href}, [text]).addTo(this);
		else
			text.addTo(this);
		return this;
	}

	function Comment(text, href) {
		if(!(this instanceof Comment)) return new Comment(text, href);
		FakeSVG.call(this, 'g');
		this.text = text;
		this.href = href;
		this.width = text.length * 7 + 10;
		this.height = 0;
		this.up = 11;
		this.down = 11;
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "comment"
		}
	}
	subclassOf(Comment, FakeSVG);
	Comment.prototype.needsSpace = true;
	Comment.prototype.format = function(x, y, width) {
		// Hook up the two sides if this is narrower than its stated width.
		var gaps = determineGaps(width, this.width);
		Path(x,y).h(gaps[0]).addTo(this);
		Path(x+gaps[0]+this.width,y+this.height).h(gaps[1]).addTo(this);
		x += gaps[0];

		var text = FakeSVG('text', {x:x+this.width/2, y:y+5, class:'comment'}, this.text);
		if(this.href)
			FakeSVG('a', {'xlink:href': this.href}, [text]).addTo(this);
		else
			text.addTo(this);
		return this;
	}

	function Skip() {
		if(!(this instanceof Skip)) return new Skip();
		FakeSVG.call(this, 'g');
		this.width = 0;
		this.height = 0;
		this.up = 0;
		this.down = 0;
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "skip"
		}
	}
	subclassOf(Skip, FakeSVG);
	Skip.prototype.format = function(x, y, width) {
		Path(x,y).right(width).addTo(this);
		return this;
	}
	/*******************************************************************************************************************************************************************/
	/*
	/* all code from there is originally written by Gilbert Brault (31/12/2016)
	/* the code before this tag comes from tabatkins original work
	/*
	/*******************************************************************************************************************************************************************/

	function Title(text, href) {
		if(!(this instanceof Title)) return new Title(text, href);
		FakeSVG.call(this, 'g');
		context.title=text;
		this.text = text;
		this.href = href;
		this.width = text.length * 7 + 10;
		this.height = 0;
		this.up = 11;
		this.down = 11;
		if(Diagram.DEBUG) {
			this.attrs['data-updown'] = this.up + " " + this.height + " " + this.down
			this.attrs['data-type'] = "title"
		}
	}
	subclassOf(Title, FakeSVG);
	Title.prototype.needsSpace = true;
	Title.prototype.format = function(x, y, width) {
		// Hook up the two sides if this is narrower than its stated width.
		var gaps = determineGaps(width, this.width);
		Path(x,y).h(gaps[0]).addTo(this);
		Path(x+gaps[0]+this.width,y+this.height).h(gaps[1]).addTo(this);
		x += gaps[0];

		var text = FakeSVG('text', {x:x+this.width/2, y:y+5, class:'comment'}, this.text);
		if(this.href)
			FakeSVG('a', {'xlink:href': this.href}, [text]).addTo(this);
		else
			text.addTo(this);
		return this;
	}	

	root.Railroad.SetExports = SetExports;

	function SetExports(fnx,fnames){

		/*
			fnames are the names that the internal classes are exported as.
			If you would like different names, adjust them here.
		*/
		fnames.forEach(
			function(e,i){ root[e] = fnx[i]; });
	}

	var fnames=['Title','Diagram', 'ComplexDiagram', 'Sequence', 'Stack', 'OptionalSequence', 'Choice', 'MultipleChoice', 'Optional', 'OneOrMore', 'ZeroOrMore', 'Terminal', 'NonTerminal', 'Comment', 'Skip','NonImplemented'];
	root.Railroad.fnames=fnames;
	var graphing = [Title,Diagram, ComplexDiagram, Sequence, Stack, OptionalSequence, Choice, MultipleChoice, Optional, OneOrMore, ZeroOrMore, Terminal, NonTerminal, Comment, Skip, NonImplemented];
	SetExports(graphing,fnames);
    root.Railroad.graphing=graphing;

    // walking functions
    function pTitle(){context.title=arguments[0];return {Title:arguments};};
    function pDiagram(){return {Diagram:arguments};};
    function pComplexDiagram(){return {ComplexDiagram:arguments};};
    function pSequence(){return {Sequence:arguments};};
    function pStack(){return {Stack:arguments};};
    function pOptionalSequence(){return {OptionalSequence:arguments};};
    function pChoice(){return {Choice:arguments};};
    function pMultipleChoice(){return {MultipleChoice:arguments};};
    function pOptional(){return {Optional:arguments};};
    function pOneOrMore(){return {OneOrMore:arguments};};
    function pZeroOrMore(){return {ZeroOrMore:arguments};};
    function pTerminal(){return {Terminal:arguments};};
    function pNonTerminal(){return {NonTerminal:arguments};};
    function pComment(){return {Comment:arguments};};
    function pSkip(){return {Skip:arguments};};
    function pNonImplemented(){return {NonImplemented:arguments};};

    var walking = [pTitle,pDiagram, pComplexDiagram, pSequence, pStack, pOptionalSequence, pChoice, pMultipleChoice, pOptional, pOneOrMore, pZeroOrMore, pTerminal, pNonTerminal, pComment, pSkip, pNonImplemented];
    root.Railroad.walking = walking;

    // generating functions
    function va_args(args){
    	var res="";
    	for(var i=0;i<args.length;i++){
			res +=args[i];
			if(i<args.length-1){
				res+=",";
			}
    	} 
    	return res;   	
    }
	function quote(str){
		str=str.replace(/\\"/g,'"');
		str=str.replace(/"/g,'\\"');
		str='"'+str+'"';
		return str;
	}
	
	function singlequote(str){
		str=str.replace(/\\'/g,"'");
		str=str.replace(/'/g,"\\'");
		str="'"+str+"'";
		return str;
	}
	
    function gTitle(){
		context.fname=arguments[0];
		return "Title.bind(this,"+quote(arguments[0])+")";
	};
    function gDiagram(){return "Diagram.bind(this,"+va_args(arguments)+")";};
    function gComplexDiagram(){return "ComplexDiagram.bind(this,"+va_args(arguments)+")";};
    function gSequence(){return "Sequence.bind(this,"+va_args(arguments)+")";};
    function gStack(){return "Stack.bind(this,"+va_args(arguments)+")";};
    function gOptionalSequence(){return "OptionalSequence.bind(this,"+ va_args(arguments)+")";};
    function gChoice(){return "Choice.bind(this,"+va_args(arguments)+")";};
    function gMultipleChoice(){return "MultipleChoice.bind(this,"+va_args(arguments)+")";};
    function gOptional(){return "Optional.bind(this,"+va_args(arguments)+")";};
    function gOneOrMore(){return "OneOrMore.bind(this,"+va_args(arguments)+")";};
    function gZeroOrMore(){return "ZeroOrMore.bind(this,"+va_args(arguments)+")";};
    function gTerminal(){return "Terminal.bind(this,"+quote(arguments[0])+")";};
    function gNonTerminal(){return "NonTerminal.bind(this,"+quote(arguments[0])+")";};
    function gComment(){return "Comment.bind(this,"+quote(arguments[0])+")";};
    function gSkip(){return "Skip";};
    function gNonImplemented() {return "NonImplemented.bind(this,"+quote(arguments[0])+")";};

    var generating = [gTitle,gDiagram, gComplexDiagram, gSequence, gStack, gOptionalSequence, gChoice, gMultipleChoice, gOptional, gOneOrMore, gZeroOrMore, gTerminal, gNonTerminal, gComment, gSkip, gNonImplemented];
    root.Railroad.generating = generating;
	
	// validating functions
	function execute(fun){
		var tmp=fun;
		do{
			if(typeof tmp ==='function'){
				tmp=tmp();
			} else {
				return tmp;
			}
		} while(true);
    };
	
	root.Railroad.execute = execute;

	function vTitle(){
		return {type:'Title'};			
	};
	
    function vDiagram(){
		var _arguments=arguments;
		return vSSD('Diagram',arguments);
	};
	
    function vComplexDiagram(){
		var error="ComplexDiagram("+context.path[context.pathindex].value+") ";
		if(arguments.length>0)
			error += "("+arguments[0]+")";
			error+= "-lines:"+context.lineschars[context.pathindex].line+" chars:"+context.lineschars[context.pathindex].char+"-";
		return {type:'ComplexDiagram',error};				
	};
	
    function vSSD(type,_arguments){
		/*  All must return no error */
		var res = {type:type};
		var tres;
		var pathindex=context.pathindex;
		var compiledindex=context.compiledindex;
		for(var i=0; i<_arguments.length; i++){		
			tres=execute(_arguments[i]);
			if(tres.error!==undefined){
				res.error=tres.error;
				context.pathindex=pathindex;
				if(compiledindex>0)
					context.compiled=context.compiled.slice(0,compiledindex);
				else
					context.compiled=[];
				context.compiledindex=compiledindex;
				break;
			} 
		}
		return res;
	};
	
	function vSequence(){
		var _arguments=arguments;
		return vSSD('Sequence',arguments);
	}
	
    function vStack(){
		var _arguments=arguments;
		return vSSD('Stack',_arguments);
	};
	
    function vOptionalSequence(){
		var error="OptionalSequence("+context.path[context.pathindex].value+") ";
		if(arguments.length>0)
			error += "("+arguments[0]+")";
			error+= "-lines:"+context.lineschars[context.pathindex].line+" chars:"+context.lineschars[context.pathindex].char+"-";
		return {type:'OptionalSequence',error};			
	};
	
    function vChoice(){
		/* One at least must return no error (or skip)*/
		var tres;
		var skip=false;
		var pathindex=context.pathindex;
		var compiledindex=context.compiledindex;
		for(var i=1; i<arguments.length; i++){ // don't care about arguments[0]
			tres = execute(arguments[i]);
			if(tres.error===undefined){
				if(tres.type=='skip'){
					skip=true;
				} else {
					return tres;
				}			
			}
			context.pathindex=pathindex;
			if(compiledindex>0)
				context.compiled=context.compiled.slice(0,compiledindex);
			else
				context.compiled=[];
			context.compiledindex=compiledindex;
		}
		if(skip){
			context.pathindex=pathindex;
			if(compiledindex>0)
				context.compiled=context.compiled.slice(0,compiledindex);
			else
				context.compiled=[];
			context.compiledindex=compiledindex;
			return {type:'choice'};
		} else {
			context.pathindex=pathindex;
			if(compiledindex>0)
				context.compiled=context.compiled.slice(0,compiledindex);
			else
				context.compiled=[];
			context.compiledindex=compiledindex;
			var error="choice with("+context.path[context.pathindex].value+") not possible";
			error+= "-lines:"+context.lineschars[context.path[context.pathindex].index].line+" chars:"+context.lineschars[context.path[context.pathindex].index].char+"-";
			return {type:'choice',error};		
		}		
	};
	
    function vMultipleChoice(){
		var error="MultipleChoice("+context.path[context.pathindex].value+") ";
		if(arguments.length>0)
			error += "("+arguments[0]+")";
			error+= "-lines:"+context.lineschars[context.path[context.pathindex].index].line+" chars:"+context.lineschars[context.path[context.pathindex].index].char+"-";
		return {type:'MultipleChoice',error};		
	};
	
    function vOptional(){
		var res = {type:'Optional'};
		var tres;
		var pathindex=context.pathindex;
		var compiledindex=context.compiledindex;
		if(context.pathindex<context.path.length){
			tres=execute(arguments[0]);
			if(tres.error!==undefined){
				// res.error=tres.error;
				context.pathindex=pathindex;
				if(compiledindex>0)
					context.compiled=context.compiled.slice(0,compiledindex);
				else
					context.compiled=[];
				context.compiledindex=compiledindex;
			} else {
				res.type=tres.type;
			}
		}
		return res;		
	};
	
    function vOneOrMore(){
		var _arguments=arguments;
		return vOrMore(false,_arguments);
	};
	
    function vZeroOrMore(){
		var _arguments=arguments;
		return vOrMore(true,_arguments);
	};
	
	function vOrMore(zero,_arguments){
		var tres;
		var more=true;
		var error = false;
		var pathindex=context.pathindex;
		var compiledindex=context.compiledindex;
		var first=true;
		var i=0;
		do{
			if(context.pathindex>=context.path.length){
				error=false;
				more=false;
			} else {
				tres = execute(_arguments[i]);
				i++;
				if(i>=_arguments.length) i=0;
				if(tres.error!==undefined){
					if((first)&&(!zero)){
						error=true;
						more=false;
					} else {
						error=false;
						more=false;					
					}
					context.pathindex=pathindex;
					if(compiledindex>0)
						context.compiled=context.compiled.slice(0,compiledindex);
					else
						context.compiled=[];
					context.compiledindex=compiledindex;
				} else{
					first=false;
					pathindex=context.pathindex;
					compiledindex=context.compiledindex;
				}
			}
		} while(more);
		var type='OneORmore';
		if(zero) type='ZeroORmore';
		if(!error){			
			return {type};
		} else{
			return {type,error:tres.error};
		}		
	}
	
	function vTerminal(){
		var error = false;
		if(arguments.length==1){
			if(arguments[0].startsWith("/")){
				var l = arguments[0].length;
				const regex = new RegExp(arguments[0].substring(1,l-1));
				var m;
				if ((m = regex.exec(context.path[context.pathindex].value)) === null) {
					error=true;
				}
			} else {
				if(arguments[0]!==context.path[context.pathindex].value){
					error=true;
				}			
			}
		} else {
			error=true;
		}
		if(error){
			var error="In "+context.stack[context.stack.length-1]+" Terminal("+context.path[context.pathindex].value+") not fitting ";
			if(arguments.length>0)
				error += "("+arguments[0]+")";
			error+= "-lines:"+context.lineschars[context.path[context.pathindex].index].line+" chars:"+context.lineschars[context.path[context.pathindex].index].char+"-";
			return {type:'terminal',error};
		} else {
			if (arguments[0]==context.path[context.pathindex].value){
				context.compiled.push({	PathItem:context.path[context.pathindex].value,										
										line:context.lineschars[context.path[context.pathindex].index].line,
										char:context.lineschars[context.path[context.pathindex].index].char,
										level:getpath(context.stack)									
									  });
			} else{
				context.compiled.push({	Terminal:arguments[0],
										PathItem:context.path[context.pathindex].value,										
										line:context.lineschars[context.path[context.pathindex].index].line,
										char:context.lineschars[context.path[context.pathindex].index].char,
										level:getpath(context.stack)									
									  });
				
			}
			context.compiledindex++;
			context.pathindex++;
			return {type:'Terminal'};
		}
	};
	
	function getpath(stack){
		var stmp="";
		for(var i=0; i<stack.length;i++){
			if(i>0) stmp +=":";
			stmp +=stack[i];
		}
		return stmp;
	}
	
    function vNonTerminal(){
		if(context.language[context.normalize(arguments[0])]!==undefined){
			context.stack.push(arguments[0]);
			var res= execute(context.language[context.normalize(arguments[0])]);
			context.stack.pop();
			return res;
		} else {
			var error="NonTerminal("+context.path[context.pathindex].value+") not fitting ";
			if(arguments.length>0)
				error += "("+arguments[0]+")";
			error+= "-lines:"+context.lineschars[context.path[context.pathindex].index].line+" chars:"+context.lineschars[context.path[context.pathindex].index].char+"-";
			return {type:'NonTerminal',error};			
		}
	};
	
    function vComment(){
		return {type:'Comment'};	
	};
	
    function vSkip(){
		return {type:'Skip'};	
	};
	
    function vNonImplemented() {
		var error="NonImplemented("+context.path[context.pathindex].value+") ";
		if(arguments.length>0)
			error += "("+arguments[0]+")";
			error+= "-lines:"+context.lineschars[context.path[context.pathindex].index].line+" chars:"+context.lineschars[context.path[context.pathindex].index].char+"-";
		return {type:'NonImplemented',error};	
	};

    var validating = [vTitle,vDiagram, vComplexDiagram, vSequence, vStack, vOptionalSequence, vChoice, vMultipleChoice, vOptional, vOneOrMore, vZeroOrMore, vTerminal, vNonTerminal, vComment, vSkip, vNonImplemented];
    root.Railroad.validating = validating;
	
	// a la bnf functions

    function bnfTitle(){
		context.fname=arguments[0];
		return "`"+arguments[0]+"`";
	};
    function bnfDiagram(){
		return arguments[0];
	};
    function bnfComplexDiagram(){
		return arguments[0];
	};
    function bnfSequence(){
		var result="(";
		for(var i=0;i<arguments.length;i++){
			if(i>0) result+=" , ";
			result+=arguments[i];
		}
		return result+")";
	};
    function bnfStack(){
		var result="(";
		for(var i=0;i<arguments.length;i++){
			if(i>0) result+=" , \\n";
			result+=arguments[i];			
		}
		return result+")";
	};
    function bnfOptionalSequence(){
		return ";<OptionalSequence not implemented>;";
	};
    function bnfChoice(){
		var result="(";
		var skip=false;
		for(var i=1;i<arguments.length;i++){
			if(arguments[i]=="<Skip>"){
				skip=true;
			} else {
				if(!(result=="(")) result+=" | ";
				var temp=arguments[i];
				if (temp.length>50) temp+="\n";
				result+=temp;
			}
		}
		result+=")";
		if(skip){
			result+="?";
		}
		return result;
	};
    function bnfMultipleChoice(){
		return "<<MultipleChoice not implemented>>";
	};
    function bnfOptional(){
		return arguments[0]+"?";
	};
    function bnfOneOrMore(){
		var result;
		if(arguments.length>1){
			result=arguments[0]+"("+arguments[1]+arguments[0]+")*";
		} else {
			result="("+arguments[0]+")+";
		}
		return result;
	};
    function bnfZeroOrMore(){
		var result;
		if(arguments.length>1){
			result=arguments[0]+"?"+"("+arguments[1]+arguments[0]+")*";
		} else {
			result="("+arguments[0]+")*";
		}
		return result;
	};
    function bnfTerminal(){
		return singlequote(arguments[0]);
	};
    function bnfNonTerminal(){
		return " "+arguments[0]+" ";
	};
    function bnfComment(){
		return "`"+arguments[0]+"`";
	};
    function bnfSkip(){
		return "<Skip>";
	};
    function bnfNonImplemented(){
		return arguments[0];
	};

    var bnf = [bnfTitle,bnfDiagram, bnfComplexDiagram, bnfSequence, bnfStack, bnfOptionalSequence, bnfChoice, bnfMultipleChoice, bnfOptional, bnfOneOrMore, bnfZeroOrMore, bnfTerminal, bnfNonTerminal, bnfComment, bnfSkip, bnfNonImplemented];
    root.Railroad.bnf = bnf;
}
