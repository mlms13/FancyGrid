(function (console, $global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var DateTools = function() { };
DateTools.__name__ = ["DateTools"];
DateTools.getMonthDays = function(d) {
	var month = d.getMonth();
	var year = d.getFullYear();
	if(month != 1) return DateTools.DAYS_OF_MONTH[month];
	var isB = year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
	if(isB) return 29; else return 28;
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,matchedPos: function() {
		if(this.r.m == null) throw new js__$Boot_HaxeError("No string matched");
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) len = -1;
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0?s:HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) this.r.s = s;
			return b;
		} else {
			var b1 = this.match(len < 0?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len));
			if(b1) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b1;
		}
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf = new StringBuf();
		do {
			if(offset >= s.length) break; else if(!this.matchSub(s,offset)) {
				buf.add(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf.add(HxOverrides.substr(s,offset,p.pos - offset));
			buf.add(f(this));
			if(p.len == 0) {
				buf.add(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else offset = p.pos + p.len;
		} while(this.r.global);
		if(!this.r.global && offset > 0 && offset < s.length) buf.add(HxOverrides.substr(s,offset,null));
		return buf.b;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
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
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
var Main = function() { };
Main.__name__ = ["Main"];
Main.main = function() {
	var cellWidth = 65;
	var cellHeight = 15;
	var rows = 100;
	var columns = 30;
	var grid = new fancy_Grid(dots_Query.find(".my-fancy-grid-container"),{ render : function(row,col) {
		return dots_Dom.create("span.value",null,null,"" + (row + 1) + ", " + (col + 1));
	}, vSize : function(row1) {
		return cellHeight;
	}, hSize : function(column) {
		return cellWidth;
	}, columns : columns, rows : rows, fixedLeft : 4, fixedTop : 3, fixedBottom : 2, fixedRight : 1});
};
Math.__name__ = ["Math"];
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && v.__enum__ == null || t == "function" && (v.__name__ || v.__ename__) != null;
};
Reflect.isEnumValue = function(v) {
	return v != null && v.__enum__ != null;
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
var Std = function() { };
Std.__name__ = ["Std"];
Std.instance = function(value,c) {
	if((value instanceof c)) return value; else return null;
};
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	b: null
	,add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
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
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.rpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = s + c;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null; else return js_Boot.getClass(o);
};
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
};
Type.getSuperClass = function(c) {
	return c.__super__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw new js__$Boot_HaxeError("Too many arguments");
	}
	return null;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js_Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var dots_AttributeType = { __ename__ : ["dots","AttributeType"], __constructs__ : ["BooleanAttribute","Property","BooleanProperty","OverloadedBooleanAttribute","NumericAttribute","PositiveNumericAttribute","SideEffectProperty"] };
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
dots_Attributes.__name__ = ["dots","Attributes"];
dots_Attributes.asAttribute = function(map) {
	var collect = [];
	var $it0 = map.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		if(__map_reserved[key] != null?map.getReserved(key):map.h[key]) collect.push(key);
	}
	return collect.join(" ");
};
dots_Attributes.asStyle = function(map) {
	var collect = [];
	var $it0 = map.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		var value;
		value = __map_reserved[key] != null?map.getReserved(key):map.h[key];
		if(thx_Strings.isEmpty(value)) continue;
		collect.push("" + key + ": " + value + ";");
	}
	return collect.join(" ");
};
dots_Attributes.getAttribute = function(el,name) {
	var prop = dots_Attributes.properties.get(name);
	if(prop == null) return el.getAttribute(name); else switch(prop[1]) {
	case 0:case 3:case 4:case 5:
		return el.getAttribute(name);
	case 1:case 2:case 6:
		return Reflect.field(el,name);
	}
};
dots_Attributes.setDynamicAttribute = function(el,name,value) {
	var prop = dots_Attributes.properties.get(name);
	if(prop == null) el.setAttribute(name,value); else switch(prop[1]) {
	case 0:case 3:case 4:case 5:
		el.setAttribute(name,value);
		break;
	case 1:case 2:case 6:
		el[name] = value;
		break;
	}
	return;
};
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
dots_Attributes.toggleBoolAttribute = function(el,name,value) {
	var prop = dots_Attributes.properties.get(name);
	if(prop == null) {
		if(value) el.setAttribute(name,name); else el.removeAttribute(name);
	} else switch(prop[1]) {
	case 0:case 3:case 4:case 5:
		if(value) el.setAttribute(name,name); else el.removeAttribute(name);
		break;
	case 1:case 2:case 6:
		el[name] = value;
		break;
	}
	return;
};
dots_Attributes.removeAttribute = function(el,name) {
	el.removeAttribute(name);
};
var dots_HTMLCollections = function() { };
dots_HTMLCollections.__name__ = ["dots","HTMLCollections"];
dots_HTMLCollections.toArray = function(it) {
	return Array.prototype.slice.call(it);
};
var dots_NodeLists = function() { };
dots_NodeLists.__name__ = ["dots","NodeLists"];
dots_NodeLists.toArray = function(it) {
	return Array.prototype.slice.call(it);
};
var dots_Dom = function() { };
dots_Dom.__name__ = ["dots","Dom"];
dots_Dom.hasClass = function(el,className) {
	return el.classList.contains(className);
};
dots_Dom.addClass = function(el,className) {
	el.classList.add(className);
	return el;
};
dots_Dom.removeClass = function(el,className) {
	el.classList.remove(className);
	return el;
};
dots_Dom.toggleClass = function(el,className,condition) {
	if(null == condition) condition = !el.classList.contains(className);
	if(condition) {
		el.classList.add(className);
		el;
	} else {
		el.classList.remove(className);
		el;
	}
};
dots_Dom.on = function(el,eventName,handler) {
	el.addEventListener(eventName,handler);
	return el;
};
dots_Dom.once = function(el,eventName,handler) {
	var f;
	var f1 = null;
	f1 = function(e) {
		el.removeEventListener(eventName,f1);
		handler(e);
	};
	f = f1;
	el.addEventListener(eventName,f);
	return el;
};
dots_Dom.off = function(el,eventName,handler) {
	el.removeEventListener(eventName,handler);
	return el;
};
dots_Dom.toString = function(node) {
	if(node.nodeType == 1) return node.outerHTML; else if(node.nodeType == 8) return "<!--" + node.textContent + "-->"; else if(node.nodeType == 3) return node.textContent; else throw new thx_Error("invalid nodeType " + node.nodeType,null,{ fileName : "Dom.hx", lineNumber : 68, className : "dots.Dom", methodName : "toString"});
};
dots_Dom.nodeText = function(node) {
	if(node.nodeType == 1) return node.innerHTML; else if(node.nodeType == 8) return node.textContent; else if(node.nodeType == 3) return node.textContent; else throw new thx_Error("invalid nodeType " + node.nodeType,null,{ fileName : "Dom.hx", lineNumber : 79, className : "dots.Dom", methodName : "nodeText"});
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
dots_Dom.insertAtIndex = function(el,child,index) {
	el.insertBefore(child,el.children[index]);
	return el;
};
dots_Dom.prependChild = function(el,child) {
	return dots_Dom.insertAtIndex(el,child,0);
};
dots_Dom.prependChildren = function(el,children) {
	return thx_Arrays.reduceRight(children,dots_Dom.prependChild,el);
};
dots_Dom.prepend = function(el,child,children) {
	if(child != null) dots_Dom.prependChild(el,child);
	return dots_Dom.prependChildren(el,children != null?children:[]);
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
dots_Dom.empty = function(el) {
	el.innerHTML = "";
	return el;
};
dots_Dom.flattenSiblingsAndChildren = function(node) {
	while(node != null) {
		if(node.nodeType == 1) dots_Dom.flattenSiblingsAndChildren(node.childNodes[0]); else if(node.nodeType == 3) while(null != node.nextSibling && node.nextSibling.nodeType == 3) {
			var a = node.textContent;
			var b = node.nextSibling.textContent;
			node.parentNode.removeChild(node.nextSibling);
			var t = window.document.createTextNode(a + b);
			node.parentNode.replaceChild(t,node);
			node = t;
		}
		node = node.nextSibling;
	}
};
dots_Dom.flattenTextNodes = function(dom) {
	dots_Dom.flattenSiblingsAndChildren(dom.childNodes[0]);
};
dots_Dom.traverseTextNodes = function(dom,f) {
	var collect = [];
	var perform;
	var perform1 = null;
	perform1 = function(dom1) {
		if(dom1.nodeType == 3) collect.push(dom1); else if(dom1.nodeType == 1) {
			var _g = 0;
			var _g1 = dom1.childNodes;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				perform1(child);
			}
		}
	};
	perform = perform1;
	perform(dom);
	var _g2 = 0;
	while(_g2 < collect.length) {
		var n = collect[_g2];
		++_g2;
		f(n);
	}
};
dots_Dom.addCss = function(css,container) {
	if(null == container) container = window.document.head;
	var style;
	var _this = window.document;
	style = _this.createElement("style");
	style.type = "text/css";
	style.appendChild(window.document.createTextNode(css));
	container.appendChild(style);
};
dots_Dom.getValue = function(el) {
	var _g = el.nodeName;
	switch(_g) {
	case "INPUT":
		var input = el;
		if(input.type == "checkbox" && !input.checked) return null; else return input.value;
		break;
	case "TEXTAREA":
		var textarea = el;
		return textarea.value;
	case "SELECT":
		var select = el;
		var option = select.options.item(select.selectedIndex);
		return option.value;
	default:
		return el.innerHTML;
	}
};
dots_Dom.getMultiValue = function(el) {
	var _g = el.nodeName;
	switch(_g) {
	case "INPUT":
		var input = el;
		if(input.type == "checkbox" && !input.checked) return haxe_ds_Either.Right([]); else return haxe_ds_Either.Left(input.value);
		break;
	case "TEXTAREA":
		var textarea = el;
		return haxe_ds_Either.Left(textarea.value);
	case "SELECT":
		var select = el;
		if(select.multiple) {
			var values = [];
			var options = select.selectedOptions;
			var _g2 = 0;
			var _g1 = options.length;
			while(_g2 < _g1) {
				var i = _g2++;
				values.push(options[i].value);
			}
			return haxe_ds_Either.Right(values);
		} else {
			var option = select.options.item(select.selectedIndex);
			return haxe_ds_Either.Left(option.value);
		}
		break;
	default:
		return haxe_ds_Either.Left(el.innerHTML);
	}
};
dots_Dom.getWindowHeight = function(win) {
	if(null == win) win = window;
	return win.document.documentElement.clientHeight;
};
dots_Dom.getWindowWidth = function(win) {
	if(null == win) win = window;
	return win.document.documentElement.clientWidth;
};
dots_Dom.getWindowSize = function(win) {
	if(null == win) win = window;
	return { width : win.document.documentElement.clientWidth, height : win.document.documentElement.clientHeight};
};
dots_Dom.getWindowInnerHeight = function(win) {
	if(null == win) win = window;
	return win.innerHeight;
};
dots_Dom.getWindowInnerWidth = function(win) {
	if(null == win) win = window;
	return win.innerWidth;
};
dots_Dom.getWindowInnerSize = function(win) {
	if(null == win) win = window;
	return { width : win.innerWidth, height : win.innerHeight};
};
dots_Dom.getDocumentHeight = function(doc) {
	if(null == doc) doc = window.document;
	return doc.documentElement.scrollHeight;
};
dots_Dom.getDocumentWidth = function(doc) {
	if(null == doc) doc = window.document;
	return doc.documentElement.scrollWidth;
};
dots_Dom.getDocumentSize = function(doc) {
	if(null == doc) doc = window.document;
	return { width : doc.documentElement.scrollWidth, height : doc.documentElement.scrollHeight};
};
dots_Dom.getScrollTop = function(doc) {
	if(null == doc) doc = window.document;
	if(null != doc.documentElement) return doc.documentElement.scrollTop; else return doc.body.scrollTop;
};
dots_Dom.getOffset = function(el,doc) {
	if(null == doc) doc = window.document;
	var rect = el.getBoundingClientRect();
	return { top : Math.round(rect.top + doc.body.scrollTop), left : Math.round(rect.left + doc.body.scrollLeft)};
};
dots_Dom.getOffsetParent = function(el) {
	if(null != el.offsetParent) return el.offsetParent; else return el;
};
dots_Dom.getOuterHeight = function(el) {
	return el.offsetHeight;
};
dots_Dom.getOuterHeightWithMargin = function(el) {
	var h = el.offsetHeight;
	var s = dots_Style.style(el);
	return h + Std.parseInt(s.marginTop) + Std.parseInt(s.marginBottom);
};
dots_Dom.getOuterWidth = function(el) {
	return el.offsetWidth;
};
dots_Dom.getOuterWidthWithMargin = function(el) {
	var h = el.offsetWidth;
	var s = dots_Style.style(el);
	return h + Std.parseInt(s.marginLeft) + Std.parseInt(s.marginRight);
};
dots_Dom.getPosition = function(el) {
	return { left : el.offsetLeft, top : el.offsetTop};
};
dots_Dom.ready = function(fn,doc) {
	if(null == doc) doc = window.document;
	if(doc.readyState != "loading") fn(); else doc.addEventListener("DOMContentLoaded",fn);
};
var dots__$EventHandler_EventHandler_$Impl_$ = {};
dots__$EventHandler_EventHandler_$Impl_$.__name__ = ["dots","_EventHandler","EventHandler_Impl_"];
dots__$EventHandler_EventHandler_$Impl_$.fromHandler = function(f) {
	return function(e) {
		e.preventDefault();
		f();
	};
};
dots__$EventHandler_EventHandler_$Impl_$.fromEventHandler = function(f) {
	return f;
};
dots__$EventHandler_EventHandler_$Impl_$.fromElementHandler = function(f) {
	return function(e) {
		e.preventDefault();
		var input = e.target;
		f(input);
	};
};
dots__$EventHandler_EventHandler_$Impl_$.fromStringValueHandler = function(f) {
	return function(e) {
		e.preventDefault();
		var value = dots_Dom.getValue(e.target);
		f(value);
	};
};
dots__$EventHandler_EventHandler_$Impl_$.fromBoolValueHandler = function(f) {
	return function(e) {
		e.preventDefault();
		var value = e.target.checked;
		f(value);
	};
};
dots__$EventHandler_EventHandler_$Impl_$.fromIntValueHandler = function(f) {
	var f1 = function(s) {
		if(thx_Ints.canParse(s)) f(thx_Ints.parse(s));
	};
	return function(e) {
		e.preventDefault();
		var value = dots_Dom.getValue(e.target);
		f1(value);
	};
};
dots__$EventHandler_EventHandler_$Impl_$.fromFloatValueHandler = function(f) {
	var f1 = function(s) {
		if(thx_Floats.canParse(s)) f(thx_Floats.parse(s));
	};
	return function(e) {
		e.preventDefault();
		var value = dots_Dom.getValue(e.target);
		f1(value);
	};
};
dots__$EventHandler_EventHandler_$Impl_$.toCallback = function(this1) {
	return this1;
};
var dots_Query = function() { };
dots_Query.__name__ = ["dots","Query"];
dots_Query.find = function(selector,ctx) {
	return (ctx != null?ctx:dots_Query.doc).querySelector(selector);
};
dots_Query.selectNodes = function(selector,ctx) {
	return (ctx != null?ctx:dots_Query.doc).querySelectorAll(selector);
};
dots_Query.select = function(selector,ctx) {
	return dots_Dom.nodeListToArray(dots_Query.selectNodes(selector,ctx));
};
dots_Query.getElementIndex = function(el) {
	var index = 0;
	while(null != (el = el.previousElementSibling)) index++;
	return index;
};
dots_Query.siblings = function(node) {
	return Array.prototype.slice.call(node.parentNode.children).filter(function(n) {
		return n != node;
	});
};
dots_Query.childrenOf = function(children,parent) {
	return children.filter(function(child) {
		return child.parentElement == parent;
	});
};
var dots_SelectorParser = function(selector) {
	this.selector = selector;
	this.index = 0;
};
dots_SelectorParser.__name__ = ["dots","SelectorParser"];
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
	selector: null
	,index: null
	,parse: function() {
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
	,isAlphaNumeric: function() {
		return this.isAlpha() || this.isNumeric();
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
	,isIdStart: function() {
		return this["char"]() == "#";
	}
	,isClassStart: function() {
		return this["char"]() == ".";
	}
	,'char': function() {
		return this.selector.charAt(this.index);
	}
	,code: function() {
		return HxOverrides.cca(this.selector,this.index);
	}
	,__class__: dots_SelectorParser
};
var dots_Style = function() { };
dots_Style.__name__ = ["dots","Style"];
dots_Style.style = function(el) {
	var $window = el.ownerDocument.defaultView;
	return $window.getComputedStyle(el,null);
};
var fancy_Grid = function(parent,options) {
	this.cacheElement = new haxe_ds_StringMap();
	var _g = this;
	this.render = options.render;
	this.vOffset = this.assignVOffset(options.vOffset);
	this.hOffset = this.assignHOffset(options.hOffset);
	this.vSize = options.vSize;
	this.hSize = options.hSize;
	this.rows = options.rows;
	this.columns = options.columns;
	var t = (function() {
		var _0 = options;
		if(null == _0) return null;
		var _1 = _0.fixedLeft;
		if(null == _1) return null;
		return _1;
	})();
	if(t != null) this.fixedLeft = t; else this.fixedLeft = 0;
	var t1 = (function() {
		var _01 = options;
		if(null == _01) return null;
		var _11 = _01.fixedRight;
		if(null == _11) return null;
		return _11;
	})();
	if(t1 != null) this.fixedRight = t1; else this.fixedRight = 0;
	var t2 = (function() {
		var _02 = options;
		if(null == _02) return null;
		var _12 = _02.fixedTop;
		if(null == _12) return null;
		return _12;
	})();
	if(t2 != null) this.fixedTop = t2; else this.fixedTop = 0;
	var t3 = (function() {
		var _03 = options;
		if(null == _03) return null;
		var _13 = _03.fixedBottom;
		if(null == _13) return null;
		return _13;
	})();
	if(t3 != null) this.fixedBottom = t3; else this.fixedBottom = 0;
	var contentWidth = this.hOffset(this.columns - 1) + this.hSize(this.columns - 1);
	var contentHeight = this.vOffset(this.rows - 1) + this.vSize(this.rows - 1);
	var fancyGrid = dots_Dom.create("div.fancy-grid");
	dots_Dom.append(parent,fancyGrid);
	var view = dots_Dom.create("div.view",null,[]);
	dots_Dom.append(fancyGrid,view);
	this.topRailSize = this.vOffset(this.fixedTop);
	this.leftRailSize = this.hOffset(this.fixedLeft);
	if(this.fixedBottom == 0) this.bottomRailSize = 0; else this.bottomRailSize = contentHeight - this.vOffset(this.rows - this.fixedBottom);
	if(this.fixedRight == 0) this.rightRailSize = 0; else this.rightRailSize = contentWidth - this.hOffset(this.columns - this.fixedRight);
	this.grid9 = new fancy_core_Grid9(view,{ scrollerMinSize : 20.0, scrollerMaxSize : 160.0, scrollerSize : 10, contentWidth : contentWidth, contentHeight : contentHeight, topRail : this.topRailSize, leftRail : this.leftRailSize, bottomRail : this.bottomRailSize, rightRail : this.rightRailSize, onScroll : function(x,y,ox,oy) {
		if(oy != y) _g.renderMiddle(y);
		if(ox != x) _g.renderCenter(x);
		_g.renderMain(x,y);
	}, onResize : function(w,h,ow,oh) {
		if(oh != h) _g.renderMiddle(_g.grid9.position.y);
		if(ow != w) _g.renderCenter(_g.grid9.position.x);
		_g.renderMain(_g.grid9.position.x,_g.grid9.position.y);
	}});
	this.topLeft = this.grid9.topLeft;
	this.topCenter = this.grid9.topCenter;
	this.topRight = this.grid9.topRight;
	this.middleLeft = this.grid9.middleLeft;
	this.middleCenter = this.grid9.middleCenter;
	this.middleRight = this.grid9.middleRight;
	this.bottomLeft = this.grid9.bottomLeft;
	this.bottomCenter = this.grid9.bottomCenter;
	this.bottomRight = this.grid9.bottomRight;
	this.renderCorners();
	this.renderMiddle(0);
	this.renderCenter(0);
	this.renderMain(0,0);
};
fancy_Grid.__name__ = ["fancy","Grid"];
fancy_Grid.prototype = {
	topLeft: null
	,topCenter: null
	,topRight: null
	,middleLeft: null
	,middleCenter: null
	,middleRight: null
	,bottomLeft: null
	,bottomCenter: null
	,bottomRight: null
	,fixedLeft: null
	,fixedRight: null
	,fixedTop: null
	,fixedBottom: null
	,columns: null
	,rows: null
	,grid9: null
	,render: null
	,vOffset: null
	,hOffset: null
	,vSize: null
	,hSize: null
	,topRailSize: null
	,leftRailSize: null
	,bottomRailSize: null
	,rightRailSize: null
	,cacheElement: null
	,assignVOffset: function(f) {
		var _g = this;
		if(null != f) return f;
		var cache = new haxe_ds_IntMap();
		return function(row) {
			if(row == 0) return 0;
			if(cache.h.hasOwnProperty(row)) return cache.h[row];
			var v = _g.vOffset(row - 1) + _g.vSize(row - 1);
			cache.h[row] = v;
			return v;
		};
	}
	,assignHOffset: function(f) {
		var _g = this;
		if(null != f) return f;
		var cache = new haxe_ds_IntMap();
		return function(col) {
			if(col == 0) return 0;
			if(cache.h.hasOwnProperty(col)) return cache.h[col];
			var v = _g.hOffset(col - 1) + _g.hSize(col - 1);
			cache.h[col] = v;
			return v;
		};
	}
	,renderTo: function(parent,row,col) {
		var k = "" + row + "-" + col;
		var el = this.cacheElement.get(k);
		if(null == el) {
			el = this.renderCell(row,col);
			this.cacheElement.set(k,el);
		}
		dots_Dom.append(parent,el);
	}
	,renderCell: function(row,col) {
		var cell = dots_Dom.create("div.cell.row-" + row + ".col-" + col,null,[this.render(row,col)]);
		cell.style.top = "" + this.vOffset(row) + "px";
		cell.style.left = "" + this.hOffset(col) + "px";
		cell.style.width = "" + this.hSize(row) + "px";
		cell.style.height = "" + this.vSize(col) + "px";
		return cell;
	}
	,renderMiddle: function(v) {
		var r = fancy_core_Search.binary(0,this.rows,this.rowComparator(v)) + this.fixedTop;
		var top = this.vOffset(r);
		var limit = top + this.grid9.get_gridMiddleHeight();
		dots_Dom.empty(this.grid9.middleLeft);
		dots_Dom.empty(this.grid9.middleRight);
		var leftAnchor = dots_Dom.create("div.anchor.middle.left");
		var rightAnchor = dots_Dom.create("div.anchor.middle.right");
		var leftCols = thx_Ints.min(this.fixedLeft,this.columns);
		var rightCols = thx_Ints.min(this.columns - this.fixedRight,this.columns);
		leftAnchor.style.top = "" + -this.topRailSize + "px";
		rightAnchor.style.top = "" + -this.topRailSize + "px";
		rightAnchor.style.left = "" + -this.hOffset(rightCols) + "px";
		dots_Dom.append(this.grid9.middleLeft,leftAnchor);
		dots_Dom.append(this.grid9.middleRight,rightAnchor);
		while(top < limit + this.vSize(r) && r < this.rows - this.fixedBottom) {
			var _g = 0;
			while(_g < leftCols) {
				var c = _g++;
				this.renderTo(leftAnchor,r,c);
			}
			var _g1 = rightCols;
			var _g2 = this.columns;
			while(_g1 < _g2) {
				var c1 = _g1++;
				this.renderTo(rightAnchor,r,c1);
			}
			top += this.vSize(r++);
		}
	}
	,renderCenter: function(v) {
		var c = fancy_core_Search.binary(0,this.columns,this.columnComparator(v)) + this.fixedLeft;
		var left = this.hOffset(c);
		var limit = left + this.grid9.get_gridCenterWidth();
		dots_Dom.empty(this.grid9.topCenter);
		dots_Dom.empty(this.grid9.bottomCenter);
		var topAnchor = dots_Dom.create("div.anchor.top.center");
		var bottomAnchor = dots_Dom.create("div.anchor.bottom.center");
		var topRows = thx_Ints.min(this.fixedTop,this.rows);
		var bottomRows = thx_Ints.min(this.rows - this.fixedBottom,this.rows);
		topAnchor.style.left = "" + -this.leftRailSize + "px";
		bottomAnchor.style.top = "" + -this.vOffset(bottomRows) + "px";
		bottomAnchor.style.left = "" + -this.leftRailSize + "px";
		dots_Dom.append(this.grid9.topCenter,topAnchor);
		dots_Dom.append(this.grid9.bottomCenter,bottomAnchor);
		while(left < limit + this.hSize(c) && c < this.columns - this.fixedRight) {
			var _g = 0;
			while(_g < topRows) {
				var r = _g++;
				this.renderTo(topAnchor,r,c);
			}
			var _g1 = bottomRows;
			var _g2 = this.rows;
			while(_g1 < _g2) {
				var r1 = _g1++;
				this.renderTo(bottomAnchor,r1,c);
			}
			left += this.hSize(c++);
		}
	}
	,renderMain: function(x,y) {
		var r = fancy_core_Search.binary(0,this.rows,this.rowComparator(y)) + this.fixedTop;
		var c = fancy_core_Search.binary(0,this.columns,this.columnComparator(x)) + this.fixedLeft;
		var left = this.hOffset(c);
		var top = this.vOffset(r);
		var hlimit = left + this.grid9.get_gridCenterWidth();
		var vlimit = top + this.grid9.get_gridMiddleHeight();
		dots_Dom.empty(this.grid9.middleCenter);
		var anchor = dots_Dom.create("div.anchor.middle.center");
		anchor.style.top = "-" + this.topRailSize + "px";
		anchor.style.left = "-" + this.leftRailSize + "px";
		dots_Dom.append(this.grid9.middleCenter,anchor);
		while(r < this.rows - this.fixedBottom && top < vlimit + this.vSize(r)) {
			var tleft = left;
			var tc = c;
			while(tc < this.columns - this.fixedRight && tleft < hlimit + this.hSize(tc)) {
				this.renderTo(anchor,r,tc);
				tleft += this.hSize(tc++);
			}
			top += this.vSize(r++);
		}
	}
	,rowComparator: function(v) {
		var _g = this;
		return function(r) {
			var tv = _g.vOffset(r);
			if(tv > v) return 1;
			var th = _g.vSize(r);
			if(tv + th >= v) return 0;
			return -1;
		};
	}
	,columnComparator: function(v) {
		var _g = this;
		return function(r) {
			var tv = _g.hOffset(r);
			if(tv > v) return 1;
			var th = _g.hSize(r);
			if(tv + th >= v) return 0;
			return -1;
		};
	}
	,renderCorners: function() {
		var top = thx_Ints.min(this.fixedTop,this.rows);
		var bottom = thx_Ints.max(this.rows - this.fixedBottom,0);
		var left = thx_Ints.min(this.fixedLeft,this.columns);
		var right = thx_Ints.max(this.columns - this.fixedRight,0);
		var bottomLeftAnchor = dots_Dom.create("div.anchor.bottom.left");
		var bottomRightAnchor = dots_Dom.create("div.anchor.bottom.right");
		var topLeftAnchor = dots_Dom.create("div.anchor.top.left");
		var topRightAnchor = dots_Dom.create("div.anchor.top.right");
		var vDelta = this.vOffset(bottom);
		var hDelta = this.hOffset(right);
		bottomRightAnchor.style.left = "" + -hDelta + "px";
		bottomRightAnchor.style.top = "" + -vDelta + "px";
		bottomLeftAnchor.style.top = "" + -vDelta + "px";
		topRightAnchor.style.left = "" + -hDelta + "px";
		dots_Dom.empty(this.topLeft);
		dots_Dom.empty(this.topRight);
		dots_Dom.append(this.topLeft,topLeftAnchor);
		dots_Dom.append(this.topRight,topRightAnchor);
		var _g = 0;
		while(_g < top) {
			var r = _g++;
			var _g1 = 0;
			while(_g1 < left) {
				var c = _g1++;
				this.renderTo(topLeftAnchor,r,c);
			}
			var _g2 = right;
			var _g11 = this.columns;
			while(_g2 < _g11) {
				var c1 = _g2++;
				this.renderTo(topRightAnchor,r,c1);
			}
		}
		dots_Dom.empty(this.bottomLeft);
		dots_Dom.empty(this.bottomRight);
		dots_Dom.append(this.bottomLeft,bottomLeftAnchor);
		dots_Dom.append(this.bottomRight,bottomRightAnchor);
		var _g12 = bottom;
		var _g3 = this.rows;
		while(_g12 < _g3) {
			var r1 = _g12++;
			var _g21 = 0;
			while(_g21 < left) {
				var c2 = _g21++;
				this.renderTo(bottomLeftAnchor,r1,c2);
			}
			var _g31 = right;
			var _g22 = this.columns;
			while(_g31 < _g22) {
				var c3 = _g31++;
				this.renderTo(bottomRightAnchor,r1,c3);
			}
		}
	}
	,__class__: fancy_Grid
};
var fancy_core_DragMoveHelper = function(el,callback) {
	var _g = this;
	this.el = el;
	el.addEventListener("mousedown",function(e) {
		if(_g.moving) return;
		e.preventDefault();
		_g.moving = true;
		_g.x = e.clientX;
		_g.y = e.clientY;
	});
	el;
	window.document.addEventListener("mousemove",function(e1) {
		if(!_g.moving) return;
		e1.preventDefault();
		dots_Dom.toggleClass(el,"dragging",true);
		var dx = e1.clientX - _g.x;
		var dy = e1.clientY - _g.y;
		_g.x = e1.clientX;
		_g.y = e1.clientY;
		callback(dx,dy);
	});
	window.document.addEventListener("mouseup",function(e2) {
		if(!_g.moving) return;
		e2.preventDefault();
		dots_Dom.toggleClass(el,"dragging",false);
		_g.moving = false;
	});
};
fancy_core_DragMoveHelper.__name__ = ["fancy","core","DragMoveHelper"];
fancy_core_DragMoveHelper.prototype = {
	el: null
	,moving: null
	,x: null
	,y: null
	,__class__: fancy_core_DragMoveHelper
};
var fancy_core_Grid9 = function(parent,options) {
	var _g = this;
	this.position = { x : 0.0, y : 0.0};
	var t = (function() {
		var _0 = options;
		if(null == _0) return null;
		var _1 = _0.onScroll;
		if(null == _1) return null;
		return _1;
	})();
	if(t != null) this.onScroll = t; else this.onScroll = function(x,y,ox,oy) {
	};
	var t1 = (function() {
		var _01 = options;
		if(null == _01) return null;
		var _11 = _01.onResize;
		if(null == _11) return null;
		return _11;
	})();
	if(t1 != null) this.onResize = t1; else this.onResize = function(w,h,ow,oh) {
	};
	var offset = function() {
		if(_g.contentWidth > _g.gridWidth && _g.contentHeight > _g.gridHeight) return _g.scrollerSize + _g.scrollerMargin; else return 0;
	};
	var viewHeight = $bind(this,this.get_gridMiddleHeight);
	var contentHeight = function() {
		return _g.contentHeight - _g.topRail - _g.bottomRail;
	};
	var viewWidth = $bind(this,this.get_gridCenterWidth);
	var contentWidth = function() {
		return _g.contentWidth - _g.leftRail - _g.rightRail;
	};
	var minScrollerSize;
	if(null != options.scrollerMinSize) {
		var v = options.scrollerMinSize;
		minScrollerSize = function() {
			return v;
		};
	} else minScrollerSize = null;
	var maxScrollerSize;
	if(null != options.scrollerMaxSize) {
		var v1 = options.scrollerMaxSize;
		maxScrollerSize = function() {
			return v1;
		};
	} else maxScrollerSize = null;
	this.scrollerVDimensions = new fancy_core_ScrollerDimensions({ viewSize : viewHeight, contentSize : contentHeight, scrollerArea : fancy_core__$Lazy_Lazy_$Impl_$.subtract(viewHeight,offset), minScrollerSize : minScrollerSize, maxScrollerSize : maxScrollerSize});
	this.scrollerHDimensions = new fancy_core_ScrollerDimensions({ viewSize : viewWidth, contentSize : contentWidth, scrollerArea : fancy_core__$Lazy_Lazy_$Impl_$.subtract(viewWidth,offset), minScrollerSize : minScrollerSize, maxScrollerSize : maxScrollerSize});
	this.scrollerSize = options.scrollerSize;
	var t2 = (function() {
		var _02 = options;
		if(null == _02) return null;
		var _12 = _02.scrollerMargin;
		if(null == _12) return null;
		return _12;
	})();
	if(t2 != null) this.scrollerMargin = t2; else this.scrollerMargin = 0;
	this.el = dots_Dom.create("div.grid9",null,[dots_Dom.create("div.scroller.scroller-v"),dots_Dom.create("div.scroller.scroller-h"),dots_Dom.create("div.row.top"),dots_Dom.create("div.row.bottom"),dots_Dom.create("div.column.left"),dots_Dom.create("div.column.right"),dots_Dom.create("div.pane.top.left"),dots_Dom.create("div.pane.top.center"),dots_Dom.create("div.pane.top.right"),dots_Dom.create("div.pane.middle.left"),dots_Dom.create("div.pane.middle.center"),dots_Dom.create("div.pane.middle.right"),dots_Dom.create("div.pane.bottom.left"),dots_Dom.create("div.pane.bottom.center"),dots_Dom.create("div.pane.bottom.right")]);
	dots_Dom.append(parent,this.el);
	this.scrollerV = dots_Query.find(".scroller-v",this.el);
	this.scrollerH = dots_Query.find(".scroller-h",this.el);
	this.top = dots_Query.find(".row.top",this.el);
	this.bottom = dots_Query.find(".row.bottom",this.el);
	this.left = dots_Query.find(".column.left",this.el);
	this.right = dots_Query.find(".column.right",this.el);
	this.tops = dots_Dom.nodeListToArray(dots_Query.selectNodes(".pane.top",this.el));
	this.bottoms = dots_Dom.nodeListToArray(dots_Query.selectNodes(".pane.bottom",this.el));
	this.lefts = dots_Dom.nodeListToArray(dots_Query.selectNodes(".pane.left",this.el));
	this.rights = dots_Dom.nodeListToArray(dots_Query.selectNodes(".pane.right",this.el));
	this.middles = dots_Dom.nodeListToArray(dots_Query.selectNodes(".pane.middle",this.el));
	this.centers = dots_Dom.nodeListToArray(dots_Query.selectNodes(".pane.center",this.el));
	this.topLeft = dots_Query.find(".pane.top.left",this.el);
	this.topCenter = dots_Query.find(".pane.top.center",this.el);
	this.topRight = dots_Query.find(".pane.top.right",this.el);
	this.middleLeft = dots_Query.find(".pane.middle.left",this.el);
	this.middleCenter = dots_Query.find(".pane.middle.center",this.el);
	this.middleRight = dots_Query.find(".pane.middle.right",this.el);
	this.bottomLeft = dots_Query.find(".pane.bottom.left",this.el);
	this.bottomCenter = dots_Query.find(".pane.bottom.center",this.el);
	this.bottomRight = dots_Query.find(".pane.bottom.right",this.el);
	this.size = this.getGridSizeFromContainer();
	this.resizeGrid(this.size.w,this.size.h);
	this.resizeContent(options.contentWidth,options.contentHeight);
	this.sizeRails((function($this) {
		var $r;
		var t3 = (function() {
			var _03 = options;
			if(null == _03) return null;
			var _13 = _03.topRail;
			if(null == _13) return null;
			return _13;
		})();
		$r = t3 != null?t3:0;
		return $r;
	}(this)),(function($this) {
		var $r;
		var t4 = (function() {
			var _04 = options;
			if(null == _04) return null;
			var _14 = _04.bottomRail;
			if(null == _14) return null;
			return _14;
		})();
		$r = t4 != null?t4:0;
		return $r;
	}(this)),(function($this) {
		var $r;
		var t5 = (function() {
			var _05 = options;
			if(null == _05) return null;
			var _15 = _05.leftRail;
			if(null == _15) return null;
			return _15;
		})();
		$r = t5 != null?t5:0;
		return $r;
	}(this)),(function($this) {
		var $r;
		var t6 = (function() {
			var _06 = options;
			if(null == _06) return null;
			var _16 = _06.rightRail;
			if(null == _16) return null;
			return _16;
		})();
		$r = t6 != null?t6:0;
		return $r;
	}(this)));
	this.refresh();
	window.addEventListener("resize",function(_) {
		var s = _g.getGridSizeFromContainer();
		_g.resizeGrid(s.w,s.h);
		_g.resetPosition();
		_g.refresh();
		var osize = _g.size;
		_g.size = s;
		if(_g.size.w != osize.w || _g.size.h != osize.h) _g.onResize(_g.size.w,_g.size.h,osize.w,osize.h);
	});
	dots_Dom.on(this.el,"wheel",function(e) {
		_g.movePosition(e.deltaX,e.deltaY);
		_g.refresh();
	});
	new fancy_core_SwipeMoveHelper(this.el,function(dx,dy) {
		_g.movePosition(dx,dy);
		_g.refresh();
	});
	new fancy_core_DragMoveHelper(this.scrollerH,function(dx1,_2) {
		_g.movePosition((function($this) {
			var $r;
			var this1 = _g.scrollerHDimensions.scrollerToContentPosition(dx1);
			$r = this1();
			return $r;
		}(this)),0);
		_g.refresh();
	});
	new fancy_core_DragMoveHelper(this.scrollerV,function(_3,dy1) {
		_g.movePosition(0,(function($this) {
			var $r;
			var this2 = _g.scrollerVDimensions.scrollerToContentPosition(dy1);
			$r = this2();
			return $r;
		}(this)));
		_g.refresh();
	});
};
fancy_core_Grid9.__name__ = ["fancy","core","Grid9"];
fancy_core_Grid9.prototype = {
	el: null
	,contentWidth: null
	,contentHeight: null
	,gridWidth: null
	,gridHeight: null
	,topRail: null
	,bottomRail: null
	,leftRail: null
	,rightRail: null
	,topLeft: null
	,topCenter: null
	,topRight: null
	,middleLeft: null
	,middleCenter: null
	,middleRight: null
	,bottomLeft: null
	,bottomCenter: null
	,bottomRight: null
	,position: null
	,size: null
	,top: null
	,tops: null
	,bottom: null
	,bottoms: null
	,left: null
	,lefts: null
	,right: null
	,rights: null
	,middles: null
	,centers: null
	,dirty: null
	,scrollerV: null
	,scrollerH: null
	,scrollerSize: null
	,scrollerMargin: null
	,scrollerVDimensions: null
	,scrollerHDimensions: null
	,onScroll: null
	,onResize: null
	,gridMiddleHeight: null
	,gridCenterWidth: null
	,displayVScroller: function() {
		return this.contentHeight > this.gridHeight;
	}
	,displayHScroller: function() {
		return this.contentWidth > this.gridWidth;
	}
	,willDisplayBothScrollbar: function() {
		return this.contentWidth > this.gridWidth && this.contentHeight > this.gridHeight;
	}
	,refreshScrollers: function() {
		if(!(this.contentHeight > this.gridHeight)) this.scrollerV.style.display = "none"; else {
			this.scrollerV.style.display = "block";
			var pos;
			var this1 = this.scrollerVDimensions.contentToScrollerPosition(this.position.y);
			pos = this1();
			var size = this.scrollerVDimensions.scrollerSize();
			this.scrollerV.style.top = "" + (this.topRail + pos) + "px";
			this.scrollerV.style.left = "" + (Math.min(this.gridWidth,this.contentWidth) - this.rightRail - this.scrollerSize - this.scrollerMargin) + "px";
			this.scrollerV.style.width = "" + this.scrollerSize + "px";
			this.scrollerV.style.height = "" + size + "px";
		}
		if(!(this.contentWidth > this.gridWidth)) this.scrollerH.style.display = "none"; else {
			this.scrollerH.style.display = "block";
			var pos1;
			var this2 = this.scrollerHDimensions.contentToScrollerPosition(this.position.x);
			pos1 = this2();
			var size1 = this.scrollerHDimensions.scrollerSize();
			this.scrollerH.style.left = "" + (this.leftRail + pos1) + "px";
			this.scrollerH.style.top = "" + (Math.min(this.gridHeight,this.contentHeight) - this.bottomRail - this.scrollerSize - this.scrollerMargin) + "px";
			this.scrollerH.style.width = "" + size1 + "px";
			this.scrollerH.style.height = "" + this.scrollerSize + "px";
		}
	}
	,resetPosition: function() {
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
		this.onScroll(this.position.x,this.position.y,oldx,oldy);
		this.dirty = true;
	}
	,getGridSizeFromContainer: function() {
		return { w : this.el.parentElement.offsetWidth, h : this.el.parentElement.offsetHeight};
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
			return _.style.top = "" + (-_g.position.y + _g.topRail) + "px";
		});
		((function(_e1) {
			return function(effect1) {
				thx_Arrays.each(_e1,effect1);
				return;
			};
		})(this.bottoms))(function(_1) {
			return _1.style.top = "" + (Math.min(_g.gridHeight,_g.contentHeight) - _g.bottomRail) + "px";
		});
		this.bottom.style.top = "" + (Math.min(this.gridHeight,this.contentHeight) - this.bottomRail) + "px";
		((function(_e2) {
			return function(effect2) {
				thx_Arrays.each(_e2,effect2);
				return;
			};
		})(this.centers))(function(_2) {
			return _2.style.left = "" + (-_g.position.x + _g.leftRail) + "px";
		});
		((function(_e3) {
			return function(effect3) {
				thx_Arrays.each(_e3,effect3);
				return;
			};
		})(this.rights))(function(_3) {
			return _3.style.left = "" + (Math.min(_g.gridWidth,_g.contentWidth) - _g.rightRail) + "px";
		});
		this.right.style.left = "" + (Math.min(this.gridWidth,this.contentWidth) - this.rightRail) + "px";
		dots_Dom.toggleClass(this.top,"overlay-bottom",this.position.y > 0 || this.gridHeight < this.topRail + this.bottomRail);
		dots_Dom.toggleClass(this.bottom,"overlay-top",this.contentHeight > this.gridHeight && this.position.y < this.contentHeight - this.gridHeight);
		dots_Dom.toggleClass(this.left,"overlay-right",this.position.x > 0 || this.gridWidth < this.leftRail + this.rightRail);
		dots_Dom.toggleClass(this.right,"overlay-left",this.contentWidth > this.gridWidth && this.position.x < this.contentWidth - this.gridWidth);
		this.refreshScrollers();
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
	,sizeRails: function(topRail,bottomRail,leftRail,rightRail) {
		var _g = this;
		if(this.topRail == topRail && this.bottomRail == bottomRail && this.leftRail == leftRail && this.rightRail == rightRail) return;
		this.dirty = true;
		this.topRail = topRail;
		this.bottomRail = bottomRail;
		this.leftRail = leftRail;
		this.rightRail = rightRail;
		this.top.style.height = "" + topRail + "px";
		((function(_e) {
			return function(effect) {
				thx_Arrays.each(_e,effect);
				return;
			};
		})(this.tops))(function(_) {
			return _.style.height = "" + topRail + "px";
		});
		((function(_e1) {
			return function(effect1) {
				thx_Arrays.each(_e1,effect1);
				return;
			};
		})(this.middles))(function(_1) {
			return _1.style.height = "" + (_g.contentHeight - topRail - bottomRail) + "px";
		});
		this.bottom.style.height = "" + bottomRail + "px";
		((function(_e2) {
			return function(effect2) {
				thx_Arrays.each(_e2,effect2);
				return;
			};
		})(this.bottoms))(function(_2) {
			return _2.style.height = "" + bottomRail + "px";
		});
		this.left.style.width = "" + leftRail + "px";
		((function(_e3) {
			return function(effect3) {
				thx_Arrays.each(_e3,effect3);
				return;
			};
		})(this.lefts))(function(_3) {
			return _3.style.width = "" + leftRail + "px";
		});
		((function(_e4) {
			return function(effect4) {
				thx_Arrays.each(_e4,effect4);
				return;
			};
		})(this.centers))(function(_4) {
			return _4.style.width = "" + (_g.contentWidth - leftRail - rightRail) + "px";
		});
		this.right.style.width = "" + rightRail + "px";
		((function(_e5) {
			return function(effect5) {
				thx_Arrays.each(_e5,effect5);
				return;
			};
		})(this.rights))(function(_5) {
			return _5.style.width = "" + rightRail + "px";
		});
	}
	,get_gridMiddleHeight: function() {
		return this.gridHeight - this.topRail - this.bottomRail;
	}
	,get_gridCenterWidth: function() {
		return this.gridWidth - this.leftRail - this.rightRail;
	}
	,__class__: fancy_core_Grid9
};
var fancy_core__$Lazy_Lazy_$Impl_$ = {};
fancy_core__$Lazy_Lazy_$Impl_$.__name__ = ["fancy","core","_Lazy","Lazy_Impl_"];
fancy_core__$Lazy_Lazy_$Impl_$.get_value = function(this1) {
	return this1();
};
fancy_core__$Lazy_Lazy_$Impl_$.ofValue = function(v) {
	return function() {
		return v;
	};
};
fancy_core__$Lazy_Lazy_$Impl_$.map = function(this1,f) {
	return function() {
		return f(this1());
	};
};
fancy_core__$Lazy_Lazy_$Impl_$.negate = function(l) {
	return fancy_core__$Lazy_Lazy_$Impl_$.map(l,function(v) {
		return -v;
	});
};
fancy_core__$Lazy_Lazy_$Impl_$.add = function(l1,l2) {
	return function() {
		return l1() + l2();
	};
};
fancy_core__$Lazy_Lazy_$Impl_$.subtract = function(l1,l2) {
	return function() {
		return l1() - l2();
	};
};
fancy_core__$Lazy_Lazy_$Impl_$.multiply = function(l1,l2) {
	return function() {
		return l1() * l2();
	};
};
fancy_core__$Lazy_Lazy_$Impl_$.divide = function(l1,l2) {
	return function() {
		return l1() / l2();
	};
};
fancy_core__$Lazy_Lazy_$Impl_$.addFloat = function(l1,v2) {
	return function() {
		return l1() + v2;
	};
};
fancy_core__$Lazy_Lazy_$Impl_$.subtractFloat = function(l1,v2) {
	return function() {
		return l1() - v2;
	};
};
fancy_core__$Lazy_Lazy_$Impl_$.subtractFromFloat = function(v1,l2) {
	return function() {
		return v1 - l2();
	};
};
fancy_core__$Lazy_Lazy_$Impl_$.multiplyFloat = function(l1,v2) {
	return function() {
		return l1() * v2;
	};
};
fancy_core__$Lazy_Lazy_$Impl_$.divideFloat = function(l1,v2) {
	return function() {
		return l1() / v2;
	};
};
fancy_core__$Lazy_Lazy_$Impl_$.divideFromFloat = function(v1,l2) {
	return function() {
		return v1 / l2();
	};
};
fancy_core__$Lazy_Lazy_$Impl_$.toString = function(this1) {
	return "Lazy[" + Std.string(this1()) + "]";
};
var fancy_core_LazyFloatExtensions = function() { };
fancy_core_LazyFloatExtensions.__name__ = ["fancy","core","LazyFloatExtensions"];
fancy_core_LazyFloatExtensions.min = function(l1,l2) {
	return function() {
		return Math.min(l1(),l2());
	};
};
fancy_core_LazyFloatExtensions.max = function(l1,l2) {
	return function() {
		return Math.max(l1(),l2());
	};
};
var fancy_core_ScrollerDimensions = function(opt) {
	var _g = this;
	this.viewSize = opt.viewSize;
	this.contentSize = opt.contentSize;
	this.scrollerArea = opt.scrollerArea;
	var minScrollerSize;
	if(null == opt.minScrollerSize) minScrollerSize = function() {
		return 0.0;
	}; else minScrollerSize = fancy_core_LazyFloatExtensions.max(opt.minScrollerSize,function() {
		return 0.0;
	});
	var maxScrollerSize;
	if(null == opt.maxScrollerSize) {
		var v = Infinity;
		maxScrollerSize = function() {
			return v;
		};
	} else maxScrollerSize = fancy_core__$Lazy_Lazy_$Impl_$.map(opt.maxScrollerSize,function(v1) {
		if(v1 < 0.0) {
			return Infinity;
		} else return v1;
	});
	this.proportionalScrollerSize = function() {
		return _g.viewSize() / _g.contentSize() * _g.scrollerArea();
	};
	this.scrollerSize = fancy_core_LazyFloatExtensions.min(fancy_core_LazyFloatExtensions.max(this.proportionalScrollerSize,minScrollerSize),maxScrollerSize);
};
fancy_core_ScrollerDimensions.__name__ = ["fancy","core","ScrollerDimensions"];
fancy_core_ScrollerDimensions.prototype = {
	viewSize: null
	,contentSize: null
	,scrollerArea: null
	,minScrollerSize: null
	,maxScrollerSize: null
	,proportionalScrollerSize: null
	,scrollerSize: null
	,scrollerPositionAsPercent: function(position) {
		return fancy_core__$Lazy_Lazy_$Impl_$.divideFromFloat(position,fancy_core__$Lazy_Lazy_$Impl_$.subtract(this.scrollerArea,this.scrollerSize));
	}
	,scrollerTopAsPercent: function(position) {
		return fancy_core__$Lazy_Lazy_$Impl_$.divideFromFloat(position,this.scrollerArea);
	}
	,contentPositionAsPercent: function(position) {
		return fancy_core__$Lazy_Lazy_$Impl_$.divideFromFloat(position,fancy_core__$Lazy_Lazy_$Impl_$.subtract(this.contentSize,this.viewSize));
	}
	,contentTopAsPercent: function(position) {
		return fancy_core__$Lazy_Lazy_$Impl_$.divideFromFloat(position,this.contentSize);
	}
	,scrollerToContentPosition: function(position) {
		return fancy_core__$Lazy_Lazy_$Impl_$.multiply(this.scrollerPositionAsPercent(position),fancy_core__$Lazy_Lazy_$Impl_$.subtract(this.contentSize,this.viewSize));
	}
	,contentToScrollerPosition: function(position) {
		return fancy_core__$Lazy_Lazy_$Impl_$.multiply(this.contentPositionAsPercent(position),fancy_core__$Lazy_Lazy_$Impl_$.subtract(this.scrollerArea,this.scrollerSize));
	}
	,__class__: fancy_core_ScrollerDimensions
};
var fancy_core_Search = function() { };
fancy_core_Search.__name__ = ["fancy","core","Search"];
fancy_core_Search.binary = function(min,max,comparator) {
	if(min > max) {
		var temp = max;
		max = min;
		min = temp;
	}
	var mid = function(l,r) {
		return (l + r) / 2 | 0;
	};
	var search;
	var search1 = null;
	search1 = function(m,l1,r1) {
		var c = comparator(m);
		if(c < 0) {
			l1 = m + 1;
			return search1(mid(l1,r1),l1,r1);
		} else if(c > 0) {
			r1 = m - 1;
			return search1(mid(l1,r1),l1,r1);
		} else return m;
	};
	search = search1;
	return search(mid(min,max),min,max);
};
var fancy_core_SwipeMoveHelper = function(el,callback) {
	var _g = this;
	this.el = el;
	el.addEventListener("touchmove",function(e) {
		e.preventDefault();
		_g.apply(e,function(t) {
			var dx = t.clientX - _g.x;
			var dy = t.clientY - _g.y;
			_g.x = t.clientX;
			_g.y = t.clientY;
			callback(-dx,-dy);
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
fancy_core_SwipeMoveHelper.__name__ = ["fancy","core","SwipeMoveHelper"];
fancy_core_SwipeMoveHelper.prototype = {
	el: null
	,id: null
	,x: null
	,y: null
	,apply: function(e,f) {
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
	,__class__: fancy_core_SwipeMoveHelper
};
var haxe_StackItem = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe_StackItem.CFunction = ["CFunction",0];
haxe_StackItem.CFunction.toString = $estr;
haxe_StackItem.CFunction.__enum__ = haxe_StackItem;
haxe_StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
var haxe_CallStack = function() { };
haxe_CallStack.__name__ = ["haxe","CallStack"];
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
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	get: null
	,set: null
	,exists: null
	,remove: null
	,keys: null
	,iterator: null
	,__class__: haxe_IMap
};
var haxe__$Int32_Int32_$Impl_$ = {};
haxe__$Int32_Int32_$Impl_$.__name__ = ["haxe","_Int32","Int32_Impl_"];
haxe__$Int32_Int32_$Impl_$.mul = function(a,b) {
	return a * (b & 65535) + (a * (b >>> 16) << 16 | 0) | 0;
};
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe__$Int64__$_$_$Int64.__name__ = ["haxe","_Int64","___Int64"];
haxe__$Int64__$_$_$Int64.prototype = {
	high: null
	,low: null
	,__class__: haxe__$Int64__$_$_$Int64
};
var haxe_Utf8 = function() { };
haxe_Utf8.__name__ = ["haxe","Utf8"];
haxe_Utf8.compare = function(a,b) {
	if(a > b) return 1; else if(a == b) return 0; else return -1;
};
haxe_Utf8.sub = function(s,pos,len) {
	return HxOverrides.substr(s,pos,len);
};
var haxe_crypto_Base64 = function() { };
haxe_crypto_Base64.__name__ = ["haxe","crypto","Base64"];
var haxe_ds_BalancedTree = function() {
};
haxe_ds_BalancedTree.__name__ = ["haxe","ds","BalancedTree"];
haxe_ds_BalancedTree.prototype = {
	root: null
	,set: function(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	,get: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) return node.value;
			if(c < 0) node = node.left; else node = node.right;
		}
		return null;
	}
	,remove: function(key) {
		try {
			this.root = this.removeLoop(key,this.root);
			return true;
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			if( js_Boot.__instanceof(e,String) ) {
				return false;
			} else throw(e);
		}
	}
	,exists: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) return true; else if(c < 0) node = node.left; else node = node.right;
		}
		return false;
	}
	,iterator: function() {
		var ret = [];
		this.iteratorLoop(this.root,ret);
		return HxOverrides.iter(ret);
	}
	,keys: function() {
		var ret = [];
		this.keysLoop(this.root,ret);
		return HxOverrides.iter(ret);
	}
	,setLoop: function(k,v,node) {
		if(node == null) return new haxe_ds_TreeNode(null,k,v,null);
		var c = this.compare(k,node.key);
		if(c == 0) return new haxe_ds_TreeNode(node.left,k,v,node.right,node == null?0:node._height); else if(c < 0) {
			var nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			var nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	,removeLoop: function(k,node) {
		if(node == null) throw new js__$Boot_HaxeError("Not_found");
		var c = this.compare(k,node.key);
		if(c == 0) return this.merge(node.left,node.right); else if(c < 0) return this.balance(this.removeLoop(k,node.left),node.key,node.value,node.right); else return this.balance(node.left,node.key,node.value,this.removeLoop(k,node.right));
	}
	,iteratorLoop: function(node,acc) {
		if(node != null) {
			this.iteratorLoop(node.left,acc);
			acc.push(node.value);
			this.iteratorLoop(node.right,acc);
		}
	}
	,keysLoop: function(node,acc) {
		if(node != null) {
			this.keysLoop(node.left,acc);
			acc.push(node.key);
			this.keysLoop(node.right,acc);
		}
	}
	,merge: function(t1,t2) {
		if(t1 == null) return t2;
		if(t2 == null) return t1;
		var t = this.minBinding(t2);
		return this.balance(t1,t.key,t.value,this.removeMinBinding(t2));
	}
	,minBinding: function(t) {
		if(t == null) throw new js__$Boot_HaxeError("Not_found"); else if(t.left == null) return t; else return this.minBinding(t.left);
	}
	,removeMinBinding: function(t) {
		if(t.left == null) return t.right; else return this.balance(this.removeMinBinding(t.left),t.key,t.value,t.right);
	}
	,balance: function(l,k,v,r) {
		var hl;
		if(l == null) hl = 0; else hl = l._height;
		var hr;
		if(r == null) hr = 0; else hr = r._height;
		if(hl > hr + 2) {
			if((function($this) {
				var $r;
				var _this = l.left;
				$r = _this == null?0:_this._height;
				return $r;
			}(this)) >= (function($this) {
				var $r;
				var _this1 = l.right;
				$r = _this1 == null?0:_this1._height;
				return $r;
			}(this))) return new haxe_ds_TreeNode(l.left,l.key,l.value,new haxe_ds_TreeNode(l.right,k,v,r)); else return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe_ds_TreeNode(l.right.right,k,v,r));
		} else if(hr > hl + 2) {
			if((function($this) {
				var $r;
				var _this2 = r.right;
				$r = _this2 == null?0:_this2._height;
				return $r;
			}(this)) > (function($this) {
				var $r;
				var _this3 = r.left;
				$r = _this3 == null?0:_this3._height;
				return $r;
			}(this))) return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left),r.key,r.value,r.right); else return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe_ds_TreeNode(r.left.right,r.key,r.value,r.right));
		} else return new haxe_ds_TreeNode(l,k,v,r,(hl > hr?hl:hr) + 1);
	}
	,compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,__class__: haxe_ds_BalancedTree
};
var haxe_ds_TreeNode = function(l,k,v,r,h) {
	if(h == null) h = -1;
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) this._height = ((function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this._height;
		return $r;
	}(this)) > (function($this) {
		var $r;
		var _this1 = $this.right;
		$r = _this1 == null?0:_this1._height;
		return $r;
	}(this))?(function($this) {
		var $r;
		var _this2 = $this.left;
		$r = _this2 == null?0:_this2._height;
		return $r;
	}(this)):(function($this) {
		var $r;
		var _this3 = $this.right;
		$r = _this3 == null?0:_this3._height;
		return $r;
	}(this))) + 1; else this._height = h;
};
haxe_ds_TreeNode.__name__ = ["haxe","ds","TreeNode"];
haxe_ds_TreeNode.prototype = {
	left: null
	,right: null
	,key: null
	,value: null
	,_height: null
	,__class__: haxe_ds_TreeNode
};
var haxe_ds_Either = { __ename__ : ["haxe","ds","Either"], __constructs__ : ["Left","Right"] };
haxe_ds_Either.Left = function(v) { var $x = ["Left",0,v]; $x.__enum__ = haxe_ds_Either; $x.toString = $estr; return $x; };
haxe_ds_Either.Right = function(v) { var $x = ["Right",1,v]; $x.__enum__ = haxe_ds_Either; $x.toString = $estr; return $x; };
var haxe_ds_EnumValueMap = function() {
	haxe_ds_BalancedTree.call(this);
};
haxe_ds_EnumValueMap.__name__ = ["haxe","ds","EnumValueMap"];
haxe_ds_EnumValueMap.__interfaces__ = [haxe_IMap];
haxe_ds_EnumValueMap.__super__ = haxe_ds_BalancedTree;
haxe_ds_EnumValueMap.prototype = $extend(haxe_ds_BalancedTree.prototype,{
	compare: function(k1,k2) {
		var d = k1[1] - k2[1];
		if(d != 0) return d;
		var p1 = k1.slice(2);
		var p2 = k2.slice(2);
		if(p1.length == 0 && p2.length == 0) return 0;
		return this.compareArgs(p1,p2);
	}
	,compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) return ld;
		var _g1 = 0;
		var _g = a1.length;
		while(_g1 < _g) {
			var i = _g1++;
			var d = this.compareArg(a1[i],a2[i]);
			if(d != 0) return d;
		}
		return 0;
	}
	,compareArg: function(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) return this.compare(v1,v2); else if((v1 instanceof Array) && v1.__enum__ == null && ((v2 instanceof Array) && v2.__enum__ == null)) return this.compareArgs(v1,v2); else return Reflect.compare(v1,v2);
	}
	,__class__: haxe_ds_EnumValueMap
});
var haxe_ds_IntMap = function() {
	this.h = { };
};
haxe_ds_IntMap.__name__ = ["haxe","ds","IntMap"];
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe_ds_ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe_ds_ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,exists: function(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i.__id__];
		}};
	}
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds_Option = { __ename__ : ["haxe","ds","Option"], __constructs__ : ["Some","None"] };
haxe_ds_Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe_ds_Option; $x.toString = $estr; return $x; };
haxe_ds_Option.None = ["None",1];
haxe_ds_Option.None.toString = $estr;
haxe_ds_Option.None.__enum__ = haxe_ds_Option;
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
haxe_ds__$StringMap_StringMapIterator.__name__ = ["haxe","ds","_StringMap","StringMapIterator"];
haxe_ds__$StringMap_StringMapIterator.prototype = {
	map: null
	,keys: null
	,index: null
	,count: null
	,hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: haxe_ds__$StringMap_StringMapIterator
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	h: null
	,rh: null
	,set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
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
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
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
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapIterator(this,this.arrayKeys());
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_Error = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
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
haxe_io_FPHelper.__name__ = ["haxe","io","FPHelper"];
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
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	val: null
	,__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = ["js","Boot"];
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
js_html_compat_ArrayBuffer.__name__ = ["js","html","compat","ArrayBuffer"];
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	byteLength: null
	,a: null
	,slice: function(begin,end) {
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
js_html_compat_DataView.__name__ = ["js","html","compat","DataView"];
js_html_compat_DataView.prototype = {
	buf: null
	,offset: null
	,length: null
	,getInt8: function(byteOffset) {
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
js_html_compat_Uint8Array.__name__ = ["js","html","compat","Uint8Array"];
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
thx_Arrays.__name__ = ["thx","Arrays"];
thx_Arrays.append = function(array,element) {
	array.push(element);
	return array;
};
thx_Arrays.appendIf = function(array,cond,element) {
	if(cond) array.push(element);
	return array;
};
thx_Arrays.applyIndexes = function(array,indexes,incrementDuplicates) {
	if(incrementDuplicates == null) incrementDuplicates = false;
	if(indexes.length != array.length) throw new thx_Error("`Arrays.applyIndexes` can only be applied to two arrays with the same length",null,{ fileName : "Arrays.hx", lineNumber : 55, className : "thx.Arrays", methodName : "applyIndexes"});
	var result = [];
	if(incrementDuplicates) {
		var usedIndexes = thx__$Set_Set_$Impl_$.createInt();
		var _g1 = 0;
		var _g = array.length;
		while(_g1 < _g) {
			var i = _g1++;
			var index = indexes[i];
			while(usedIndexes.h.hasOwnProperty(index)) index++;
			thx__$Set_Set_$Impl_$.add(usedIndexes,index);
			result[index] = array[i];
		}
	} else {
		var _g11 = 0;
		var _g2 = array.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			result[indexes[i1]] = array[i1];
		}
	}
	return result;
};
thx_Arrays.monoid = function() {
	return { zero : [], append : function(a,b) {
		return a.concat(b);
	}};
};
thx_Arrays.after = function(array,element) {
	return array.slice(thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(array,element) + 1);
};
thx_Arrays.atIndex = function(array,i) {
	if(i >= 0 && i < array.length) return haxe_ds_Option.Some(array[i]); else return haxe_ds_Option.None;
};
thx_Arrays.getOption = function(array,i) {
	return thx_Options.ofValue(array[i]);
};
thx_Arrays.each = function(arr,effect) {
	var _g1 = 0;
	var _g = arr.length;
	while(_g1 < _g) {
		var i = _g1++;
		effect(arr[i]);
	}
};
thx_Arrays.eachi = function(arr,effect) {
	var _g1 = 0;
	var _g = arr.length;
	while(_g1 < _g) {
		var i = _g1++;
		effect(arr[i],i);
	}
};
thx_Arrays.all = function(arr,predicate) {
	var _g1 = 0;
	var _g = arr.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(!predicate(arr[i])) return false;
	}
	return true;
};
thx_Arrays.any = function(arr,predicate) {
	var _g1 = 0;
	var _g = arr.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(predicate(arr[i])) return true;
	}
	return false;
};
thx_Arrays.at = function(arr,indexes) {
	return indexes.map(function(i) {
		return arr[i];
	});
};
thx_Arrays.before = function(array,element) {
	return array.slice(0,thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(array,element));
};
thx_Arrays.commonsFromStart = function(self,other,equality) {
	if(null == equality) equality = thx_Functions.equality;
	var count = 0;
	var _g = 0;
	var _g1 = thx_Arrays.zip(self,other);
	while(_g < _g1.length) {
		var pair = _g1[_g];
		++_g;
		if(equality(pair._0,pair._1)) count++; else break;
	}
	return self.slice(0,count);
};
thx_Arrays.compact = function(arr) {
	return arr.filter(function(v) {
		return null != v;
	});
};
thx_Arrays.compare = function(a,b) {
	var v;
	if((v = a.length - b.length) != 0) return v;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if((v = thx_Dynamics.compare(a[i],b[i])) != 0) return v;
	}
	return 0;
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
thx_Arrays.containsAll = function(array,elements,eq) {
	var $it0 = $iterator(elements)();
	while( $it0.hasNext() ) {
		var el = $it0.next();
		if(!thx_Arrays.contains(array,el,eq)) return false;
	}
	return true;
};
thx_Arrays.containsAny = function(array,elements,eq) {
	var $it0 = $iterator(elements)();
	while( $it0.hasNext() ) {
		var el = $it0.next();
		if(thx_Arrays.contains(array,el,eq)) return true;
	}
	return false;
};
thx_Arrays.create = function(length,fillWith) {
	var arr;
	if(length > 0) arr = new Array(length); else arr = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		arr[i] = fillWith;
	}
	return arr;
};
thx_Arrays.cross = function(a,b) {
	var r = [];
	var $it0 = HxOverrides.iter(a);
	while( $it0.hasNext() ) {
		var va = $it0.next();
		var $it1 = HxOverrides.iter(b);
		while( $it1.hasNext() ) {
			var vb = $it1.next();
			r.push([va,vb]);
		}
	}
	return r;
};
thx_Arrays.crossMulti = function(array) {
	var acopy = array.slice();
	var result = acopy.shift().map(function(v) {
		return [v];
	});
	while(acopy.length > 0) {
		var array1 = acopy.shift();
		var tresult = result;
		result = [];
		var $it0 = HxOverrides.iter(array1);
		while( $it0.hasNext() ) {
			var v1 = $it0.next();
			var _g = 0;
			while(_g < tresult.length) {
				var ar = tresult[_g];
				++_g;
				var t = ar.slice();
				t.push(v1);
				result.push(t);
			}
		}
	}
	return result;
};
thx_Arrays.distinct = function(array,predicate) {
	var result = [];
	if(array.length <= 1) return array.slice();
	if(null == predicate) predicate = thx_Functions.equality;
	var $it0 = HxOverrides.iter(array);
	while( $it0.hasNext() ) {
		var v = $it0.next();
		var v1 = [v];
		var keep = !thx_Arrays.any(result,(function(v1) {
			return function(r) {
				return predicate(r,v1[0]);
			};
		})(v1));
		if(keep) result.push(v1[0]);
	}
	return result;
};
thx_Arrays.eachPair = function(array,callback) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		var _g3 = i;
		var _g2 = array.length;
		while(_g3 < _g2) {
			var j = _g3++;
			if(!callback(array[i],array[j])) return;
		}
	}
};
thx_Arrays.equals = function(a,b,equality) {
	if(a == null || b == null || a.length != b.length) return false;
	if(null == equality) equality = thx_Functions.equality;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(!equality(a[i],b[i])) return false;
	}
	return true;
};
thx_Arrays.extract = function(a,predicate) {
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(predicate(a[i])) return a.splice(i,1)[0];
	}
	return null;
};
thx_Arrays.filterNull = function(a) {
	var arr = [];
	var $it0 = HxOverrides.iter(a);
	while( $it0.hasNext() ) {
		var v = $it0.next();
		if(null != v) arr.push(v);
	}
	return arr;
};
thx_Arrays.filterOption = function(a) {
	return thx_Arrays.reduce(a,function(acc,maybeV) {
		switch(maybeV[1]) {
		case 0:
			var v = maybeV[2];
			acc.push(v);
			break;
		case 1:
			break;
		}
		return acc;
	},[]);
};
thx_Arrays.find = function(array,predicate) {
	var $it0 = HxOverrides.iter(array);
	while( $it0.hasNext() ) {
		var element = $it0.next();
		if(predicate(element)) return element;
	}
	return null;
};
thx_Arrays.findi = function(array,predicate) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(predicate(array[i],i)) return array[i];
	}
	return null;
};
thx_Arrays.findiOption = function(array,predicate) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(predicate(array[i],i)) return haxe_ds_Option.Some(array[i]);
	}
	return haxe_ds_Option.None;
};
thx_Arrays.findOption = function(array,predicate) {
	var $it0 = HxOverrides.iter(array);
	while( $it0.hasNext() ) {
		var element = $it0.next();
		if(predicate(element)) return haxe_ds_Option.Some(element);
	}
	return haxe_ds_Option.None;
};
thx_Arrays.findIndex = function(array,predicate) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(predicate(array[i])) return i;
	}
	return -1;
};
thx_Arrays.findLast = function(array,predicate) {
	var len = array.length;
	var j;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		j = len - i - 1;
		if(predicate(array[j])) return array[j];
	}
	return null;
};
thx_Arrays.first = function(array) {
	return array[0];
};
thx_Arrays.firstOption = function(array) {
	return thx_Options.ofValue(array[0]);
};
thx_Arrays.flatMap = function(array,callback) {
	return thx_Arrays.flatten(array.map(callback));
};
thx_Arrays.flatten = function(array) {
	return Array.prototype.concat.apply([],array);
};
thx_Arrays.from = function(array,element) {
	return array.slice(thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(array,element));
};
thx_Arrays.groupByAppend = function(arr,resolver,map) {
	var _g1 = 0;
	var _g = arr.length;
	while(_g1 < _g) {
		var i = _g1++;
		var v = arr[i];
		var key = resolver(v);
		var acc = map.get(key);
		if(null == acc) map.set(key,[v]); else acc.push(v);
	}
	return map;
};
thx_Arrays.spanByIndex = function(arr,spanKey) {
	var acc = [];
	var cur = null;
	var j = -1;
	var _g1 = 0;
	var _g = arr.length;
	while(_g1 < _g) {
		var i = _g1++;
		var k = spanKey(i);
		if(k == null) throw new thx_Error("spanKey function returned null for index " + i,null,{ fileName : "Arrays.hx", lineNumber : 577, className : "thx.Arrays", methodName : "spanByIndex"});
		if(cur == k) acc[j].push(arr[i]); else {
			cur = k;
			j++;
			acc.push([arr[i]]);
		}
	}
	return acc;
};
thx_Arrays.hasElements = function(array) {
	return null != array && array.length > 0;
};
thx_Arrays.head = function(array) {
	return array[0];
};
thx_Arrays.ifEmpty = function(array,alt) {
	if(null != array && 0 != array.length) return array; else return alt;
};
thx_Arrays.initial = function(array) {
	return array.slice(0,array.length - 1);
};
thx_Arrays.intersperse = function(array,value) {
	return thx_Arrays.reducei(array,function(acc,v,i) {
		acc[i * 2] = v;
		return acc;
	},thx_Arrays.create(array.length * 2 - 1,value));
};
thx_Arrays.isEmpty = function(array) {
	return null == array || array.length == 0;
};
thx_Arrays.last = function(array) {
	return array[array.length - 1];
};
thx_Arrays.lastOption = function(array) {
	return thx_Options.ofValue(array[array.length - 1]);
};
thx_Arrays.map = function(array,callback) {
	var r = [];
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		r.push(callback(array[i]));
	}
	return r;
};
thx_Arrays.mapi = function(array,callback) {
	var r = [];
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		r.push(callback(array[i],i));
	}
	return r;
};
thx_Arrays.mapRight = function(array,callback) {
	var i = array.length;
	var result = [];
	while(--i >= 0) result.push(callback(array[i]));
	return result;
};
thx_Arrays.order = function(array,sort) {
	var n = array.slice();
	n.sort(sort);
	return n;
};
thx_Arrays.pull = function(array,toRemove,equality) {
	var $it0 = HxOverrides.iter(toRemove);
	while( $it0.hasNext() ) {
		var element = $it0.next();
		thx_Arrays.removeAll(array,element,equality);
	}
};
thx_Arrays.pushIf = function(array,condition,value) {
	if(condition) array.push(value);
	return array;
};
thx_Arrays.rank = function(array,compare,incrementDuplicates) {
	if(incrementDuplicates == null) incrementDuplicates = true;
	var arr = thx_Arrays.mapi(array,function(v,i) {
		return { _0 : v, _1 : i};
	});
	arr.sort(function(a,b) {
		return compare(a._0,b._0);
	});
	if(incrementDuplicates) {
		var usedIndexes = thx__$Set_Set_$Impl_$.createInt();
		return thx_Arrays.reducei(arr,function(acc,x,i1) {
			var index;
			if(i1 > 0 && compare(arr[i1 - 1]._0,x._0) == 0) index = acc[arr[i1 - 1]._1]; else index = i1;
			while(usedIndexes.h.hasOwnProperty(index)) index++;
			thx__$Set_Set_$Impl_$.add(usedIndexes,index);
			acc[x._1] = index;
			return acc;
		},[]);
	} else return thx_Arrays.reducei(arr,function(acc1,x1,i2) {
		if(i2 > 0 && compare(arr[i2 - 1]._0,x1._0) == 0) acc1[x1._1] = acc1[arr[i2 - 1]._1]; else acc1[x1._1] = i2;
		return acc1;
	},[]);
};
thx_Arrays.reduce = function(array,f,initial) {
	var $it0 = HxOverrides.iter(array);
	while( $it0.hasNext() ) {
		var v = $it0.next();
		initial = f(initial,v);
	}
	return initial;
};
thx_Arrays.foldLeft = function(array,init,f) {
	return thx_Arrays.reduce(array,f,init);
};
thx_Arrays.foldLeftEither = function(array,init,f) {
	var acc = thx_Either.Right(init);
	var $it0 = HxOverrides.iter(array);
	while( $it0.hasNext() ) {
		var a = $it0.next();
		switch(acc[1]) {
		case 0:
			var error = acc[2];
			return acc;
		case 1:
			var b = acc[2];
			acc = f(b,a);
			break;
		}
	}
	return acc;
};
thx_Arrays.foldMap = function(array,f,m) {
	return thx_Arrays.foldLeft(array.map(f),thx__$Monoid_Monoid_$Impl_$.get_zero(m),(function(_e) {
		return function(a0,a1) {
			return thx__$Monoid_Monoid_$Impl_$.append(_e,a0,a1);
		};
	})(m));
};
thx_Arrays.fold = function(array,m) {
	return thx_Arrays.foldMap(array,thx_Functions.identity,m);
};
thx_Arrays.nel = function(array) {
	return thx__$Nel_Nel_$Impl_$.fromArray(array);
};
thx_Arrays.foldS = function(array,s) {
	return thx_Options.map(thx_Arrays.nel(array),function(x) {
		return thx__$Nel_Nel_$Impl_$.fold(x,s);
	});
};
thx_Arrays.resize = function(array,length,fill) {
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_Arrays.reducei = function(array,f,initial) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		initial = f(initial,array[i],i);
	}
	return initial;
};
thx_Arrays.reduceRight = function(array,f,initial) {
	var i = array.length;
	while(--i >= 0) initial = f(initial,array[i]);
	return initial;
};
thx_Arrays.removeAll = function(array,element,equality) {
	if(null == equality) equality = thx_Functions.equality;
	var i = array.length;
	while(--i >= 0) if(equality(array[i],element)) array.splice(i,1);
};
thx_Arrays.rest = function(array) {
	return array.slice(1);
};
thx_Arrays.reversed = function(array) {
	var result = array.slice();
	result.reverse();
	return result;
};
thx_Arrays.sample = function(array,n) {
	n = thx_Ints.min(n,array.length);
	var copy = array.slice();
	var result = [];
	var _g = 0;
	while(_g < n) {
		var i = _g++;
		result.push(copy.splice(Std.random(copy.length),1)[0]);
	}
	return result;
};
thx_Arrays.sampleOne = function(array) {
	var index = Std.random(array.length);
	return array[index];
};
thx_Arrays.string = function(arr) {
	var strings = arr.map(thx_Dynamics.string);
	return "[" + strings.join(", ") + "]";
};
thx_Arrays.shuffle = function(a) {
	var t = thx_Ints.range(a.length);
	var array = [];
	while(t.length > 0) {
		var pos = Std.random(t.length);
		var index = t[pos];
		t.splice(pos,1);
		array.push(a[index]);
	}
	return array;
};
thx_Arrays.split = function(array,parts) {
	var len = Math.ceil(array.length / parts);
	return thx_Arrays.splitBy(array,len);
};
thx_Arrays.splitBy = function(array,len) {
	var res = [];
	len = thx_Ints.min(len,array.length);
	var _g1 = 0;
	var _g = Math.ceil(array.length / len);
	while(_g1 < _g) {
		var p = _g1++;
		res.push(array.slice(p * len,(p + 1) * len));
	}
	return res;
};
thx_Arrays.splitByPad = function(arr,len,pad) {
	var res = thx_Arrays.splitBy(arr,len);
	while(res[res.length - 1].length < len) res[res.length - 1].push(pad);
	return res;
};
thx_Arrays.tail = function(array) {
	return array.slice(1);
};
thx_Arrays.take = function(arr,n) {
	return arr.slice(0,n);
};
thx_Arrays.takeLast = function(arr,n) {
	return arr.slice(arr.length - n);
};
thx_Arrays.traverseOption = function(arr,f) {
	return thx_Arrays.reduce(arr,function(acc,t) {
		return thx_Options.ap(f(t),thx_Options.map(acc,function(ux) {
			return function(u) {
				ux.push(u);
				return ux;
			};
		}));
	},haxe_ds_Option.Some([]));
};
thx_Arrays.traverseValidation = function(arr,f,s) {
	return thx_Arrays.reduce(arr,function(acc,t) {
		return thx__$Validation_Validation_$Impl_$.ap(f(t),thx__$Validation_Validation_$Impl_$.ap(acc,thx_Either.Right(function(ux) {
			return function(u) {
				ux.push(u);
				return ux;
			};
		}),function(e1,e2) {
			throw new js__$Boot_HaxeError("Unreachable");
		}),s);
	},thx_Either.Right([]));
};
thx_Arrays.traverseValidationIndexed = function(arr,f,s) {
	return thx_Arrays.reducei(arr,function(acc,t,i) {
		return thx__$Validation_Validation_$Impl_$.ap(f(t,i),thx__$Validation_Validation_$Impl_$.ap(acc,thx_Either.Right(function(ux) {
			return function(u) {
				ux.push(u);
				return ux;
			};
		}),function(e1,e2) {
			throw new js__$Boot_HaxeError("Unreachable");
		}),s);
	},thx_Either.Right([]));
};
thx_Arrays.rotate = function(arr) {
	var result = [];
	var _g1 = 0;
	var _g = arr[0].length;
	while(_g1 < _g) {
		var i = _g1++;
		var row = [];
		result.push(row);
		var _g3 = 0;
		var _g2 = arr.length;
		while(_g3 < _g2) {
			var j = _g3++;
			row.push(arr[j][i]);
		}
	}
	return result;
};
thx_Arrays.sliding2 = function(arr,f) {
	if(arr.length < 2) return []; else {
		var result = [];
		var _g1 = 0;
		var _g = arr.length - 1;
		while(_g1 < _g) {
			var i = _g1++;
			result.push(f(arr[i],arr[i + 1]));
		}
		return result;
	}
};
thx_Arrays.unzip = function(array) {
	var a1 = [];
	var a2 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
	});
	return { _0 : a1, _1 : a2};
};
thx_Arrays.unzip3 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
	});
	return { _0 : a1, _1 : a2, _2 : a3};
};
thx_Arrays.unzip4 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4};
};
thx_Arrays.unzip5 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	var a5 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
		a5.push(t._4);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4, _4 : a5};
};
thx_Arrays.zip = function(array1,array2) {
	var length = thx_Ints.min(array1.length,array2.length);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i]});
	}
	return array;
};
thx_Arrays.zip3 = function(array1,array2,array3) {
	var length = thx_ArrayInts.min([array1.length,array2.length,array3.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i]});
	}
	return array;
};
thx_Arrays.zip4 = function(array1,array2,array3,array4) {
	var length = thx_ArrayInts.min([array1.length,array2.length,array3.length,array4.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i], _3 : array4[i]});
	}
	return array;
};
thx_Arrays.zip5 = function(array1,array2,array3,array4,array5) {
	var length = thx_ArrayInts.min([array1.length,array2.length,array3.length,array4.length,array5.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i], _3 : array4[i], _4 : array5[i]});
	}
	return array;
};
thx_Arrays.zipAp = function(ax,fx) {
	var result = [];
	var _g1 = 0;
	var _g = thx_Ints.min(ax.length,fx.length);
	while(_g1 < _g) {
		var i = _g1++;
		result.push(fx[i](ax[i]));
	}
	return result;
};
thx_Arrays.zip2Ap = function(f,ax,bx) {
	return thx_Arrays.zipAp(bx,ax.map(thx_Functions2.curry(f)));
};
thx_Arrays.zip3Ap = function(f,ax,bx,cx) {
	return thx_Arrays.zipAp(cx,thx_Arrays.zip2Ap(thx_Functions3.curry(f),ax,bx));
};
thx_Arrays.zip4Ap = function(f,ax,bx,cx,dx) {
	return thx_Arrays.zipAp(dx,thx_Arrays.zip3Ap(thx_Functions4.curry(f),ax,bx,cx));
};
thx_Arrays.zip5Ap = function(f,ax,bx,cx,dx,ex) {
	return thx_Arrays.zipAp(ex,thx_Arrays.zip4Ap(thx_Functions5.curry(f),ax,bx,cx,dx));
};
thx_Arrays.withPrepend = function(arr,el) {
	return [el].concat(arr);
};
thx_Arrays["with"] = function(arr,el) {
	return arr.concat([el]);
};
thx_Arrays.withSlice = function(arr,other,start,length) {
	if(length == null) length = 0;
	return arr.slice(0,start).concat(other).concat(arr.slice(start + length));
};
thx_Arrays.withInsert = function(arr,el,pos) {
	return arr.slice(0,pos).concat([el]).concat(arr.slice(pos));
};
thx_Arrays.maxBy = function(arr,ord) {
	if(arr.length == 0) return haxe_ds_Option.None; else return haxe_ds_Option.Some(thx_Arrays.reduce(arr,(function(_e) {
		return function(a0,a1) {
			return thx__$Ord_Ord_$Impl_$.max(_e,a0,a1);
		};
	})(ord),arr[0]));
};
thx_Arrays.minBy = function(arr,ord) {
	if(arr.length == 0) return haxe_ds_Option.None; else return haxe_ds_Option.Some(thx_Arrays.reduce(arr,(function(_e) {
		return function(a0,a1) {
			return thx__$Ord_Ord_$Impl_$.min(_e,a0,a1);
		};
	})(ord),arr[0]));
};
thx_Arrays.toMap = function(arr,keyOrder) {
	var m = thx_fp_MapImpl.Tip;
	var collisions = [];
	var _g1 = 0;
	var _g = arr.length;
	while(_g1 < _g) {
		var i = _g1++;
		var tuple = arr[i];
		if(thx_Options.isNone(thx_fp__$Map_Map_$Impl_$.lookup(m,tuple._0,keyOrder))) m = thx_fp__$Map_Map_$Impl_$.insert(m,tuple._0,tuple._1,keyOrder); else collisions.push(tuple._0);
	}
	return thx_Options.toFailure(thx__$Nel_Nel_$Impl_$.fromArray(collisions),m);
};
thx_Arrays.toStringMap = function(arr) {
	return thx_Arrays.reduce(arr,function(acc,t) {
		acc.set(t._0,t._1);
		return acc;
	},new haxe_ds_StringMap());
};
thx_Arrays.partition = function(arr,f) {
	return thx_Arrays.reduce(arr,function(a,b) {
		if(f(b)) a._0.push(b); else a._1.push(b);
		return a;
	},{ _0 : [], _1 : []});
};
thx_Arrays.partitionWhile = function(arr,f) {
	var partitioning = true;
	return thx_Arrays.reduce(arr,function(a,b) {
		if(partitioning) {
			if(f(b)) a._0.push(b); else {
				partitioning = false;
				a._1.push(b);
			}
		} else a._1.push(b);
		return a;
	},{ _0 : [], _1 : []});
};
thx_Arrays.dropLeft = function(a,n) {
	if(n >= a.length) return []; else return a.slice(n);
};
thx_Arrays.dropRight = function(a,n) {
	if(n >= a.length) return []; else return a.slice(0,a.length - n);
};
thx_Arrays.dropWhile = function(a,p) {
	var r = [].concat(a.slice());
	var $it0 = HxOverrides.iter(a);
	while( $it0.hasNext() ) {
		var e = $it0.next();
		if(p(e)) r.shift(); else break;
	}
	return r;
};
var thx_ArrayFloats = function() { };
thx_ArrayFloats.__name__ = ["thx","ArrayFloats"];
thx_ArrayFloats.average = function(arr) {
	return thx_ArrayFloats.sum(arr) / arr.length;
};
thx_ArrayFloats.compact = function(arr) {
	return arr.filter(function(v) {
		return null != v && isFinite(v);
	});
};
thx_ArrayFloats.max = function(arr) {
	return thx_Options.get(thx_Arrays.maxBy(arr,thx_Floats.order));
};
thx_ArrayFloats.min = function(arr) {
	return thx_Options.get(thx_Arrays.minBy(arr,thx_Floats.order));
};
thx_ArrayFloats.resize = function(array,length,fill) {
	if(fill == null) fill = 0.0;
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_ArrayFloats.standardDeviation = function(array) {
	if(array.length < 2) return 0.0;
	var mean = thx_ArrayFloats.average(array);
	var variance = thx_Arrays.reduce(array,function(acc,val) {
		return acc + Math.pow(val - mean,2);
	},0) / (array.length - 1);
	return Math.sqrt(variance);
};
thx_ArrayFloats.sum = function(arr) {
	return thx_Arrays.reduce(arr,function(tot,v) {
		return tot + v;
	},0.0);
};
var thx_ArrayInts = function() { };
thx_ArrayInts.__name__ = ["thx","ArrayInts"];
thx_ArrayInts.average = function(arr) {
	return thx_ArrayInts.sum(arr) / arr.length;
};
thx_ArrayInts.max = function(arr) {
	return thx_Options.get(thx_Arrays.maxBy(arr,thx_Ints.order));
};
thx_ArrayInts.min = function(arr) {
	return thx_Options.get(thx_Arrays.minBy(arr,thx_Ints.order));
};
thx_ArrayInts.resize = function(array,length,fill) {
	if(fill == null) fill = 0;
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_ArrayInts.sum = function(arr) {
	return thx_Arrays.reduce(arr,function(tot,v) {
		return tot + v;
	},0);
};
var thx_ArrayStrings = function() { };
thx_ArrayStrings.__name__ = ["thx","ArrayStrings"];
thx_ArrayStrings.compact = function(arr) {
	return arr.filter(function(v) {
		return !thx_Strings.isEmpty(v);
	});
};
thx_ArrayStrings.max = function(arr) {
	return thx_Options.getOrElse(thx_Arrays.maxBy(arr,thx_Strings.order),null);
};
thx_ArrayStrings.min = function(arr) {
	return thx_Options.getOrElse(thx_Arrays.minBy(arr,thx_Strings.order),null);
};
var thx_Bools = function() { };
thx_Bools.__name__ = ["thx","Bools"];
thx_Bools.compare = function(a,b) {
	if(a == b) return 0; else if(a) return -1; else return 1;
};
thx_Bools.toInt = function(v) {
	if(v) return 1; else return 0;
};
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
thx_Bools.xor = function(a,b) {
	return a != b;
};
thx_Bools.option = function(cond,a) {
	if(cond) return haxe_ds_Option.Some(a); else return haxe_ds_Option.None;
};
var thx__$Ord_Ord_$Impl_$ = {};
thx__$Ord_Ord_$Impl_$.__name__ = ["thx","_Ord","Ord_Impl_"];
thx__$Ord_Ord_$Impl_$.order = function(this1,a0,a1) {
	return this1(a0,a1);
};
thx__$Ord_Ord_$Impl_$.max = function(this1,a0,a1) {
	var _g = this1(a0,a1);
	switch(_g[1]) {
	case 0:case 2:
		return a1;
	case 1:
		return a0;
	}
};
thx__$Ord_Ord_$Impl_$.min = function(this1,a0,a1) {
	var _g = this1(a0,a1);
	switch(_g[1]) {
	case 0:case 2:
		return a0;
	case 1:
		return a1;
	}
};
thx__$Ord_Ord_$Impl_$.equal = function(this1,a0,a1) {
	return this1(a0,a1) == thx_OrderingImpl.EQ;
};
thx__$Ord_Ord_$Impl_$.contramap = function(this1,f) {
	return function(b0,b1) {
		return this1(f(b0),f(b1));
	};
};
thx__$Ord_Ord_$Impl_$.inverse = function(this1) {
	return function(a0,a1) {
		return this1(a1,a0);
	};
};
thx__$Ord_Ord_$Impl_$.intComparison = function(this1,a0,a1) {
	var _g = this1(a0,a1);
	switch(_g[1]) {
	case 0:
		return -1;
	case 2:
		return 0;
	case 1:
		return 1;
	}
};
thx__$Ord_Ord_$Impl_$.fromIntComparison = function(f) {
	return function(a,b) {
		return thx__$Ord_Ordering_$Impl_$.fromInt(f(a,b));
	};
};
thx__$Ord_Ord_$Impl_$.forComparable = function() {
	return function(a,b) {
		return thx__$Ord_Ordering_$Impl_$.fromInt(a.compareTo(b));
	};
};
thx__$Ord_Ord_$Impl_$.forComparableOrd = function() {
	return function(a,b) {
		return a.compareTo(b);
	};
};
var thx__$Ord_Ordering_$Impl_$ = {};
thx__$Ord_Ordering_$Impl_$.__name__ = ["thx","_Ord","Ordering_Impl_"];
thx__$Ord_Ordering_$Impl_$.fromInt = function(value) {
	if(value < 0) return thx_OrderingImpl.LT; else if(value > 0) return thx_OrderingImpl.GT; else return thx_OrderingImpl.EQ;
};
thx__$Ord_Ordering_$Impl_$.fromFloat = function(value) {
	if(value < 0) return thx_OrderingImpl.LT; else if(value > 0) return thx_OrderingImpl.GT; else return thx_OrderingImpl.EQ;
};
thx__$Ord_Ordering_$Impl_$.toInt = function(this1) {
	switch(this1[1]) {
	case 0:
		return -1;
	case 1:
		return 1;
	case 2:
		return 0;
	}
};
var thx_OrderingImpl = { __ename__ : ["thx","OrderingImpl"], __constructs__ : ["LT","GT","EQ"] };
thx_OrderingImpl.LT = ["LT",0];
thx_OrderingImpl.LT.toString = $estr;
thx_OrderingImpl.LT.__enum__ = thx_OrderingImpl;
thx_OrderingImpl.GT = ["GT",1];
thx_OrderingImpl.GT.toString = $estr;
thx_OrderingImpl.GT.__enum__ = thx_OrderingImpl;
thx_OrderingImpl.EQ = ["EQ",2];
thx_OrderingImpl.EQ.toString = $estr;
thx_OrderingImpl.EQ.__enum__ = thx_OrderingImpl;
var thx_Floats = function() { };
thx_Floats.__name__ = ["thx","Floats"];
thx_Floats.angleDifference = function(a,b,turn) {
	if(turn == null) turn = 360.0;
	var r = (b - a) % turn;
	if(r < 0) r += turn;
	if(r > turn / 2) r -= turn;
	return r;
};
thx_Floats.ceilTo = function(f,decimals) {
	var p = Math.pow(10,decimals);
	return Math.ceil(f * p) / p;
};
thx_Floats.canParse = function(s) {
	return thx_Floats.pattern_parse.match(s);
};
thx_Floats.clamp = function(v,min,max) {
	if(v < min) return min; else if(v > max) return max; else return v;
};
thx_Floats.clampSym = function(v,max) {
	return thx_Floats.clamp(v,-max,max);
};
thx_Floats.compare = function(a,b) {
	if(a < b) return -1; else if(a > b) return 1; else return 0;
};
thx_Floats.floorTo = function(f,decimals) {
	var p = Math.pow(10,decimals);
	return Math.floor(f * p) / p;
};
thx_Floats.interpolate = function(f,a,b) {
	return (b - a) * f + a;
};
thx_Floats.interpolateAngle = function(f,a,b,turn) {
	if(turn == null) turn = 360;
	return thx_Floats.wrapCircular(thx_Floats.interpolate(f,a,a + thx_Floats.angleDifference(a,b,turn)),turn);
};
thx_Floats.interpolateAngleWidest = function(f,a,b,turn) {
	if(turn == null) turn = 360;
	return thx_Floats.wrapCircular(thx_Floats.interpolateAngle(f,a,b,turn) - turn / 2,turn);
};
thx_Floats.interpolateAngleCW = function(f,a,b,turn) {
	if(turn == null) turn = 360;
	a = thx_Floats.wrapCircular(a,turn);
	b = thx_Floats.wrapCircular(b,turn);
	if(b < a) b += turn;
	return thx_Floats.wrapCircular(thx_Floats.interpolate(f,a,b),turn);
};
thx_Floats.interpolateAngleCCW = function(f,a,b,turn) {
	if(turn == null) turn = 360;
	a = thx_Floats.wrapCircular(a,turn);
	b = thx_Floats.wrapCircular(b,turn);
	if(b > a) b -= turn;
	return thx_Floats.wrapCircular(thx_Floats.interpolate(f,a,b),turn);
};
thx_Floats.max = function(a,b) {
	if(a > b) return a; else return b;
};
thx_Floats.min = function(a,b) {
	if(a < b) return a; else return b;
};
thx_Floats.nearEquals = function(a,b,tollerance) {
	if(tollerance == null) tollerance = 1e-9;
	if(isFinite(a)) return Math.abs(a - b) <= tollerance;
	if(isNaN(a)) return isNaN(b);
	if(isNaN(b)) return false;
	if(!isFinite(b)) return a > 0 == b > 0;
	return false;
};
thx_Floats.nearEqualAngles = function(a,b,turn,tollerance) {
	if(tollerance == null) tollerance = 1e-9;
	if(turn == null) turn = 360.0;
	return Math.abs(thx_Floats.angleDifference(a,b,turn)) <= tollerance;
};
thx_Floats.nearZero = function(n,tollerance) {
	if(tollerance == null) tollerance = 1e-9;
	return Math.abs(n) <= tollerance;
};
thx_Floats.normalize = function(v) {
	if(v < 0) return 0; else if(v > 1) return 1; else return v;
};
thx_Floats.parse = function(s) {
	if(s.substring(0,1) == "+") s = s.substring(1);
	return parseFloat(s);
};
thx_Floats.root = function(base,index) {
	return Math.pow(base,1 / index);
};
thx_Floats.roundTo = function(f,decimals) {
	var p = Math.pow(10,decimals);
	return Math.round(f * p) / p;
};
thx_Floats.sign = function(value) {
	if(value < 0) return -1; else return 1;
};
thx_Floats.toString = function(v) {
	return "" + v;
};
thx_Floats.toFloat = function(s) {
	return thx_Floats.parse(s);
};
thx_Floats.trunc = function(value) {
	if(value < 0.0) return Math.ceil(value); else return Math.floor(value);
};
thx_Floats.ftrunc = function(value) {
	if(value < 0.0) return Math.ceil(value); else return Math.floor(value);
};
thx_Floats.wrap = function(v,min,max) {
	var range = max - min + 1;
	if(v < min) v += range * ((min - v) / range + 1);
	return min + (v - min) % range;
};
thx_Floats.wrapCircular = function(v,max) {
	v = v % max;
	if(v < 0) v += max;
	return v;
};
var thx_Dates = function() { };
thx_Dates.__name__ = ["thx","Dates"];
thx_Dates.compare = function(a,b) {
	return thx_Floats.compare(a.getTime(),b.getTime());
};
thx_Dates.create = function(year,month,day,hour,minute,second) {
	if(second == null) second = 0;
	if(minute == null) minute = 0;
	if(hour == null) hour = 0;
	if(day == null) day = 1;
	if(month == null) month = 0;
	minute += Math.floor(second / 60);
	second = second % 60;
	if(second < 0) second += 60;
	hour += Math.floor(minute / 60);
	minute = minute % 60;
	if(minute < 0) minute += 60;
	day += Math.floor(hour / 24);
	hour = hour % 24;
	if(hour < 0) hour += 24;
	if(day == 0) {
		month -= 1;
		if(month < 0) {
			month = 11;
			year -= 1;
		}
		day = thx_Dates.daysInMonth(year,month);
	}
	year += Math.floor(month / 12);
	month = month % 12;
	if(month < 0) month += 12;
	var days = thx_Dates.daysInMonth(year,month);
	while(day > days) {
		if(day > days) {
			day -= days;
			month++;
		}
		if(month > 11) {
			month -= 12;
			year++;
		}
		days = thx_Dates.daysInMonth(year,month);
	}
	return new Date(year,month,day,hour,minute,second);
};
thx_Dates.daysRange = function(start,end) {
	if(thx_Dates.compare(end,start) < 0) return [];
	var days = [];
	while(!thx_Dates.sameDay(start,end)) {
		days.push(start);
		start = thx_Dates.jump(start,thx_TimePeriod.Day,1);
	}
	days.push(end);
	return days;
};
thx_Dates.equals = function(self,other) {
	return self.getTime() == other.getTime();
};
thx_Dates.nearEquals = function(self,other,units,period) {
	if(units == null) units = 1;
	if(null == period) period = thx_TimePeriod.Second;
	if(units < 0) units = -units;
	var min = thx_Dates.jump(self,period,-units);
	var max = thx_Dates.jump(self,period,units);
	return thx_Dates.compare(min,other) <= 0 && thx_Dates.compare(max,other) >= 0;
};
thx_Dates.greater = function(self,other) {
	return thx_Dates.compare(self,other) > 0;
};
thx_Dates.more = function(self,other) {
	return thx_Dates.compare(self,other) > 0;
};
thx_Dates.less = function(self,other) {
	return thx_Dates.compare(self,other) < 0;
};
thx_Dates.greaterEquals = function(self,other) {
	return thx_Dates.compare(self,other) >= 0;
};
thx_Dates.moreEqual = function(self,other) {
	return thx_Dates.compare(self,other) >= 0;
};
thx_Dates.lessEquals = function(self,other) {
	return thx_Dates.compare(self,other) <= 0;
};
thx_Dates.lessEqual = function(self,other) {
	return thx_Dates.compare(self,other) <= 0;
};
thx_Dates.isLeapYear = function(year) {
	if(year % 4 != 0) return false;
	if(year % 100 == 0) return year % 400 == 0;
	return true;
};
thx_Dates.isInLeapYear = function(d) {
	return thx_Dates.isLeapYear(d.getFullYear());
};
thx_Dates.daysInMonth = function(year,month) {
	switch(month) {
	case 0:case 2:case 4:case 6:case 7:case 9:case 11:
		return 31;
	case 3:case 5:case 8:case 10:
		return 30;
	case 1:
		if(thx_Dates.isLeapYear(year)) return 29; else return 28;
		break;
	default:
		throw new js__$Boot_HaxeError("Invalid month \"" + month + "\".  Month should be a number, Jan=0, Dec=11");
	}
};
thx_Dates.numDaysInMonth = function(month,year) {
	return thx_Dates.daysInMonth(year,month);
};
thx_Dates.daysInThisMonth = function(d) {
	return thx_Dates.daysInMonth(d.getFullYear(),d.getMonth());
};
thx_Dates.numDaysInThisMonth = function(d) {
	return thx_Dates.daysInThisMonth(d);
};
thx_Dates.sameYear = function(self,other) {
	return self.getFullYear() == other.getFullYear();
};
thx_Dates.sameMonth = function(self,other) {
	return thx_Dates.sameYear(self,other) && self.getMonth() == other.getMonth();
};
thx_Dates.sameDay = function(self,other) {
	return thx_Dates.sameMonth(self,other) && self.getDate() == other.getDate();
};
thx_Dates.sameHour = function(self,other) {
	return thx_Dates.sameDay(self,other) && self.getHours() == other.getHours();
};
thx_Dates.sameMinute = function(self,other) {
	return thx_Dates.sameHour(self,other) && self.getMinutes() == other.getMinutes();
};
thx_Dates.snapNext = function(date,period) {
	{
		var this1 = thx__$Timestamp_Timestamp_$Impl_$.snapNext(date.getTime(),period);
		var d = new Date();
		d.setTime(this1);
		return d;
	}
};
thx_Dates.snapPrev = function(date,period) {
	{
		var this1 = thx__$Timestamp_Timestamp_$Impl_$.snapPrev(date.getTime(),period);
		var d = new Date();
		d.setTime(this1);
		return d;
	}
};
thx_Dates.snapTo = function(date,period) {
	{
		var this1 = thx__$Timestamp_Timestamp_$Impl_$.snapTo(date.getTime(),period);
		var d = new Date();
		d.setTime(this1);
		return d;
	}
};
thx_Dates.jump = function(date,period,amount) {
	var sec = date.getSeconds();
	var min = date.getMinutes();
	var hour = date.getHours();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();
	switch(period[1]) {
	case 0:
		sec += amount;
		break;
	case 1:
		min += amount;
		break;
	case 2:
		hour += amount;
		break;
	case 3:
		day += amount;
		break;
	case 4:
		day += amount * 7;
		break;
	case 5:
		month += amount;
		break;
	case 6:
		year += amount;
		break;
	}
	return thx_Dates.create(year,month,day,hour,min,sec);
};
thx_Dates.max = function(self,other) {
	if(self.getTime() > other.getTime()) return self; else return other;
};
thx_Dates.min = function(self,other) {
	if(self.getTime() < other.getTime()) return self; else return other;
};
thx_Dates.snapToWeekDay = function(date,day,firstDayOfWk) {
	if(firstDayOfWk == null) firstDayOfWk = 0;
	var d = date.getDay();
	var s = day;
	if(s < firstDayOfWk) s = s + 7;
	if(d < firstDayOfWk) d = d + 7;
	return thx_Dates.jump(date,thx_TimePeriod.Day,s - d);
};
thx_Dates.snapNextWeekDay = function(date,day) {
	var d = date.getDay();
	var s = day;
	if(s < d) s = s + 7;
	return thx_Dates.jump(date,thx_TimePeriod.Day,s - d);
};
thx_Dates.snapPrevWeekDay = function(date,day) {
	var d = date.getDay();
	var s = day;
	if(s > d) s = s - 7;
	return thx_Dates.jump(date,thx_TimePeriod.Day,s - d);
};
thx_Dates.prevYear = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Year,-1);
};
thx_Dates.nextYear = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Year,1);
};
thx_Dates.prevMonth = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Month,-1);
};
thx_Dates.nextMonth = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Month,1);
};
thx_Dates.prevWeek = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Week,-1);
};
thx_Dates.nextWeek = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Week,1);
};
thx_Dates.prevDay = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Day,-1);
};
thx_Dates.nextDay = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Day,1);
};
thx_Dates.prevHour = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Hour,-1);
};
thx_Dates.nextHour = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Hour,1);
};
thx_Dates.prevMinute = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Minute,-1);
};
thx_Dates.nextMinute = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Minute,1);
};
thx_Dates.prevSecond = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Second,-1);
};
thx_Dates.nextSecond = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Second,1);
};
thx_Dates.withYear = function(date,year) {
	return thx_Dates.create(year,date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
};
thx_Dates.withMonth = function(date,month) {
	return thx_Dates.create(date.getFullYear(),month,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
};
thx_Dates.withDay = function(date,day) {
	return thx_Dates.create(date.getFullYear(),date.getMonth(),day,date.getHours(),date.getMinutes(),date.getSeconds());
};
thx_Dates.withHour = function(date,hour) {
	return thx_Dates.create(date.getFullYear(),date.getMonth(),date.getDate(),hour,date.getMinutes(),date.getSeconds());
};
thx_Dates.withMinute = function(date,minute) {
	return thx_Dates.create(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),minute,date.getSeconds());
};
thx_Dates.withSecond = function(date,second) {
	return thx_Dates.create(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),second);
};
thx_Dates.parseDate = function(s) {
	try {
		return thx_Either.Right(HxOverrides.strDate(s));
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return thx_Either.Left("" + s + " could not be parsed to a valid Date value.");
	}
};
var thx_Dynamics = function() { };
thx_Dynamics.__name__ = ["thx","Dynamics"];
thx_Dynamics.equals = function(a,b) {
	if(!thx_Types.sameType(a,b)) return false;
	if(a == b) return true;
	{
		var _g = Type["typeof"](a);
		switch(_g[1]) {
		case 2:case 0:case 1:case 3:
			return false;
		case 5:
			return Reflect.compareMethods(a,b);
		case 6:
			var c = _g[2];
			var ca = Type.getClassName(c);
			var cb = Type.getClassName(b == null?null:js_Boot.getClass(b));
			if(ca != cb) return false;
			if(typeof(a) == "string") return false;
			if((a instanceof Array) && a.__enum__ == null) {
				var aa = a;
				var ab = b;
				if(aa.length != ab.length) return false;
				var _g2 = 0;
				var _g1 = aa.length;
				while(_g2 < _g1) {
					var i = _g2++;
					if(!thx_Dynamics.equals(aa[i],ab[i])) return false;
				}
				return true;
			}
			if(js_Boot.__instanceof(a,Date)) return a.getTime() == b.getTime();
			if(js_Boot.__instanceof(a,haxe_IMap)) {
				var ha = a;
				var hb = b;
				var ka = thx_Iterators.toArray(ha.keys());
				var kb = thx_Iterators.toArray(hb.keys());
				if(ka.length != kb.length) return false;
				var _g11 = 0;
				while(_g11 < ka.length) {
					var key = ka[_g11];
					++_g11;
					if(!hb.exists(key) || !thx_Dynamics.equals(ha.get(key),hb.get(key))) return false;
				}
				return true;
			}
			var t = false;
			if((t = thx_Iterators.isIterator(a)) || thx_Iterables.isIterable(a)) {
				var va;
				if(t) va = thx_Iterators.toArray(a); else va = thx_Iterators.toArray($iterator(a)());
				var vb;
				if(t) vb = thx_Iterators.toArray(b); else vb = thx_Iterators.toArray($iterator(b)());
				if(va.length != vb.length) return false;
				var _g21 = 0;
				var _g12 = va.length;
				while(_g21 < _g12) {
					var i1 = _g21++;
					if(!thx_Dynamics.equals(va[i1],vb[i1])) return false;
				}
				return true;
			}
			var f = null;
			if(Object.prototype.hasOwnProperty.call(a,"equals") && Reflect.isFunction(f = Reflect.field(a,"equals"))) return f.apply(a,[b]);
			var fields = Type.getInstanceFields(a == null?null:js_Boot.getClass(a));
			var _g13 = 0;
			while(_g13 < fields.length) {
				var field = fields[_g13];
				++_g13;
				var va1 = Reflect.field(a,field);
				if(Reflect.isFunction(va1)) continue;
				var vb1 = Reflect.field(b,field);
				if(!thx_Dynamics.equals(va1,vb1)) return false;
			}
			return true;
		case 7:
			var e = _g[2];
			var ea = Type.getEnumName(e);
			var teb = Type.getEnum(b);
			var eb = Type.getEnumName(teb);
			if(ea != eb) return false;
			if(a[1] != b[1]) return false;
			var pa = a.slice(2);
			var pb = b.slice(2);
			var _g22 = 0;
			var _g14 = pa.length;
			while(_g22 < _g14) {
				var i2 = _g22++;
				if(!thx_Dynamics.equals(pa[i2],pb[i2])) return false;
			}
			return true;
		case 4:
			var fa = Reflect.fields(a);
			var fb = Reflect.fields(b);
			var _g15 = 0;
			while(_g15 < fa.length) {
				var field1 = fa[_g15];
				++_g15;
				HxOverrides.remove(fb,field1);
				if(!Object.prototype.hasOwnProperty.call(b,field1)) return false;
				var va2 = Reflect.field(a,field1);
				if(Reflect.isFunction(va2)) continue;
				var vb2 = Reflect.field(b,field1);
				if(!thx_Dynamics.equals(va2,vb2)) return false;
			}
			if(fb.length > 0) return false;
			var t1 = false;
			if((t1 = thx_Iterators.isIterator(a)) || thx_Iterables.isIterable(a)) {
				if(t1 && !thx_Iterators.isIterator(b)) return false;
				if(!t1 && !thx_Iterables.isIterable(b)) return false;
				var aa1;
				if(t1) aa1 = thx_Iterators.toArray(a); else aa1 = thx_Iterators.toArray($iterator(a)());
				var ab1;
				if(t1) ab1 = thx_Iterators.toArray(b); else ab1 = thx_Iterators.toArray($iterator(b)());
				if(aa1.length != ab1.length) return false;
				var _g23 = 0;
				var _g16 = aa1.length;
				while(_g23 < _g16) {
					var i3 = _g23++;
					if(!thx_Dynamics.equals(aa1[i3],ab1[i3])) return false;
				}
				return true;
			}
			return true;
		case 8:
			throw new js__$Boot_HaxeError("Unable to compare two unknown types");
			break;
		}
	}
	throw new thx_Error("Unable to compare values: " + Std.string(a) + " and " + Std.string(b),null,{ fileName : "Dynamics.hx", lineNumber : 153, className : "thx.Dynamics", methodName : "equals"});
};
thx_Dynamics.clone = function(v,cloneInstances) {
	if(cloneInstances == null) cloneInstances = false;
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 0:
			return null;
		case 1:case 2:case 3:case 7:case 8:case 5:
			return v;
		case 4:
			return thx_Objects.copyTo(v,{ });
		case 6:
			var c = _g[2];
			var name = Type.getClassName(c);
			switch(name) {
			case "Array":
				return v.map(function(v1) {
					return thx_Dynamics.clone(v1,cloneInstances);
				});
			case "String":case "Date":
				return v;
			default:
				if(cloneInstances) {
					var o = Type.createEmptyInstance(c);
					var _g1 = 0;
					var _g2 = Type.getInstanceFields(c);
					while(_g1 < _g2.length) {
						var field = _g2[_g1];
						++_g1;
						Reflect.setField(o,field,thx_Dynamics.clone(Reflect.field(v,field),cloneInstances));
					}
					return o;
				} else return v;
			}
			break;
		}
	}
};
thx_Dynamics.compare = function(a,b) {
	if(null == a && null == b) return 0;
	if(null == a) return -1;
	if(null == b) return 1;
	if(!thx_Types.sameType(a,b)) return thx_Strings.compare(thx_Types.valueTypeToString(a),thx_Types.valueTypeToString(b));
	{
		var _g = Type["typeof"](a);
		switch(_g[1]) {
		case 1:
			return thx_Ints.compare(a,b);
		case 2:
			return thx_Floats.compare(a,b);
		case 3:
			return thx_Bools.compare(a,b);
		case 4:
			return thx_Objects.compare(a,b);
		case 6:
			var c = _g[2];
			var name = Type.getClassName(c);
			switch(name) {
			case "Array":
				return thx_Arrays.compare(a,b);
			case "String":
				return thx_Strings.compare(a,b);
			case "Date":
				return thx_Dates.compare(a,b);
			default:
				if(Object.prototype.hasOwnProperty.call(a,"compare")) return Reflect.callMethod(a,Reflect.field(a,"compare"),[b]); else return haxe_Utf8.compare(Std.string(a),Std.string(b));
			}
			break;
		case 7:
			var e = _g[2];
			return thx_Enums.compare(a,b);
		default:
			return 0;
		}
	}
};
thx_Dynamics.string = function(v) {
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 0:
			return "null";
		case 1:case 2:case 3:
			return "" + Std.string(v);
		case 4:
			return thx_Objects.string(v);
		case 6:
			var c = _g[2];
			var _g1 = Type.getClassName(c);
			switch(_g1) {
			case "Array":
				return thx_Arrays.string(v);
			case "String":
				return v;
			case "Date":
				return HxOverrides.dateStr(v);
			default:
				if(js_Boot.__instanceof(v,haxe_IMap)) return thx_Maps.string(v); else return Std.string(v);
			}
			break;
		case 7:
			var e = _g[2];
			return thx_Enums.string(v);
		case 8:
			return "<unknown>";
		case 5:
			return "<function>";
		}
	}
};
var thx_DynamicsT = function() { };
thx_DynamicsT.__name__ = ["thx","DynamicsT"];
thx_DynamicsT.isEmpty = function(o) {
	return Reflect.fields(o).length == 0;
};
thx_DynamicsT.exists = function(o,name) {
	return Object.prototype.hasOwnProperty.call(o,name);
};
thx_DynamicsT.fields = function(o) {
	return Reflect.fields(o);
};
thx_DynamicsT.merge = function(to,from,replacef) {
	if(null == replacef) replacef = function(field,oldv,newv) {
		return newv;
	};
	var _g = 0;
	var _g1 = Reflect.fields(from);
	while(_g < _g1.length) {
		var field1 = _g1[_g];
		++_g;
		var newv1 = Reflect.field(from,field1);
		if(Object.prototype.hasOwnProperty.call(to,field1)) Reflect.setField(to,field1,replacef(field1,Reflect.field(to,field1),newv1)); else to[field1] = newv1;
	}
	return to;
};
thx_DynamicsT.size = function(o) {
	return Reflect.fields(o).length;
};
thx_DynamicsT.values = function(o) {
	return Reflect.fields(o).map(function(key) {
		return Reflect.field(o,key);
	});
};
thx_DynamicsT.tuples = function(o) {
	return Reflect.fields(o).map(function(key) {
		var _1 = Reflect.field(o,key);
		return { _0 : key, _1 : _1};
	});
};
var thx_Either = { __ename__ : ["thx","Either"], __constructs__ : ["Left","Right"] };
thx_Either.Left = function(value) { var $x = ["Left",0,value]; $x.__enum__ = thx_Either; $x.toString = $estr; return $x; };
thx_Either.Right = function(value) { var $x = ["Right",1,value]; $x.__enum__ = thx_Either; $x.toString = $estr; return $x; };
var thx_Eithers = function() { };
thx_Eithers.__name__ = ["thx","Eithers"];
thx_Eithers.isLeft = function(either) {
	switch(either[1]) {
	case 0:
		return true;
	case 1:
		return false;
	}
};
thx_Eithers.isRight = function(either) {
	switch(either[1]) {
	case 0:
		return false;
	case 1:
		return true;
	}
};
thx_Eithers.toLeft = function(either) {
	switch(either[1]) {
	case 0:
		var v = either[2];
		return haxe_ds_Option.Some(v);
	case 1:
		return haxe_ds_Option.None;
	}
};
thx_Eithers.toRight = function(either) {
	switch(either[1]) {
	case 0:
		return haxe_ds_Option.None;
	case 1:
		var v = either[2];
		return haxe_ds_Option.Some(v);
	}
};
thx_Eithers.toLeftUnsafe = function(either) {
	switch(either[1]) {
	case 0:
		var v = either[2];
		return v;
	case 1:
		return null;
	}
};
thx_Eithers.toRightUnsafe = function(either) {
	switch(either[1]) {
	case 0:
		return null;
	case 1:
		var v = either[2];
		return v;
	}
};
thx_Eithers.map = function(either,f) {
	switch(either[1]) {
	case 0:
		var v = either[2];
		return thx_Either.Left(v);
	case 1:
		var v1 = either[2];
		return thx_Either.Right(f(v1));
	}
};
thx_Eithers.flatMap = function(either,f) {
	switch(either[1]) {
	case 0:
		var v = either[2];
		return thx_Either.Left(v);
	case 1:
		var v1 = either[2];
		return f(v1);
	}
};
thx_Eithers.leftMap = function(either,f) {
	switch(either[1]) {
	case 0:
		var v = either[2];
		return thx_Either.Left(f(v));
	case 1:
		var v1 = either[2];
		return thx_Either.Right(v1);
	}
};
thx_Eithers.orThrow = function(either,message) {
	switch(either[1]) {
	case 0:
		var v = either[2];
		throw new thx_Error("" + message + ": " + Std.string(v),null,{ fileName : "Eithers.hx", lineNumber : 93, className : "thx.Eithers", methodName : "orThrow"});
		break;
	case 1:
		var v1 = either[2];
		return v1;
	}
};
thx_Eithers.toVNel = function(either) {
	switch(either[1]) {
	case 0:
		var e = either[2];
		return thx_Either.Left(thx__$Nel_Nel_$Impl_$.pure(e));
	case 1:
		var v = either[2];
		return thx_Either.Right(v);
	}
};
thx_Eithers.cata = function(either,l,r) {
	switch(either[1]) {
	case 0:
		var l0 = either[2];
		return l(l0);
	case 1:
		var r0 = either[2];
		return r(r0);
	}
};
var thx_Enums = function() { };
thx_Enums.__name__ = ["thx","Enums"];
thx_Enums.string = function(e) {
	var cons = e[0];
	var params = [];
	var _g = 0;
	var _g1 = e.slice(2);
	while(_g < _g1.length) {
		var param = _g1[_g];
		++_g;
		params.push(thx_Dynamics.string(param));
	}
	return cons + (params.length == 0?"":"(" + params.join(", ") + ")");
};
thx_Enums.compare = function(a,b) {
	var v = a[1] - b[1];
	if(v != 0) return v;
	return thx_Arrays.compare(a.slice(2),b.slice(2));
};
thx_Enums.sameConstructor = function(a,b) {
	return a[1] == b[1];
};
thx_Enums.min = function(a,b) {
	if(thx_Enums.compare(a,b) < 0) return a; else return b;
};
thx_Enums.max = function(a,b) {
	if(thx_Enums.compare(a,b) > 0) return a; else return b;
};
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
thx_Error.__name__ = ["thx","Error"];
thx_Error.fromDynamic = function(err,pos) {
	if(js_Boot.__instanceof(err,thx_Error)) return err;
	return new thx_error_ErrorWrapper("" + Std.string(err),err,null,pos);
};
thx_Error.__super__ = Error;
thx_Error.prototype = $extend(Error.prototype,{
	pos: null
	,stackItems: null
	,toString: function() {
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
var thx_Functions0 = function() { };
thx_Functions0.__name__ = ["thx","Functions0"];
thx_Functions0.after = function(callback,n) {
	return function() {
		if(--n == 0) callback();
	};
};
thx_Functions0.join = function(fa,fb) {
	return function() {
		fa();
		fb();
	};
};
thx_Functions0.once = function(f) {
	return function() {
		var t = f;
		f = thx_Functions.noop;
		t();
	};
};
thx_Functions0.negate = function(callback) {
	return function() {
		return !callback();
	};
};
thx_Functions0.times = function(n,callback) {
	return function() {
		return thx_Ints.range(n).map(function(_) {
			return callback();
		});
	};
};
thx_Functions0.timesi = function(n,callback) {
	return function() {
		return thx_Ints.range(n).map(function(i) {
			return callback(i);
		});
	};
};
var thx_Functions1 = function() { };
thx_Functions1.__name__ = ["thx","Functions1"];
thx_Functions1.compose = function(fa,fb) {
	return function(v) {
		return fa(fb(v));
	};
};
thx_Functions1.map = function(fab,fbc) {
	return function(a) {
		return fbc(fab(a));
	};
};
thx_Functions1.contramap = function(fbc,fab) {
	return function(a) {
		return fbc(fab(a));
	};
};
thx_Functions1.join = function(fa,fb) {
	return function(v) {
		fa(v);
		fb(v);
	};
};
thx_Functions1.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v) {
		return "" + Std.string(v);
	};
	var map = new haxe_ds_StringMap();
	return function(v1) {
		var key = resolver(v1);
		if(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key)) return __map_reserved[key] != null?map.getReserved(key):map.h[key];
		var result = callback(v1);
		if(__map_reserved[key] != null) map.setReserved(key,result); else map.h[key] = result;
		return result;
	};
};
thx_Functions1.negate = function(callback) {
	return function(v) {
		return !callback(v);
	};
};
thx_Functions1.noop = function(_) {
};
thx_Functions1.times = function(n,callback) {
	return function(value) {
		return thx_Ints.range(n).map(function(_) {
			return callback(value);
		});
	};
};
thx_Functions1.timesi = function(n,callback) {
	return function(value) {
		return thx_Ints.range(n).map(function(i) {
			return callback(value,i);
		});
	};
};
thx_Functions1.swapArguments = function(callback) {
	return function(a2,a1) {
		return callback(a1,a2);
	};
};
var thx_Functions2 = function() { };
thx_Functions2.__name__ = ["thx","Functions2"];
thx_Functions2.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v1,v2) {
		return "" + Std.string(v1) + ":" + Std.string(v2);
	};
	var map = new haxe_ds_StringMap();
	return function(v11,v21) {
		var key = resolver(v11,v21);
		if(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key)) return __map_reserved[key] != null?map.getReserved(key):map.h[key];
		var result = callback(v11,v21);
		if(__map_reserved[key] != null) map.setReserved(key,result); else map.h[key] = result;
		return result;
	};
};
thx_Functions2.curry = function(f) {
	return function(a) {
		return function(b) {
			return f(a,b);
		};
	};
};
thx_Functions2.negate = function(callback) {
	return function(v1,v2) {
		return !callback(v1,v2);
	};
};
var thx_Functions3 = function() { };
thx_Functions3.__name__ = ["thx","Functions3"];
thx_Functions3.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v1,v2,v3) {
		return "" + Std.string(v1) + ":" + Std.string(v2) + ":" + Std.string(v3);
	};
	var map = new haxe_ds_StringMap();
	return function(v11,v21,v31) {
		var key = resolver(v11,v21,v31);
		if(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key)) return __map_reserved[key] != null?map.getReserved(key):map.h[key];
		var result = callback(v11,v21,v31);
		if(__map_reserved[key] != null) map.setReserved(key,result); else map.h[key] = result;
		return result;
	};
};
thx_Functions3.negate = function(callback) {
	return function(v1,v2,v3) {
		return !callback(v1,v2,v3);
	};
};
thx_Functions3.curry = function(f) {
	return function(a,b) {
		return function(c) {
			return f(a,b,c);
		};
	};
};
var thx_Functions4 = function() { };
thx_Functions4.__name__ = ["thx","Functions4"];
thx_Functions4.curry = function(f) {
	return function(a,b,c) {
		return function(d) {
			return f(a,b,c,d);
		};
	};
};
var thx_Functions5 = function() { };
thx_Functions5.__name__ = ["thx","Functions5"];
thx_Functions5.curry = function(f) {
	return function(a,b,c,d) {
		return function(e) {
			return f(a,b,c,d,e);
		};
	};
};
var thx_Functions6 = function() { };
thx_Functions6.__name__ = ["thx","Functions6"];
thx_Functions6.curry = function(f) {
	return function(a,b,c,d,e) {
		return function(f0) {
			return f(a,b,c,d,e,f0);
		};
	};
};
var thx_Functions7 = function() { };
thx_Functions7.__name__ = ["thx","Functions7"];
thx_Functions7.curry = function(f) {
	return function(a,b,c,d,e,f0) {
		return function(g) {
			return f(a,b,c,d,e,f0,g);
		};
	};
};
var thx_Functions8 = function() { };
thx_Functions8.__name__ = ["thx","Functions8"];
thx_Functions8.curry = function(f) {
	return function(a,b,c,d,e,f0,g) {
		return function(h) {
			return f(a,b,c,d,e,f0,g,h);
		};
	};
};
var thx_Functions9 = function() { };
thx_Functions9.__name__ = ["thx","Functions9"];
thx_Functions9.curry = function(f) {
	return function(a,b,c,d,e,f0,g,h) {
		return function(i) {
			return f(a,b,c,d,e,f0,g,h,i);
		};
	};
};
var thx__$Functions_Reader_$Impl_$ = {};
thx__$Functions_Reader_$Impl_$.__name__ = ["thx","_Functions","Reader_Impl_"];
thx__$Functions_Reader_$Impl_$.flatMap = function(this1,f) {
	return function(a) {
		return (f(this1(a)))(a);
	};
};
var thx_Functions = function() { };
thx_Functions.__name__ = ["thx","Functions"];
thx_Functions.equality = function(a,b) {
	return a == b;
};
thx_Functions.identity = function(value) {
	return value;
};
thx_Functions.noop = function() {
};
var thx_Ints = function() { };
thx_Ints.__name__ = ["thx","Ints"];
thx_Ints.abs = function(v) {
	if(v < 0) return -v; else return v;
};
thx_Ints.canParse = function(s) {
	return thx_Ints.pattern_parse.match(s);
};
thx_Ints.clamp = function(v,min,max) {
	if(v < min) return min; else if(v > max) return max; else return v;
};
thx_Ints.clampSym = function(v,max) {
	return thx_Ints.clamp(v,-max,max);
};
thx_Ints.compare = function(a,b) {
	return a - b;
};
thx_Ints.gcd = function(m,n) {
	if(m < 0) m = -m; else m = m;
	if(n < 0) n = -n; else n = n;
	if(n == 0) return m;
	return thx_Ints.gcd(n,m % n);
};
thx_Ints.interpolate = function(f,a,b) {
	return Math.round(a + (b - a) * f);
};
thx_Ints.isEven = function(v) {
	return v % 2 == 0;
};
thx_Ints.isOdd = function(v) {
	return v % 2 != 0;
};
thx_Ints.lpad = function(v,pad,len) {
	if(pad == null) pad = "0";
	var neg = false;
	if(v < 0) {
		neg = true;
		v = -v;
	}
	return (neg?"-":"") + StringTools.lpad("" + v,pad,len);
};
thx_Ints.lcm = function(m,n) {
	if(m < 0) m = -m; else m = m;
	if(n < 0) n = -n; else n = n;
	if(n == 0) return m;
	return m * Std["int"](n / thx_Ints.gcd(m,n));
};
thx_Ints.rpad = function(v,pad,len) {
	if(pad == null) pad = "0";
	return StringTools.rpad("" + v,pad,len);
};
thx_Ints.max = function(a,b) {
	if(a > b) return a; else return b;
};
thx_Ints.min = function(a,b) {
	if(a < b) return a; else return b;
};
thx_Ints.parse = function(s,base) {
	if(null == base) {
		if(s.substring(0,2) == "0x") base = 16; else base = 10;
	}
	var v = parseInt(s,base);
	if(isNaN(v)) return null; else return v;
};
thx_Ints.random = function(min,max) {
	if(min == null) min = 0;
	return Std.random(max + 1) + min;
};
thx_Ints.range = function(start,stop,step) {
	if(step == null) step = 1;
	if(null == stop) {
		stop = start;
		start = 0;
	}
	if((stop - start) / step == Infinity) throw new js__$Boot_HaxeError("infinite range");
	var range = [];
	var i = -1;
	var j;
	if(step < 0) while((j = start + step * ++i) > stop) range.push(j); else while((j = start + step * ++i) < stop) range.push(j);
	return range;
};
thx_Ints.rangeIter = function(start,stop,step) {
	if(step == null) step = 1;
	return new thx_RangeIterator(start,stop,step);
};
thx_Ints.toString = function(value,base) {
	return value.toString(base);
};
thx_Ints.toBase = function(value,base) {
	return value.toString(base);
};
thx_Ints.toBool = function(v) {
	return v != 0;
};
thx_Ints.toInt = function(s,base) {
	return thx_Ints.parse(s,base);
};
thx_Ints.sign = function(value) {
	if(value < 0) return -1; else return 1;
};
thx_Ints.wrapCircular = function(v,max) {
	v = v % max;
	if(v < 0) v += max;
	return v;
};
var thx_RangeIterator = function(start,stop,step) {
	if(step == null) step = 1;
	this.current = start;
	this.stop = stop;
	this.step = step;
};
thx_RangeIterator.__name__ = ["thx","RangeIterator"];
thx_RangeIterator.prototype = {
	current: null
	,stop: null
	,step: null
	,hasNext: function() {
		return this.stop == null || this.step >= 0 && this.current < this.stop || this.step < 0 && this.current > this.stop;
	}
	,next: function() {
		var result = this.current;
		this.current += this.step;
		return result;
	}
	,__class__: thx_RangeIterator
};
var thx_Iterables = function() { };
thx_Iterables.__name__ = ["thx","Iterables"];
thx_Iterables.all = function(it,predicate) {
	return thx_Iterators.all($iterator(it)(),predicate);
};
thx_Iterables.any = function(it,predicate) {
	return thx_Iterators.any($iterator(it)(),predicate);
};
thx_Iterables.eachPair = function(it,handler) {
	thx_Iterators.eachPair($iterator(it)(),handler);
	return;
};
thx_Iterables.equals = function(a,b,equality) {
	return thx_Iterators.equals($iterator(a)(),$iterator(b)(),equality);
};
thx_Iterables.filter = function(it,predicate) {
	return thx_Iterators.filter($iterator(it)(),predicate);
};
thx_Iterables.find = function(it,predicate) {
	return thx_Iterators.find($iterator(it)(),predicate);
};
thx_Iterables.findOption = function(it,predicate) {
	return thx_Options.ofValue(thx_Iterators.find($iterator(it)(),predicate));
};
thx_Iterables.first = function(it) {
	return thx_Iterators.first($iterator(it)());
};
thx_Iterables.get = function(it,index) {
	return thx_Iterators.get($iterator(it)(),index);
};
thx_Iterables.getOption = function(it,index) {
	return thx_Options.ofValue(thx_Iterators.get($iterator(it)(),index));
};
thx_Iterables.last = function(it) {
	return thx_Iterators.last($iterator(it)());
};
thx_Iterables.hasElements = function(it) {
	return thx_Iterators.hasElements($iterator(it)());
};
thx_Iterables.indexOf = function(it,element) {
	return thx_Iterators.indexOf($iterator(it)(),element);
};
thx_Iterables.isEmpty = function(it) {
	return thx_Iterators.isEmpty($iterator(it)());
};
thx_Iterables.isIterable = function(v) {
	var fields;
	if(Reflect.isObject(v) && null == Type.getClass(v)) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"iterator")) return false;
	return Reflect.isFunction(Reflect.field(v,"iterator"));
};
thx_Iterables.map = function(it,f) {
	return thx_Iterators.map($iterator(it)(),f);
};
thx_Iterables.fmap = function(it,f) {
	return { iterator : function() {
		return thx_Iterators.fmap($iterator(it)(),f);
	}};
};
thx_Iterables.mapi = function(it,f) {
	return thx_Iterators.mapi($iterator(it)(),f);
};
thx_Iterables.fmapi = function(it,f) {
	return { iterator : function() {
		return thx_Iterators.fmapi($iterator(it)(),f);
	}};
};
thx_Iterables.order = function(it,sort) {
	return thx_Iterators.order($iterator(it)(),sort);
};
thx_Iterables.reduce = function(it,callback,initial) {
	return thx_Iterators.reduce($iterator(it)(),callback,initial);
};
thx_Iterables.reducei = function(it,callback,initial) {
	return thx_Iterators.reducei($iterator(it)(),callback,initial);
};
thx_Iterables.toArray = function(it) {
	return thx_Iterators.toArray($iterator(it)());
};
thx_Iterables.minBy = function(it,f,ord) {
	var found = haxe_ds_Option.None;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var a = $it0.next();
		var a1 = [a];
		if(thx_Options.any(found,(function(a1) {
			return function(a0) {
				return ord(f(a0),f(a1[0])) == thx_OrderingImpl.LT;
			};
		})(a1))) found = found; else found = haxe_ds_Option.Some(a1[0]);
	}
	return found;
};
thx_Iterables.maxBy = function(it,f,ord) {
	return thx_Iterables.minBy(it,f,thx__$Ord_Ord_$Impl_$.inverse(ord));
};
thx_Iterables.min = function(it,ord) {
	return thx_Iterables.minBy(it,thx_Functions.identity,ord);
};
thx_Iterables.max = function(it,ord) {
	return thx_Iterables.min(it,thx__$Ord_Ord_$Impl_$.inverse(ord));
};
thx_Iterables.extremaBy = function(it,f,ord) {
	var found = haxe_ds_Option.None;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var a = $it0.next();
		switch(found[1]) {
		case 1:
			found = haxe_ds_Option.Some({ _0 : a, _1 : a});
			break;
		case 0:
			var t = found[2];
			if(ord(f(a),f(t._0)) == thx_OrderingImpl.LT) found = haxe_ds_Option.Some({ _0 : a, _1 : t._1}); else {
				var t1 = found[2];
				if(ord(f(a),f(t1._1)) == thx_OrderingImpl.GT) found = haxe_ds_Option.Some({ _0 : t1._0, _1 : a}); else found = found;
			}
			break;
		default:
			found = found;
		}
	}
	return found;
};
thx_Iterables.extrema = function(it,ord) {
	return thx_Iterables.extremaBy(it,thx_Functions.identity,ord);
};
thx_Iterables.unzip = function(it) {
	return thx_Iterators.unzip($iterator(it)());
};
thx_Iterables.unzip3 = function(it) {
	return thx_Iterators.unzip3($iterator(it)());
};
thx_Iterables.unzip4 = function(it) {
	return thx_Iterators.unzip4($iterator(it)());
};
thx_Iterables.unzip5 = function(it) {
	return thx_Iterators.unzip5($iterator(it)());
};
thx_Iterables.zip = function(it1,it2) {
	return thx_Iterators.zip($iterator(it1)(),$iterator(it2)());
};
thx_Iterables.zip3 = function(it1,it2,it3) {
	return thx_Iterators.zip3($iterator(it1)(),$iterator(it2)(),$iterator(it3)());
};
thx_Iterables.zip4 = function(it1,it2,it3,it4) {
	return thx_Iterators.zip4($iterator(it1)(),$iterator(it2)(),$iterator(it3)(),$iterator(it4)());
};
thx_Iterables.zip5 = function(it1,it2,it3,it4,it5) {
	return thx_Iterators.zip5($iterator(it1)(),$iterator(it2)(),$iterator(it3)(),$iterator(it4)(),$iterator(it5)());
};
var thx_Iterators = function() { };
thx_Iterators.__name__ = ["thx","Iterators"];
thx_Iterators.all = function(it,predicate) {
	while( it.hasNext() ) {
		var element = it.next();
		if(!predicate(element)) return false;
	}
	return true;
};
thx_Iterators.any = function(it,predicate) {
	while( it.hasNext() ) {
		var element = it.next();
		if(predicate(element)) return true;
	}
	return false;
};
thx_Iterators.equals = function(a,b,equality) {
	if(null == equality) equality = thx_Functions.equality;
	var ae;
	var be;
	var an;
	var bn;
	while(true) {
		an = a.hasNext();
		bn = b.hasNext();
		if(!an && !bn) return true;
		if(!an || !bn) return false;
		if(!equality(a.next(),b.next())) return false;
	}
};
thx_Iterators.get = function(it,index) {
	var pos = 0;
	while( it.hasNext() ) {
		var i = it.next();
		if(pos++ == index) return i;
	}
	return null;
};
thx_Iterators.getOption = function(it,index) {
	return thx_Options.ofValue(thx_Iterators.get(it,index));
};
thx_Iterators.eachPair = function(it,handler) {
	thx_Arrays.eachPair(thx_Iterators.toArray(it),handler);
};
thx_Iterators.filter = function(it,predicate) {
	return thx_Iterators.reduce(it,function(acc,element) {
		if(predicate(element)) acc.push(element);
		return acc;
	},[]);
};
thx_Iterators.find = function(it,f) {
	while( it.hasNext() ) {
		var element = it.next();
		if(f(element)) return element;
	}
	return null;
};
thx_Iterators.findOption = function(it,f) {
	return thx_Options.ofValue(thx_Iterators.find(it,f));
};
thx_Iterators.first = function(it) {
	if(it.hasNext()) return it.next(); else return null;
};
thx_Iterators.hasElements = function(it) {
	return it.hasNext();
};
thx_Iterators.indexOf = function(it,element) {
	var pos = 0;
	while( it.hasNext() ) {
		var v = it.next();
		if(element == v) return pos;
		pos++;
	}
	return -1;
};
thx_Iterators.isEmpty = function(it) {
	return !it.hasNext();
};
thx_Iterators.isIterator = function(v) {
	var fields;
	if(Reflect.isObject(v) && null == Type.getClass(v)) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"next") || !Lambda.has(fields,"hasNext")) return false;
	return Reflect.isFunction(Reflect.field(v,"next")) && Reflect.isFunction(Reflect.field(v,"hasNext"));
};
thx_Iterators.last = function(it) {
	var buf = null;
	while(it.hasNext()) buf = it.next();
	return buf;
};
thx_Iterators.forEach = function(it,proc) {
	while(it.hasNext()) proc(it.next());
};
thx_Iterators.map = function(it,f) {
	var acc = [];
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v));
	}
	return acc;
};
thx_Iterators.fmap = function(it,f) {
	return new thx_MapIterator(it,f);
};
thx_Iterators.mapi = function(it,f) {
	var acc = [];
	var i = 0;
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v,i++));
	}
	return acc;
};
thx_Iterators.fmapi = function(it,f) {
	return new thx_MapIIterator(it,f);
};
thx_Iterators.order = function(it,sort) {
	var n = thx_Iterators.toArray(it);
	n.sort(sort);
	return n;
};
thx_Iterators.reduce = function(it,callback,initial) {
	var result = initial;
	while(it.hasNext()) result = callback(result,it.next());
	return result;
};
thx_Iterators.reducei = function(it,callback,initial) {
	thx_Iterators.mapi(it,function(v,i) {
		initial = callback(initial,v,i);
	});
	return initial;
};
thx_Iterators.foldLeft = function(it,zero,f) {
	return thx_Iterators.reduce(it,f,zero);
};
thx_Iterators.foldMap = function(it,f,m) {
	return thx_Iterators.foldLeft(thx_Iterators.fmap(it,f),thx__$Monoid_Monoid_$Impl_$.get_zero(m),(function(_e) {
		return function(a0,a1) {
			return thx__$Monoid_Monoid_$Impl_$.append(_e,a0,a1);
		};
	})(m));
};
thx_Iterators.toArray = function(it) {
	var elements = [];
	while( it.hasNext() ) {
		var element = it.next();
		elements.push(element);
	}
	return elements;
};
thx_Iterators.unzip = function(it) {
	var a1 = [];
	var a2 = [];
	thx_Iterators.forEach(it,function(t) {
		a1.push(t._0);
		a2.push(t._1);
	});
	return { _0 : a1, _1 : a2};
};
thx_Iterators.unzip3 = function(it) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	thx_Iterators.forEach(it,function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
	});
	return { _0 : a1, _1 : a2, _2 : a3};
};
thx_Iterators.unzip4 = function(it) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	thx_Iterators.forEach(it,function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4};
};
thx_Iterators.unzip5 = function(it) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	var a5 = [];
	thx_Iterators.forEach(it,function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
		a5.push(t._4);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4, _4 : a5};
};
thx_Iterators.zip = function(it1,it2) {
	var array = [];
	while(it1.hasNext() && it2.hasNext()) array.push((function($this) {
		var $r;
		var _0 = it1.next();
		var _1 = it2.next();
		$r = { _0 : _0, _1 : _1};
		return $r;
	}(this)));
	return array;
};
thx_Iterators.zip3 = function(it1,it2,it3) {
	var array = [];
	while(it1.hasNext() && it2.hasNext() && it3.hasNext()) array.push((function($this) {
		var $r;
		var _0 = it1.next();
		var _1 = it2.next();
		var _2 = it3.next();
		$r = { _0 : _0, _1 : _1, _2 : _2};
		return $r;
	}(this)));
	return array;
};
thx_Iterators.zip4 = function(it1,it2,it3,it4) {
	var array = [];
	while(it1.hasNext() && it2.hasNext() && it3.hasNext() && it4.hasNext()) array.push((function($this) {
		var $r;
		var _0 = it1.next();
		var _1 = it2.next();
		var _2 = it3.next();
		var _3 = it4.next();
		$r = { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
		return $r;
	}(this)));
	return array;
};
thx_Iterators.zip5 = function(it1,it2,it3,it4,it5) {
	var array = [];
	while(it1.hasNext() && it2.hasNext() && it3.hasNext() && it4.hasNext() && it5.hasNext()) array.push((function($this) {
		var $r;
		var _0 = it1.next();
		var _1 = it2.next();
		var _2 = it3.next();
		var _3 = it4.next();
		var _4 = it5.next();
		$r = { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4};
		return $r;
	}(this)));
	return array;
};
var thx_MapIterator = function(base,f) {
	this.base = base;
	this.f = f;
};
thx_MapIterator.__name__ = ["thx","MapIterator"];
thx_MapIterator.prototype = {
	base: null
	,f: null
	,next: function() {
		return this.f(this.base.next());
	}
	,hasNext: function() {
		return this.base.hasNext();
	}
	,__class__: thx_MapIterator
};
var thx_MapIIterator = function(base,f) {
	this.i = 0;
	this.base = base;
	this.f = f;
};
thx_MapIIterator.__name__ = ["thx","MapIIterator"];
thx_MapIIterator.prototype = {
	base: null
	,f: null
	,i: null
	,next: function() {
		var result = this.f(this.base.next(),this.i);
		this.i++;
		return result;
	}
	,hasNext: function() {
		return this.base.hasNext();
	}
	,__class__: thx_MapIIterator
};
var thx_Maps = function() { };
thx_Maps.__name__ = ["thx","Maps"];
thx_Maps.copyTo = function(src,dst) {
	var $it0 = src.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		dst.set(key,src.get(key));
	}
	return dst;
};
thx_Maps.tuples = function(map) {
	return thx_Iterators.map(map.keys(),function(key) {
		var _1 = map.get(key);
		return { _0 : key, _1 : _1};
	});
};
thx_Maps.mapValues = function(map,f,acc) {
	return thx_Maps.reduce(map,function(m,t) {
		var value = f(t._1);
		m.set(t._0,value);
		return m;
	},acc);
};
thx_Maps.reduce = function(map,f,acc) {
	return thx_Arrays.reduce(thx_Maps.tuples(map),f,acc);
};
thx_Maps.values = function(map) {
	return thx_Iterators.map(map.keys(),function(key) {
		return map.get(key);
	});
};
thx_Maps.foldLeftWithKeys = function(map,f,acc) {
	return thx_Iterators.reduce(map.keys(),function(acc1,k) {
		return f(acc1,k,map.get(k));
	},acc);
};
thx_Maps.getOption = function(map,key) {
	return thx_Options.ofValue(map.get(key));
};
thx_Maps.toObject = function(map) {
	return thx_Arrays.reduce(thx_Maps.tuples(map),function(o,t) {
		o[t._0] = t._1;
		return o;
	},{ });
};
thx_Maps.getAlt = function(map,key,alt) {
	var v = map.get(key);
	if(null == v) return alt; else return v;
};
thx_Maps.isMap = function(v) {
	return js_Boot.__instanceof(v,haxe_IMap);
};
thx_Maps.string = function(m) {
	return "[" + thx_Maps.tuples(m).map(function(t) {
		return thx_Dynamics.string(t._0) + " => " + thx_Dynamics.string(t._1);
	}).join(", ") + "]";
};
thx_Maps.merge = function(dest,sources) {
	return thx_Arrays.reduce(sources,function(result,source) {
		return thx_Iterators.reduce(source.keys(),function(result1,key) {
			result1.set(key,source.get(key));
			return result1;
		},result);
	},dest);
};
var thx__$Monoid_Monoid_$Impl_$ = {};
thx__$Monoid_Monoid_$Impl_$.__name__ = ["thx","_Monoid","Monoid_Impl_"];
thx__$Monoid_Monoid_$Impl_$.get_semigroup = function(this1) {
	return this1.append;
};
thx__$Monoid_Monoid_$Impl_$.get_zero = function(this1) {
	return this1.zero;
};
thx__$Monoid_Monoid_$Impl_$.append = function(this1,a0,a1) {
	return this1.append(a0,a1);
};
var thx__$Nel_Nel_$Impl_$ = {};
thx__$Nel_Nel_$Impl_$.__name__ = ["thx","_Nel","Nel_Impl_"];
thx__$Nel_Nel_$Impl_$.nel = function(hd,tl) {
	{
		var _g = thx__$Nel_Nel_$Impl_$.fromArray(tl);
		switch(_g[1]) {
		case 0:
			var nel = _g[2];
			return thx__$Nel_Nel_$Impl_$.cons(hd,nel);
		case 1:
			return thx__$Nel_Nel_$Impl_$.pure(hd);
		}
	}
};
thx__$Nel_Nel_$Impl_$.pure = function(a) {
	return thx_NonEmptyList.Single(a);
};
thx__$Nel_Nel_$Impl_$.cons = function(a,nl) {
	return thx_NonEmptyList.ConsNel(a,nl);
};
thx__$Nel_Nel_$Impl_$.fromArray = function(arr) {
	if(arr.length == 0) return haxe_ds_Option.None; else {
		var res = thx_NonEmptyList.Single(arr[arr.length - 1]);
		var $it0 = thx_Ints.rangeIter(arr.length - 2,-1,-1);
		while( $it0.hasNext() ) {
			var i = $it0.next();
			res = thx_NonEmptyList.ConsNel(arr[i],res);
		}
		return haxe_ds_Option.Some(res);
	}
};
thx__$Nel_Nel_$Impl_$.map = function(this1,f) {
	return thx__$Nel_Nel_$Impl_$.flatMap(this1,thx_Functions1.compose(thx__$Nel_Nel_$Impl_$.pure,f));
};
thx__$Nel_Nel_$Impl_$.flatMap = function(this1,f) {
	switch(this1[1]) {
	case 0:
		var x = this1[2];
		return f(x);
	case 1:
		var xs = this1[3];
		var x1 = this1[2];
		return thx__$Nel_Nel_$Impl_$.append(f(x1),thx__$Nel_Nel_$Impl_$.flatMap(xs,f));
	}
};
thx__$Nel_Nel_$Impl_$.fold = function(this1,f) {
	switch(this1[1]) {
	case 0:
		var x = this1[2];
		return x;
	case 1:
		var xs = this1[3];
		var x1 = this1[2];
		return f(x1,thx__$Nel_Nel_$Impl_$.fold(xs,f));
	}
};
thx__$Nel_Nel_$Impl_$.append = function(this1,nel) {
	switch(this1[1]) {
	case 0:
		var x = this1[2];
		return thx_NonEmptyList.ConsNel(x,nel);
	case 1:
		var xs = this1[3];
		var x1 = this1[2];
		return thx_NonEmptyList.ConsNel(x1,thx__$Nel_Nel_$Impl_$.append(xs,nel));
	}
};
thx__$Nel_Nel_$Impl_$.toArray = function(this1) {
	var go;
	var go1 = null;
	go1 = function(acc,xs) {
		switch(xs[1]) {
		case 0:
			var x = xs[2];
			return thx_Arrays.append(acc,x);
		case 1:
			var xs1 = xs[3];
			var x1 = xs[2];
			return go1(thx_Arrays.append(acc,x1),xs1);
		}
	};
	go = go1;
	return thx_Arrays.reversed(go([],this1));
};
thx__$Nel_Nel_$Impl_$.semigroup = function() {
	return function(nl,nr) {
		return thx__$Nel_Nel_$Impl_$.append(nl,nr);
	};
};
var thx_NonEmptyList = { __ename__ : ["thx","NonEmptyList"], __constructs__ : ["Single","ConsNel"] };
thx_NonEmptyList.Single = function(x) { var $x = ["Single",0,x]; $x.__enum__ = thx_NonEmptyList; $x.toString = $estr; return $x; };
thx_NonEmptyList.ConsNel = function(x,xs) { var $x = ["ConsNel",1,x,xs]; $x.__enum__ = thx_NonEmptyList; $x.toString = $estr; return $x; };
var thx_Nil = { __ename__ : ["thx","Nil"], __constructs__ : ["nil"] };
thx_Nil.nil = ["nil",0];
thx_Nil.nil.toString = $estr;
thx_Nil.nil.__enum__ = thx_Nil;
var thx_Nulls = function() { };
thx_Nulls.__name__ = ["thx","Nulls"];
var thx_Objects = function() { };
thx_Objects.__name__ = ["thx","Objects"];
thx_Objects.compare = function(a,b) {
	var v;
	var fields;
	if((v = thx_Arrays.compare(fields = Reflect.fields(a),Reflect.fields(b))) != 0) return v;
	var _g = 0;
	while(_g < fields.length) {
		var field = fields[_g];
		++_g;
		if((v = thx_Dynamics.compare(Reflect.field(a,field),Reflect.field(b,field))) != 0) return v;
	}
	return 0;
};
thx_Objects.isEmpty = function(o) {
	return Reflect.fields(o).length == 0;
};
thx_Objects.exists = function(o,name) {
	return Object.prototype.hasOwnProperty.call(o,name);
};
thx_Objects.fields = function(o) {
	return Reflect.fields(o);
};
thx_Objects.combine = function(first,second) {
	var to = { };
	var _g = 0;
	var _g1 = Reflect.fields(first);
	while(_g < _g1.length) {
		var field = _g1[_g];
		++_g;
		Reflect.setField(to,field,Reflect.field(first,field));
	}
	var _g2 = 0;
	var _g11 = Reflect.fields(second);
	while(_g2 < _g11.length) {
		var field1 = _g11[_g2];
		++_g2;
		Reflect.setField(to,field1,Reflect.field(second,field1));
	}
	return to;
};
thx_Objects.assign = function(to,from,replacef) {
	if(null == replacef) replacef = function(field,oldv,newv) {
		return newv;
	};
	var _g = 0;
	var _g1 = Reflect.fields(from);
	while(_g < _g1.length) {
		var field1 = _g1[_g];
		++_g;
		var newv1 = Reflect.field(from,field1);
		if(Object.prototype.hasOwnProperty.call(to,field1)) Reflect.setField(to,field1,replacef(field1,Reflect.field(to,field1),newv1)); else to[field1] = newv1;
	}
	return to;
};
thx_Objects.copyTo = function(src,dst,cloneInstances) {
	if(cloneInstances == null) cloneInstances = false;
	var _g = 0;
	var _g1 = Reflect.fields(src);
	while(_g < _g1.length) {
		var field = _g1[_g];
		++_g;
		var sv = thx_Dynamics.clone(Reflect.field(src,field),cloneInstances);
		var dv = Reflect.field(dst,field);
		if(Reflect.isObject(sv) && null == Type.getClass(sv) && (Reflect.isObject(dv) && null == Type.getClass(dv))) thx_Objects.copyTo(sv,dv); else dst[field] = sv;
	}
	return dst;
};
thx_Objects.clone = function(src,cloneInstances) {
	if(cloneInstances == null) cloneInstances = false;
	return thx_Dynamics.clone(src,cloneInstances);
};
thx_Objects.toMap = function(o) {
	return thx_Arrays.reduce(thx_Objects.tuples(o),function(map,t) {
		var value = t._1;
		map.set(t._0,value);
		return map;
	},new haxe_ds_StringMap());
};
thx_Objects.size = function(o) {
	return Reflect.fields(o).length;
};
thx_Objects.string = function(o) {
	return "{" + Reflect.fields(o).map(function(key) {
		var v = Reflect.field(o,key);
		var s;
		if(typeof(v) == "string") s = thx_Strings.quote(v); else s = thx_Dynamics.string(v);
		return "" + key + " : " + s;
	}).join(", ") + "}";
};
thx_Objects.stringImpl = function(o,cache) {
};
thx_Objects.values = function(o) {
	return Reflect.fields(o).map(function(key) {
		return Reflect.field(o,key);
	});
};
thx_Objects.tuples = function(o) {
	return Reflect.fields(o).map(function(key) {
		var _1 = Reflect.field(o,key);
		return { _0 : key, _1 : _1};
	});
};
thx_Objects.hasPath = function(o,path) {
	var paths = path.split(".");
	var current = o;
	var _g = 0;
	while(_g < paths.length) {
		var currentPath = paths[_g];
		++_g;
		if(thx_Strings.DIGITS.match(currentPath)) {
			var index = Std.parseInt(currentPath);
			var arr = Std.instance(current,Array);
			if(null == arr || arr.length <= index) return false;
			current = arr[index];
		} else if(Object.prototype.hasOwnProperty.call(current,currentPath)) current = Reflect.field(current,currentPath); else return false;
	}
	return true;
};
thx_Objects.hasPathValue = function(o,path) {
	return thx_Objects.getPath(o,path) != null;
};
thx_Objects.getPath = function(o,path) {
	var paths = path.split(".");
	var current = o;
	var _g = 0;
	while(_g < paths.length) {
		var currentPath = paths[_g];
		++_g;
		if(thx_Strings.DIGITS.match(currentPath)) {
			var index = Std.parseInt(currentPath);
			var arr = Std.instance(current,Array);
			if(null == arr) return null;
			current = arr[index];
		} else if(Object.prototype.hasOwnProperty.call(current,currentPath)) current = Reflect.field(current,currentPath); else return null;
	}
	return current;
};
thx_Objects.getPathOption = function(o,path) {
	return thx_Options.ofValue(thx_Objects.getPath(o,path));
};
thx_Objects.getPathOr = function(o,path,alt) {
	var paths = path.split(".");
	var current = o;
	var _g = 0;
	while(_g < paths.length) {
		var currentPath = paths[_g];
		++_g;
		if(thx_Strings.DIGITS.match(currentPath)) {
			var index = Std.parseInt(currentPath);
			var arr = Std.instance(current,Array);
			if(null == arr) return null;
			current = arr[index];
		} else if(Object.prototype.hasOwnProperty.call(current,currentPath)) current = Reflect.field(current,currentPath); else return alt;
	}
	return current;
};
thx_Objects.setPath = function(o,path,val) {
	var paths = path.split(".");
	var current = o;
	var _g1 = 0;
	var _g = paths.length - 1;
	while(_g1 < _g) {
		var i = _g1++;
		var currentPath = paths[i];
		var nextPath = paths[i + 1];
		if(thx_Strings.DIGITS.match(currentPath) || currentPath == "*") {
			var index;
			if(currentPath == "*") index = current.length; else index = Std.parseInt(currentPath);
			if(current[index] == null) {
				if(thx_Strings.DIGITS.match(nextPath) || nextPath == "*") current[index] = []; else current[index] = { };
			}
			current = current[index];
		} else {
			if(!Object.prototype.hasOwnProperty.call(current,currentPath)) {
				if(thx_Strings.DIGITS.match(nextPath) || nextPath == "*") current[currentPath] = []; else current[currentPath] = { };
			}
			current = Reflect.field(current,currentPath);
		}
	}
	var p = paths[paths.length - 1];
	if(thx_Strings.DIGITS.match(p)) {
		var index1 = Std.parseInt(p);
		current[index1] = val;
	} else if(p == "*") current.push(val); else current[p] = val;
	return o;
};
thx_Objects.removePath = function(o,path) {
	var paths = path.split(".");
	var target = paths.pop();
	try {
		var sub = thx_Arrays.reduce(paths,function(existing,nextPath) {
			if(nextPath == "*") return existing.pop(); else if(thx_Strings.DIGITS.match(nextPath)) {
				var current = existing;
				var index = Std.parseInt(nextPath);
				return current[index];
			} else return Reflect.field(existing,nextPath);
		},o);
		if(null != sub) Reflect.deleteField(sub,target);
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
	}
	return o;
};
var thx_Options = function() { };
thx_Options.__name__ = ["thx","Options"];
thx_Options.ofValue = function(value) {
	if(null == value) return haxe_ds_Option.None; else return haxe_ds_Option.Some(value);
};
thx_Options.maybe = function(value) {
	if(null == value) return haxe_ds_Option.None; else return haxe_ds_Option.Some(value);
};
thx_Options.equals = function(a,b,eq) {
	switch(a[1]) {
	case 1:
		switch(b[1]) {
		case 1:
			return true;
		default:
			return false;
		}
		break;
	case 0:
		switch(b[1]) {
		case 0:
			var a1 = a[2];
			var b1 = b[2];
			if(null == eq) eq = function(a2,b2) {
				return a2 == b2;
			};
			return eq(a1,b1);
		default:
			return false;
		}
		break;
	}
};
thx_Options.equalsValue = function(a,b,eq) {
	return thx_Options.equals(a,null == b?haxe_ds_Option.None:haxe_ds_Option.Some(b),eq);
};
thx_Options.map = function(option,callback) {
	switch(option[1]) {
	case 1:
		return haxe_ds_Option.None;
	case 0:
		var v = option[2];
		return haxe_ds_Option.Some(callback(v));
	}
};
thx_Options.ap = function(option,fopt) {
	switch(option[1]) {
	case 1:
		return haxe_ds_Option.None;
	case 0:
		var v = option[2];
		return thx_Options.map(fopt,function(f) {
			return f(v);
		});
	}
};
thx_Options.flatMap = function(option,callback) {
	switch(option[1]) {
	case 1:
		return haxe_ds_Option.None;
	case 0:
		var v = option[2];
		return callback(v);
	}
};
thx_Options.join = function(option) {
	switch(option[1]) {
	case 1:
		return haxe_ds_Option.None;
	case 0:
		var v = option[2];
		return v;
	}
};
thx_Options.cata = function(option,ifNone,f) {
	switch(option[1]) {
	case 1:
		return ifNone;
	case 0:
		var v = option[2];
		return f(v);
	}
};
thx_Options.foldLeft = function(option,b,f) {
	switch(option[1]) {
	case 1:
		return b;
	case 0:
		var v = option[2];
		return f(b,v);
	}
};
thx_Options.foldMap = function(option,f,m) {
	return thx_Options.foldLeft(thx_Options.map(option,f),thx__$Monoid_Monoid_$Impl_$.get_zero(m),(function(_e) {
		return function(a0,a1) {
			return thx__$Monoid_Monoid_$Impl_$.append(_e,a0,a1);
		};
	})(m));
};
thx_Options.filter = function(option,f) {
	switch(option[1]) {
	case 0:
		var v = option[2];
		if(f(v)) return option; else return haxe_ds_Option.None;
		break;
	default:
		return haxe_ds_Option.None;
	}
};
thx_Options.toArray = function(option) {
	switch(option[1]) {
	case 1:
		return [];
	case 0:
		var v = option[2];
		return [v];
	}
};
thx_Options.toBool = function(option) {
	switch(option[1]) {
	case 1:
		return false;
	case 0:
		return true;
	}
};
thx_Options.isNone = function(option) {
	return !thx_Options.toBool(option);
};
thx_Options.toOption = function(value) {
	if(null == value) return haxe_ds_Option.None; else return haxe_ds_Option.Some(value);
};
thx_Options.get = function(option) {
	switch(option[1]) {
	case 1:
		return null;
	case 0:
		var v = option[2];
		return v;
	}
};
thx_Options.getOrElse = function(option,alt) {
	switch(option[1]) {
	case 1:
		return alt;
	case 0:
		var v = option[2];
		return v;
	}
};
thx_Options.orElse = function(option,alt) {
	switch(option[1]) {
	case 1:
		return alt;
	case 0:
		return option;
	}
};
thx_Options.all = function(option,f) {
	switch(option[1]) {
	case 1:
		return true;
	case 0:
		var v = option[2];
		return f(v);
	}
};
thx_Options.any = function(option,f) {
	switch(option[1]) {
	case 1:
		return false;
	case 0:
		var v = option[2];
		return f(v);
	}
};
thx_Options.traverseValidation = function(option,f) {
	switch(option[1]) {
	case 0:
		var v = option[2];
		var this1 = f(v);
		return thx__$Validation_Validation_$Impl_$.ap(this1,thx_Either.Right(function(v1) {
			return haxe_ds_Option.Some(v1);
		}),function(e1,e2) {
			throw new js__$Boot_HaxeError("Unreachable");
		});
	case 1:
		return thx_Either.Right(haxe_ds_Option.None);
	}
};
thx_Options.toSuccess = function(option,error) {
	switch(option[1]) {
	case 1:
		return thx_Either.Left(error);
	case 0:
		var v = option[2];
		return thx_Either.Right(v);
	}
};
thx_Options.toSuccessNel = function(option,error) {
	switch(option[1]) {
	case 1:
		return thx_Either.Left(thx__$Nel_Nel_$Impl_$.pure(error));
	case 0:
		var v = option[2];
		return thx_Either.Right(v);
	}
};
thx_Options.toFailure = function(error,value) {
	switch(error[1]) {
	case 1:
		return thx_Either.Right(value);
	case 0:
		var e = error[2];
		return thx_Either.Left(e);
	}
};
thx_Options.toFailureNel = function(error,value) {
	switch(error[1]) {
	case 1:
		return thx_Either.Right(value);
	case 0:
		var e = error[2];
		return thx_Either.Left(thx__$Nel_Nel_$Impl_$.pure(e));
	}
};
thx_Options.ap2 = function(f,v1,v2) {
	return thx_Options.ap(v2,thx_Options.map(v1,thx_Functions2.curry(f)));
};
thx_Options.ap3 = function(f,v1,v2,v3) {
	return thx_Options.ap(v3,thx_Options.ap2(thx_Functions3.curry(f),v1,v2));
};
thx_Options.ap4 = function(f,v1,v2,v3,v4) {
	return thx_Options.ap(v4,thx_Options.ap3(thx_Functions4.curry(f),v1,v2,v3));
};
thx_Options.ap5 = function(f,v1,v2,v3,v4,v5) {
	return thx_Options.ap(v5,thx_Options.ap4(thx_Functions5.curry(f),v1,v2,v3,v4));
};
thx_Options.ap6 = function(f,v1,v2,v3,v4,v5,v6) {
	return thx_Options.ap(v6,thx_Options.ap5(thx_Functions6.curry(f),v1,v2,v3,v4,v5));
};
thx_Options.ap7 = function(f,v1,v2,v3,v4,v5,v6,v7) {
	return thx_Options.ap(v7,thx_Options.ap6(thx_Functions7.curry(f),v1,v2,v3,v4,v5,v6));
};
thx_Options.ap8 = function(f,v1,v2,v3,v4,v5,v6,v7,v8) {
	return thx_Options.ap(v8,thx_Options.ap7(thx_Functions8.curry(f),v1,v2,v3,v4,v5,v6,v7));
};
thx_Options.combine = function(a,b) {
	return thx_Options.ap(b,thx_Options.map(a,thx_Functions2.curry(thx__$Tuple_Tuple2_$Impl_$.of)));
};
thx_Options.combine2 = function(a,b) {
	return thx_Options.ap(b,thx_Options.map(a,thx_Functions2.curry(thx__$Tuple_Tuple2_$Impl_$.of)));
};
thx_Options.combine3 = function(a,b,c) {
	return thx_Options.ap(c,thx_Options.ap2(thx_Functions3.curry(thx__$Tuple_Tuple3_$Impl_$.of),a,b));
};
thx_Options.combine4 = function(a,b,c,d) {
	return thx_Options.ap(d,thx_Options.ap3(thx_Functions4.curry(thx__$Tuple_Tuple4_$Impl_$.of),a,b,c));
};
thx_Options.combine5 = function(a,b,c,d,e) {
	return thx_Options.ap(e,thx_Options.ap4(thx_Functions5.curry(thx__$Tuple_Tuple5_$Impl_$.of),a,b,c,d));
};
thx_Options.combine6 = function(a,b,c,d,e,f) {
	return thx_Options.ap(f,thx_Options.ap5(thx_Functions6.curry(thx__$Tuple_Tuple6_$Impl_$.of),a,b,c,d,e));
};
thx_Options.spread2 = function(v,f) {
	return thx_Options.map(v,function(t) {
		return f(t._0,t._1);
	});
};
thx_Options.spread = function(v,f) {
	return thx_Options.spread2(v,f);
};
thx_Options.spread3 = function(v,f) {
	return thx_Options.map(v,function(t) {
		return f(t._0,t._1,t._2);
	});
};
thx_Options.spread4 = function(v,f) {
	return thx_Options.map(v,function(t) {
		return f(t._0,t._1,t._2,t._3);
	});
};
thx_Options.spread5 = function(v,f) {
	return thx_Options.map(v,function(t) {
		return f(t._0,t._1,t._2,t._3,t._4);
	});
};
thx_Options.spread6 = function(v,f) {
	return thx_Options.map(v,function(t) {
		return f(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
var thx_Orderings = function() { };
thx_Orderings.__name__ = ["thx","Orderings"];
thx_Orderings.negate = function(o) {
	switch(o[1]) {
	case 0:
		return thx_OrderingImpl.GT;
	case 2:
		return thx_OrderingImpl.EQ;
	case 1:
		return thx_OrderingImpl.LT;
	}
};
var thx__$ReadonlyArray_ReadonlyArray_$Impl_$ = {};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.__name__ = ["thx","_ReadonlyArray","ReadonlyArray_Impl_"];
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.empty = function() {
	return [];
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.flatten = function(array) {
	return Array.prototype.concat.apply([],array);
};
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
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.lastIndexOf = function(this1,el,eq) {
	if(null == eq) eq = thx_Functions.equality;
	var len = this1.length;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		if(eq(el,this1[len - i - 1])) return i;
	}
	return -1;
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.get = function(this1,index) {
	return this1[index];
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.head = function(this1) {
	return this1[0];
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.tail = function(this1) {
	return this1.slice(1);
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.reduce = function(this1,arr,f,initial) {
	var _g = 0;
	while(_g < arr.length) {
		var v = arr[_g];
		++_g;
		initial = f(initial,v);
	}
	return initial;
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.reducei = function(array,f,initial) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		initial = f(initial,array[i],i);
	}
	return initial;
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.reverse = function(this1) {
	var arr = this1.slice();
	arr.reverse();
	return arr;
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.toArray = function(this1) {
	return this1.slice();
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.unsafe = function(this1) {
	return this1;
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.concat = function(this1,that) {
	return this1.concat(that);
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.insertAt = function(this1,pos,el) {
	return this1.slice(0,pos).concat([el]).concat(this1.slice(pos));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.insertAfter = function(this1,ref,el,eq) {
	var pos = thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(this1,ref,eq);
	if(pos < 0) pos = this1.length - 1;
	var pos1 = pos + 1;
	return this1.slice(0,pos1).concat([el]).concat(this1.slice(pos1));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.insertBefore = function(this1,ref,el,eq) {
	var pos = thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(this1,ref,eq);
	return this1.slice(0,pos).concat([el]).concat(this1.slice(pos));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.replace = function(this1,ref,el,eq) {
	var pos = thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(this1,ref,eq);
	if(pos < 0) throw new thx_Error("unable to find reference element",null,{ fileName : "ReadonlyArray.hx", lineNumber : 91, className : "thx._ReadonlyArray.ReadonlyArray_Impl_", methodName : "replace"});
	return this1.slice(0,pos).concat([el]).concat(this1.slice(pos + 1));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.replaceAt = function(this1,pos,el) {
	return this1.slice(0,pos).concat([el]).concat(this1.slice(pos + 1));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.remove = function(this1,el,eq) {
	var pos = thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(this1,el,eq);
	return this1.slice(0,pos).concat(this1.slice(pos + 1));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.removeAt = function(this1,pos) {
	return this1.slice(0,pos).concat(this1.slice(pos + 1));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.prepend = function(this1,el) {
	return [el].concat(this1);
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.append = function(this1,el) {
	return this1.concat([el]);
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.unshift = function(this1,el) {
	return [el].concat(this1);
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.shift = function(this1) {
	if(this1.length == 0) return { _0 : null, _1 : this1};
	var value = this1[0];
	var array = this1.slice(0,0).concat(this1.slice(1));
	return { _0 : value, _1 : array};
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.push = function(this1,el) {
	return this1.concat([el]);
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.pop = function(this1) {
	if(this1.length == 0) return { _0 : null, _1 : this1};
	var value = this1[this1.length - 1];
	var array;
	var pos = this1.length - 1;
	array = this1.slice(0,pos).concat(this1.slice(pos + 1));
	return { _0 : value, _1 : array};
};
var thx__$Semigroup_Semigroup_$Impl_$ = {};
thx__$Semigroup_Semigroup_$Impl_$.__name__ = ["thx","_Semigroup","Semigroup_Impl_"];
thx__$Semigroup_Semigroup_$Impl_$.get_append = function(this1) {
	return this1;
};
var thx__$Set_Set_$Impl_$ = {};
thx__$Set_Set_$Impl_$.__name__ = ["thx","_Set","Set_Impl_"];
thx__$Set_Set_$Impl_$.createString = function(it) {
	var map = new haxe_ds_StringMap();
	var set = map;
	if(null != it) thx__$Set_Set_$Impl_$.pushMany(set,it);
	return set;
};
thx__$Set_Set_$Impl_$.createInt = function(it) {
	var map = new haxe_ds_IntMap();
	var set = map;
	if(null != it) thx__$Set_Set_$Impl_$.pushMany(set,it);
	return set;
};
thx__$Set_Set_$Impl_$.createObject = function(it) {
	var map = new haxe_ds_ObjectMap();
	var set = map;
	if(null != it) thx__$Set_Set_$Impl_$.pushMany(set,it);
	return set;
};
thx__$Set_Set_$Impl_$.createEnum = function(arr) {
	var map = new haxe_ds_EnumValueMap();
	var set = map;
	if(null != arr) thx__$Set_Set_$Impl_$.pushMany(set,arr);
	return set;
};
thx__$Set_Set_$Impl_$._new = function(map) {
	return map;
};
thx__$Set_Set_$Impl_$.add = function(this1,v) {
	if(this1.exists(v)) return false; else {
		this1.set(v,true);
		return true;
	}
};
thx__$Set_Set_$Impl_$.copy = function(this1) {
	var inst = thx__$Set_Set_$Impl_$.empty(this1);
	var $it0 = this1.keys();
	while( $it0.hasNext() ) {
		var k = $it0.next();
		inst.set(k,true);
	}
	return inst;
};
thx__$Set_Set_$Impl_$.empty = function(this1) {
	var inst = Type.createInstance(this1 == null?null:js_Boot.getClass(this1),[]);
	return inst;
};
thx__$Set_Set_$Impl_$.difference = function(this1,set) {
	var result = thx__$Set_Set_$Impl_$.copy(this1);
	var $it0 = $iterator(thx__$Set_Set_$Impl_$)(set);
	while( $it0.hasNext() ) {
		var item = $it0.next();
		result.remove(item);
	}
	return result;
};
thx__$Set_Set_$Impl_$.filter = function(this1,predicate) {
	return thx__$Set_Set_$Impl_$.reduce(this1,function(acc,v) {
		if(predicate(v)) thx__$Set_Set_$Impl_$.add(acc,v);
		return acc;
	},thx__$Set_Set_$Impl_$.empty(this1));
};
thx__$Set_Set_$Impl_$.map = function(this1,f) {
	return thx__$Set_Set_$Impl_$.reduce(this1,function(acc,v) {
		acc.push(f(v));
		return acc;
	},[]);
};
thx__$Set_Set_$Impl_$.exists = function(this1,v) {
	return this1.exists(v);
};
thx__$Set_Set_$Impl_$.remove = function(this1,v) {
	return this1.remove(v);
};
thx__$Set_Set_$Impl_$.intersection = function(this1,set) {
	var result = thx__$Set_Set_$Impl_$.empty(this1);
	var $it0 = $iterator(thx__$Set_Set_$Impl_$)(this1);
	while( $it0.hasNext() ) {
		var item = $it0.next();
		if(set.exists(item)) result.set(item,true);
	}
	return result;
};
thx__$Set_Set_$Impl_$.push = function(this1,v) {
	this1.set(v,true);
};
thx__$Set_Set_$Impl_$.pushMany = function(this1,values) {
	var $it0 = $iterator(values)();
	while( $it0.hasNext() ) {
		var value = $it0.next();
		this1.set(value,true);
	}
};
thx__$Set_Set_$Impl_$.reduce = function(this1,handler,acc) {
	var $it0 = $iterator(thx__$Set_Set_$Impl_$)(this1);
	while( $it0.hasNext() ) {
		var v = $it0.next();
		acc = handler(acc,v);
	}
	return acc;
};
thx__$Set_Set_$Impl_$.iterator = function(this1) {
	return this1.keys();
};
thx__$Set_Set_$Impl_$.union = function(this1,set) {
	var newset = thx__$Set_Set_$Impl_$.copy(this1);
	thx__$Set_Set_$Impl_$.pushMany(newset,thx__$Set_Set_$Impl_$.toArray(set));
	return newset;
};
thx__$Set_Set_$Impl_$.toArray = function(this1) {
	var arr = [];
	var $it0 = this1.keys();
	while( $it0.hasNext() ) {
		var k = $it0.next();
		arr.push(k);
	}
	return arr;
};
thx__$Set_Set_$Impl_$.toString = function(this1) {
	return "{" + thx__$Set_Set_$Impl_$.toArray(this1).join(", ") + "}";
};
thx__$Set_Set_$Impl_$.get_length = function(this1) {
	var l = 0;
	var $it0 = this1.iterator();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		++l;
	}
	return l;
};
var thx_Strings = function() { };
thx_Strings.__name__ = ["thx","Strings"];
thx_Strings.after = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return ""; else return value.substring(pos + searchFor.length);
};
thx_Strings.afterLast = function(value,searchFor) {
	var pos = value.lastIndexOf(searchFor);
	if(pos < 0) return ""; else return value.substring(pos + searchFor.length);
};
thx_Strings.capitalize = function(s) {
	return HxOverrides.substr(s,0,1).toUpperCase() + HxOverrides.substr(s,1,s.length - 1);
};
thx_Strings.capitalizeWords = function(value,whiteSpaceOnly) {
	if(whiteSpaceOnly == null) whiteSpaceOnly = false;
	if(whiteSpaceOnly) return thx_Strings.UCWORDSWS.map(HxOverrides.substr(value,0,1).toUpperCase() + HxOverrides.substr(value,1,value.length - 1),thx_Strings.upperMatch); else return thx_Strings.UCWORDS.map(HxOverrides.substr(value,0,1).toUpperCase() + HxOverrides.substr(value,1,value.length - 1),thx_Strings.upperMatch);
};
thx_Strings.canonicalizeNewlines = function(value) {
	return thx_Strings.CANONICALIZE_LINES.replace(value,"\n");
};
thx_Strings.caseInsensitiveCompare = function(a,b) {
	if(null == a && null == b) return 0;
	if(null == a) return -1; else if(null == b) return 1;
	return thx_Strings.compare(a.toLowerCase(),b.toLowerCase());
};
thx_Strings.caseInsensitiveEndsWith = function(s,end) {
	return StringTools.endsWith(s.toLowerCase(),end.toLowerCase());
};
thx_Strings.caseInsensitiveEndsWithAny = function(s,values) {
	return thx_Strings.endsWithAny(s.toLowerCase(),values.map(function(v) {
		return v.toLowerCase();
	}));
};
thx_Strings.caseInsensitiveStartsWith = function(s,start) {
	return StringTools.startsWith(s.toLowerCase(),start.toLowerCase());
};
thx_Strings.caseInsensitiveStartsWithAny = function(s,values) {
	return thx_Strings.startsWithAny(s.toLowerCase(),values.map(function(v) {
		return v.toLowerCase();
	}));
};
thx_Strings.collapse = function(value) {
	return thx_Strings.WSG.replace(StringTools.trim(value)," ");
};
thx_Strings.compare = function(a,b) {
	return haxe_Utf8.compare(a,b);
};
thx_Strings.caseInsensitiveContains = function(s,test) {
	return s.toLowerCase().indexOf(test.toLowerCase()) >= 0;
};
thx_Strings.contains = function(s,test) {
	return s.indexOf(test) >= 0;
};
thx_Strings.count = function(s,test) {
	return s.split(test).length - 1;
};
thx_Strings.caseInsensitiveContainsAny = function(s,tests) {
	return thx_Arrays.any(tests,(function(f,s1) {
		return function(a1) {
			return f(s1,a1);
		};
	})(thx_Strings.caseInsensitiveContains,s));
};
thx_Strings.containsAny = function(s,tests) {
	return thx_Arrays.any(tests,(function(f,s1) {
		return function(a1) {
			return f(s1,a1);
		};
	})(thx_Strings.contains,s));
};
thx_Strings.dasherize = function(s) {
	return StringTools.replace(s,"_","-");
};
thx_Strings.diffAt = function(a,b) {
	var min = thx_Ints.min(a.length,b.length);
	var _g = 0;
	while(_g < min) {
		var i = _g++;
		if(a.substring(i,i + 1) != b.substring(i,i + 1)) return i;
	}
	return min;
};
thx_Strings.ellipsis = function(s,maxlen,symbol) {
	if(symbol == null) symbol = "…";
	if(maxlen == null) maxlen = 20;
	var sl = s.length;
	var symboll = symbol.length;
	if(sl > maxlen) {
		if(maxlen < symboll) return HxOverrides.substr(symbol,symboll - maxlen,maxlen); else return HxOverrides.substr(s,0,maxlen - symboll) + symbol;
	} else return s;
};
thx_Strings.ellipsisMiddle = function(s,maxlen,symbol) {
	if(symbol == null) symbol = "…";
	if(maxlen == null) maxlen = 20;
	var sl = s.length;
	var symboll = symbol.length;
	if(sl > maxlen) {
		if(maxlen <= symboll) return thx_Strings.ellipsis(s,maxlen,symbol);
		var hll = Math.ceil((maxlen - symboll) / 2);
		var hlr = Math.floor((maxlen - symboll) / 2);
		return HxOverrides.substr(s,0,hll) + symbol + HxOverrides.substr(s,sl - hlr,hlr);
	} else return s;
};
thx_Strings.endsWithAny = function(s,values) {
	return thx_Iterables.any(values,function(end) {
		return StringTools.endsWith(s,end);
	});
};
thx_Strings.filter = function(s,predicate) {
	return s.split("").filter(predicate).join("");
};
thx_Strings.filterCharcode = function(s,predicate) {
	var codes = thx_Strings.toCharcodes(s).filter(predicate);
	return codes.map(function(i) {
		return String.fromCharCode(i);
	}).join("");
};
thx_Strings.from = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return ""; else return value.substring(pos);
};
thx_Strings.hashCode = function(value) {
	var code = 0;
	var _g1 = 0;
	var _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = HxOverrides.cca(value,i);
		code = (function($this) {
			var $r;
			var a = haxe__$Int32_Int32_$Impl_$.mul(thx_Strings.HASCODE_MUL,code);
			$r = a + c | 0;
			return $r;
		}(this)) % thx_Strings.HASCODE_MAX;
	}
	return code;
};
thx_Strings.hasContent = function(value) {
	return value != null && value.length > 0;
};
thx_Strings.humanize = function(s) {
	return StringTools.replace(thx_Strings.underscore(s),"_"," ");
};
thx_Strings.isAlpha = function(s) {
	return s.length > 0 && !thx_Strings.IS_ALPHA.match(s);
};
thx_Strings.isAlphaNum = function(value) {
	return thx_Strings.ALPHANUM.match(value);
};
thx_Strings.isBreakingWhitespace = function(value) {
	return !thx_Strings.IS_BREAKINGWHITESPACE.match(value);
};
thx_Strings.isLowerCase = function(value) {
	return value.toLowerCase() == value;
};
thx_Strings.isUpperCase = function(value) {
	return value.toUpperCase() == value;
};
thx_Strings.ifEmpty = function(value,alt) {
	if(null != value && "" != value) return value; else return alt;
};
thx_Strings.isDigitsOnly = function(value) {
	return thx_Strings.DIGITS.match(value);
};
thx_Strings.isEmpty = function(value) {
	return value == null || value == "";
};
thx_Strings.lowerCaseFirst = function(value) {
	return value.substring(0,1).toLowerCase() + value.substring(1);
};
thx_Strings.random = function(value,length) {
	if(length == null) length = 1;
	return haxe_Utf8.sub(value,Math.floor((value.length - length + 1) * Math.random()),length);
};
thx_Strings.randomSequence = function(seed,length) {
	return thx_Ints.range(0,length).map(function(_) {
		return thx_Strings.random(seed);
	}).join("");
};
thx_Strings.randomSequence64 = function(length) {
	return thx_Strings.randomSequence(haxe_crypto_Base64.CHARS,length);
};
thx_Strings.iterator = function(s) {
	var _this = s.split("");
	return HxOverrides.iter(_this);
};
thx_Strings.map = function(value,callback) {
	return value.split("").map(callback);
};
thx_Strings.remove = function(value,toremove) {
	return StringTools.replace(value,toremove,"");
};
thx_Strings.removeAfter = function(value,toremove) {
	if(StringTools.endsWith(value,toremove)) return value.substring(0,value.length - toremove.length); else return value;
};
thx_Strings.removeAt = function(value,index,length) {
	return value.substring(0,index) + value.substring(index + length);
};
thx_Strings.removeBefore = function(value,toremove) {
	if(StringTools.startsWith(value,toremove)) return value.substring(toremove.length); else return value;
};
thx_Strings.removeOne = function(value,toremove) {
	var pos = value.indexOf(toremove);
	if(pos < 0) return value;
	return value.substring(0,pos) + value.substring(pos + toremove.length);
};
thx_Strings.repeat = function(s,times) {
	return ((function($this) {
		var $r;
		var _g = [];
		{
			var _g1 = 0;
			while(_g1 < times) {
				var i = _g1++;
				_g.push(s);
			}
		}
		$r = _g;
		return $r;
	}(this))).join("");
};
thx_Strings.reverse = function(s) {
	var arr = s.split("");
	arr.reverse();
	return arr.join("");
};
thx_Strings.quote = function(s) {
	if(s.indexOf("\"") < 0) return "\"" + s + "\""; else if(s.indexOf("'") < 0) return "'" + s + "'"; else return "\"" + StringTools.replace(s,"\"","\\\"") + "\"";
};
thx_Strings.splitOnce = function(s,separator) {
	var pos = s.indexOf(separator);
	if(pos < 0) return [s];
	return [s.substring(0,pos),s.substring(pos + separator.length)];
};
thx_Strings.startsWithAny = function(s,values) {
	return thx_Iterables.any(values,function(start) {
		return StringTools.startsWith(s,start);
	});
};
thx_Strings.stripTags = function(s) {
	return thx_Strings.STRIPTAGS.replace(s,"");
};
thx_Strings.surround = function(s,left,right) {
	return "" + left + s + (null == right?left:right);
};
thx_Strings.toArray = function(s) {
	return s.split("");
};
thx_Strings.toCharcodes = function(s) {
	return thx_Strings.map(s,function(s1) {
		return HxOverrides.cca(s1,0);
	});
};
thx_Strings.toChunks = function(s,len) {
	var chunks = [];
	while(s.length > 0) {
		chunks.push(HxOverrides.substr(s,0,len));
		s = HxOverrides.substr(s,len,s.length - len);
	}
	return chunks;
};
thx_Strings.toLines = function(s) {
	return thx_Strings.SPLIT_LINES.split(s);
};
thx_Strings.trimChars = function(value,charlist) {
	return thx_Strings.trimCharsRight(thx_Strings.trimCharsLeft(value,charlist),charlist);
};
thx_Strings.trimCharsLeft = function(value,charlist) {
	var pos = 0;
	var _g1 = 0;
	var _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(thx_Strings.contains(charlist,value.charAt(i))) pos++; else break;
	}
	return value.substring(pos);
};
thx_Strings.trimCharsRight = function(value,charlist) {
	var len = value.length;
	var pos = len;
	var i;
	var _g = 0;
	while(_g < len) {
		var j = _g++;
		i = len - j - 1;
		if(thx_Strings.contains(charlist,value.charAt(i))) pos = i; else break;
	}
	return value.substring(0,pos);
};
thx_Strings.underscore = function(s) {
	s = new EReg("::","g").replace(s,"/");
	s = new EReg("([A-Z]+)([A-Z][a-z])","g").replace(s,"$1_$2");
	s = new EReg("([a-z\\d])([A-Z])","g").replace(s,"$1_$2");
	s = new EReg("-","g").replace(s,"_");
	return s.toLowerCase();
};
thx_Strings.upperCaseFirst = function(value) {
	return value.substring(0,1).toUpperCase() + value.substring(1);
};
thx_Strings.upTo = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return value; else return value.substring(0,pos);
};
thx_Strings.wrapColumns = function(s,columns,indent,newline) {
	if(newline == null) newline = "\n";
	if(indent == null) indent = "";
	if(columns == null) columns = 78;
	return thx_Strings.SPLIT_LINES.split(s).map(function(part) {
		return thx_Strings.wrapLine(StringTools.trim(thx_Strings.WSG.replace(part," ")),columns,indent,newline);
	}).join(newline);
};
thx_Strings.upperMatch = function(re) {
	return re.matched(0).toUpperCase();
};
thx_Strings.wrapLine = function(s,columns,indent,newline) {
	var parts = [];
	var pos = 0;
	var len = s.length;
	var ilen = indent.length;
	columns -= ilen;
	while(true) {
		if(pos + columns >= len - ilen) {
			parts.push(s.substring(pos));
			break;
		}
		var i = 0;
		while(!StringTools.isSpace(s,pos + columns - i) && i < columns) i++;
		if(i == columns) {
			i = 0;
			while(!StringTools.isSpace(s,pos + columns + i) && pos + columns + i < len) i++;
			parts.push(s.substring(pos,pos + columns + i));
			pos += columns + i + 1;
		} else {
			parts.push(s.substring(pos,pos + columns - i));
			pos += columns - i + 1;
		}
	}
	return indent + parts.join(newline + indent);
};
thx_Strings.lpad = function(s,$char,length) {
	var diff = length - s.length;
	if(diff > 0) return thx_Strings.repeat($char,diff) + s; else return s;
};
thx_Strings.rpad = function(s,$char,length) {
	var diff = length - s.length;
	if(diff > 0) return s + thx_Strings.repeat($char,diff); else return s;
};
var thx_TimePeriod = { __ename__ : ["thx","TimePeriod"], __constructs__ : ["Second","Minute","Hour","Day","Week","Month","Year"] };
thx_TimePeriod.Second = ["Second",0];
thx_TimePeriod.Second.toString = $estr;
thx_TimePeriod.Second.__enum__ = thx_TimePeriod;
thx_TimePeriod.Minute = ["Minute",1];
thx_TimePeriod.Minute.toString = $estr;
thx_TimePeriod.Minute.__enum__ = thx_TimePeriod;
thx_TimePeriod.Hour = ["Hour",2];
thx_TimePeriod.Hour.toString = $estr;
thx_TimePeriod.Hour.__enum__ = thx_TimePeriod;
thx_TimePeriod.Day = ["Day",3];
thx_TimePeriod.Day.toString = $estr;
thx_TimePeriod.Day.__enum__ = thx_TimePeriod;
thx_TimePeriod.Week = ["Week",4];
thx_TimePeriod.Week.toString = $estr;
thx_TimePeriod.Week.__enum__ = thx_TimePeriod;
thx_TimePeriod.Month = ["Month",5];
thx_TimePeriod.Month.toString = $estr;
thx_TimePeriod.Month.__enum__ = thx_TimePeriod;
thx_TimePeriod.Year = ["Year",6];
thx_TimePeriod.Year.toString = $estr;
thx_TimePeriod.Year.__enum__ = thx_TimePeriod;
var thx__$Timestamp_Timestamp_$Impl_$ = {};
thx__$Timestamp_Timestamp_$Impl_$.__name__ = ["thx","_Timestamp","Timestamp_Impl_"];
thx__$Timestamp_Timestamp_$Impl_$.create = function(year,month,day,hour,minute,second) {
	return thx_Dates.create(year,month,day,hour,minute,second).getTime();
};
thx__$Timestamp_Timestamp_$Impl_$.now = function() {
	var d = new Date();
	return d.getTime();
};
thx__$Timestamp_Timestamp_$Impl_$.fromDate = function(d) {
	return d.getTime();
};
thx__$Timestamp_Timestamp_$Impl_$.fromString = function(s) {
	return HxOverrides.strDate(s).getTime();
};
thx__$Timestamp_Timestamp_$Impl_$.toDate = function(this1) {
	var d = new Date();
	d.setTime(this1);
	return d;
};
thx__$Timestamp_Timestamp_$Impl_$.toString = function(this1) {
	var _this;
	var d = new Date();
	d.setTime(this1);
	_this = d;
	return HxOverrides.dateStr(_this);
};
thx__$Timestamp_Timestamp_$Impl_$.snapNext = function(this1,period) {
	switch(period[1]) {
	case 0:
		return Math.ceil(this1 / 1000.0) * 1000.0;
	case 1:
		return Math.ceil(this1 / 60000.0) * 60000.0;
	case 2:
		return Math.ceil(this1 / 3600000.0) * 3600000.0;
	case 3:
		var d;
		var d1 = new Date();
		d1.setTime(this1);
		d = d1;
		var year = d.getFullYear();
		var month = d.getMonth();
		var day = d.getDate() + 1;
		return thx_Dates.create(year,month,day,0,0,0).getTime();
	case 4:
		var d2;
		var d3 = new Date();
		d3.setTime(this1);
		d2 = d3;
		var wd = d2.getDay();
		var year1 = d2.getFullYear();
		var month1 = d2.getMonth();
		var day1 = d2.getDate() + 7 - wd;
		return thx_Dates.create(year1,month1,day1,0,0,0).getTime();
	case 5:
		var d4;
		var d5 = new Date();
		d5.setTime(this1);
		d4 = d5;
		var year2 = d4.getFullYear();
		var month2 = d4.getMonth() + 1;
		return thx_Dates.create(year2,month2,1,0,0,0).getTime();
	case 6:
		var d6;
		var d7 = new Date();
		d7.setTime(this1);
		d6 = d7;
		var year3 = d6.getFullYear() + 1;
		return thx_Dates.create(year3,0,1,0,0,0).getTime();
	}
};
thx__$Timestamp_Timestamp_$Impl_$.snapPrev = function(this1,period) {
	switch(period[1]) {
	case 0:
		return Math.floor(this1 / 1000.0) * 1000.0;
	case 1:
		return Math.floor(this1 / 60000.0) * 60000.0;
	case 2:
		return Math.floor(this1 / 3600000.0) * 3600000.0;
	case 3:
		var d;
		var d1 = new Date();
		d1.setTime(this1);
		d = d1;
		var year = d.getFullYear();
		var month = d.getMonth();
		var day = d.getDate();
		return thx_Dates.create(year,month,day,0,0,0).getTime();
	case 4:
		var d2;
		var d3 = new Date();
		d3.setTime(this1);
		d2 = d3;
		var wd = d2.getDay();
		var year1 = d2.getFullYear();
		var month1 = d2.getMonth();
		var day1 = d2.getDate() - wd;
		return thx_Dates.create(year1,month1,day1,0,0,0).getTime();
	case 5:
		var d4;
		var d5 = new Date();
		d5.setTime(this1);
		d4 = d5;
		var year2 = d4.getFullYear();
		var month2 = d4.getMonth();
		return thx_Dates.create(year2,month2,1,0,0,0).getTime();
	case 6:
		var d6;
		var d7 = new Date();
		d7.setTime(this1);
		d6 = d7;
		var year3 = d6.getFullYear();
		return thx_Dates.create(year3,0,1,0,0,0).getTime();
	}
};
thx__$Timestamp_Timestamp_$Impl_$.snapTo = function(this1,period) {
	switch(period[1]) {
	case 0:
		return Math.round(this1 / 1000.0) * 1000.0;
	case 1:
		return Math.round(this1 / 60000.0) * 60000.0;
	case 2:
		return Math.round(this1 / 3600000.0) * 3600000.0;
	case 3:
		var d;
		var d1 = new Date();
		d1.setTime(this1);
		d = d1;
		var mod;
		if(d.getHours() >= 12) mod = 1; else mod = 0;
		var year = d.getFullYear();
		var month = d.getMonth();
		var day = d.getDate() + mod;
		return thx_Dates.create(year,month,day,0,0,0).getTime();
	case 4:
		var d2;
		var d3 = new Date();
		d3.setTime(this1);
		d2 = d3;
		var wd = d2.getDay();
		var mod1;
		if(wd < 3) mod1 = -wd; else if(wd > 3) mod1 = 7 - wd; else if(d2.getHours() < 12) mod1 = -wd; else mod1 = 7 - wd;
		var year1 = d2.getFullYear();
		var month1 = d2.getMonth();
		var day1 = d2.getDate() + mod1;
		return thx_Dates.create(year1,month1,day1,0,0,0).getTime();
	case 5:
		var d4;
		var d5 = new Date();
		d5.setTime(this1);
		d4 = d5;
		var mod2;
		if(d4.getDate() > Math.round(DateTools.getMonthDays(d4) / 2)) mod2 = 1; else mod2 = 0;
		var year2 = d4.getFullYear();
		var month2 = d4.getMonth() + mod2;
		return thx_Dates.create(year2,month2,1,0,0,0).getTime();
	case 6:
		var d6;
		var d7 = new Date();
		d7.setTime(this1);
		d6 = d7;
		var mod3;
		if(this1 > new Date(d6.getFullYear(),6,2,0,0,0).getTime()) mod3 = 1; else mod3 = 0;
		var year3 = d6.getFullYear() + mod3;
		return thx_Dates.create(year3,0,1,0,0,0).getTime();
	}
};
thx__$Timestamp_Timestamp_$Impl_$.r = function(t,v) {
	return Math.round(t / v) * v;
};
thx__$Timestamp_Timestamp_$Impl_$.f = function(t,v) {
	return Math.floor(t / v) * v;
};
thx__$Timestamp_Timestamp_$Impl_$.c = function(t,v) {
	return Math.ceil(t / v) * v;
};
var thx__$Tuple_Tuple0_$Impl_$ = {};
thx__$Tuple_Tuple0_$Impl_$.__name__ = ["thx","_Tuple","Tuple0_Impl_"];
thx__$Tuple_Tuple0_$Impl_$._new = function() {
	return thx_Nil.nil;
};
thx__$Tuple_Tuple0_$Impl_$["with"] = function(this1,v) {
	return v;
};
thx__$Tuple_Tuple0_$Impl_$.toString = function(this1) {
	return "Tuple0()";
};
thx__$Tuple_Tuple0_$Impl_$.toNil = function(this1) {
	return this1;
};
thx__$Tuple_Tuple0_$Impl_$.nilToTuple = function(v) {
	return thx_Nil.nil;
};
var thx__$Tuple_Tuple1_$Impl_$ = {};
thx__$Tuple_Tuple1_$Impl_$.__name__ = ["thx","_Tuple","Tuple1_Impl_"];
thx__$Tuple_Tuple1_$Impl_$._new = function(_0) {
	return _0;
};
thx__$Tuple_Tuple1_$Impl_$.get__0 = function(this1) {
	return this1;
};
thx__$Tuple_Tuple1_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1, _1 : v};
};
thx__$Tuple_Tuple1_$Impl_$.toString = function(this1) {
	return "Tuple1(" + Std.string(this1) + ")";
};
thx__$Tuple_Tuple1_$Impl_$.arrayToTuple = function(v) {
	return v[0];
};
var thx__$Tuple_Tuple2_$Impl_$ = {};
thx__$Tuple_Tuple2_$Impl_$.__name__ = ["thx","_Tuple","Tuple2_Impl_"];
thx__$Tuple_Tuple2_$Impl_$.of = function(_0,_1) {
	return { _0 : _0, _1 : _1};
};
thx__$Tuple_Tuple2_$Impl_$._new = function(_0,_1) {
	return { _0 : _0, _1 : _1};
};
thx__$Tuple_Tuple2_$Impl_$.get_left = function(this1) {
	return this1._0;
};
thx__$Tuple_Tuple2_$Impl_$.get_right = function(this1) {
	return this1._1;
};
thx__$Tuple_Tuple2_$Impl_$.flip = function(this1) {
	return { _0 : this1._1, _1 : this1._0};
};
thx__$Tuple_Tuple2_$Impl_$.dropLeft = function(this1) {
	return this1._1;
};
thx__$Tuple_Tuple2_$Impl_$.dropRight = function(this1) {
	return this1._0;
};
thx__$Tuple_Tuple2_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : v};
};
thx__$Tuple_Tuple2_$Impl_$.toString = function(this1) {
	return "Tuple2(" + Std.string(this1._0) + "," + Std.string(this1._1) + ")";
};
thx__$Tuple_Tuple2_$Impl_$.map = function(this1,f) {
	var _1 = f(this1._1);
	return { _0 : this1._0, _1 : _1};
};
thx__$Tuple_Tuple2_$Impl_$.arrayToTuple2 = function(v) {
	return { _0 : v[0], _1 : v[1]};
};
var thx__$Tuple_Tuple3_$Impl_$ = {};
thx__$Tuple_Tuple3_$Impl_$.__name__ = ["thx","_Tuple","Tuple3_Impl_"];
thx__$Tuple_Tuple3_$Impl_$.of = function(_0,_1,_2) {
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx__$Tuple_Tuple3_$Impl_$._new = function(_0,_1,_2) {
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx__$Tuple_Tuple3_$Impl_$.flip = function(this1) {
	return { _0 : this1._2, _1 : this1._1, _2 : this1._0};
};
thx__$Tuple_Tuple3_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2};
};
thx__$Tuple_Tuple3_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1};
};
thx__$Tuple_Tuple3_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : v};
};
thx__$Tuple_Tuple3_$Impl_$.toString = function(this1) {
	return "Tuple3(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + ")";
};
thx__$Tuple_Tuple3_$Impl_$.arrayToTuple3 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2]};
};
thx__$Tuple_Tuple3_$Impl_$.map = function(this1,f) {
	var _2 = f(this1._2);
	return { _0 : this1._0, _1 : this1._1, _2 : _2};
};
var thx__$Tuple_Tuple4_$Impl_$ = {};
thx__$Tuple_Tuple4_$Impl_$.__name__ = ["thx","_Tuple","Tuple4_Impl_"];
thx__$Tuple_Tuple4_$Impl_$.of = function(_0,_1,_2,_3) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx__$Tuple_Tuple4_$Impl_$._new = function(_0,_1,_2,_3) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx__$Tuple_Tuple4_$Impl_$.flip = function(this1) {
	return { _0 : this1._3, _1 : this1._2, _2 : this1._1, _3 : this1._0};
};
thx__$Tuple_Tuple4_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3};
};
thx__$Tuple_Tuple4_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2};
};
thx__$Tuple_Tuple4_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : v};
};
thx__$Tuple_Tuple4_$Impl_$.toString = function(this1) {
	return "Tuple4(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + ")";
};
thx__$Tuple_Tuple4_$Impl_$.arrayToTuple4 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2], _3 : v[3]};
};
var thx__$Tuple_Tuple5_$Impl_$ = {};
thx__$Tuple_Tuple5_$Impl_$.__name__ = ["thx","_Tuple","Tuple5_Impl_"];
thx__$Tuple_Tuple5_$Impl_$.of = function(_0,_1,_2,_3,_4) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4};
};
thx__$Tuple_Tuple5_$Impl_$._new = function(_0,_1,_2,_3,_4) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4};
};
thx__$Tuple_Tuple5_$Impl_$.flip = function(this1) {
	return { _0 : this1._4, _1 : this1._3, _2 : this1._2, _3 : this1._1, _4 : this1._0};
};
thx__$Tuple_Tuple5_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3, _3 : this1._4};
};
thx__$Tuple_Tuple5_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3};
};
thx__$Tuple_Tuple5_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : v};
};
thx__$Tuple_Tuple5_$Impl_$.toString = function(this1) {
	return "Tuple5(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + ")";
};
thx__$Tuple_Tuple5_$Impl_$.arrayToTuple5 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2], _3 : v[3], _4 : v[4]};
};
var thx__$Tuple_Tuple6_$Impl_$ = {};
thx__$Tuple_Tuple6_$Impl_$.__name__ = ["thx","_Tuple","Tuple6_Impl_"];
thx__$Tuple_Tuple6_$Impl_$.of = function(_0,_1,_2,_3,_4,_5) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4, _5 : _5};
};
thx__$Tuple_Tuple6_$Impl_$._new = function(_0,_1,_2,_3,_4,_5) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4, _5 : _5};
};
thx__$Tuple_Tuple6_$Impl_$.flip = function(this1) {
	return { _0 : this1._5, _1 : this1._4, _2 : this1._3, _3 : this1._2, _4 : this1._1, _5 : this1._0};
};
thx__$Tuple_Tuple6_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3, _3 : this1._4, _4 : this1._5};
};
thx__$Tuple_Tuple6_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4};
};
thx__$Tuple_Tuple6_$Impl_$.toString = function(this1) {
	return "Tuple6(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + "," + Std.string(this1._5) + ")";
};
thx__$Tuple_Tuple6_$Impl_$.arrayToTuple6 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2], _3 : v[3], _4 : v[4], _5 : v[5]};
};
var thx_Types = function() { };
thx_Types.__name__ = ["thx","Types"];
thx_Types.isAnonymousObject = function(v) {
	return Reflect.isObject(v) && null == Type.getClass(v);
};
thx_Types.isPrimitive = function(v) {
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 1:case 2:case 3:
			return true;
		case 0:case 5:case 7:case 4:case 8:
			return false;
		case 6:
			var c = _g[2];
			return Type.getClassName(c) == "String";
		}
	}
};
thx_Types.isEnumValue = function(v) {
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 7:
			return true;
		default:
			return false;
		}
	}
};
thx_Types.hasSuperClass = function(cls,sup) {
	while(null != cls) {
		if(cls == sup) return true;
		cls = Type.getSuperClass(cls);
	}
	return false;
};
thx_Types.sameType = function(a,b) {
	return thx_Types.toString(Type["typeof"](a)) == thx_Types.toString(Type["typeof"](b));
};
thx_Types.typeInheritance = function(type) {
	switch(type[1]) {
	case 1:
		return ["Int"];
	case 2:
		return ["Float"];
	case 3:
		return ["Bool"];
	case 4:
		return ["{}"];
	case 5:
		return ["Function"];
	case 6:
		var c = type[2];
		var classes = [];
		while(null != c) {
			classes.push(c);
			c = Type.getSuperClass(c);
		}
		return classes.map(Type.getClassName);
	case 7:
		var e = type[2];
		return [Type.getEnumName(e)];
	default:
		throw new js__$Boot_HaxeError("invalid type " + Std.string(type));
	}
};
thx_Types.toString = function(type) {
	switch(type[1]) {
	case 0:
		return "Null";
	case 1:
		return "Int";
	case 2:
		return "Float";
	case 3:
		return "Bool";
	case 4:
		return "{}";
	case 5:
		return "Function";
	case 6:
		var c = type[2];
		return Type.getClassName(c);
	case 7:
		var e = type[2];
		return Type.getEnumName(e);
	default:
		throw new js__$Boot_HaxeError("invalid type " + Std.string(type));
	}
};
thx_Types.valueTypeInheritance = function(value) {
	return thx_Types.typeInheritance(Type["typeof"](value));
};
thx_Types.valueTypeToString = function(value) {
	return thx_Types.toString(Type["typeof"](value));
};
thx_Types.anyValueToString = function(value) {
	if(js_Boot.__instanceof(value,ValueType)) return thx_Types.toString(value);
	if(js_Boot.__instanceof(value,Class)) return Type.getClassName(value);
	if(js_Boot.__instanceof(value,Enum)) return Type.getEnumName(value);
	return thx_Types.valueTypeToString(value);
};
var thx__$Validation_Validation_$Impl_$ = {};
thx__$Validation_Validation_$Impl_$.__name__ = ["thx","_Validation","Validation_Impl_"];
thx__$Validation_Validation_$Impl_$.validation = function(e) {
	return e;
};
thx__$Validation_Validation_$Impl_$.vnel = function(e) {
	return e;
};
thx__$Validation_Validation_$Impl_$.liftVNel = function(e) {
	return thx_Eithers.leftMap(e,thx__$Nel_Nel_$Impl_$.pure);
};
thx__$Validation_Validation_$Impl_$.pure = function(a) {
	return thx_Either.Right(a);
};
thx__$Validation_Validation_$Impl_$.success = function(a) {
	return thx_Either.Right(a);
};
thx__$Validation_Validation_$Impl_$.failure = function(e) {
	return thx_Either.Left(e);
};
thx__$Validation_Validation_$Impl_$.nn = function(a,e) {
	if(a == null) return thx_Either.Left(e); else return thx_Either.Right(a);
};
thx__$Validation_Validation_$Impl_$.successNel = function(a) {
	return thx_Either.Right(a);
};
thx__$Validation_Validation_$Impl_$.failureNel = function(e) {
	return thx_Either.Left(thx__$Nel_Nel_$Impl_$.pure(e));
};
thx__$Validation_Validation_$Impl_$.nnNel = function(a,e) {
	if(a == null) return thx_Either.Left(thx__$Nel_Nel_$Impl_$.pure(e)); else return thx_Either.Right(a);
};
thx__$Validation_Validation_$Impl_$.get_either = function(this1) {
	return this1;
};
thx__$Validation_Validation_$Impl_$.map = function(this1,f) {
	return thx__$Validation_Validation_$Impl_$.ap(this1,thx_Either.Right(f),function(e1,e2) {
		throw new js__$Boot_HaxeError("Unreachable");
	});
};
thx__$Validation_Validation_$Impl_$.foldLeft = function(this1,b,f) {
	switch(this1[1]) {
	case 0:
		return b;
	case 1:
		var a = this1[2];
		return f(b,a);
	}
};
thx__$Validation_Validation_$Impl_$.foldMap = function(this1,f,m) {
	return thx__$Validation_Validation_$Impl_$.foldLeft(thx_Eithers.map(this1,f),thx__$Monoid_Monoid_$Impl_$.get_zero(m),(function(_e) {
		return function(a0,a1) {
			return thx__$Monoid_Monoid_$Impl_$.append(_e,a0,a1);
		};
	})(m));
};
thx__$Validation_Validation_$Impl_$.ap = function(this1,v,s) {
	switch(this1[1]) {
	case 0:
		var e0 = this1[2];
		{
			var _g = v;
			switch(_g[1]) {
			case 0:
				var e1 = _g[2];
				return thx_Either.Left((thx__$Semigroup_Semigroup_$Impl_$.get_append(s))(e0,e1));
			case 1:
				var b = _g[2];
				return thx_Either.Left(e0);
			}
		}
		break;
	case 1:
		var a = this1[2];
		{
			var _g1 = v;
			switch(_g1[1]) {
			case 0:
				var e = _g1[2];
				return thx_Either.Left(e);
			case 1:
				var f = _g1[2];
				return thx_Either.Right(f(a));
			}
		}
		break;
	}
};
thx__$Validation_Validation_$Impl_$.zip = function(this1,v,s) {
	return thx__$Validation_Validation_$Impl_$.ap(this1,thx_Eithers.map(v,function(b) {
		return (function(f,_1) {
			return function(_0) {
				return f(_0,_1);
			};
		})(thx__$Tuple_Tuple2_$Impl_$.of,b);
	}),s);
};
thx__$Validation_Validation_$Impl_$.leftMap = function(this1,f) {
	return thx_Eithers.leftMap(this1,f);
};
thx__$Validation_Validation_$Impl_$.wrapNel = function(this1) {
	return thx_Eithers.leftMap(this1,thx__$Nel_Nel_$Impl_$.pure);
};
thx__$Validation_Validation_$Impl_$.ensure = function(this1,p,error) {
	{
		var left = this1;
		switch(this1[1]) {
		case 1:
			var a = this1[2];
			if(p(a)) return this1; else return thx_Either.Left(error);
			break;
		default:
			return left;
		}
	}
};
thx__$Validation_Validation_$Impl_$.flatMapV = function(this1,f) {
	switch(this1[1]) {
	case 0:
		var a = this1[2];
		return thx_Either.Left(a);
	case 1:
		var b = this1[2];
		return f(b);
	}
};
thx__$Validation_Validation_$Impl_$.val2 = function(f,v1,v2,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
		var $r;
		var f1 = thx_Functions2.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f1),function(e1,e2) {
			throw new js__$Boot_HaxeError("Unreachable");
		});
		return $r;
	}(this)),s);
};
thx__$Validation_Validation_$Impl_$.val3 = function(f,v1,v2,v3,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v3,(function($this) {
		var $r;
		var f1 = thx_Functions3.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
			var $r;
			var f2 = thx_Functions2.curry(f1);
			$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f2),function(e1,e2) {
				throw new js__$Boot_HaxeError("Unreachable");
			});
			return $r;
		}($this)),s);
		return $r;
	}(this)),s);
};
thx__$Validation_Validation_$Impl_$.val4 = function(f,v1,v2,v3,v4,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v4,(function($this) {
		var $r;
		var f1 = thx_Functions4.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v3,(function($this) {
			var $r;
			var f2 = thx_Functions3.curry(f1);
			$r = thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
				var $r;
				var f3 = thx_Functions2.curry(f2);
				$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f3),function(e1,e2) {
					throw new js__$Boot_HaxeError("Unreachable");
				});
				return $r;
			}($this)),s);
			return $r;
		}($this)),s);
		return $r;
	}(this)),s);
};
thx__$Validation_Validation_$Impl_$.val5 = function(f,v1,v2,v3,v4,v5,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v5,(function($this) {
		var $r;
		var f1 = thx_Functions5.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v4,(function($this) {
			var $r;
			var f2 = thx_Functions4.curry(f1);
			$r = thx__$Validation_Validation_$Impl_$.ap(v3,(function($this) {
				var $r;
				var f3 = thx_Functions3.curry(f2);
				$r = thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
					var $r;
					var f4 = thx_Functions2.curry(f3);
					$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f4),function(e1,e2) {
						throw new js__$Boot_HaxeError("Unreachable");
					});
					return $r;
				}($this)),s);
				return $r;
			}($this)),s);
			return $r;
		}($this)),s);
		return $r;
	}(this)),s);
};
thx__$Validation_Validation_$Impl_$.val6 = function(f,v1,v2,v3,v4,v5,v6,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v6,(function($this) {
		var $r;
		var f1 = thx_Functions6.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v5,(function($this) {
			var $r;
			var f2 = thx_Functions5.curry(f1);
			$r = thx__$Validation_Validation_$Impl_$.ap(v4,(function($this) {
				var $r;
				var f3 = thx_Functions4.curry(f2);
				$r = thx__$Validation_Validation_$Impl_$.ap(v3,(function($this) {
					var $r;
					var f4 = thx_Functions3.curry(f3);
					$r = thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
						var $r;
						var f5 = thx_Functions2.curry(f4);
						$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f5),function(e1,e2) {
							throw new js__$Boot_HaxeError("Unreachable");
						});
						return $r;
					}($this)),s);
					return $r;
				}($this)),s);
				return $r;
			}($this)),s);
			return $r;
		}($this)),s);
		return $r;
	}(this)),s);
};
thx__$Validation_Validation_$Impl_$.val7 = function(f,v1,v2,v3,v4,v5,v6,v7,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v7,(function($this) {
		var $r;
		var f1 = thx_Functions7.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v6,(function($this) {
			var $r;
			var f2 = thx_Functions6.curry(f1);
			$r = thx__$Validation_Validation_$Impl_$.ap(v5,(function($this) {
				var $r;
				var f3 = thx_Functions5.curry(f2);
				$r = thx__$Validation_Validation_$Impl_$.ap(v4,(function($this) {
					var $r;
					var f4 = thx_Functions4.curry(f3);
					$r = thx__$Validation_Validation_$Impl_$.ap(v3,(function($this) {
						var $r;
						var f5 = thx_Functions3.curry(f4);
						$r = thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
							var $r;
							var f6 = thx_Functions2.curry(f5);
							$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f6),function(e1,e2) {
								throw new js__$Boot_HaxeError("Unreachable");
							});
							return $r;
						}($this)),s);
						return $r;
					}($this)),s);
					return $r;
				}($this)),s);
				return $r;
			}($this)),s);
			return $r;
		}($this)),s);
		return $r;
	}(this)),s);
};
thx__$Validation_Validation_$Impl_$.val8 = function(f,v1,v2,v3,v4,v5,v6,v7,v8,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v8,(function($this) {
		var $r;
		var f1 = thx_Functions8.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v7,(function($this) {
			var $r;
			var f2 = thx_Functions7.curry(f1);
			$r = thx__$Validation_Validation_$Impl_$.ap(v6,(function($this) {
				var $r;
				var f3 = thx_Functions6.curry(f2);
				$r = thx__$Validation_Validation_$Impl_$.ap(v5,(function($this) {
					var $r;
					var f4 = thx_Functions5.curry(f3);
					$r = thx__$Validation_Validation_$Impl_$.ap(v4,(function($this) {
						var $r;
						var f5 = thx_Functions4.curry(f4);
						$r = thx__$Validation_Validation_$Impl_$.ap(v3,(function($this) {
							var $r;
							var f6 = thx_Functions3.curry(f5);
							$r = thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
								var $r;
								var f7 = thx_Functions2.curry(f6);
								$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f7),function(e1,e2) {
									throw new js__$Boot_HaxeError("Unreachable");
								});
								return $r;
							}($this)),s);
							return $r;
						}($this)),s);
						return $r;
					}($this)),s);
					return $r;
				}($this)),s);
				return $r;
			}($this)),s);
			return $r;
		}($this)),s);
		return $r;
	}(this)),s);
};
var thx_ValidationExtensions = function() { };
thx_ValidationExtensions.__name__ = ["thx","ValidationExtensions"];
thx_ValidationExtensions.leftMapNel = function(n,f) {
	return thx_Eithers.leftMap(n,function(n1) {
		return thx__$Nel_Nel_$Impl_$.map(n1,f);
	});
};
thx_ValidationExtensions.ensureNel = function(v,p,error) {
	{
		var left = v;
		switch(v[1]) {
		case 1:
			var a = v[2];
			if(p(a)) return v; else return thx_Either.Left(thx__$Nel_Nel_$Impl_$.pure(error));
			break;
		default:
			return left;
		}
	}
};
var thx_error_ErrorWrapper = function(message,innerError,stack,pos) {
	thx_Error.call(this,message,stack,pos);
	this.innerError = innerError;
};
thx_error_ErrorWrapper.__name__ = ["thx","error","ErrorWrapper"];
thx_error_ErrorWrapper.__super__ = thx_Error;
thx_error_ErrorWrapper.prototype = $extend(thx_Error.prototype,{
	innerError: null
	,__class__: thx_error_ErrorWrapper
});
var thx_fp__$Map_Map_$Impl_$ = {};
thx_fp__$Map_Map_$Impl_$.__name__ = ["thx","fp","_Map","Map_Impl_"];
thx_fp__$Map_Map_$Impl_$.empty = function() {
	return thx_fp_MapImpl.Tip;
};
thx_fp__$Map_Map_$Impl_$.singleton = function(k,v) {
	return thx_fp_MapImpl.Bin(1,k,v,thx_fp_MapImpl.Tip,thx_fp_MapImpl.Tip);
};
thx_fp__$Map_Map_$Impl_$.bin = function(k,v,lhs,rhs) {
	return thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(lhs) + thx_fp__$Map_Map_$Impl_$.size(rhs) + 1,k,v,lhs,rhs);
};
thx_fp__$Map_Map_$Impl_$.fromNative = function(map,comparator) {
	var r = thx_fp_MapImpl.Tip;
	var $it0 = map.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		r = thx_fp__$Map_Map_$Impl_$.insert(r,key,map.get(key),comparator);
	}
	return r;
};
thx_fp__$Map_Map_$Impl_$.lookup = function(this1,key,comparator) {
	switch(this1[1]) {
	case 0:
		return haxe_ds_Option.None;
	case 1:
		var rhs = this1[6];
		var lhs = this1[5];
		var xvalue = this1[4];
		var xkey = this1[3];
		var size = this1[2];
		var c = comparator(key,xkey);
		switch(c[1]) {
		case 0:
			return thx_fp__$Map_Map_$Impl_$.lookup(lhs,key,comparator);
		case 1:
			return thx_fp__$Map_Map_$Impl_$.lookup(rhs,key,comparator);
		case 2:
			return haxe_ds_Option.Some(xvalue);
		}
		break;
	}
};
thx_fp__$Map_Map_$Impl_$.lookupTuple = function(this1,key,comparator) {
	switch(this1[1]) {
	case 0:
		return haxe_ds_Option.None;
	case 1:
		var rhs = this1[6];
		var lhs = this1[5];
		var xvalue = this1[4];
		var xkey = this1[3];
		var size = this1[2];
		var c = comparator(key,xkey);
		switch(c[1]) {
		case 0:
			return thx_fp__$Map_Map_$Impl_$.lookupTuple(lhs,key,comparator);
		case 1:
			return thx_fp__$Map_Map_$Impl_$.lookupTuple(rhs,key,comparator);
		case 2:
			return haxe_ds_Option.Some({ _0 : xkey, _1 : xvalue});
		}
		break;
	}
};
thx_fp__$Map_Map_$Impl_$["delete"] = function(this1,key,comparator) {
	switch(this1[1]) {
	case 0:
		return thx_fp_MapImpl.Tip;
	case 1:
		var rhs = this1[6];
		var lhs = this1[5];
		var x = this1[4];
		var kx = this1[3];
		var size = this1[2];
		var _g = comparator(key,kx);
		switch(_g[1]) {
		case 0:
			return thx_fp__$Map_Map_$Impl_$.balance(kx,x,thx_fp__$Map_Map_$Impl_$["delete"](lhs,key,comparator),rhs);
		case 1:
			return thx_fp__$Map_Map_$Impl_$.balance(kx,x,lhs,thx_fp__$Map_Map_$Impl_$["delete"](rhs,key,comparator));
		case 2:
			return thx_fp__$Map_Map_$Impl_$.glue(lhs,rhs);
		}
		break;
	}
};
thx_fp__$Map_Map_$Impl_$.insert = function(this1,kx,x,comparator) {
	switch(this1[1]) {
	case 0:
		return thx_fp_MapImpl.Bin(1,kx,x,thx_fp_MapImpl.Tip,thx_fp_MapImpl.Tip);
	case 1:
		var rhs = this1[6];
		var lhs = this1[5];
		var y = this1[4];
		var ky = this1[3];
		var sz = this1[2];
		var _g = comparator(kx,ky);
		switch(_g[1]) {
		case 0:
			return thx_fp__$Map_Map_$Impl_$.balance(ky,y,thx_fp__$Map_Map_$Impl_$.insert(lhs,kx,x,comparator),rhs);
		case 1:
			return thx_fp__$Map_Map_$Impl_$.balance(ky,y,lhs,thx_fp__$Map_Map_$Impl_$.insert(rhs,kx,x,comparator));
		case 2:
			return thx_fp_MapImpl.Bin(sz,kx,x,lhs,rhs);
		}
		break;
	}
};
thx_fp__$Map_Map_$Impl_$.foldLeft = function(this1,b,f) {
	switch(this1[1]) {
	case 0:
		return b;
	case 1:
		var r = this1[6];
		var l = this1[5];
		var x = this1[4];
		return thx_fp__$Map_Map_$Impl_$.foldLeft(r,thx_fp__$Map_Map_$Impl_$.foldLeft(l,f(b,x),f),f);
	}
};
thx_fp__$Map_Map_$Impl_$.map = function(this1,f) {
	switch(this1[1]) {
	case 0:
		return thx_fp_MapImpl.Tip;
	case 1:
		var rhs = this1[6];
		var lhs = this1[5];
		var y = this1[4];
		var ky = this1[3];
		var sz = this1[2];
		return thx_fp_MapImpl.Bin(sz,ky,f(y),thx_fp__$Map_Map_$Impl_$.map(lhs,f),thx_fp__$Map_Map_$Impl_$.map(rhs,f));
	}
};
thx_fp__$Map_Map_$Impl_$.values = function(this1) {
	return thx_fp__$Map_Map_$Impl_$.foldLeft(this1,[],function(acc,v) {
		acc.push(v);
		return acc;
	});
};
thx_fp__$Map_Map_$Impl_$.foldLeftKeys = function(this1,b,f) {
	switch(this1[1]) {
	case 0:
		return b;
	case 1:
		var r = this1[6];
		var l = this1[5];
		var kx = this1[3];
		return thx_fp__$Map_Map_$Impl_$.foldLeftKeys(r,thx_fp__$Map_Map_$Impl_$.foldLeftKeys(l,f(b,kx),f),f);
	}
};
thx_fp__$Map_Map_$Impl_$.foldLeftAll = function(this1,b,f) {
	switch(this1[1]) {
	case 0:
		return b;
	case 1:
		var r = this1[6];
		var l = this1[5];
		var x = this1[4];
		var kx = this1[3];
		return thx_fp__$Map_Map_$Impl_$.foldLeftAll(r,thx_fp__$Map_Map_$Impl_$.foldLeftAll(l,f(b,kx,x),f),f);
	}
};
thx_fp__$Map_Map_$Impl_$.foldLeftTuples = function(this1,b,f) {
	switch(this1[1]) {
	case 0:
		return b;
	case 1:
		var r = this1[6];
		var l = this1[5];
		var x = this1[4];
		var kx = this1[3];
		return thx_fp__$Map_Map_$Impl_$.foldLeftTuples(r,thx_fp__$Map_Map_$Impl_$.foldLeftTuples(l,f(b,{ _0 : kx, _1 : x}),f),f);
	}
};
thx_fp__$Map_Map_$Impl_$.size = function(this1) {
	switch(this1[1]) {
	case 0:
		return 0;
	case 1:
		var size = this1[2];
		return size;
	}
};
thx_fp__$Map_Map_$Impl_$.balance = function(k,x,lhs,rhs) {
	var ls = thx_fp__$Map_Map_$Impl_$.size(lhs);
	var rs = thx_fp__$Map_Map_$Impl_$.size(rhs);
	var xs = ls + rs + 1;
	if(ls + rs <= 1) return thx_fp_MapImpl.Bin(xs,k,x,lhs,rhs); else if(rs >= 5 * ls) return thx_fp__$Map_Map_$Impl_$.rotateLeft(k,x,lhs,rhs); else if(ls >= 5 * rs) return thx_fp__$Map_Map_$Impl_$.rotateRight(k,x,lhs,rhs); else return thx_fp_MapImpl.Bin(xs,k,x,lhs,rhs);
};
thx_fp__$Map_Map_$Impl_$.glue = function(this1,that) {
	{
		var l = this1;
		var l1 = this1;
		switch(this1[1]) {
		case 0:
			return that;
		default:
			var r = that;
			var r1 = that;
			switch(that[1]) {
			case 0:
				return this1;
			default:
				if(thx_fp__$Map_Map_$Impl_$.size(l) > thx_fp__$Map_Map_$Impl_$.size(r)) {
					var t = thx_fp__$Map_Map_$Impl_$.deleteFindMax(l);
					return thx_fp__$Map_Map_$Impl_$.balance(t.k,t.x,t.t,r);
				} else {
					var t1 = thx_fp__$Map_Map_$Impl_$.deleteFindMin(r1);
					return thx_fp__$Map_Map_$Impl_$.balance(t1.k,t1.x,l1,t1.t);
				}
			}
		}
	}
};
thx_fp__$Map_Map_$Impl_$.deleteFindMin = function(map) {
	switch(map[1]) {
	case 1:
		var l = map[5];
		switch(map[5][1]) {
		case 0:
			var r = map[6];
			var x = map[4];
			var k = map[3];
			return { k : k, x : x, t : r};
		default:
			var r1 = map[6];
			var x1 = map[4];
			var k1 = map[3];
			var t = thx_fp__$Map_Map_$Impl_$.deleteFindMin(l);
			return { k : t.k, x : t.x, t : thx_fp__$Map_Map_$Impl_$.balance(k1,x1,t.t,r1)};
		}
		break;
	case 0:
		throw new thx_Error("can not return the minimal element of an empty map",null,{ fileName : "Map.hx", lineNumber : 161, className : "thx.fp._Map.Map_Impl_", methodName : "deleteFindMin"});
		break;
	}
};
thx_fp__$Map_Map_$Impl_$.deleteFindMax = function(map) {
	switch(map[1]) {
	case 1:
		var r = map[6];
		switch(map[6][1]) {
		case 0:
			var l = map[5];
			var x = map[4];
			var k = map[3];
			return { k : k, x : x, t : l};
		default:
			var l1 = map[5];
			var x1 = map[4];
			var k1 = map[3];
			var t = thx_fp__$Map_Map_$Impl_$.deleteFindMax(r);
			return { k : t.k, x : t.x, t : thx_fp__$Map_Map_$Impl_$.balance(k1,x1,l1,t.t)};
		}
		break;
	case 0:
		throw new thx_Error("can not return the maximal element of an empty map",null,{ fileName : "Map.hx", lineNumber : 171, className : "thx.fp._Map.Map_Impl_", methodName : "deleteFindMax"});
		break;
	}
};
thx_fp__$Map_Map_$Impl_$.rotateLeft = function(k,x,lhs,rhs) {
	switch(rhs[1]) {
	case 1:
		var ry = rhs[6];
		var ly = rhs[5];
		if(thx_fp__$Map_Map_$Impl_$.size(ly) < 2 * thx_fp__$Map_Map_$Impl_$.size(ry)) return thx_fp__$Map_Map_$Impl_$.singleLeft(k,x,lhs,rhs); else return thx_fp__$Map_Map_$Impl_$.doubleLeft(k,x,lhs,rhs);
		break;
	default:
		return thx_fp__$Map_Map_$Impl_$.doubleLeft(k,x,lhs,rhs);
	}
};
thx_fp__$Map_Map_$Impl_$.rotateRight = function(k,x,lhs,rhs) {
	switch(lhs[1]) {
	case 1:
		var ry = lhs[6];
		var ly = lhs[5];
		if(thx_fp__$Map_Map_$Impl_$.size(ry) < 2 * thx_fp__$Map_Map_$Impl_$.size(ly)) return thx_fp__$Map_Map_$Impl_$.singleRight(k,x,lhs,rhs); else return thx_fp__$Map_Map_$Impl_$.doubleRight(k,x,lhs,rhs);
		break;
	default:
		return thx_fp__$Map_Map_$Impl_$.doubleRight(k,x,lhs,rhs);
	}
};
thx_fp__$Map_Map_$Impl_$.singleLeft = function(k1,x1,t1,rhs) {
	switch(rhs[1]) {
	case 1:
		var t3 = rhs[6];
		var t2 = rhs[5];
		var x2 = rhs[4];
		var k2 = rhs[3];
		var lhs = thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t1) + thx_fp__$Map_Map_$Impl_$.size(t2) + 1,k1,x1,t1,t2);
		return thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(lhs) + thx_fp__$Map_Map_$Impl_$.size(t3) + 1,k2,x2,lhs,t3);
	default:
		throw new thx_Error("damn it, this should never happen",null,{ fileName : "Map.hx", lineNumber : 193, className : "thx.fp._Map.Map_Impl_", methodName : "singleLeft"});
	}
};
thx_fp__$Map_Map_$Impl_$.singleRight = function(k1,x1,lhs,t3) {
	switch(lhs[1]) {
	case 1:
		var t2 = lhs[6];
		var t1 = lhs[5];
		var x2 = lhs[4];
		var k2 = lhs[3];
		var rhs = thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t2) + thx_fp__$Map_Map_$Impl_$.size(t3) + 1,k1,x1,t2,t3);
		return thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t1) + thx_fp__$Map_Map_$Impl_$.size(rhs) + 1,k2,x2,t1,rhs);
	default:
		throw new thx_Error("damn it, this should never happen",null,{ fileName : "Map.hx", lineNumber : 199, className : "thx.fp._Map.Map_Impl_", methodName : "singleRight"});
	}
};
thx_fp__$Map_Map_$Impl_$.doubleLeft = function(k1,x1,t1,rhs) {
	switch(rhs[1]) {
	case 1:
		switch(rhs[5][1]) {
		case 1:
			var t4 = rhs[6];
			var x2 = rhs[4];
			var k2 = rhs[3];
			var t3 = rhs[5][6];
			var t2 = rhs[5][5];
			var x3 = rhs[5][4];
			var k3 = rhs[5][3];
			var lhs = thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t1) + thx_fp__$Map_Map_$Impl_$.size(t2) + 1,k1,x1,t1,t2);
			var rhs1 = thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t3) + thx_fp__$Map_Map_$Impl_$.size(t4) + 1,k2,x2,t3,t4);
			return thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(lhs) + thx_fp__$Map_Map_$Impl_$.size(rhs1) + 1,k3,x3,lhs,rhs1);
		default:
			throw new thx_Error("damn it, this should never happen",null,{ fileName : "Map.hx", lineNumber : 206, className : "thx.fp._Map.Map_Impl_", methodName : "doubleLeft"});
		}
		break;
	default:
		throw new thx_Error("damn it, this should never happen",null,{ fileName : "Map.hx", lineNumber : 206, className : "thx.fp._Map.Map_Impl_", methodName : "doubleLeft"});
	}
};
thx_fp__$Map_Map_$Impl_$.doubleRight = function(k1,x1,lhs,t4) {
	switch(lhs[1]) {
	case 1:
		switch(lhs[6][1]) {
		case 1:
			var t1 = lhs[5];
			var x2 = lhs[4];
			var k2 = lhs[3];
			var t3 = lhs[6][6];
			var t2 = lhs[6][5];
			var x3 = lhs[6][4];
			var k3 = lhs[6][3];
			var lhs1 = thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t1) + thx_fp__$Map_Map_$Impl_$.size(t2) + 1,k2,x2,t1,t2);
			var rhs = thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t3) + thx_fp__$Map_Map_$Impl_$.size(t4) + 1,k1,x1,t3,t4);
			return thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(lhs1) + thx_fp__$Map_Map_$Impl_$.size(rhs) + 1,k3,x3,lhs1,rhs);
		default:
			throw new thx_Error("damn it, this should never happen",null,{ fileName : "Map.hx", lineNumber : 213, className : "thx.fp._Map.Map_Impl_", methodName : "doubleRight"});
		}
		break;
	default:
		throw new thx_Error("damn it, this should never happen",null,{ fileName : "Map.hx", lineNumber : 213, className : "thx.fp._Map.Map_Impl_", methodName : "doubleRight"});
	}
};
var thx_fp_MapImpl = { __ename__ : ["thx","fp","MapImpl"], __constructs__ : ["Tip","Bin"] };
thx_fp_MapImpl.Tip = ["Tip",0];
thx_fp_MapImpl.Tip.toString = $estr;
thx_fp_MapImpl.Tip.__enum__ = thx_fp_MapImpl;
thx_fp_MapImpl.Bin = function(size,key,value,lhs,rhs) { var $x = ["Bin",1,size,key,value,lhs,rhs]; $x.__enum__ = thx_fp_MapImpl; $x.toString = $estr; return $x; };
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
var __map_reserved = {}
var ArrayBuffer = $global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = $global.DataView || js_html_compat_DataView;
var Uint8Array = $global.Uint8Array || js_html_compat_Uint8Array._new;
DateTools.DAYS_OF_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];
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
haxe_crypto_Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe_ds_ObjectMap.count = 0;
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
thx_Floats.TOLERANCE = 10e-5;
thx_Floats.EPSILON = 1e-9;
thx_Floats.pattern_parse = new EReg("^(\\+|-)?\\d+(\\.\\d+)?(e-?\\d+)?$","");
thx_Floats.order = thx__$Ord_Ord_$Impl_$.fromIntComparison(thx_Floats.compare);
thx_Floats.monoid = { zero : 0.0, append : function(a,b) {
	return a + b;
}};
thx_Dates.order = thx__$Ord_Ord_$Impl_$.fromIntComparison(thx_Dates.compare);
thx_Ints.pattern_parse = new EReg("^[ \t\r\n]*[+-]?(\\d+|0x[0-9A-F]+)","i");
thx_Ints.BASE = "0123456789abcdefghijklmnopqrstuvwxyz";
thx_Ints.order = function(i0,i1) {
	if(i0 > i1) return thx_OrderingImpl.GT; else if(i0 == i1) return thx_OrderingImpl.EQ; else return thx_OrderingImpl.LT;
};
thx_Ints.monoid = { zero : 0, append : function(a,b) {
	return a + b;
}};
thx_Orderings.monoid = { zero : thx_OrderingImpl.EQ, append : function(o0,o1) {
	switch(o0[1]) {
	case 0:
		return thx_OrderingImpl.LT;
	case 2:
		return o1;
	case 1:
		return thx_OrderingImpl.GT;
	}
}};
thx_Strings.order = thx__$Ord_Ord_$Impl_$.fromIntComparison(thx_Strings.compare);
thx_Strings.HASCODE_MAX = 2147483647;
thx_Strings.HASCODE_MUL = 31;
thx_Strings.monoid = { zero : "", append : function(a,b) {
	return a + b;
}};
thx_Strings.UCWORDS = new EReg("[^a-zA-Z]([a-z])","g");
thx_Strings.IS_BREAKINGWHITESPACE = new EReg("[^\t\n\r ]","");
thx_Strings.IS_ALPHA = new EReg("[^a-zA-Z]","");
thx_Strings.UCWORDSWS = new EReg("[ \t\r\n][a-z]","g");
thx_Strings.ALPHANUM = new EReg("^[a-z0-9]+$","i");
thx_Strings.DIGITS = new EReg("^[0-9]+$","");
thx_Strings.STRIPTAGS = new EReg("</?[a-z]+[^>]*>","gi");
thx_Strings.WSG = new EReg("[ \t\r\n]+","g");
thx_Strings.SPLIT_LINES = new EReg("\r\n|\n\r|\n|\r","g");
thx_Strings.CANONICALIZE_LINES = new EReg("\r\n|\n\r|\r","g");
thx_fp__$Map_Map_$Impl_$.delta = 5;
thx_fp__$Map_Map_$Impl_$.ratio = 2;
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
