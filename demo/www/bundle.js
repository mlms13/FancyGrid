(function (console, $global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Main = function() { };
Main.__name__ = true;
Main.main = function() {
	var cellWidth = 50;
	var cellHeight = 30;
	var grid = new fancy_Grid(dots_Query.find(".my-fancy-grid-container"),{ render : function(row,col) {
		return dots_Dom.create("div.cell",null,null,"" + row + ", " + col);
	}, vOffset : function(row1) {
		return cellHeight * row1;
	}, hOffset : function(col1) {
		return cellWidth * col1;
	}, columns : 100000, rows : 200000, vSize : function() {
		return 200 * cellHeight;
	}, hSize : function() {
		return 100 * cellWidth;
	}});
};
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
var dots_AttributeType = { __ename__ : true, __constructs__ : ["BooleanAttribute","Property","BooleanProperty","OverloadedBooleanAttribute","NumericAttribute","PositiveNumericAttribute","SideEffectProperty"] };
dots_AttributeType.BooleanAttribute = ["BooleanAttribute",0];
dots_AttributeType.BooleanAttribute.toString = $estr;
dots_AttributeType.BooleanAttribute.__enum__ = dots_AttributeType;
dots_AttributeType.Property = ["Property",1];
dots_AttributeType.Property.toString = $estr;
dots_AttributeType.Property.__enum__ = dots_AttributeType;
dots_AttributeType.BooleanProperty = ["BooleanProperty",2];
dots_AttributeType.BooleanProperty.toString = $estr;
dots_AttributeType.BooleanProperty.__enum__ = dots_AttributeType;
dots_AttributeType.OverloadedBooleanAttribute = ["OverloadedBooleanAttribute",3];
dots_AttributeType.OverloadedBooleanAttribute.toString = $estr;
dots_AttributeType.OverloadedBooleanAttribute.__enum__ = dots_AttributeType;
dots_AttributeType.NumericAttribute = ["NumericAttribute",4];
dots_AttributeType.NumericAttribute.toString = $estr;
dots_AttributeType.NumericAttribute.__enum__ = dots_AttributeType;
dots_AttributeType.PositiveNumericAttribute = ["PositiveNumericAttribute",5];
dots_AttributeType.PositiveNumericAttribute.toString = $estr;
dots_AttributeType.PositiveNumericAttribute.__enum__ = dots_AttributeType;
dots_AttributeType.SideEffectProperty = ["SideEffectProperty",6];
dots_AttributeType.SideEffectProperty.toString = $estr;
dots_AttributeType.SideEffectProperty.__enum__ = dots_AttributeType;
var dots_Attributes = function() { };
dots_Attributes.__name__ = true;
dots_Attributes.setStringAttribute = function(el,name,value) {
	var prop = dots_Attributes.properties.get(name);
	if(null == value) {
		if(name == "value") el.setAttribute(name,""); else el.removeAttribute(name);
	} else if(prop == null) el.setAttribute(name,value); else switch(prop[1]) {
	case 0:case 3:case 4:case 5:
		el.setAttribute(name,value);
		break;
	case 1:case 2:case 6:
		el[name] = value;
		break;
	}
};
var dots_Dom = function() { };
dots_Dom.__name__ = true;
dots_Dom.addClass = function(el,className) {
	el.classList.add(className);
	return el;
};
dots_Dom.removeClass = function(el,className) {
	el.classList.remove(className);
	return el;
};
dots_Dom.on = function(el,eventName,handler) {
	el.addEventListener(eventName,handler);
	return el;
};
dots_Dom.nodeListToArray = function(list) {
	return Array.prototype.slice.call(list,0);
};
dots_Dom.create = function(name,attrs,children,textContent,doc) {
	var node = dots_SelectorParser.parseSelector(name,attrs);
	if(null == doc) doc = window.document;
	var el = doc.createElement(node.tag);
	var $it0 = node.attributes.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		dots_Attributes.setStringAttribute(el,key,node.attributes.get(key));
	}
	if(null != children) {
		var _g = 0;
		while(_g < children.length) {
			var child = children[_g];
			++_g;
			el.appendChild(child);
		}
	}
	if(null != textContent) el.appendChild(doc.createTextNode(textContent));
	return el;
};
dots_Dom.appendChild = function(el,child) {
	el.appendChild(child);
	return el;
};
dots_Dom.appendChildren = function(el,children) {
	return thx_Arrays.reduce(children,dots_Dom.appendChild,el);
};
dots_Dom.append = function(el,child,children) {
	if(child != null) dots_Dom.appendChild(el,child);
	return dots_Dom.appendChildren(el,children != null?children:[]);
};
var dots_Query = function() { };
dots_Query.__name__ = true;
dots_Query.find = function(selector,ctx) {
	return (ctx != null?ctx:dots_Query.doc).querySelector(selector);
};
dots_Query.selectNodes = function(selector,ctx) {
	return (ctx != null?ctx:dots_Query.doc).querySelectorAll(selector);
};
var dots_SelectorParser = function(selector) {
	this.selector = selector;
	this.index = 0;
};
dots_SelectorParser.__name__ = true;
dots_SelectorParser.parseSelector = function(selector,otherAttributes) {
	var result = new dots_SelectorParser(selector).parse();
	if(otherAttributes != null) result.attributes = dots_SelectorParser.mergeAttributes(result.attributes,otherAttributes);
	return result;
};
dots_SelectorParser.mergeAttributes = function(dest,other) {
	return thx_Iterators.reduce(other.keys(),function(acc,key) {
		var value;
		value = __map_reserved[key] != null?other.getReserved(key):other.h[key];
		if(key == "class" && (__map_reserved[key] != null?acc.existsReserved(key):acc.h.hasOwnProperty(key))) {
			var previousValue;
			previousValue = __map_reserved[key] != null?acc.getReserved(key):acc.h[key];
			value = "" + previousValue.toString() + " " + value.toString();
		}
		if(__map_reserved[key] != null) acc.setReserved(key,value); else acc.h[key] = value;
		return acc;
	},dest);
};
dots_SelectorParser.prototype = {
	parse: function() {
		var tag = this.gobbleTag();
		var attributes = this.gobbleAttributes();
		return { tag : tag, attributes : attributes};
	}
	,gobbleTag: function() {
		if(this.isIdentifierStart()) return this.gobbleIdentifier(); else return "div";
	}
	,gobbleAttributes: function() {
		var attributes = new haxe_ds_StringMap();
		while(this.index < this.selector.length) {
			var attribute = this.gobbleAttribute();
			if(attribute.key == "class" && (__map_reserved["class"] != null?attributes.existsReserved("class"):attributes.h.hasOwnProperty("class"))) {
				var previousClass = (__map_reserved["class"] != null?attributes.getReserved("class"):attributes.h["class"]).toString();
				attribute.value = "" + previousClass + " " + attribute.value.toString();
			}
			attributes.set(attribute.key,attribute.value);
		}
		return attributes;
	}
	,gobbleAttribute: function() {
		var _g = this["char"]();
		var unknown = _g;
		switch(_g) {
		case "#":
			return this.gobbleElementId();
		case ".":
			return this.gobbleElementClass();
		case "[":
			return this.gobbleElementAttribute();
		default:
			throw new thx_Error("unknown selector char \"" + unknown + "\" at pos " + this.index,null,{ fileName : "SelectorParser.hx", lineNumber : 79, className : "dots.SelectorParser", methodName : "gobbleAttribute"});
		}
	}
	,gobbleElementId: function() {
		this.gobbleChar("#");
		var id = this.gobbleIdentifier();
		return { key : "id", value : id};
	}
	,gobbleElementClass: function() {
		this.gobbleChar(".");
		var id = this.gobbleIdentifier();
		return { key : "class", value : id};
	}
	,gobbleElementAttribute: function() {
		this.gobbleChar("[");
		var key = this.gobbleIdentifier();
		this.gobbleChar("=");
		var value = this.gobbleUpTo("]");
		if(thx_Bools.canParse(value.toString())) {
			if(thx_Bools.parse(value.toString())) value = key; else value = null;
		}
		this.gobbleChar("]");
		return { key : key, value : value};
	}
	,gobbleIdentifier: function() {
		var result = [];
		result.push(this.gobbleChar());
		while(this.isIdentifierPart()) result.push(this.gobbleChar());
		return result.join("");
	}
	,gobbleChar: function(expecting,expectingAnyOf) {
		var c = this.selector.charAt(this.index++);
		if(expecting != null && expecting != c) throw new thx_Error("expecting " + expecting + " at position " + this.index + " of " + this.selector,null,{ fileName : "SelectorParser.hx", lineNumber : 122, className : "dots.SelectorParser", methodName : "gobbleChar"});
		if(expectingAnyOf != null && !thx_Arrays.contains(expectingAnyOf,c)) throw new thx_Error("expecting one of " + expectingAnyOf.join(", ") + " at position " + this.index + " of " + this.selector,null,{ fileName : "SelectorParser.hx", lineNumber : 125, className : "dots.SelectorParser", methodName : "gobbleChar"});
		return c;
	}
	,gobbleUpTo: function(stopChar) {
		var result = [];
		while(this["char"]() != stopChar) result.push(this.gobbleChar());
		return result.join("");
	}
	,isAlpha: function() {
		var c = this.code();
		return c >= 65 && c <= 90 || c >= 97 && c <= 122;
	}
	,isNumeric: function() {
		var c = this.code();
		return c >= 48 && c <= 57;
	}
	,isAny: function(cs) {
		var _g = 0;
		while(_g < cs.length) {
			var c = cs[_g];
			++_g;
			if(c == this["char"]()) return true;
		}
		return false;
	}
	,isIdentifierStart: function() {
		return this.isAlpha();
	}
	,isIdentifierPart: function() {
		return this.isAlpha() || this.isNumeric() || this.isAny(["_","-"]);
	}
	,'char': function() {
		return this.selector.charAt(this.index);
	}
	,code: function() {
		return HxOverrides.cca(this.selector,this.index);
	}
	,__class__: dots_SelectorParser
};
var fancy_ScrollPosition = function() {
	this.x = 0;
	this.y = 0;
};
fancy_ScrollPosition.__name__ = true;
fancy_ScrollPosition.prototype = {
	__class__: fancy_ScrollPosition
};
var fancy_SwipeHelper = function(el,callback) {
	var _g = this;
	this.el = el;
	el.addEventListener("touchmove",function(e) {
		e.preventDefault();
		_g.apply(e,function(t) {
			var dx = t.clientX - _g.x;
			var dy = t.clientY - _g.y;
			_g.x = t.clientX;
			_g.y = t.clientY;
			callback(dx,dy);
		});
	});
	el;
	el.addEventListener("touchstart",function(e1) {
		e1.preventDefault();
		if(null != _g.id) return;
		var t1 = e1.touches[0];
		_g.id = t1.identifier;
		_g.x = t1.clientX;
		_g.y = t1.clientY;
	});
	el;
	el.addEventListener("touchend",function(e2) {
		e2.preventDefault();
		if(e2.touches.length == 0) _g.id = null; else _g.apply(e2,function(_) {
			_g.id = null;
		});
	});
	el;
};
fancy_SwipeHelper.__name__ = true;
fancy_SwipeHelper.prototype = {
	apply: function(e,f) {
		var _g = 0;
		var _g1 = e.touches;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.identifier == this.id) {
				f(t);
				break;
			}
		}
	}
	,__class__: fancy_SwipeHelper
};
var fancy_Grid9 = function(parent) {
	var _g = this;
	this.position = new fancy_ScrollPosition();
	this.el = dots_Dom.create("div.grid9",null,[dots_Dom.create("div.row.top"),dots_Dom.create("div.row.bottom"),dots_Dom.create("div.column.left"),dots_Dom.create("div.column.right"),dots_Dom.create("div.cell.top.left",null,null,"top.left"),dots_Dom.create("div.cell.top.center",null,null,"top.center"),dots_Dom.create("div.cell.top.right",null,null,"top.right"),dots_Dom.create("div.cell.middle.left",null,null,"middle.left"),dots_Dom.create("div.cell.middle.center",null,null,"middle.center"),dots_Dom.create("div.cell.middle.right",null,null,"middle.right"),dots_Dom.create("div.cell.bottom.left",null,null,"bottom.left"),dots_Dom.create("div.cell.bottom.center",null,null,"bottom.center"),dots_Dom.create("div.cell.bottom.right",null,null,"bottom.right")]);
	dots_Dom.append(parent,this.el);
	this.top = dots_Query.find(".row.top",this.el);
	this.bottom = dots_Query.find(".row.bottom",this.el);
	this.left = dots_Query.find(".column.left",this.el);
	this.right = dots_Query.find(".column.right",this.el);
	this.tops = dots_Dom.nodeListToArray(dots_Query.selectNodes(".cell.top",this.el));
	this.bottoms = dots_Dom.nodeListToArray(dots_Query.selectNodes(".cell.bottom",this.el));
	this.lefts = dots_Dom.nodeListToArray(dots_Query.selectNodes(".cell.left",this.el));
	this.rights = dots_Dom.nodeListToArray(dots_Query.selectNodes(".cell.right",this.el));
	this.middles = dots_Dom.nodeListToArray(dots_Query.selectNodes(".cell.middle",this.el));
	this.centers = dots_Dom.nodeListToArray(dots_Query.selectNodes(".cell.center",this.el));
	this.setGridSizeFromContainer();
	this.resizeContent(1000,1000);
	this.sizeFixedElements(60,30,100,90);
	this.refresh();
	window.addEventListener("resize",function(_) {
		_g.setGridSizeFromContainer();
		_g.resetPosition();
		_g.refresh();
	});
	dots_Dom.on(this.el,"wheel",function(e) {
		_g.movePosition(e.deltaX,e.deltaY);
		_g.refresh();
	});
	new fancy_SwipeHelper(this.el,function(dx,dy) {
		_g.movePosition(-dx,-dy);
		_g.refresh();
	});
};
fancy_Grid9.__name__ = true;
fancy_Grid9.prototype = {
	resetPosition: function() {
		this.setPosition(this.position.x,this.position.y);
	}
	,movePosition: function(x,y) {
		this.setPosition(this.position.x + x,this.position.y + y);
	}
	,setPosition: function(x,y) {
		var oldx = this.position.x;
		var oldy = this.position.y;
		this.position.x = x;
		this.position.y = y;
		var limit = Math.max(this.contentWidth - this.gridWidth,0);
		if(this.position.x < 0) this.position.x = 0; else if(this.position.x > limit) this.position.x = limit;
		var limit1 = Math.max(this.contentHeight - this.gridHeight,0);
		if(this.position.y < 0) this.position.y = 0; else if(this.position.y > limit1) this.position.y = limit1;
		if(oldx == this.position.x && oldy == this.position.y) return;
		this.dirty = true;
	}
	,setGridSizeFromContainer: function() {
		var w = this.el.parentElement.offsetWidth;
		var h = this.el.parentElement.offsetHeight;
		this.resizeGrid(w,h);
	}
	,refresh: function() {
		var _g = this;
		if(!this.dirty) return;
		this.dirty = false;
		((function(_e) {
			return function(effect) {
				thx_Arrays.each(_e,effect);
				return;
			};
		})(this.middles))(function(_) {
			return _.style.top = "" + (-_g.position.y + _g.topHeight) + "px";
		});
		((function(_e1) {
			return function(effect1) {
				thx_Arrays.each(_e1,effect1);
				return;
			};
		})(this.bottoms))(function(_1) {
			return _1.style.top = "" + (Math.min(_g.gridHeight,_g.contentHeight) - _g.bottomHeight) + "px";
		});
		this.bottom.style.top = "" + (Math.min(this.gridHeight,this.contentHeight) - this.bottomHeight) + "px";
		((function(_e2) {
			return function(effect2) {
				thx_Arrays.each(_e2,effect2);
				return;
			};
		})(this.centers))(function(_2) {
			return _2.style.left = "" + (-_g.position.x + _g.leftWidth) + "px";
		});
		((function(_e3) {
			return function(effect3) {
				thx_Arrays.each(_e3,effect3);
				return;
			};
		})(this.rights))(function(_3) {
			return _3.style.left = "" + (Math.min(_g.gridWidth,_g.contentWidth) - _g.rightWidth) + "px";
		});
		this.right.style.left = "" + (Math.min(this.gridWidth,this.contentWidth) - this.rightWidth) + "px";
		if(this.position.y > 0 || this.gridHeight < this.topHeight + this.bottomHeight) dots_Dom.addClass(this.top,"overlay-bottom"); else dots_Dom.removeClass(this.top,"overlay-bottom");
		if(this.contentHeight > this.gridHeight && this.position.y < this.contentHeight - this.gridHeight) dots_Dom.addClass(this.bottom,"overlay-top"); else dots_Dom.removeClass(this.bottom,"overlay-top");
		if(this.position.x > 0 || this.gridWidth < this.leftWidth + this.rightWidth) dots_Dom.addClass(this.left,"overlay-right"); else dots_Dom.removeClass(this.left,"overlay-right");
		if(this.contentWidth > this.gridWidth && this.position.x < this.contentWidth - this.gridWidth) dots_Dom.addClass(this.right,"overlay-left"); else dots_Dom.removeClass(this.right,"overlay-left");
	}
	,resizeGrid: function(width,height) {
		if(this.gridWidth == width && this.gridHeight == height) return;
		this.dirty = true;
		this.gridWidth = width;
		this.gridHeight = height;
		this.top.style.width = this.bottom.style.width = "" + Math.min(this.gridWidth,this.contentWidth) + "px";
		this.left.style.height = this.right.style.height = "" + Math.min(this.gridHeight,this.contentHeight) + "px";
	}
	,resizeContent: function(width,height) {
		if(this.contentWidth == width && this.contentHeight == height) return;
		this.dirty = true;
		this.contentWidth = width;
		this.contentHeight = height;
		this.top.style.width = this.bottom.style.width = "" + Math.min(this.gridWidth,this.contentWidth) + "px";
		this.left.style.height = this.right.style.height = "" + Math.min(this.gridHeight,this.contentHeight) + "px";
	}
	,sizeFixedElements: function(topHeight,bottomHeight,leftWidth,rightWidth) {
		var _g = this;
		if(this.topHeight == topHeight && this.bottomHeight == bottomHeight && this.leftWidth == leftWidth && this.rightWidth == rightWidth) return;
		this.dirty = true;
		this.topHeight = topHeight;
		this.bottomHeight = bottomHeight;
		this.leftWidth = leftWidth;
		this.rightWidth = rightWidth;
		this.top.style.height = "" + topHeight + "px";
		((function(_e) {
			return function(effect) {
				thx_Arrays.each(_e,effect);
				return;
			};
		})(this.tops))(function(_) {
			return _.style.height = "" + topHeight + "px";
		});
		((function(_e1) {
			return function(effect1) {
				thx_Arrays.each(_e1,effect1);
				return;
			};
		})(this.middles))(function(_1) {
			return _1.style.height = "" + (_g.contentHeight - topHeight - bottomHeight) + "px";
		});
		this.bottom.style.height = "" + bottomHeight + "px";
		((function(_e2) {
			return function(effect2) {
				thx_Arrays.each(_e2,effect2);
				return;
			};
		})(this.bottoms))(function(_2) {
			return _2.style.height = "" + bottomHeight + "px";
		});
		this.left.style.width = "" + leftWidth + "px";
		((function(_e3) {
			return function(effect3) {
				thx_Arrays.each(_e3,effect3);
				return;
			};
		})(this.lefts))(function(_3) {
			return _3.style.width = "" + leftWidth + "px";
		});
		((function(_e4) {
			return function(effect4) {
				thx_Arrays.each(_e4,effect4);
				return;
			};
		})(this.centers))(function(_4) {
			return _4.style.width = "" + (_g.contentWidth - leftWidth - rightWidth) + "px";
		});
		this.right.style.width = "" + rightWidth + "px";
		((function(_e5) {
			return function(effect5) {
				thx_Arrays.each(_e5,effect5);
				return;
			};
		})(this.rights))(function(_5) {
			return _5.style.width = "" + rightWidth + "px";
		});
	}
	,__class__: fancy_Grid9
};
var fancy_View = function(parent) {
	this.el = dots_Dom.create("div.view",null,[]);
	dots_Dom.append(parent,this.el);
};
fancy_View.__name__ = true;
fancy_View.prototype = {
	__class__: fancy_View
};
var fancy_Grid = function(parent,options) {
	var fancyGrid = dots_Dom.create("div.fancy-grid");
	dots_Dom.append(parent,fancyGrid);
	var view = new fancy_View(fancyGrid);
	var grid9 = new fancy_Grid9(view.el);
};
fancy_Grid.__name__ = true;
fancy_Grid.prototype = {
	__class__: fancy_Grid
};
var haxe_StackItem = { __ename__ : true, __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe_StackItem.CFunction = ["CFunction",0];
haxe_StackItem.CFunction.toString = $estr;
haxe_StackItem.CFunction.__enum__ = haxe_StackItem;
haxe_StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
var haxe_CallStack = function() { };
haxe_CallStack.__name__ = true;
haxe_CallStack.getStack = function(e) {
	if(e == null) return [];
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			if(haxe_CallStack.wrapCallSite != null) site = haxe_CallStack.wrapCallSite(site);
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe_StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe_StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe_CallStack.makeStack(e.stack);
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe_CallStack.callStack = function() {
	try {
		throw new Error();
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		var a = haxe_CallStack.getStack(e);
		a.shift();
		return a;
	}
};
haxe_CallStack.exceptionStack = function() {
	return haxe_CallStack.getStack(haxe_CallStack.lastException);
};
haxe_CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe_CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe_CallStack.itemToString = function(b,s) {
	switch(s[1]) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = s[2];
		b.b += "module ";
		if(m == null) b.b += "null"; else b.b += "" + m;
		break;
	case 2:
		var line = s[4];
		var file = s[3];
		var s1 = s[2];
		if(s1 != null) {
			haxe_CallStack.itemToString(b,s1);
			b.b += " (";
		}
		if(file == null) b.b += "null"; else b.b += "" + file;
		b.b += " line ";
		if(line == null) b.b += "null"; else b.b += "" + line;
		if(s1 != null) b.b += ")";
		break;
	case 3:
		var meth = s[3];
		var cname = s[2];
		if(cname == null) b.b += "null"; else b.b += "" + cname;
		b.b += ".";
		if(meth == null) b.b += "null"; else b.b += "" + meth;
		break;
	case 4:
		var n = s[2];
		b.b += "local function #";
		if(n == null) b.b += "null"; else b.b += "" + n;
		break;
	}
};
haxe_CallStack.makeStack = function(s) {
	if(s == null) return []; else if(typeof(s) == "string") {
		var stack = s.split("\n");
		if(stack[0] == "Error") stack.shift();
		var m = [];
		var rie10 = new EReg("^   at ([A-Za-z0-9_. ]+) \\(([^)]+):([0-9]+):([0-9]+)\\)$","");
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			if(rie10.match(line)) {
				var path = rie10.matched(1).split(".");
				var meth = path.pop();
				var file = rie10.matched(2);
				var line1 = Std.parseInt(rie10.matched(3));
				m.push(haxe_StackItem.FilePos(meth == "Anonymous function"?haxe_StackItem.LocalFunction():meth == "Global code"?null:haxe_StackItem.Method(path.join("."),meth),file,line1));
			} else m.push(haxe_StackItem.Module(StringTools.trim(line)));
		}
		return m;
	} else return s;
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe__$Int64__$_$_$Int64.__name__ = true;
haxe__$Int64__$_$_$Int64.prototype = {
	__class__: haxe__$Int64__$_$_$Int64
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var haxe_io_FPHelper = function() { };
haxe_io_FPHelper.__name__ = true;
haxe_io_FPHelper.i32ToFloat = function(i) {
	var sign = 1 - (i >>> 31 << 1);
	var exp = i >>> 23 & 255;
	var sig = i & 8388607;
	if(sig == 0 && exp == 0) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
haxe_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	var af;
	if(f < 0) af = -f; else af = f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
haxe_io_FPHelper.i64ToDouble = function(low,high) {
	var sign = 1 - (high >>> 31 << 1);
	var exp = (high >> 20 & 2047) - 1023;
	var sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
haxe_io_FPHelper.doubleToI64 = function(v) {
	var i64 = haxe_io_FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else {
		var av;
		if(v < 0) av = -v; else av = v;
		var exp = Math.floor(Math.log(av) / 0.6931471805599453);
		var sig;
		var v1 = (av / Math.pow(2,exp) - 1) * 4503599627370496.;
		sig = Math.round(v1);
		var sig_l = sig | 0;
		var sig_h = sig / 4294967296.0 | 0;
		i64.low = sig_l;
		i64.high = (v < 0?-2147483648:0) | exp + 1023 << 20 | sig_h;
	}
	return i64;
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
js_html_compat_ArrayBuffer.__name__ = true;
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_DataView = function(buffer,byteOffset,byteLength) {
	this.buf = buffer;
	if(byteOffset == null) this.offset = 0; else this.offset = byteOffset;
	if(byteLength == null) this.length = buffer.byteLength - this.offset; else this.length = byteLength;
	if(this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
};
js_html_compat_DataView.__name__ = true;
js_html_compat_DataView.prototype = {
	getInt8: function(byteOffset) {
		var v = this.buf.a[this.offset + byteOffset];
		if(v >= 128) return v - 256; else return v;
	}
	,getUint8: function(byteOffset) {
		return this.buf.a[this.offset + byteOffset];
	}
	,getInt16: function(byteOffset,littleEndian) {
		var v = this.getUint16(byteOffset,littleEndian);
		if(v >= 32768) return v - 65536; else return v;
	}
	,getUint16: function(byteOffset,littleEndian) {
		if(littleEndian) return this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8; else return this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
	}
	,getInt32: function(byteOffset,littleEndian) {
		var p = this.offset + byteOffset;
		var a = this.buf.a[p++];
		var b = this.buf.a[p++];
		var c = this.buf.a[p++];
		var d = this.buf.a[p++];
		if(littleEndian) return a | b << 8 | c << 16 | d << 24; else return d | c << 8 | b << 16 | a << 24;
	}
	,getUint32: function(byteOffset,littleEndian) {
		var v = this.getInt32(byteOffset,littleEndian);
		if(v < 0) return v + 4294967296.; else return v;
	}
	,getFloat32: function(byteOffset,littleEndian) {
		return haxe_io_FPHelper.i32ToFloat(this.getInt32(byteOffset,littleEndian));
	}
	,getFloat64: function(byteOffset,littleEndian) {
		var a = this.getInt32(byteOffset,littleEndian);
		var b = this.getInt32(byteOffset + 4,littleEndian);
		return haxe_io_FPHelper.i64ToDouble(littleEndian?a:b,littleEndian?b:a);
	}
	,setInt8: function(byteOffset,value) {
		if(value < 0) this.buf.a[byteOffset + this.offset] = value + 128 & 255; else this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setUint8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setInt16: function(byteOffset,value,littleEndian) {
		this.setUint16(byteOffset,value < 0?value + 65536:value,littleEndian);
	}
	,setUint16: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
		} else {
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p] = value & 255;
		}
	}
	,setInt32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,value,littleEndian);
	}
	,setUint32: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p++] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >>> 24;
		} else {
			this.buf.a[p++] = value >>> 24;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value & 255;
		}
	}
	,setFloat32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,haxe_io_FPHelper.floatToI32(value),littleEndian);
	}
	,setFloat64: function(byteOffset,value,littleEndian) {
		var i64 = haxe_io_FPHelper.doubleToI64(value);
		if(littleEndian) {
			this.setUint32(byteOffset,i64.low);
			this.setUint32(byteOffset,i64.high);
		} else {
			this.setUint32(byteOffset,i64.high);
			this.setUint32(byteOffset,i64.low);
		}
	}
	,__class__: js_html_compat_DataView
};
var js_html_compat_Uint8Array = function() { };
js_html_compat_Uint8Array.__name__ = true;
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	var t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js__$Boot_HaxeError("TODO");
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var t = this;
	var a = js_html_compat_Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
var thx_Arrays = function() { };
thx_Arrays.__name__ = true;
thx_Arrays.each = function(arr,effect) {
	var _g1 = 0;
	var _g = arr.length;
	while(_g1 < _g) {
		var i = _g1++;
		effect(arr[i]);
	}
};
thx_Arrays.contains = function(array,element,eq) {
	if(null == eq) return thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(array,element) >= 0; else {
		var _g1 = 0;
		var _g = array.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(eq(array[i],element)) return true;
		}
		return false;
	}
};
thx_Arrays.reduce = function(array,f,initial) {
	var $it0 = HxOverrides.iter(array);
	while( $it0.hasNext() ) {
		var v = $it0.next();
		initial = f(initial,v);
	}
	return initial;
};
var thx_Bools = function() { };
thx_Bools.__name__ = true;
thx_Bools.canParse = function(v) {
	var _g = v.toLowerCase();
	if(_g == null) return true; else switch(_g) {
	case "true":case "false":case "0":case "1":case "on":case "off":
		return true;
	default:
		return false;
	}
};
thx_Bools.parse = function(v) {
	var _g = v.toLowerCase();
	var v1 = _g;
	if(_g == null) return false; else switch(_g) {
	case "true":case "1":case "on":
		return true;
	case "false":case "0":case "off":
		return false;
	default:
		throw new js__$Boot_HaxeError("unable to parse \"" + v1 + "\"");
	}
};
var thx_Either = { __ename__ : true, __constructs__ : ["Left","Right"] };
thx_Either.Left = function(value) { var $x = ["Left",0,value]; $x.__enum__ = thx_Either; $x.toString = $estr; return $x; };
thx_Either.Right = function(value) { var $x = ["Right",1,value]; $x.__enum__ = thx_Either; $x.toString = $estr; return $x; };
var thx_Error = function(message,stack,pos) {
	Error.call(this,message);
	this.message = message;
	if(null == stack) {
		try {
			stack = haxe_CallStack.exceptionStack();
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			stack = [];
		}
		if(stack.length == 0) try {
			stack = haxe_CallStack.callStack();
		} catch( e1 ) {
			haxe_CallStack.lastException = e1;
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
			stack = [];
		}
	}
	this.stackItems = stack;
	this.pos = pos;
};
thx_Error.__name__ = true;
thx_Error.__super__ = Error;
thx_Error.prototype = $extend(Error.prototype,{
	toString: function() {
		return this.message + "\nfrom: " + this.getPosition() + "\n\n" + this.stackToString();
	}
	,getPosition: function() {
		return this.pos.className + "." + this.pos.methodName + "() at " + this.pos.lineNumber;
	}
	,stackToString: function() {
		return haxe_CallStack.toString(this.stackItems);
	}
	,__class__: thx_Error
});
var thx_Functions = function() { };
thx_Functions.__name__ = true;
thx_Functions.equality = function(a,b) {
	return a == b;
};
var thx_Iterators = function() { };
thx_Iterators.__name__ = true;
thx_Iterators.reduce = function(it,callback,initial) {
	var result = initial;
	while(it.hasNext()) result = callback(result,it.next());
	return result;
};
var thx__$ReadonlyArray_ReadonlyArray_$Impl_$ = {};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.__name__ = true;
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf = function(this1,el,eq) {
	if(null == eq) eq = thx_Functions.equality;
	var _g1 = 0;
	var _g = this1.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(eq(el,this1[i])) return i;
	}
	return -1;
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var __map_reserved = {}
var ArrayBuffer = $global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = $global.DataView || js_html_compat_DataView;
var Uint8Array = $global.Uint8Array || js_html_compat_Uint8Array._new;
dots_Attributes.properties = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	_g.set("allowFullScreen",dots_AttributeType.BooleanAttribute);
	_g.set("async",dots_AttributeType.BooleanAttribute);
	_g.set("autoFocus",dots_AttributeType.BooleanAttribute);
	_g.set("autoPlay",dots_AttributeType.BooleanAttribute);
	_g.set("capture",dots_AttributeType.BooleanAttribute);
	_g.set("checked",dots_AttributeType.BooleanProperty);
	_g.set("cols",dots_AttributeType.PositiveNumericAttribute);
	_g.set("controls",dots_AttributeType.BooleanAttribute);
	_g.set("default",dots_AttributeType.BooleanAttribute);
	_g.set("defer",dots_AttributeType.BooleanAttribute);
	_g.set("disabled",dots_AttributeType.BooleanAttribute);
	_g.set("download",dots_AttributeType.OverloadedBooleanAttribute);
	_g.set("formNoValidate",dots_AttributeType.BooleanAttribute);
	_g.set("hidden",dots_AttributeType.BooleanAttribute);
	_g.set("loop",dots_AttributeType.BooleanAttribute);
	_g.set("multiple",dots_AttributeType.BooleanProperty);
	_g.set("muted",dots_AttributeType.BooleanProperty);
	_g.set("noValidate",dots_AttributeType.BooleanAttribute);
	_g.set("open",dots_AttributeType.BooleanAttribute);
	_g.set("readOnly",dots_AttributeType.BooleanAttribute);
	_g.set("required",dots_AttributeType.BooleanAttribute);
	_g.set("reversed",dots_AttributeType.BooleanAttribute);
	_g.set("rows",dots_AttributeType.PositiveNumericAttribute);
	_g.set("rowSpan",dots_AttributeType.NumericAttribute);
	_g.set("scoped",dots_AttributeType.BooleanAttribute);
	_g.set("seamless",dots_AttributeType.BooleanAttribute);
	_g.set("selected",dots_AttributeType.BooleanProperty);
	_g.set("size",dots_AttributeType.PositiveNumericAttribute);
	_g.set("span",dots_AttributeType.PositiveNumericAttribute);
	_g.set("start",dots_AttributeType.NumericAttribute);
	_g.set("value",dots_AttributeType.SideEffectProperty);
	_g.set("itemScope",dots_AttributeType.BooleanAttribute);
	$r = _g;
	return $r;
}(this));
dots_Query.doc = document;
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);