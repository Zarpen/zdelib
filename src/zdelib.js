/*
Copyright (c) 2012 Alberto Romo Valverde
Licensed under the MIT license
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
* . -> class, # -> id, | -> tag, > -> custom selector
* _("selectorC") return class instance working with match elements
* _("selectorD") return array with match dom elements
* _("selectorO") return zdelib registered object
*/
//if(!window.M){
function M(id,sub_id){
	try{
	var mode = "class";
	if(id != undefined && id != null){
		if(typeof id == 'object' || typeof id == 'function'){
			var temp = id;
			if(id.Z_META_DATA) res = id.me;
			mode = "class";
			if(sub_id != undefined && sub_id != null){
				var name = sub_id.substr(0,sub_id.length-1);
				if(M.i) temp = M.i.getChild(id,name,[]);
				var op_char = sub_id.charAt(sub_id.length-1);
				switch(op_char){case "C": mode = "class";break; case "D": mode = "dom";break; case "O": mode = "object";break;}
			}
			M.i.me = false;
			M.i.me = temp.length ? (temp.length == 1 ? temp[0] : temp) : temp;
			if(mode == "class" && M.i.me){
				M.i.nav_reg = [];
				M.i.nav_reg.push(M.i.me);
			}
			M.i.selector = sub_id;
		}else{
			var id_char = id.substr(0,1);
			var op_char = id.charAt(id.length-1);
			var temp_base = M.i.base_doc ? M.i.base_doc : M.i.base_win.document;
			var res = temp_base.getElementById(id);
			var name = id.slice(1,id.length-1);
			if(id_char == "#") res = temp_base.getElementById(name);
			if(id_char == ".") res = M.i.getElementsByClassName(name);
			if(id_char == "|") res = temp_base.getElementsByTagName(name);
			if(name.indexOf(">") >= 0) res = M.i.z_selector(id.slice(0,id.length-1));
			if(res && !(res instanceof Array) && res.length !== undefined && (res.nodeType !== 0 && res.nodeType !== false && !res.nodeType)){var temp_array = [];for(var i=0;i<res.length;i++) temp_array.push(res[i]);res = temp_array;};
			if(res && res instanceof Array && (res.length === 1 || res.length === 0)) res = res[0]; 
			M.i.me = false;
			M.i.me = res;
			if(mode == "class" && M.i.me){
				M.i.nav_reg = [];
				M.i.nav_reg.push(M.i.me);
			}
			M.i.selector = id;
			switch(op_char){case "C": mode = "class";break; case "D": mode = "dom";break; case "O": mode = "object";break;}
		}
	}
	
	switch(mode){case "class": return M.i;break; case "dom": return M.i.me;break; case "object": return M.i.get_obj(M.i.me);break;}
	}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
(function (){
//M CLASS FUNCTIONS (DOM MANIPULATION AND MORE)
M.prototype.init = function(){
	M.i.mobile_host = M.i.isMobile({"width":800,"height":800});

	M.i.add_event("resize",{"func":function(e){
		M.i.mobile_host = M.i.isMobile({"width":800,"height":800});
		M.i.zb.updateBinds({"bindSpace":"zdelib","bindRule":"mobile_host"});
	},"capture":false},M.i.base_win);

	M.i.zb.createBindSpace({"name":"zdelib","scope":M.i});
	M.i.zb.addBindRule({"bindSpace":"zdelib","bindProperty":"mobile_host","bindElement":{"enabled":true,"type":"property"}});

	// attach base events
	if(M.i.base_win.addEventListener){
		M.i.base_win.addEventListener('load', M.i.run_load, false);
		M.i.base_win.addEventListener('unload', M.i.run_unload, false);
	}else if(M.i.base_win.attachEvent){
		M.i.base_win.attachEvent('onload', M.i.run_load);
		M.i.base_win.attachEvent('onunload', M.i.run_unload);
	}
	
	// init classes
	M.i.zg.g = M.i.zg.g();
	M.i.zg2.c = M.i.zg2.c();
	
	// attach object events
	M.i.add_event("mousemove",{"func":function(e){
		var dragOn = false;
		for(var i=0;i<M.i.reg_objs.length;i++) if(M.i.reg_objs[i].drag || M.i.reg_objs[i].resize) dragOn = true;
		if(dragOn){
			M.i.cancel_event(e);
			try{M.i.getBase().selection.empty();}catch(e){M.i.getWin().getSelection().removeAllRanges();}
			var rox = 5;
			var roy = 5;
			
			for(var i=0;i<M.i.reg_objs.length;i++){
				var reg_obj = M.i.reg_objs[i];

				var pos = M.i.event_pos(e);

				if(reg_obj.drag){
					var final_x_0,final_y_0,final_x_1,final_y_1,change_x,change_y,offset;
					final_x_0 = pos[0]-reg_obj.data.ipush[0];
					final_y_0 = pos[1]-reg_obj.data.ipush[1];
					final_x_1 = final_x_0+reg_obj.data.ipush[2];
					final_y_1 = pos[1]+reg_obj.data.ipush[3];
					
					offset = reg_obj.data.drag_area !== reg_obj.me.parentNode ? 
						reg_obj.data.drag_area.offsetTop+(reg_obj.data.drag_area.offsetHeight/2) : 0;
					if(reg_obj.data.limits){
						var l = reg_obj.data.limits;
						if((final_x_0 >= l.x[0] && final_x_1 <= l.x[1])) change_x = true;
						if((final_y_0 >= l.y[0] && final_y_1 <= l.y[1])) change_y = true;
						M.i.throttle(function(){
							if(change_x) M.i.set_sty("left:"+final_x_0+"px;",reg_obj.me.parentNode); else 
								M.i.set_sty("left:"+(final_x_0 < l.x[0] ? 0 : (final_x_1 > l.x[1] ? l.x[1]-reg_obj.data.ipush[2] : final_x_1))+"px;",reg_obj.me.parentNode);
							if(change_y) M.i.set_sty("top:"+final_y_0+"px;",reg_obj.me.parentNode); else
								M.i.set_sty("top:"+(final_y_0 < l.y[0] ? 0 : (final_y_1 > l.y[1] ? l.y[1]-reg_obj.data.ipush[3] : final_y_1))+"px;",reg_obj.me.parentNode);
						},10,M.i.init)();
					}else{
						M.i.throttle(function(){
							M.i.set_sty("left:"+final_x_0+"px;top:"+final_y_0+"px;",reg_obj.me.parentNode);
							reg_obj.data.last_pos = pos;
						},10,M.i.init)();
					}
				}

				var winLimit = M.i.win_size();
				var resizeLimit = (pos[0] <= 0 || pos[0] >= winLimit[0]) || (pos[1] <= 0 || pos[1] >= winLimit[1]);

				if(!resizeLimit && reg_obj.resize){
					var node = reg_obj.me;
					var final_w,final_h,type_x,type_y;
					var change_x,change_y,change_w,change_h;
					change_x = change_y = change_w = change_y = false;
					
					switch(reg_obj.resize){
						case "rul":
							change_x = change_w = change_y = change_h = true;type_x = type_y = 1;
							break;
						case "ruc":
							change_y = change_h = true;type_x = type_y = 1;
							break;
						case "rur":
							change_w = change_h = change_y = true;type_x = 2;type_y = 1;
							break;
						case "rl":
							change_w = change_x = true;type_x = type_y = 1;
							break;
						case "rr":
							change_w = true;type_x = 2;type_y = 1;
							break;
						case "rdl":
							change_w = change_x = change_h = true;type_x = 1;type_y = 2;
							break;
						case "rdc":
							change_h = true;type_x = 1;type_y = 2;
							break;
						case "rdr":
							change_w = change_h = true;type_x = type_y = 2;
							break;
					}

					if(type_x == 1) final_w = reg_obj.data.ipush[2] + ((reg_obj.data.ipush[0]+reg_obj.data.ipush[2]) - (pos[0]+reg_obj.data.ipush[2])); else 
						final_w = pos[0]-reg_obj.data.ipush[0];
					if(type_y == 1) final_h = reg_obj.data.ipush[3] + ((reg_obj.data.ipush[1]+reg_obj.data.ipush[3]) - (pos[1]+reg_obj.data.ipush[3])); else
						final_h = pos[1]-reg_obj.data.ipush[1];

					if((final_w <= 100 && change_w) || (final_h <= 40 && change_h)){
						if(change_w) reg_obj.data.ipush[2] = 100;
						if(change_h) reg_obj.data.ipush[3] = 40;
						return;
					}

					var wrap_obj = M.i.get_obj(node.parentNode);
					if(wrap_obj && wrap_obj.data.limits){
						if(pos[0] < wrap_obj.data.limits.x[0] || pos[0]+final_w > wrap_obj.data.limits.x[1]) change_x = false;
						if(pos[1] < wrap_obj.data.limits.y[0] || pos[1]+final_h > wrap_obj.data.limits.y[1]) change_y = false;
					}

					var max = M.i.max_wrap(node);
					if(change_x) M.i.set_sty("left:"+pos[0]+"px;",max ? max : node);
					if(change_y) M.i.set_sty("top:"+pos[1]+"px;",max ? max : node);
						
					while(node){
						if(change_w) M.i.set_sty("width:"+(final_w+(rox*2)+2)+"px;",node);
						if(change_h) M.i.set_sty("height:"+(final_h+(roy*2))+"px;",node);
						node = node.parentNode && node.parentNode.id && node.parentNode.id.search(/_wrap/) > -1 ? node.parentNode : false;
					}

					if(change_x) reg_obj.data.ipush[0] = pos[0];
					if(change_y) reg_obj.data.ipush[1] = pos[1];
					if(change_w) reg_obj.data.ipush[2] = final_w;
					if(change_h) reg_obj.data.ipush[3] = final_h;

					if(change_w) M.i.set_sty("width:"+(final_w)+"px;float:left;",reg_obj.me.id);

					var twSize = M.i.get_pos(reg_obj.me.id);
					var tmp = M.i.getElement(reg_obj.me.id);
					twSize[2] = tmp.scrollWidth ? tmp.offsetWidth : twSize[2];
					twSize[3] = tmp.scrollHeight ? tmp.offsetHeight : twSize[3];

					if(change_w) M.i.set_sty("width:"+(twSize[2])+"px;","#"+reg_obj.me.parentNode.id+" > .zdelib-resize-rucD");
					if(change_h) M.i.set_sty("height:"+(twSize[3])+"px;","#"+reg_obj.me.parentNode.id+" > .zdelib-resize-rlD");
					if(change_w) M.i.set_sty("width:"+(final_w)+"px;float:left;",reg_obj.me.id);
					if(change_h) M.i.set_sty("height:"+(twSize[3])+"px;","#"+reg_obj.me.parentNode.id+" > .zdelib-resize-rrD");
					if(change_w) M.i.set_sty("width:"+(twSize[2])+"px;","#"+reg_obj.me.parentNode.id+" > .zdelib-resize-rdcD");
				}
			}
		}
	},"capture":false},M.i.base_win);

	M.i.add_event("mouseup",{"func":function(e){
		var dragOn = false;
		for(var i=0;i<M.i.reg_objs.length;i++) if(M.i.reg_objs[i].drag || M.i.reg_objs[i].resize) dragOn = true;
		if(dragOn){
			M.i.cancel_event(e);
			for(var i=0;i<M.i.reg_objs.length;i++){
				if(M.i.reg_objs[i].drag){
					M.i.reg_objs[i].drag = false;
					M.i.reg_objs[i].data.ipush=false;
					M.i.reg_objs[i].me.parentNode.style.zIndex = "auto";
				}
				if(M.i.reg_objs[i].resize) M.i.reg_objs[i].resize = false;
			}
		}
	},"capture":false},M.i.base_win);
	
	// create basic lib css
	M.i.createCSS("zdelib-css",{"attr":"type=text/css;"});
	M.i.addRule([[".zdelib-resize-rul",""],[".zdelib-resize-rul:hover","cursor:se-resize;"],[".zdelib-resize-ruc",""],
		[".zdelib-resize-ruc:hover","cursor:n-resize;"],[".zdelib-resize-rur",""],[".zdelib-resize-rur:hover","cursor:sw-resize;"],
		[".zdelib-resize-rl",""],[".zdelib-resize-rl:hover","cursor:w-resize;"],[".zdelib-resize-rr",""],[".zdelib-resize-rr:hover","cursor:w-resize;"],
		[".zdelib-resize-rdl",""],[".zdelib-resize-rdl:hover","cursor:sw-resize;"],[".zdelib-resize-rdc",""],
		[".zdelib-resize-rdc:hover","cursor:n-resize;"],[".zdelib-resize-rdr",""],[".zdelib-resize-rdr:hover","cursor:se-resize;"],
		["article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section","display:block"]
	],"zdelib-css");
	
	// fix for html5 new elements on old browsers
	var e = ("abbr,article,aside,audio,canvas,datalist,details," +
	  "figure,footer,header,hgroup,mark,menu,meter,nav,output," +
	  "progress,section,time,video").split(',');
	for (var i = 0; i < e.length; i++) { M.i.base_doc.createElement(e[i]); }
	
	// html5 inits
	if(M.i.zg2.c){
	  var context = M.i.zg2.c.getContext("2d");
	  
	  M.i.zg2.setBounds({x:[0,M.i.base_doc.documentElement.clientWidth],y:[0,M.i.base_doc.documentElement.clientHeight]});
	  M.i.zg2_pixel_ratio = M.i.base_win.devicePixelRatio || 1;
	  M.i.zg2_store_ratio = context.webkitBackingStorePixelRatio ||
			      context.mozBackingStorePixelRatio ||
			      context.msBackingStorePixelRatio ||
			      context.oBackingStorePixelRatio ||
			      context.backingStorePixelRatio || 1;
	  M.i.zg2_computed_ratio = M.i.zg2_pixel_ratio / M.i.zg2_store_ratio;
	  M.i.zg2_device_resolution = [M.i.base_doc.documentElement.clientWidth,M.i.base_doc.documentElement.clientHeight];
	}
	
	M.i.base_win.requestAnimationFrame = (function(){
	  return  window.requestAnimationFrame       ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame    ||
		  function( callback ){
		    window.setTimeout(callback, 1000 / M.i.zg2_base_fps);
		  };
	})();
}
M.prototype.getMe = function(){
	return M.i.me;
}
M.prototype.setMe = function(me){
	try{M.i.me = false;M.i.me = M.i.getElement(me);
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.setBase = function(to){
	try{M.i.base_doc = to ? (typeof to == "object" ? to : M.i.base_win.frames[to].document) : document;
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.setWin = function(to){
	try{M.i.base_win = to ? (typeof to == "object" ? to : M.i.base_win.frames[to]) : window;
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.getBase = function(){
	return M.i.base_doc;
}
M.prototype.getWin = function(){
	return M.i.base_win;
}
M.prototype.obj_reg = function(type,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	var exist = false,res_obj = false;
	for(var i=0;i<M.i.reg_objs.length;i++) if(M.i.reg_objs[i].me === element) exist = M.i.reg_objs[i];
	if(exist === false){
		res_obj = {"Z_META_DATA":true,"id":element.id,"name":element.name,"me":element,"type":type,
		"drag":false,"resize":false,"maximized":false,"minimized":false,"title":"","focus":false,"x":false,"y":false,"w":false,"h":false,"rotate_2d":false,"data":{}};
		M.i.reg_objs.push(res_obj);
	}else{
		res_obj = exist;
	}
	M.i.nav_reg.push(res_obj);
	return res_obj;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.obj_unreg = function(to,del){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	var action_del = true;
	action_del = del === false ? false : action_del; 
	for(var i=0;i<M.i.reg_objs.length;i++){
		if(M.i.reg_objs[i].me === element){
			M.i.reg_objs.slice(i,1);
			if(action_del) M.i.del(M.i.reg_objs[i].me);
		}
	}	
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.get_obj = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	for(var i=0;i<M.i.reg_objs.length;i++) if(M.i.reg_objs[i].me === element) return M.i.reg_objs[i];
	return false;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.obj_prop = function(props,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	var obj = false;
	for(var i=0;i<M.i.reg_objs.length;i++) if(M.i.reg_objs[i].me === element) obj = i;
	if(obj >= 0) for(p in M.i.reg_objs[obj].Z_META_DATA) if(props[p]) M.i.reg_objs[obj].Z_META_DATA[p] = props[p];
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.is_reg = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	for(var i=0;i<M.i.reg_objs.length;i++) if(M.i.reg_objs[i].me === element) return true;
	return false;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.focus = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(M.i.actual_focus){
		var z = M.i.actual_focus.style.zIndex;
		M.i.actual_focus.style.zIndex = element.style.zIndex;
		element.style.zIndex = z;
	}
	M.i.actual_focus = element;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.load = function(func){
	try{M.i.load_queue.push(func);}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.unload = function(func){
	try{M.i.unload_queue.push(func);}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.run_load = function(){
	try{for(var i=0;i<M.i.load_queue.length;i++) M.i.load_queue[i]();}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.run_unload = function(){
	try{for(var i=0;i<M.i.unload_queue.length;i++) M.i.unload_queue[i]();
		// lib actions for unload
		for(var i=0;i<M.i.zt.timers;i++) if(M.i.zt.timers[i][2] == "I") M.i.base_win.clearInterval(M.i.zt.timers[i][1]); else M.i.base_win.clearTimeout(M.i.zt.timers[i][1]);
		M.i._unclass_all();
		for(var i=0;i<M.i.reg_objs.length;i++) M.i.reg_objs[i].me = false;
		M.i.zg2.deleteTimers();
	}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.getXhr = function(){
	try{var temp;
	// clean queue
	for(var i=0;i<M.i.xhr_queue.length;i++){ 
		if(M.i.xhr_queue[i].readyState == 4){
			temp = M.i.xhr_queue[i];
		}
	}
	if(temp == undefined || temp == null){
		temp = M.i.base_win.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		M.i.xhr_queue.push(temp);
	}
	
	return temp;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.getChild = function(comienzo,patron){
	try{var p = patron,c = comienzo,pa = null,h = null,t = 0,vi = false;len = 1;res = false,ar_res = [],len=1;
	for(var i=0;i<len;i++){
		if(c === pa && t == c.childNodes.length) break;
		if(!pa){
			pa = c;h = c.childNodes[0];t = 0;vi = false;
		}else if(!h){
			if(t < pa.childNodes.length){
				h = pa.childNodes[t];vi = false;
			}else{
				for(var k=0;k<pa.parentNode.childNodes.length;k++)
					if(pa.parentNode.childNodes[k] === pa){h = pa;pa = pa.parentNode;t = k+1;vi = true;break;}
			}
		}else{
			if(!vi){
				if(typeof p == "object"){
					if(p === h){
						res = h;break;
					}
				}else{
					if(p.substr(0,1) == "#" && (h.id && h.id == p.substr(1,p.length))){
						res = h;break;
					}else{
						if(p.substr(0,1) == "." && M.i.get_attr("class",h) == p.substr(1,p.length)) ar_res.push(h);
						if(p.substr(0,1) == "|" && (h.tagName == p.substr(1,p.length).toLowerCase() || h.tagName == p.substr(1,p.length).toUpperCase())) ar_res.push(h);
						// special search
						// attr search
						if(p.substr(0,1) == "["){
							var split_type = false;
							if(p.search(/=/) >= 0) split_type = "=";
							if(!split_type && p.search(/\*/) >= 0) split_type = "*";
							var att_val = p.replace(/\[/,"").replace(/\]/,"").split(split_type);
							try{var attr = h.getAttribute(att_val[0]);}catch(e){var attr = false;};
							if(attr){
								switch(split_type){
									case "=": if(attr == att_val[1]) ar_res.push(h); break;
									case "*": if(attr.search(att_val[1]) >= 0) ar_res.push(h); break;
								}
							}
						}
						// sty search
						if(p.substr(0,1) == "("){
							var split_type = false;
							if(p.search(/=/) >= 0) split_type = "=";
							if(!split_type && p.search(/\*/) >= 0) split_type = "*";
							var st_val = p.replace(/\{/,"").replace(/\}/,"").split(split_type);
							try{var sty = h.style[st_val[0]];}catch(e){var sty = false;};
							if(sty){
								switch(split_type){
									case "=": if(sty == sty_val[1]) ar_res.push(h); break;
									case "*": if(sty.search(sty_val[1]) >= 0) ar_res.push(h); break;
								}
							}
						}
					}
				}
			}
			if(h.childNodes.length > 0 && vi == false){
				pa = h;h = h.childNodes[0];t = 0;vi = false;
			}else{
				for(var k=0;k<pa.childNodes.length;k++) if(pa.childNodes[k] === h){h = null;t = k+1;vi = false;break;}
			}
		}
		if(i>=1000){i=0;len=2;}else{len++;}
	}
	ar_res = ar_res.length > 0 ? ar_res : false;
	return res ? res : ar_res;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.getElement = function(id){
	try{var res;
	if(typeof id == 'object'){ 
		res = id;
		if(id.Z_META_DATA) res = id.me;
	}else{
		var id_char = id.substr(0,1);
		res = M.i.base_doc.getElementById(id);
		var name = id_char ? id.substr(1,id.length) : id;
		if(id_char == "#") res = M.i.base_doc.getElementById(name);
		if(id_char == ".") res = M.i.getElementsByClassName(name);
		if(id_char == "|") res = M.i.base_doc.getElementsByTagName(name);
		if(name.indexOf(">") >= 0) res = M.i.z_selector(id.slice(0,id.length-1));
		if(res && !(res instanceof Array) && res.length !== undefined){var temp_array = [];for(var i=0;i<res.length;i++) temp_array.push(res[i]);res = temp_array;};
		if(res && res instanceof Array && (res.length === 1 || res.length === 0)) res = res[0];
	}
	return res;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.iter = function(func,elements){
	try{for(var i=0;i<elements.length;i++) func(elements[i],i);
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.mobile_event = function(event){
	try{
		var res = event;
		switch(res){
			case "mousedown": res = "touchstart";
			case "mousemove": res = "touchmove";
			case "mouseup": res = "touchend";
		}
	return res;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.desktop_event = function(event){
	try{
		var res = event;
		switch(res){
			case "touchstart": res = "mousedown";
			case "touchmove": res = "mousemove";
			case "touchend": res = "mouseup";
		}
	return res;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.add_event = function(event,options,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	var finalEvent = M.i.mobile_host ? M.i.mobile_event(event) : M.i.desktop_event(event);
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.add_event(finalEvent,{"func":function(i){return function(){options["func"].apply(options["with"] ? options["with"] : i,arguments);}}(item),"orig_func":options["func"]},item);},element);
	M.i.bind_events.push([element,options["orig_func"] ? options["orig_func"] : options["func"],function(){options["func"].apply(options["with"] ? options["with"] : element,arguments);},finalEvent]);
	if (element.addEventListener) element.addEventListener(finalEvent,M.i.bind_events[M.i.bind_events.length-1][2],options["capture"]);
	else element.attachEvent('on' + finalEvent,M.i.bind_events[M.i.bind_events.length-1][2]);
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.del_event = function(event,options,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	var finalEvent = M.i.mobile_host ? M.i.mobile_event(event) : M.i.desktop_event(event);
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.del_event(finalEvent,{"func":function(i){return function(){options["func"].apply(options["with"] ? options["with"] : i,arguments);}}(item),"orig_func":options["func"]},item);},element);
	var func = false;
	for(var i=0;i<M.i.bind_events.length;i++) if(M.i.bind_events[i][0] === element && (M.i.bind_events[i][1].toString() == options["func"].toString() || (options["orig_func"] && M.i.bind_events[i][1].toString() == options["orig_func"].toString())) && M.i.bind_events[i][3] == finalEvent) func = i;
	if(element.removeEventListener) element.removeEventListener(finalEvent,func ? M.i.bind_events[func][2] : function(){},options["capture"]); else element.detachEvent("on"+finalEvent,func ? M.i.bind_events[func][2] : function(){});
	if(func){M.i.bind_events[func][0] = false;M.i.bind_events.slice(func,func+1);}
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.cancel_event = function(e){
	try{if(e.preventDefault){
		e.preventDefault();
	}else{
		e.cancelBubble = true;
		e.returnValue = false;
	}
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.fire_event = function(event_name,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	var finalEvent = M.i.mobile_host ? M.i.mobile_event(event_name) : M.i.desktop_event(event_name);
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.fire_event(finalEvent,item);},element);
	
	var event;

	switch(finalEvent){
		case "click":
			if(M.i.base_doc.createEvent){
				event = M.i.base_doc.createEvent("MouseEvents");
				event.initMouseEvent(finalEvent, true, true, M.i.base_win,
					    1, 1, 1, 1, 1, false, false, false, false, 0, element);
				element.dispatchEvent(event);
			}else if(M.i.base_doc.createEventObject){
				event = M.i.base_doc.createEventObject();
				element.fireEvent('on'+finalEvent);
			}
		break;
		case "change":
			if(M.i.base_doc.createEvent){
				event = M.i.base_doc.createEvent("Event");
				event.initEvent(finalEvent,true,true);
				element.dispatchEvent(event);
			}else if(M.i.base_doc.createEventObject){
				event = M.i.base_doc.createEventObject();
				element.fireEvent('on'+finalEvent,event);
			}
		break;
	}
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.set_attr = function(attr_str,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.set_attr(attr_str,item);},element);
	
	var temp,name = element.id,vector = attr_str.split(';'),st,stval,pos;
	if(attr_str.search(/type/i) != -1 && (element.tagName == "input" || element.tagName == "INPUT") && element.parentNode){
		temp = M.i.base_doc.createElement('input');
		temp.id = name;
		for(var i=0;i < vector.length;i++){
			pos = vector[i].indexOf('=',0);
			if(pos > -1){
				st = vector[i].substring(0,pos);
				if(st == 'class' && navigator.appName == 'Microsoft Internet Explorer'){
					stval = vector[i].substring(pos+1,vector[i].length);
					element.setAttribute("class",stval);
					element.setAttribute("className",stval);
				}else{
					stval = vector[i].substring(pos+1,vector[i].length);
					temp.setAttribute(st,stval);
				}
			}
		}
		element.parentNode.replaceChild(temp,element);
	}else{
		for(var i = 0;i < vector.length;i++){
			pos = vector[i].indexOf('=',0);
			if(pos > -1){
				st = vector[i].substring(0,pos);
				if(st == 'class' && navigator.appName == 'Microsoft Internet Explorer'){
					stval = vector[i].substring(pos+1,vector[i].length);
					element.setAttribute("class",stval);
					element.setAttribute("className",stval);
				}else{
					stval = vector[i].substring(pos+1,vector[i].length);
					element.setAttribute(st,stval);
				}
			}
		}
	}
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.get_attr = function(attr_name,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array){
		var res_array = [];
		M.i.iter(function(item,index){res_array.push(M.i.get_attr(attr_name,item));},element);
		return res_array;
	}
	if(M.i.str_cmp(attr_name,"class")){
		return element.className;
	}else{
		return element.getAttribute(attr_name);
	}}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.del_attr = function(attr_name,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.del_attr(attr_name,item);},element);
	element.removeAttribute(attr_name);
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.set_sty = function(sty_str,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.set_sty(sty_str,item);},element);
	var vector = sty_str.split(';'),st,stval,pos;
	for(var i=0;i<vector.length;i++){
		pos = vector[i].indexOf(':',0);
		if(pos > -1){
			st = vector[i].substring(0,pos);
			stval = vector[i].substring(pos+1,vector[i].length);
			/* specific values */
			if(st == "float") st = M.i.is_ie() > 0 ? "styleFloat" : "cssFloat";
			element.style[st] = stval;
		}
	}
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.get_sty = function(sty_name,to,numeric){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	var final_sty = sty_name;
	var sty_val;
	if(element instanceof Array){
		var res_array = [];
		M.i.iter(function(item,index){res_array.push(M.i.get_sty(sty_name,item));},element);
		return res_array;
	}
	/* specific values */
	if(sty_name == "float") final_sty = "cssFloat";
	if(numeric){
		if(element.style && element.style[final_sty]){
			sty_val = element.style[final_sty];
			sty_modifier = sty_val.search("px") > -1 ? "px" : (sty_val.search("%") > -1 ? "%" : "px");
			sty_val = sty_modifier == "px" ? sty_val.slice(0,sty_val.search("px")) : (sty_modifier == "%" ? sty_val.slice(0,sty_val.search("%")) : sty_val.slice(0,sty_val.indexOf(" ")));
			sty_val = parseInt(M.i.trim(sty_val),10);
			sty_val = new Array(sty_val,sty_modifier);
		}else{
			sty_val = new Array(0,"px");
		}
	}else{
		sty_val = element.style[final_sty];
	}
	return sty_val;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.del_sty = function(sty_name,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.del_sty(sty_name,item);},element);
	element.style[sty_name] = '';
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.createCSS = function(name,options){
	try{var css = M.i.create(options["href"] ? "link" : "style",name,options);
	M.i.del_attr("name",css);
	// opera can have documents without head so ensure to create one
	if(!M.i.base_doc.getElementsByTagName("head")) M.i.base_doc.body.parentNode.insertBefore(M.i.base_doc.body,M.i.base_doc.createElement("head"));
	M.i.base_doc.getElementsByTagName("head")[0].appendChild(css);
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.addRule = function(rule_array,stylesheet){
	try{var target_sheet;
		var new_rule_array = [];

	// pre-process special css rules
	for(var i=0;i<rule_array.length;i++) if(rule_array[i][0] == "@import"){ M.i.createCSS("",{"attr":"rel=stylesheet;href="+rule_array[i][1]+";","href":true}); }else{ new_rule_array.push(rule_array[i]); }

	if(!isNaN(stylesheet)){
		target_sheet = M.i.base_doc.styleSheets[stylesheet];
	}else{
		var elems = M.i.base_doc.getElementsByTagName("style");
		for(var i=0;i<elems.length;i++) if(elems[i].id == stylesheet) target_sheet = M.i.base_doc.styleSheets[i];
		elems = M.i.base_doc.getElementsByTagName("link");
		for(var i=0;i<elems.length;i++) if(elems[i].id == stylesheet || elems[i].href == stylesheet) target_sheet = M.i.base_doc.styleSheets[i];
	}
	if(target_sheet){
		// test for func availability
		if(target_sheet.addRule){
			for(var i=0;i<new_rule_array.length;i++) target_sheet.addRule(new_rule_array[i][0],new_rule_array[i][1],new_rule_array[i][2] ? new_rule_array[i][2] : target_sheet.rules.length);
		}else if(target_sheet.insertRule){
			for(var i=0;i<new_rule_array.length;i++) target_sheet.insertRule(new_rule_array[i][0]+"{"+new_rule_array[i][1]+"}",new_rule_array[i][2] ? new_rule_array[i][2] : target_sheet.cssRules.length);
		}else{
			// no functions available try rules array
			if(target_sheet.cssRules){
				for(var i=0;i<new_rule_array.length;i++){
					var index = new_rule_array[i][2] ? new_rule_array[i][2] : target_sheet.cssRules.length;
					target_sheet.cssRules[index] = new_rule_array[i][0]+"{"+new_rule_array[i][1]+"}";
				}
			}else if(target_sheet.rules){
				for(var i=0;i<new_rule_array.length;i++){
					var index = new_rule_array[i][2] ? new_rule_array[i][2] : target_sheet.rules.length;
					target_sheet.rules[index] = new_rule_array[i][0]+"{"+new_rule_array[i][1]+"}";
				}
			}
		}
	}
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.deleteRule = function(rule_array,stylesheet){
	try{var target_sheet;
		var new_rule_array = [];

	// pre-process special css rules
	for(var i=0;i<rule_array.length;i++) if(!(rule_array[i][0] == "@import")) new_rule_array.push(rule_array[i]);

	if(!isNaN(stylesheet)){
		target_sheet = M.i.base_doc.styleSheets[stylesheet];
	}else{
		var elems = M.i.base_doc.getElementsByTagName("style");
		for(var i=0;i<elems.length;i++) if(elems[i].id == stylesheet) target_sheet = M.i.base_doc.styleSheets[i];
		elems = M.i.base_doc.getElementsByTagName("link");
		for(var i=0;i<elems.length;i++) if(elems[i].id == stylesheet || elems[i].href == stylesheet) target_sheet = elems[i];
	}
	if(target_sheet){
		// query array type {index,selectors}
		var index_array = !isNaN(new_rule_array[0]) ? true : false;
		// test for func availability
		if(target_sheet.removeRule){
			if(index_array){
				for(var i=0;i<new_rule_array.length;i++) target_sheet.removeRule(new_rule_array[i]);
			}else{
				for(var i=0;i<new_rule_array.length;i++){
					for(var j=0;j<target_sheet.rules.length;j++) if (target_sheet.rules[j].selectorText==new_rule_array[i][0]) target_sheet.removeRule(j);
				}
			}
		}else if(target_sheet.deleteRule){
			if(index_array){
				for(var i=0;i<new_rule_array.length;i++) target_sheet.deleteRule(new_rule_array[i]);
			}else{
				for(var i=0;i<new_rule_array.length;i++){
					for(var j=0;j<target_sheet.cssRules.length;j++) if (target_sheet.cssRules[j].selectorText==new_rule_array[i][0]) target_sheet.deleteRule(j);
				}
			}
		}else{
			// no functions available try rules array
			if(target_sheet.cssRules){
				if(index_array){
					var temp_array = [];
					var c = 0;
					for(var i=0;i<target_sheet.cssRules;i++){
						var found = false;
						for(var j=0;j<new_rule_array.length;j++) if(i == new_rule_array[j]) found = true;
						if(!found){temp_array[c]=target_sheet.cssRules[i];c++;}
					}
					target_sheet.cssRules = temp_array;
				}else{
					var temp_array = [];
					var c = 0;
					for(var i=0;i<target_sheet.cssRules;i++){
						var found = false;
						for(var j=0;j<new_rule_array.length;j++) if(target_sheet.cssRules[i].selectorText == new_rule_array[j][0]) found = true;
						if(!found){temp_array[c]=target_sheet.cssRules[i];c++;}
					}
					target_sheet.cssRules = temp_array;
				}
			}else if(target_sheet.rules){
				if(index_array){
					var temp_array = [];
					var c = 0;
					for(var i=0;i<target_sheet.rules;i++){
						var found = false;
						for(var j=0;j<new_rule_array.length;j++) if(i == new_rule_array[j]) found = true;
						if(!found){temp_array[c]=target_sheet.rules[i];c++;}
					}
					target_sheet.rules = temp_array;
				}else{
					var temp_array = [];
					var c = 0;
					for(var i=0;i<target_sheet.rules;i++){
						var found = false;
						for(var j=0;j<new_rule_array.length;j++) if(target_sheet.rules[i].selectorText == new_rule_array[j][0]) found = true;
						if(!found){temp_array[c]=target_sheet.rules[i];c++;}
					}
					target_sheet.rules = temp_array;
				}
			}
		}
	}
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.create = function(type,name,options){
	try{
		var new_element = M.i.base_doc.createElement(type);
		if(name){
			if(!options || !options["attr"] || options["attr"].search("id=") < 0) new_element.setAttribute("id",name);
			if(!options || !options["attr"] || options["attr"].search("name=") < 0) new_element.setAttribute("name",name);
		}
		if(options){
			if(options["attr"]) M.i.set_attr(options["attr"],new_element);
			if(options["sty"]) M.i.set_sty(options["sty"],new_element);
			if(options["bind"]) for(var item in options["bind"]) M.i.add_event(item,{"func":options["bind"][item],"capture":true},new_element);
			if(options["text"]) M.i.addText(options["text"],new_element);
			if(options["guid"]) new_element.id = new_element.name = M.i.guid();
			if(options["html"]) new_element.innerHTML = options["html"];
		}
		M.i.nav_reg.push(new_element);
		return new_element;
	}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.append = function(node,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.append(node,item);},element);
	if(node.tagName == "tr" || node.tagName == "TR"){ 
		var final_element;
		if(element.tagName == "table" || element.tagName == "TABLE"){ 
			if(element.tBodies.length <= 0){
				M.i.add("tbody","","",element);
				M.i.nav_reg.pop();
				final_element = element.tBodies[0];
			}else{
				final_element = element.tBodies[element.tBodies.length-1];
			} 
		}
		if(final_element) final_element.appendChild(node); else element.appendChild(node);
	}else{
		element.appendChild(node);
	}
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.add = function(type,name,options,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.add(type,name,options,item);},element);
	var new_node = M.i.create(type,name,options);
	M.i.append(new_node,element);
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.addm = function(data,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.addm(data,item);},element);
	
	var regexp = /<(.|\n)*?>/g;
	//var regexp_close = /<\s*\/\s*\w\s*.*?>|<\s*br\s*>/g;
	
	var tags = data.match(regexp);
	var open_node = element;
	var nodes = [];
	var content = data;
	
	nodes.push([element.tagName,false,element]);
	// iterate tags and process
	for(var i=0;i<tags.length;i++){
		// get tagname
		var tagname;
		for(var j=0;j<tags[i].length;j++){ if(tags[i].charAt(j) == " " || tags[i].charAt(j) == ">"){tagname = M.i.trim(tags[i].substr(1,j-1));break;} }
		// check for attrs
		var attr_tag = tags[i].replace(tagname,"");
		attr_tag = attr_tag.replace("<","");
		var lastix = false;
		if(attr_tag.match(/\//ig) && attr_tag.match(/\//ig).length > 1){
			lastix = attr_tag.lastIndexOf("/");
			if(lastix) attr_tag = attr_tag.substr(0,lastix)+attr_tag.substr(lastix+1);
		}else{
			attr_tag = attr_tag.replace("/","");
		}
		if(attr_tag.match(/\\/ig) && attr_tag.match(/\\/ig).length > 1){
			lastix = attr_tag.lastIndexOf("\\");
			if(lastix) attr_tag = attr_tag.substr(0,lastix)+attr_tag.substr(lastix+1);
		}else{
			attr_tag = attr_tag.replace("\\","");
		}
		if(attr_tag.match(/>/ig) && attr_tag.match(/>/ig).length > 1){
			lastix = attr_tag.lastIndexOf(">");
			if(lastix) attr_tag = attr_tag.substr(0,lastix)+attr_tag.substr(lastix+1);
		}else{
			attr_tag = attr_tag.replace(">","");
		}
		
		var attr_str = "",sty_str = "";
		var attrs = [];
		var quote = false;
		for(var j=0;j<attr_tag.length;j++){
			if(attr_tag.charAt(j) == "'" || attr_tag.charAt(j) == '"') quote = !quote;
			if(!quote){
				if(attr_tag.charAt(j) == " "){
					if(attrs.length < 1){
						attrs.push([j+1,false]);
					}else{
						var found = false;
						for(var z=0;z<attrs.length;z++) if(!attrs[z][1]) found = z;
						if(found >= 0){
							attrs[found][1] = j;
							attrs.push([j+1,false]);
						}
					}
				}
			}
		}
		for(var j=0;j<attrs.length;j++){
			if(attrs[j][0] && attrs[j][1]){
				attrs[j] = attr_tag.substr(attrs[j][0],attrs[j][1]-attrs[j][0]);
				if(attrs[j].search("style") >= 0){
					sty_str = attrs[j].substr(6);
					sty_str = sty_str.replace(/"/g,"");
					sty_str = sty_str.replace(/'/g,"");
				}else{
					var final_attr = attrs[j].replace(/"/g,"");
					final_attr = final_attr.replace(/'/g,"");
					attr_str = attr_str+final_attr+";";
				}
			}
		}
		
		var temp = "";
		for(var j=0;j<=content.length;j++){if(temp == tags[i]){temp = j;break;}else{temp = temp+content.charAt(j);}}
		content = content.substr(temp);
		temp = "";
		for(var j=0;j<=content.length;j++){if(temp.search(tags[i+1]) >= 0){temp = temp.replace(tags[i+1],"");content = content.substr(temp.length);break;}else{temp = temp+content.charAt(j);}}
		temp = temp.replace(/&nbsp;/gi,"\u00A0");
		if(temp.match(regexp)) temp = false; 
		
		if(tags[i].match(/</).length < 2 && tags[i].search("</") >= 0){
			// is close tag
			for(var j=nodes.length-1;j>=0;j--){if(!nodes[j][1]){nodes[j][1] = true;break;}}
			for(var j=nodes.length-1;j>=0;j--){if(!nodes[j][1]){open_node = nodes[j][2];break;}}
			if(temp) M.i.addText(temp,open_node);
		}else if(tags[i].match(/</).length < 2 && tags[i].search("</") < 0){
			// is open tag
			if(tags[i].match(/\/>/)){
				var new_node;
				if(tags[i].search("br") > 0){
					new_node = M.i.base_doc.createElement("br");
					M.i.append(new_node,open_node);
					if(temp) M.i.addText(temp,open_node);
				}else{
					new_node = M.i.create(tagname,"",{"attr":attr_str,"sty":sty_str});
					M.i.append(new_node,open_node);	
					if(temp) M.i.addText(temp,open_node);
				}
				nodes.push([tagname,true,new_node]);
			}else{
				var new_node = M.i.create(tagname,"",{"attr":attr_str,"sty":sty_str});
				M.i.append(new_node,open_node);
				nodes.push([tagname,false,new_node]);
				open_node = new_node;
				if(temp) M.i.addText(temp,open_node);
			}
		}
	}
	
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.del = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element){
		if(element instanceof Array) return M.i.iter(function(item,index){M.i.del(item);},element);
		if(element.Z_META_DATA){
			M.i.obj_unreg(element);
		}else{
			if(element.parentNode){
				element.parentNode.removeChild(element);
			}else{
				M.i.base_doc.body.appendChild(element);
				M.i.base_doc.body.removeChild(element);
			}	
		}
	}
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.replace = function(newn,oldn){
	try{var element = oldn != undefined && oldn != null ? M.i.getElement(oldn) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.replace(newn,item);},element);
	element.parentNode.replaceChild(element,M.i.getElement(newn));
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.move =function(target,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.move(target,item);},element);
	var node = target.parentNode ? target.parentNode.removeChild(target) : target;
	element.appendChild(node);
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.clear = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.clear(item);},element);
	for(var i=element.childNodes.length-1;i>=0;i--) element.removeChild(element.childNodes[i]);
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.addText = function(text,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.addText(text,item);},element);
	var text_node = M.i.base_doc.createTextNode(text);
	M.i.append(text_node,element);
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.setText = function(text,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.setText(text,item);},element);
	for(var i=0;i<element.childNodes.length;i++) if(element.childNodes[i].nodeType == 3) element.removeChild(element.childNodes[i]);
	M.i.addText(text,element);
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.getText = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	var res = [];
	for(var i=0;i<element.childNodes.length;i++) if(element.childNodes[i].nodeType == 3) res.push(element.childNodes[i].nodeValue);
	return res.join("");}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.html = function(html,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.html(html,item);},element);
	element.innerHTML = html;
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.win_size = function(){
	try{return new Array(M.i.base_win.innerWidth ? M.i.base_win.innerWidth : M.i.base_doc.getElementsByTagName("html")[0].offsetWidth,
		M.i.base_win.innerHeight ? M.i.base_win.innerHeight : M.i.base_doc.getElementsByTagName("html")[0].offsetHeight);}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.win_scroll = function(){
	try{return new Array(M.i.base_win.pageXOffset ? M.i.base_win.pageXOffset : M.i.base_doc.body.scrollLeft,
		M.i.base_win.pageYOffset ? M.i.base_win.pageYOffset : M.i.base_doc.body.scrollTop);}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.get_size = function(comienzo){
    try{var c = comienzo,pa = null,h = null,t = 0,vi = false,len = 1;
	for(var i=0;i<len;i++){
		if(c === pa && t == c.childNodes.length) return 1;
		if(!pa){
			pa = c;h = c.childNodes[0];t = 0;vi = false;
		}else if(!h){
			if(t < pa.childNodes.length){
				h = pa.childNodes[t];vi = false;
			}else{
				for(var k=0;k<pa.parentNode.childNodes.length;k++)
					if(pa.parentNode.childNodes[k] === pa){h = pa;pa = pa.parentNode;t = k+1;vi = true;break;}
			}
		}else{
			if(!vi){
				if(pa.offsetLeft != undefined && h.offsetLeft != undefined && h.offsetWidth != undefined) 
					if((h.offsetLeft-pa.offsetLeft)+h.offsetWidth > M.i.rect[2]) M.i.rect[2] = (h.offsetLeft-pa.offsetLeft) 
						+ h.offsetWidth;
				if(h.offsetTop != undefined && h.offsetHeight != undefined) if(h.offsetTop+h.offsetHeight > M.i.rect[3])
					M.i.rect[3] = h.offsetTop+h.offsetHeight;
			}
			if(h.childNodes.length > 0 && vi == false){
				pa = h;h = h.childNodes[0];t = 0;vi = false;
			}else{
				for(var k=0;k<pa.childNodes.length;k++) if(pa.childNodes[k] === h){h = null;t = k+1;vi = false;break;}
			}
		}
		if(i >= 1000){i=0;len=10;}else{len++;}
	}}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
// get position and widths for elements already attached to dom tree
M.prototype.get_pos = function(to,scroll){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array){
		var res_array = [];
		M.i.iter(function(item,index){res_array.push(M.i.get_pos(item,scroll));},element);
		return res_array;
	}
	var r = element,left = 0,top = 0;
	while(r != null){ if(r.offsetLeft) left += r.offsetLeft; if(r.offsetTop) top += r.offsetTop; r= r.offsetParent;}
	M.i.rect[2] = M.i.rect[3] = 0;
	M.i.get_size(element);
	if(element.offsetWidth > M.i.rect[2]) M.i.rect[2] = element.offsetWidth;
	if(element.offsetHeight > M.i.rect[3]) M.i.rect[3] = element.offsetHeight;
	
	if(scroll){
		return new Array(left+M.i.win_scroll()[0],top+M.i.win_scroll()[1],M.i.rect[2],M.i.rect[3]);
	}else{
		return new Array(left,top,M.i.rect[2],M.i.rect[3]);
	}}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
// set dimensions to element
M.prototype.set_pos = function(dim,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.set_pos(dim,item);},element);
	
	element.style.left = isNaN(dim[0]) ? dim[0] : dim[0]+"px";
	element.style.top = isNaN(dim[1]) ? dim[1] : dim[1]+"px";
	element.style.width = isNaN(dim[2]) ?  dim[2] : dim[2]+"px";
	element.style.height = isNaN(dim[3]) ? dim[3] : dim[3]+"px";
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.center = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.center(item);},element);
	
	var pos = M.i.get_pos(element);
	var left = M.i.win_size()[0];
	var top = M.i.win_size()[1];
	
	pos[1] = Math.round(left/2) - Math.round(pos[2]/2);
	pos[0] = Math.round(top/2) - Math.round(pos[3]/2);
	
	element.style.top = pos[0]+"px";
	element.style.left = pos[1]+"px";
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.wrap = function(opts,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.wrap(item);},element);
	
	var parent = element.parentNode ? element.parentNode : M.i.base_doc.body;
	var node = parent.removeChild(element);
	
	var wrape = M.i.create((opts["type"] ? opts["type"] : "div"),(node.id ? (M.i.base_doc.getElementById(node.id+"_wrap") ? M.i.guid()+"_wrap" : node.id+"_wrap") : 
		(opts["id"] ? opts["id"]+"_wrap" : M.i.guid()+"_wrap")));
	
	wrape.style.cssText = node.style.cssText;
	M.i.set_attr("class=zdelib-wrapper;",wrape);
	M.i.set_sty("position:relative;left:0px;top:0px;",node);
	
	parent.appendChild(wrape);
	wrape.appendChild(node);
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.unwrap = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.unwrap(item);},element);
	
	if(element.parentNode){
		var grand_parent = element.parentNode.parentNode ? element.parentNode.parentNode : M.i.base_doc.body;
		var parent = element.parentNode;
		var node = parent.removeChild(element);
		node.style.cssText = parent.cssText;
		grand_parent.appendChild(node);
		if(parent.childNodes.length < 1) grand_parent.removeChild(parent);
	}
	
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.gnext = function(filter,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	
	var nn = element.nextSibling;
	while(!nn || (filter && nn.nodeType != 1)) nn = element.nextSibling;
	return nn;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.gprev = function(filter,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	
	var nn = element.previousSibling;
	while(!nn || (filter && nn.nodeType != 1)) nn = element.previousSibling;
	return nn;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.gfirst = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
		return element.firstChild ? element.firstChild : element.childNodes[0];
	}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.glast = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
		return element.lastChild ? element.lastChild : element.childNodes[element.childNodes.length > 0 ? element.childNodes.length-1 : 0];
	}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.gparent = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
		return element.parentNode ? element.parentNode : M.i.base_doc.body;
	}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.request = function(options,poll){
	try{
	var final_url = options["url"];
	var type = options["type"] ? options["type"] : false;
	// some timeouts can call before restart due to javascript engine not fast enought, try to restart the poll on the request call init
	if(options["poll"] && !poll) M.i.poll_restart(options["poll"]);
	
	var check_poll = function(poll_opts,poll_data){
		var name = poll_opts["poll"];
		if(M.i.poll_exist(name) && poll){
			// poll running
			if(poll != "restart"){
				if(M.i.poll_live(name)){
					if(!M.i.zt.tick_live(name)){
						M.i.zt.tick_on(name,function(){
							M.i.update_poll(name);
							if(M.i.poll_count(name) == poll && M.i.poll_live(name)){					
								if(!M.i.zt.tick_live(name+"_restart")){
									M.i.zt.end(name);
									poll_opts["pfunc"](poll_data);
									M.i.request.apply(M.i.request,[poll_opts,poll+1]);
								}
							}
						},(poll_opts["poll_delay"] ? poll_opts["poll_delay"] : 1000));
					}
				}else{
					M.i.zt.end(name);
				}
			}else{	
				if(!M.i.zt.tick_live(name+"_restart")){
					M.i.zt.tick_on(name+"_restart",function(){
						M.i.zt.end(name);
						M.i.zt.end(name+"_restart");
						M.i.start_poll(name);
						poll_opts["pfunc"](poll_data);
						M.i.request.apply(M.i.request,[poll_opts,1]);
					},(poll_opts["poll_delay"] ? poll_opts["poll_delay"] : 1000));
				}
			}
		}else if(!M.i.poll_exist(name) && !poll){
			// start poll
			M.i.zt.end(name);
			M.i.start_poll(name);
			poll_opts["pfunc"](poll_data);
			M.i.request.apply(M.i.request,[poll_opts,1]);
		}else if(M.i.poll_exist(name)){
			// restart poll
			M.i.zt.end(name);
			poll_opts["pfunc"](poll_data);
			M.i.stop_poll(name);
			M.i.poll_restart(name);
			M.i.request.apply(M.i.request,[poll_opts,"restart"]);
		}else{
			M.i.zt.end(name);
			// stop poll requested in some point do nothing
		}
	}
	
	if(type && type == "jsonp"){
		// special jsonp request
		var prefix = options["prefix"] ? options["prefix"] : "callback";
		var pcallback = options["pcallback"] ? options["pcallback"] : "M.i.jsonp_handler."+options["id"];
		var del_tag = options["deltag"] ? options["deltag"] : true;
		
		final_url = final_url.indexOf("?") < 0 ?  final_url+"?"+prefix+"="+pcallback : final_url+"&"+prefix+"="+pcallback;
		
		if(options["pfunc"]){
			if(options["wrap"]){
				// check if object exist and save
				var temp_obj = M.i.base_win[options["wrap"]["key"]] ? M.i.base_win[options["wrap"]["key"]] : null;
				// function for object iteration
				var iterate = function(obj){
					for (var property in obj) {
						if (obj.hasOwnProperty(property)) {
							if (typeof obj[property] == "object"){
								iterate(obj[property]);
							}else{
								if(property == options["wrap"]["function_key"]) obj[property] = function(data){
									M.i.base_win[options["wrap"]["key"]] = temp_obj;
									if(del_tag) if(M.i.getElement(options["id"])) M.i.del(options["id"]);
									if(options["poll"]) check_poll(options,data); else options["pfunc"](data);
								}
							}
						}
					}
				}
				M.i.base_win[options["wrap"]["key"]] = options["wrap"]["value"];
				iterate(M.i.base_win[options["wrap"]["key"]]);
			}else{
				M.i.jsonp_handler[options["id"]] = function(data){
					if(del_tag) if(M.i.getElement(options["id"])) M.i.del(options["id"]);
					if(options["poll"]) check_poll(options,data); else options["pfunc"](data);
				};
			}
		}
		
		M.i.add("script",options["id"],{"attr":"type=text/javascript;src="+final_url},M.i.base_doc.getElementsByTagName("head")[0]);
	}else{
		// normal request
		var params = options["params"];
		var post = options["method"] == "POST" ? true : false;
		var mime = options["mime"] ? options["mime"] : false;
		var xhr = M.i.getXhr();
		
		// take params from url if no separate ones
		if(!params && post){
			final_url = options["url"].slice(0,options["url"].indexOf("?"));
			params = options["url"].slice(options["url"].indexOf("?")+1);
		}
		
		// open request
		if(options["auth"]){
			xhr.open(options["method"],final_url,options["async"],options["user"],options["pass"]);
		}else{
			xhr.open(options["method"],final_url,options["async"]);
		}
		
		// set header if post petition
		if(post) xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		// if user request other headers apply it
		if(options["headers"]) for(var i=0;i<options["headers"].length;i++) xhr.setRequestHeader(options["headers"][i][0], options["headers"][i][1]);
		// query data type
		if(type && type == "xml"){if(xhr.contentType) xhr.contentType = "Document";if(xhr.overrideMimeType)xhr.overrideMimeType("text/xml");};
		if(type && type == "binary"){if(xhr.contentType) xhr.contentType = "blob";if(xhr.overrideMimeType) xhr.overrideMimeType("text/plain; charset=x-user-defined")};
		if(type && type == "json"){if(xhr.contentType) xhr.contentType = "json";if(xhr.overrideMimeType) xhr.overrideMimeType("application/json")};
		if(type && type == "html"){if(xhr.contentType) xhr.contentType = "text";if(xhr.overrideMimeType) xhr.overrideMimeType("text/html")};
		if(mime) if(xhr.overrideMimeType) xhr.overrideMimeType(mime);
		
		// attach callback on asyncronous request
		if(options["async"]){
			xhr.onreadystatechange = function(){
				if(xhr.readyState==4){
					if(!xhr.status||xhr.status == 200){
						var result = false;
						if(type == "html" || !type) result = xhr.responseText;
						if(!result && type == "xml") result = xhr.responseXML ? xhr.responseXML : (xhr.response ? xhr.response : xhr.responseText);
						if(!result && type == "json") if(xhr.response) result = typeof xhr.response == "object" ? xhr.response : (options["jsontext"] ? xhr.response : M.i.DJSON({"json":xhr.response}));
							else result = !options["jsontext"] ? M.i.DJSON({"json":xhr.responseText}) : xhr.responseText;
						if(!result) result = xhr.responseText;
						options["func"](result,xhr);
						if(options["poll"]) check_poll(options["poll"]);
					}else{
						options["func"](xhr.responseText,xhr);
						if(options["poll"]) check_poll(options["poll"]);
					}
				}
			}
		}
		// send request post with params
		if(post) xhr.send(params); else xhr.send(null);
		// on synchronous request dont attach handle (issues on some-browsers not firing it) directly 
		// execute handle code after send
		if(!options["async"]){
			var result = false;
			if(type == "html" || !type) result = xhr.responseText;
			if(!result && type == "xml") result = xhr.responseXML ? xhr.responseXML : (xhr.response ? xhr.response : xhr.responseText);
			if(!result && type == "json") if(xhr.response) result = typeof xhr.response == "object" ? xhr.response : (options["jsontext"] ? xhr.response : M.i.DJSON({"json":xhr.response}));
				else result = !options["jsontext"] ? M.i.DJSON({"json":xhr.responseText}) : xhr.responseText;
			if(!result) result = xhr.responseText;
			options["func"](result,xhr);
			if(options["poll"]) check_poll(options["poll"]);
		}
		return xhr;
	}
	}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
// CLASSES
// time class
M.prototype.zt = {
	timers:[],
	d:function(){return new Date();},
	tick:function(name,code,period){
		try{
			var it = M.i.base_win.setInterval(code,period);
			M.i.zt.timers.push([name,it,"I",false,{}]);
		}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	},
	tick_fps:function(name,code,fps){
		try{
			var it = M.i.base_win.setInterval(function(){
				for(var i=0;i<M.i.zt.timers.length;i++){
					if(M.i.str_cmp(name,M.i.zt.timers[i][0])){
						if(M.i.zt.d().getTime()-M.i.zt.timers[i][3] >= 1000/fps){code.apply(M.i.zt,arguments);M.i.zt.timers[i][3] = M.i.zt.d().getTime();}
					}
				}
			},1000/fps);
			M.i.zt.timers.push([name,it,"I",M.i.zt.d().getTime(),{}]);
		}catch(e){
			if(M.i.debug_mode) M.i.error(e,arguments);
		}
	},
	tick_var:function(name,name_var,value){
		try{
			for(var i=0;i<M.i.zt.timers.length;i++){
				if(M.i.str_cmp(name,M.i.zt.timers[i][0])){
					if(name_var){
						if(value) M.i.zt.timers[i][4][name_var] = value; else return M.i.zt.timers[i][4][name_var];
					}
				} 	
			}
		}catch(e){
			if(M.i.debug_mode) M.i.error(e,arguments);
		}
	},
	tick_on:function(name,code,period){
		try{
			var found = false;
			for(var i=0;i<M.i.zt.timers.length;i++) if(M.i.zt.timers[i][0] == name) found = true;
			if(!found){
				var to = M.i.base_win.setTimeout(code,period);
				M.i.zt.timers.push([name,to,"T",false,{}]);
			}
		}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}},
	tick_live:function(name){
		try{
			var res = false;
			for(var i=0;i<M.i.zt.timers.length;i++)  if(M.i.str_cmp(name,M.i.zt.timers[i][0])) res = true;
			return res;
		}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	},
	end:function(name,type){
		try{
			var remove = [];
			var final_ticks = [];
			for(var i=0;i<M.i.zt.timers.length;i++){
				if((name && M.i.str_cmp(name,M.i.zt.timers[i][0])) || (type && (type == M.i.zt.timers[i][2] || type == "A"))){
					if(M.i.zt.timers[i][2] == "I") M.i.base_win.clearInterval(M.i.zt.timers[i][1]); else M.i.base_win.clearTimeout(M.i.zt.timers[i][1]);
					remove.push(i);
				} 	
			}
			for(var i=0;i<M.i.zt.timers.length;i++) if(remove.indexOf(i) < 0) final_ticks.push(M.i.zt.timers[i]);
			M.i.zt.timers = final_ticks;
		}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}},
	end_intervals:function(){try{ M.i.zt.end(false,"I"); }catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}},
	end_timeouts:function(){try{ M.i.zt.end(false,"T"); }catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}},
	end_all:function(){ try{ M.i.zt.end(false,"A"); }catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}},
	leap_year:function(y){return ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0);},
	month_days:function(m,y){return m == 2 ? 28+M.i.zt.leap_year(y) : 31-((m-4)*(m-6)*(m-9)*(m-11) == 0);},
	date_comp:function(date1,date2){
		try{var dmy1,dmy2;
		var js_date = M.i.zt.d();
		var ok1 = 0,ok2 = 0,res = "e";
		dmy1 = date1.split("/");
		dmy2 = date2.split("/");
		if(((dmy1.length >0 && dmy1.length < 4) && (dmy1[0] > 0 && dmy1[0] < 32) && (dmy1[1] > 0 && dmy1[1] < 13)) && dmy1[2] > 0) ok1=1;
		if(((dmy2.length >0 && dmy2.length < 4) && (dmy2[0] > 0 && dmy2[0] < 32) && (dmy2[1] > 0 && dmy2[1] < 13)) && dmy2[2] > 0) ok2=1;
		if(ok1==1 && ok2 == 1) res = Date.parse(dmy1[1]+"/"+dmy1[0]+"/"+dmy1[2]) - Date.parse(dmy2[1]+"/"+dmy2[0]+"/"+dmy2[2]);
		return res;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	},
	date_add:function(date1,n,t){
		try{var d1,m1,y1,dmy,mili,amount = 0;
		var js_date = new Date();
		var ok = 0,res = "e";
		dmy = date1.split("/");
		d1 = parseInt(dmy[0]);
		m1 = parseInt(dmy[1]);
		y1 = parseInt(dmy[2]);
		if(((dmy.length >0 && dmy.length < 4) && (d1 > 0 && d1 < 32) && (m1 > 0 && m1 < 13)) && y1 > 0) ok=1;
		if(ok==1){
			if(t == "d") amount = n*(24*60*60*1000);
			if(t == "m"){
				var j=y1,k=d1,ia=m1;
				for(var i=(m1 ? m1 : 1); i<m1+n; i++,ia++){
					k = k > M.i.month_days(ia,j) ? k-M.i.month_days(ia,j) : k;
					amount += ((M.i.month_days(ia,j)-k)+k)*24*60*60*1000;
					if(ia % 12 == 0){
						ia = 0;
						j++;
					}
				}
			} 	
			if(t == "y") for(var i=y1;i<y1+n;i++) amount += ((365+M.i.leap_year(i))*24*60*60*1000)
			mili = Date.parse(dmy[1]+"/"+dmy[0]+"/"+dmy[2]) + amount;
			mili = js_date.getTime() + (mili-js_date.getTime());
			js_date.setTime(mili);
			res = new Array(js_date.getDate(),js_date.getMonth()+1,js_date.getFullYear());
		}
		return (res != "e" ? res.slice(0) : res);}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	},
	// still test cases for this function needed
	date_diff:function(date1,date2){
		try{var d = 0,m = 0,y = 0,c;
		var ms = Math.abs(M.i.comp_date(date1,date2));
		var days = parseInt((((ms/1000)/60)/60)/24);
		var min_date = ms <= 0 ? date1 : date2;
		min_date = min_date.split("/");
		for(var i=0;i<days;i++){
			c = M.i.date_add(min_date[0]+"/"+min_date[1]+"/"+min_date[2],1,"d");
			if(min_date[0] != c[0]){ d++;}
			if(min_date[1] != c[1]){ m++;d=1;}
			if(min_date[2] != c[2]){ y++;m=1;}
			min_date = c;
		}
		return new Array(d,m,y);}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	},
	week_day:function(d,m,y){
		try{
			var dt = new Date(y+"-"+(m < 10 ? "0"+m : m)+"-"+(d < 10 ? "0"+d : d));
			return dt.getDay();
		}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	},
	print_fdate:function(){ 
		return M.i.zt.d().toLocaleString();
	}
}
// math class
M.prototype.zm = {
	deg_rad:function(deg){ return deg*(Math.PI/180);},
	rad_deg:function(rad){ return rad*(180/Math.PI);},
	fix_rat:function(value,old_proportion,new_proportion){
		var percent;
		var res = -1;
		
		percent = parseFloat(Math.abs(parseInt(new_proportion)-parseInt(old_proportion))/old_proportion);
		if(new_proportion >= old_proportion){
			res = (value * (parseFloat(1+percent)));
		}else{
			res = (value * (parseFloat(1-percent)));
		}
		return res;
	},
	percent:function(percent,value){return parseFloat((value/100)*percent);},
	percentByVal:function(percent,value){return parseFloat((percent/value)*100);},
}
// graphics class
M.prototype.zg = {
	// object for html tags wrap graphics
	g:function(){
		try{if(!!M.i.base_doc.createElementNS && !!M.i.base_doc.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect){
			return 0;
		}else{
			if(M.i.is_ie() >=0){
				if (!M.i.base_doc.namespaces['z_v']) {M.i.base_doc.namespaces.add('z_v', 'urn:schemas-microsoft-com:vml','#default#VML');}
				if (!M.i.base_doc.namespaces['z_v_o']) {M.i.base_doc.namespaces.add('z_v_o', 'urn:schemas-microsoft-com:office:office','#default#VML');}
			}else{
				M.i.base_doc.getElementsByTagName("html")[0].setAttribute("xmlns:z_v_2","");
			}
			if(!M.i.base_doc.styleSheets['zdelib_zg']){
				var ss = M.i.base_doc.createStyleSheet();
				ss.owningElement.id = 'zdelib_zg';
				ss.cssText = 'z_v\\:*{behavior:url(#default#VML);display:inline-block}z_v_o\\:*{behavior:url(#default#VML);display:inline-block}z_v_2\\:*{behavior:url(#default#VML);display:inline-block}';
			}
			return 1;
		}}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	},
	put:function(x,y,w,h,scroll,to){
		try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
		if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg.put(x,y,w,h,scroll,item);},element);
		var obj_pos = M.i.get_pos(element);
		var obj = M.i.is_reg(element) ? M.i.get_obj(element) : M.i.obj_reg("ZG",element);
		var sc = M.i.win_scroll();
		M.i.set_sty("position:absolute;left:"+(scroll ? (!M.i.empty(x) ? x+sc[0] : obj_pos[0]+sc[0]) : (!M.i.empty(x) ? x : obj_pos[0]))+"px;top:"+
		(scroll ? (!M.i.empty(y) ? y+sc[1] : obj_pos[1]+sc[1]) : (!M.i.empty(y) ? y : obj_pos[1]))
			+"px;width:"+(!M.i.empty(w) ? w : obj_pos[2])+"px;height:"+(!M.i.empty(h) ? h : obj_pos[3])+"px;",element);
		M.i.obj_prop({"X":(scroll ? (!M.i.empty(x) ? x+sc[0] : obj_pos[0]+sc[0]) : (!M.i.empty(x) ? x : obj_pos[0])),"Y":
		(scroll ? (!M.i.empty(y) ? y+sc[1] : obj_pos[1]+sc[1]) : (!M.i.empty(y) ? y : obj_pos[1])),"W":(!M.i.empty(w) ? w : obj_pos[2]),"H":(!M.i.empty(h) ? h : obj_pos[3])},element);
		return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	},
	rotate_2d:function(degree,to){
		try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
		if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg.rotate_2d(degree,item);},element);
		var rad = M.i.zm.deg_rad(degree);
		var obj = M.i.is_reg(element) ? M.i.get_obj(element) : M.i.obj_reg("ZG",element);
		obj.Z_META_DATA.rotation_2d = obj.Z_META_DATA.rotation_2d ? obj.Z_META_DATA.rotation_2d + degree : degree;
		var obj_pos = M.i.get_pos(element);
		// if ie use propietary filters for simple functions
		if(M.i.is_ie() >=0){
			var temp_pos = M.i.get_pos(element,true);
			element.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand')";
			element.filters.item(0).M11 = Math.cos(rad);
			element.filters.item(0).M12 = -Math.sin(rad);
			element.filters.item(0).M21 = Math.sin(rad);
			element.filters.item(0).M22 = Math.cos(rad);
			M.i.set_sty("width:"+temp_pos[2]+"px;height:"+temp_pos[3]+"px;",element);
			if(element.className) element.className = element.className.toString()+" zdelib-rotate"; else element.className = "zdelib-rotate";
		}else{
			// draw_type 0:svg 1:xmlns 
			switch(M.i.zg.g){
				case 0:
					var wrapper = M.i.base_doc.createElement("div");
					if(element.id) wrapper.id = element.id+"_rotate";
					M.i.set_attr("class=zdelib-rotate;",wrapper);
					wrapper.style.cssText = element.style.cssText;
					var draw_object = M.i.base_doc.createElementNS(M.i.svg_ns, "svg");
					M.i.set_attr("width="+obj_pos[2]+";height="+obj_pos[2]+";xmlns="+M.i.svg_ns,draw_object);
					if(element.parentNode) element.parentNode.appendChild(wrapper); else M.i.base_doc.body.appendChild(wrapper);
					wrapper.appendChild(draw_object);
					var fo = M.i.base_doc.createElementNS(M.i.svg_ns, "foreignObject");
					draw_object.appendChild(fo);
					var wb = M.i.base_doc.createElement("body");
					wb.setAttribute("xmlns",M.i.xhtml_ns);
					fo.appendChild(wb);
					M.i.move(element,wb);
					M.i.set_sty("position:static;left:auto;top:auto;width:auto;height:auto;",element);
					M.i.set_attr("width="+obj_pos[2]+";height="+obj_pos[3]+";transform=rotate("+degree+","+(Math.round(obj_pos[2]/2))+","+(Math.round(obj_pos[3]/2))+")",fo);
					break;
				case 1:
					var draw_object = M.i.base_doc.createElement("v:Rect");
					if(element.parentNode) element.parentNode.appendChild(draw_object);
					M.i.move(element,draw_object);
					M.i.set_sty("rotation:"+degree+";",draw_object);
					break;
			}
		}
		return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	}
}
// graphic class for canvas / webgl
M.prototype.zg2 = {
    timerLib:{},
    // object for canvas oriented graphics
    c:function(){
		return M.i.zg2.check(false);
	},
    cv:function(value,type){
	if(M.i.zg2_enableCv){
		var work_to_device = M.i.zm.fix_rat(value,M.i.zg2_base_resolution[type],M.i.zg2_device_resolution[type]);
		if(M.i.zg2_pixel_ratio !== M.i.zg2_store_ratio) work_to_device = work_to_device * M.i.zg2_computed_ratio;
		return work_to_device;
	}else{
		return value;
	}
    },
    rcv:function(value,type){
	if(M.i.zg2_enableCv){
		var device_to_work = M.i.zm.fix_rat(value,M.i.zg2_device_resolution[type],M.i.zg2_base_resolution[type]);
		if(M.i.zg2_pixel_ratio !== M.i.zg2_store_ratio) device_to_work = device_to_work * M.i.zg2_computed_ratio;
		return device_to_work;
	}else{
		return value;
	}
    },
    check:function(api){
      var canvas_compatible;
      try {canvas_compatible = !!(M.i.base_doc.createElement('canvas').getContext('2d'));} catch(e) {canvas_compatible = !!				(M.i.base_doc.createElement('canvas').getContext);}
      if(canvas_compatible){
	if(api){
	      var dummy_canvas = M.i.create("canvas");
	      var context = null;
	      var result = false;
	      try{context = dummy_canvas.getContext('2d');}catch(e){context = dummy_canvas.getContext;}
	      switch(api){
		case "text":
		  if(context && typeof context.fillText == 'function') result = M.i.create("canvas"); else result = false;  
		  break;
		default:
		  result = false;
		  break;
	      }
	      return result;
	}else{
	  return M.i.create("canvas");
	}
      }else{
	return false;
      }
    },
    reset:function(to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.reset(item);},element);
      element.width = element.width;
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    enableBounds:function(option){
      M.i.zg2_enablebounds = option;
      return M.i;
    },
	enableCv:function(option){
      M.i.zg2_enableCv = option;
      return M.i;
    },
    setBounds:function(bounds){
      M.i.zg2_bounds = bounds;
      return M.i;
    },
    getBounds:function(){
      return M.i.zg2_bounds;
    },
    checkBounds:function(x,y,width,height){
      var nx = M.i.zg2.cv(x,0),ny = M.i.zg2.cv(y,1),nw = M.i.zg2.cv(width,0),nh = M.i.zg2.cv(height,1);
      if(nx < M.i.zg2_bounds.x[0] || nx + nw > M.i.zg2_bounds.x[1]) return false;
      if(ny < M.i.zg2_bounds.y[0] || ny + nh > M.i.zg2_bounds.y[1]) return false;
      return true;
    },
    setProperty:function(property,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.setProperty(property,item);},element);
      var c = element.getContext("2d");
      for(zg2_sp_key in property) c[zg2_sp_key] = property[zg2_sp_key];
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    getProperty:function(property,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.getProperty(property,item);},element);
      var c = element.getContext("2d");
      return c[property];}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    fitToWindow:function(to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.fitToWindow(item);},element);
      M.i.set_sty("width:100%;height:100%;margin:0;padding:0;overflow:hidden;","|html");
      M.i.set_sty("width:100%;height:100%;margin:0;padding:0;overflow:hidden;","|body");
      var wh = M.i.zg2_device_resolution;
      if(M.i.zg2_pixel_ratio !== M.i.zg2_store_ratio) wh[0] = wh[0] * M.i.zg2_computed_ratio;
      if(M.i.zg2_pixel_ratio !== M.i.zg2_store_ratio) wh[1] = wh[1] * M.i.zg2_computed_ratio;
      M.i.set_sty("position:absolute;width:"+wh[0]+"px;height:"+wh[1]+"px;",element);
	  element.width = wh[0];element.height = wh[1];
      if(M.i.zg2_pixel_ratio !== M.i.zg2_store_ratio) element.getContext("2d").scale(M.i.zg2_computed_ratio,M.i.zg2_computed_ratio);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    setResolution:function(resolution){ M.i.zg2_device_resolution = resolution;return M.i;},
    setBaseResolution:function(resolution){ M.i.zg2_base_resolution = resolution;return M.i;},
    getResolution:function(resolution){ return M.i.zg2_device_resolution;},
    getBaseResolution:function(resolution){ return M.i.zg2_base_resolution;},
    fillRect:function(x,y,width,height,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.fillRect(x,y,width,height,item);},element);
      var nx = M.i.zg2.cv(x,0),ny = M.i.zg2.cv(y,1),nw = M.i.zg2.cv(width,0),nh = M.i.zg2.cv(height,1);
      var c = element.getContext("2d");
      c.fillRect(nx,ny,nw,nh);
      if(M.i.zg2_enablebounds) if(!M.i.zg2.checkBounds()) throw new M.i.exceptions.zg2_bounds("fillRect - x:"+nx+" y:"+ny+" width:"+nw+" height:"+nh);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    strokeRect:function(x,y,width,height,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.strokeRect(x,y,width,height,item);},element);
      var nx = M.i.zg2.cv(x,0),ny = M.i.zg2.cv(y,1),nw = M.i.zg2.cv(width,0),nh = M.i.zg2.cv(height,1);
      var c = element.getContext("2d");
      c.strokeRect(nx,ny,nw,nh);
      if(M.i.zg2_enablebounds) if(!M.i.zg2.checkBounds()) throw new M.i.exceptions.zg2_bounds("strokeRect - x:"+nx+" y:"+ny+" width:"+nw+" height:"+nh);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    clearRect:function(x,y,width,height,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.clearRect(x,y,width,height,item);},element);
      var nx = M.i.zg2.cv(x,0),ny = M.i.zg2.cv(y,1),nw = M.i.zg2.cv(width,0),nh = M.i.zg2.cv(height,1);
      var c = element.getContext("2d");
      c.clearRect(nx,ny,nw,nh);
      if(M.i.zg2_enablebounds) if(!M.i.zg2.checkBounds()) throw new M.i.exceptions.zg2_bounds("clearRect - x:"+nx+" y:"+ny+" width:"+nw+" height:"+nh);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    moveTo:function(x,y,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.moveTo(x,y,item);},element);
      var nx = M.i.zg2.cv(x,0),ny = M.i.zg2.cv(y,1);
      var c = element.getContext("2d");
      c.moveTo(nx+0.5,ny+0.5);
      if(M.i.zg2_enablebounds) if(!M.i.zg2.checkBounds()) throw new M.i.exceptions.zg2_bounds("moveTo - x:"+nx+" y:"+ny);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    lineTo:function(x,y,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.lineTo(x,y,item);},element);
      var nx = M.i.zg2.cv(x,0),ny = M.i.zg2.cv(y,1);
      var c = element.getContext("2d");
      c.lineTo(nx+0.5,ny+0.5);
      if(M.i.zg2_enablebounds) if(!M.i.zg2.checkBounds()) throw new M.i.exceptions.zg2_bounds("lineTo - x:"+nx+" y:"+ny);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    stroke:function(to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.stroke(item);},element);
      var c = element.getContext("2d");
      c.stroke();
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    fill:function(to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.fill(item);},element);
      var c = element.getContext("2d");
      c.fill();
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    beginPath:function(to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.beginPath(item);},element);
      var c = element.getContext("2d");
      c.beginPath();
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    closePath:function(to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.closePath(item);},element);
      var c = element.getContext("2d");
      c.closePath();
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    measureText:function(text,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.measureText(text,item);},element);
      var c = element.getContext("2d");
      var result = c.measureText(text);
      // add unsupported height parameter guessing on M capital letter width
      result["height"] = c.measureText('M').width;
      return result;
      }catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    fillText:function(text,x,y,maxWidth,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.fillText(text,x,y,maxWidth,item);},element);
      var nx = M.i.zg2.cv(x,0),ny = M.i.zg2.cv(y,1);
      var c = element.getContext("2d");
      c.fillText(text,nx,ny,maxWidth ? maxWidth : false);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    strokeText:function(text,x,y,maxWidth,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.strokeText(text,x,y,maxWidth,item);},element);
      var nx = M.i.zg2.cv(x,0),ny = M.i.zg2.cv(y,1);
      var c = element.getContext("2d");
      c.strokeText(text,nx,ny,maxWidth);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    createLinearGradient:function(x0,y0,x1,y1,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.createLinearGradient(x0,y0,x1,y1,item);},element);
      var nx0 = M.i.zg2.cv(x0,0),ny0 = M.i.zg2.cv(y0,1),nx1 = M.i.zg2.cv(x1,0),ny1 = M.i.zg2.cv(y1,1);
      var c = element.getContext("2d");
      return c.createLinearGradient(nx0,ny0,nx1,ny1);
      }catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    createRadialGradient:function(x0,y0,r0,x1,y1,r1,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.createLinearGradient(x0,y0,r0,x1,y1,r1,item);},element);
      var nx0 = M.i.zg2.cv(x0,0),ny0 = M.i.zg2.cv(y0,1),nr0 = M.i.zg2.cv(r0,0),nx1 = M.i.zg2.cv(x1,0),ny1 = M.i.zg2.cv(y1,1),nr1 = M.i.zg2.cv(r1,0);
      var c = element.getContext("2d");
      return c.createLinearGradient(nx0,ny0,nr0,nx1,ny1,nr1);
      }catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    drawImage:function(image,dx,dy,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.drawImage(image,dx,dy,item);},element);
      var nx = M.i.zg2.cv(dx,0),ny = M.i.zg2.cv(dy,1);
      var c = element.getContext("2d");
      c.drawImage(image,nx,ny);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    drawImageScale:function(image,dx,dy,dw,dh,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.drawImageScale(image,dx,dy,dw,dh,item);},element);
      var nx = M.i.zg2.cv(dx,0),ny = M.i.zg2.cv(dy,1),nw = M.i.zg2.cv(dw,0),nh = M.i.zg2.cv(dh,1);
      var c = element.getContext("2d");
      c.drawImage(image,nx,ny,nw,nh);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    drawImageClip:function(image,sx,sy,sw,sh,dx,dy,dw,dh,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.drawImageClip(image,sx,sy,sw,sh,dx,dy,dw,dh,item);},element);
      var nx = M.i.zg2.cv(dx,0),ny = M.i.zg2.cv(dy,1),nw = M.i.zg2.cv(dw,0),nh = M.i.zg2.cv(dh,1),nsx = M.i.zg2.cv(sx,0),nsy = M.i.zg2.cv(sy,1),
      nsw = M.i.zg2.cv(sw,0),nsh = M.i.zg2.cv(sh,1);
      var c = element.getContext("2d");
      c.drawImage(image,nsx,nsy,nsw,nsh,nx,ny,nw,nh);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    arc:function(x,y,r,sdeg,edeg,dir,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.arc(x,y,radius,sdeg,edeg,dir,item);},element);
      var nx = M.i.zg2.cv(x,0),ny = M.i.zg2.cv(y,1),nr = M.i.zg2.cv(r,0);
      var c = element.getContext("2d");
      c.arc(nx,ny,nr,M.i.zm.deg_rad(sdeg),M.i.zm.deg_rad(edeg),dir);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    translate:function(x,y,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.translate(x,y,item);},element);
      var nx = M.i.zg2.cv(x,0),ny = M.i.zg2.cv(y,1);
      var c = element.getContext("2d");
      c.translate(nx,ny);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    rotate:function(ang,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.rotate(ang,item);},element);
      var c = element.getContext("2d");
      c.rotate(M.i.zm.deg_rad(ang));
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    save:function(to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.save(item);},element);
      var c = element.getContext("2d");
      c.save();
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    restore:function(to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.restore(item);},element);
      var c = element.getContext("2d");
      c.restore();
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    scale:function(x,y,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.scale(x,y,item);},element);
      var nx = M.i.zg2.cv(x,0),ny = M.i.zg2.cv(y,1);
      var c = element.getContext("2d");
      c.scale(nx,ny);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    arcTo:function(x,y,x1,y1,r,to){
      try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
      if(element instanceof Array) return M.i.iter(function(item,index){M.i.zg2.arcTo(x,y,x1,y1,r,item);},element);
      var nx = M.i.zg2.cv(x,0),ny = M.i.zg2.cv(y,1),nx1 = M.i.zg2.cv(x1,0),ny1 = M.i.zg2.cv(y1,1),nr = M.i.zg2.cv(r,0);
      var c = element.getContext("2d");
      c.arcTo(nx,ny,nx1,ny1,nr);
      return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    collide:function(rect1,rect2,event){
      try{
	var r1 = rect1,r2 = rect2;
	if(event) r2 = {"x":rect2[0],"y":rect2[1],"w":1,"h":1};
	r1.x = M.i.zg2.cv(r1.x,0);r1.y = M.i.zg2.cv(r1.y,1);r1.w = M.i.zg2.cv(r1.w,0);r1.h = M.i.zg2.cv(r1.h,1);
	r2.x = M.i.zg2.cv(r2.x,0);r2.y = M.i.zg2.cv(r2.y,1);r2.w = M.i.zg2.cv(r2.w,0);r2.h = M.i.zg2.cv(r2.h,1);
	return Math.abs(2*(r1.x - r2.x) + (r1.w-r2.w) ) < (r1.w+r2.w) &&
	  Math.abs(2*(r1.y - r2.y) + (r1.h-r2.h) ) < (r1.h+r2.h);}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
    },
    addTimer:function(options){
      var startTime = Date.now();
      var tempTime = options["duration"];
      var avgInterval;
      M.i.zg2.timerLib[options["name"]] = {"running":true,"stopped":false,"timeMarks":[],"options":options};
      
      function step(timestamp){
	if(!M.i.zg2.timerLib[options["name"]]["stopped"]){
	  if(M.i.zg2.timerLib[options["name"]]["running"]){
	    if(Date.now() >= startTime+(options["interval"] ? options["interval"] : M.i.zg2_base_fps)){
		avgInterval = Date.now()-startTime;
		startTime = Date.now();
		tempTime = tempTime - avgInterval;
		if(tempTime <= 0 || (timestamp - startTime) >= options["duration"]){
		  if(options["duration"] > 0){
		    options["tick"].apply(M.i.zg2,[tempTime < 0 ? tempTime+avgInterval : avgInterval]);
		    options["end"].apply(M.i.zg2,arguments);
		  }else{
		    options["tick"].apply(M.i.zg2,[avgInterval]);
		    M.i.base_win.requestAnimationFrame(step);
		  }
		}else{
		  var timeMarks = M.i.zg2.timerLib[timerName]["timeMarks"];
		  for(var i=0;i < timeMarks.length;i++){
		      if(tempTime <= timeMarks[i]["mark"] && timeMarks[i]["deleted"] == 0){
			timeMarks[i]["markTick"]();
			timeMarks[i]["deleted"] = 1;
		      }
		  }
		  options["tick"].apply(M.i.zg2,[avgInterval]);
		  M.i.base_win.requestAnimationFrame(step);
		}
	      }else{
		M.i.base_win.requestAnimationFrame(step);
	      }
	  }else{
	    M.i.base_win.requestAnimationFrame(step);
	  }
	}
      }
      
      M.i.base_win.requestAnimationFrame(step);
    },
    pauseTimer:function(timerName){
      M.i.zg2.timerLib[timerName]["running"] = false;
    },
    resummeTimer: function(timerName){
      M.i.zg2.timerLib[timerName]["running"] = true;
    },
    stopTimer: function(timerName){
      M.i.zg2.timerLib[timerName]["stopped"] = true;
    },
    playTimer: function(timerName){
      M.i.zg2.addTimer(M.i.zg2.timerLib[timerName]["options"]);
    },
    deleteTimer: function(timerName){
      delete M.i.zg2.timerLib[timerName];
    },
    deleteTimers: function(){
      for(key in M.i.zg2.timerLib) delete M.i.zg2.timerLib[key];
      M.i.zg2.timerLib = {};
    },
    addTimeMark: function(timerName,mark,markTick){
      M.i.zg2.timerLib[timerName]["timeMarks"].push({mark:mark,markTick:markTick,deleted:0});
    },
}
M.prototype.zc = {
  video:function(codec){
    var video_compatible;
    try{video_compatible = !!M.i.base_doc.createElement('video').canPlayType;}catch(e){video_compatible = false;}
    if(video_compatible){
	if(codec){
	    var dummy_video = M.i.create("video");
	    var result = false;
	    switch(codec){
	      case "h264":
		if(dummy_video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') == "probably") result = M.i.create("video"); else result = false;
		break;
	      case "ogg":
		if(dummy_video.canPlayType('video/ogg; codecs="theora, vorbis"') == "probably") result = M.i.create("video"); else result = false;
		break;
	      case "webm":
		if(dummy_video.canPlayType('video/webm; codecs="vp8, vorbis"') == "probably") result = M.i.create("video"); else result = false;
		break;
	      default:
		  result = false;
		  break;
	    }
	    return result;
	}else{
	    return M.i.create("video");
	}
    }else{
      return video_compatible;
    }
  },
  storage:function(){
    try {
      var storage_compatible = 'localStorage' in M.i.base_win && M.i.base_win['localStorage'] !== null;
      if(storage_compatible) return M.i.base_win.localStorage; else return false;
    } catch(e){
      return false;
    }
  },
  worker:function(){
    var worker_compatible = !!M.i.base_win.Worker;
    if(worker_compatible) return M.i.base_win.Worker; else return worker_compatible; 
  },
  offline:function(){
    var offline_compatible = !!M.i.base_win.applicationCache;
    if(offline_compatible) return M.i.base_win.applicationCache; else return offline_compatible; 
  },
  geolocation:function(){
    var geolocation_compatible = 'geolocation' in M.i.base_win.navigator;
    if(geolocation_compatible) return M.i.base_win.navigator; else return geolocation_compatible;
  },
  input:function(data){
    var dummy_input = M.i.create("input");
    if(data.type){
	dummy_input.setAttribute("type", type);
	if(dummy_input.type == type) return dummy_input; else return false;
    }
    if(data.property){
      if(data.property in dummy_input) return dummy_input; else return false;
    }
  },
  microdata:function(){
    var microdata_compatible = !!M.i.base_doc.getItems;
    if(microdata_compatible) return M.i.base_doc.getItems; else return microdata_compatible; 
  },
  history:function(){
    var history_compatible = !!(M.i.base_win.history && M.i.base_win.pushState);
    if(history_compatible) return M.i.base_win.history; else return history_compatible; 
  },
}
// binding class
M.prototype.zb = {
	createBindSpace: function(options){
		try{M.i.bindings[options["name"] ? options["name"] : M.i.guid()] = {"scope": options["scope"]};return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	},
	deleteBindSpace: function(name){
		try{delete M.i.bindings[name];return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	},
	addBindRule: function(options){
		try{M.i.bindings[options["bindSpace"]][options["bindProperty"]] = options["bindElement"];options["bindElement"]["oldValue"] = (options["bindElement"]["type"] == "property" ? M.i.bindings[options["bindSpace"]]["scope"][options["bindProperty"]] : M.i.bindings[options["bindSpace"]]["scope"][options["bindProperty"]].apply(options["bindElement"]["this"] || M.i,options["bindElement"]["args"] || []));return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	},
	deleteBindRule: function(bindSpaceName,bindRuleName){
		try{delete M.i.bindings[bindSpaceName][bindRuleName];return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	},
	updateBinds: function(options){
		try{for(var space in M.i.bindings){if(options["bindSpace"] && options["bindSpace"] != space) continue; for(var rule in M.i.bindings[space]){if(options["bindRule"] && options["bindRule"] != rule) continue;
			var newValue = (M.i.bindings[space][rule]["type"] == "property" ? M.i.bindings[space]["scope"][rule] : M.i.bindings[space]["scope"][rule](M.i.bindings[space][rule]["this"] || M.i,M.i.bindings[space][rule]["args"] || []));
			if(M.i.bindings[space][rule]["enabled"] && M.i.bindings[space][rule]["oldValue"] !== newValue) for(var i = 0;i < M.i.bindings["bindHandlers"].length;i++) if((M.i.bindings["bindHandlers"][i]["scope"] == "*" || M.i.bindings["bindHandlers"][i]["scope"] == space) && (M.i.bindings["bindHandlers"][i]["target"] == "*" || M.i.bindings["bindHandlers"][i]["target"] == rule)) M.i.bindings["bindHandlers"][i]["func"].apply(M.i.bindings["bindHandlers"][i]["this"] || M.i,[{"oldValue":M.i.bindings[space][rule]["oldValue"],"newValue":newValue,"bindSpace":space,"bindRule":rule}]);
			M.i.bindings[space][rule]["oldValue"] = newValue;
		}}return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	},
	addBindHandler: function(handler){
		try{M.i.bindings["bindHandlers"].push(handler);return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	}
}
// EVENT FUNCTIONS
M.prototype.event_pos = function(e){
	try{var posx = 0;
	var posy = 0;
	var ev_elem = e.target ? e.target : e.srcElement;
	if (!e) var e = M.i.base_win.event;

	if(M.i.mobile_host){
		var focusEvent = e.originalEvent ? e.originalEvent : e;
		var posxy = focusEvent.touches[0] || focusEvent.changedTouches[0];
		posx = posxy.pageX;
		posy = posxy.pageY;
	}else{
		if (e.pageX || e.pageY){
			posx = e.pageX;
			posy = e.pageY;
		}else if (e.clientX || e.clientY){
			posx = e.clientX + M.i.base_doc.body.scrollLeft
				+ M.i.base_doc.documentElement.scrollLeft;
			posy = e.clientY + M.i.base_doc.body.scrollTop
				+ M.i.base_doc.documentElement.scrollTop;
		}
	}
	
	if((ev_elem.tagName == "CANVAS" || ev_elem.tagName == "canvas") || (ev_elem.parentNode && 
	  (ev_elem.parentNode.tagName == "CANVAS" || ev_elem.parentNode.tagName == "canvas"))){
	  var rect = M.i.get_pos(ev_elem);
	  posx = posx - rect[0];
	  posy = posy - rect[1];
	}
	return [posx,posy];}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
// UI FUNCTIONS
M.prototype.drag = function(options,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.drag(options,item);},element);
	
	if(element.parentNode && element.parentNode.id && element.parentNode.id.search(/_wrap/) > -1) element = element.parentNode;
	
	var obj;
	if(M.i.get_obj(element)){obj = M.i.get_obj(element);}else{M.i.obj_reg("drag",element);obj = M.i.get_obj(element);}
	
	if(options["limits"]) obj.data.limits = options["limits"];
	
	var pos = M.i.get_pos(element,true);
	M.i.wrap("",element);
	
	var drag_area = options["drag_area"] ? (typeof options["drag_area"] == 'object' ? options["drag_area"] : M.i.base_doc.getElementById(options["drag_area"])): element.parentNode;
	obj.data.drag_area = drag_area;
	
	M.i.set_sty("position:absolute;top:"+pos[1]+"px;left:"+pos[0]+"px;",element.parentNode);
	
	M.i.add_event("mousedown",{"func":function(e){
		M.i.cancel_event(e);
		obj.drag = true;
		var ev_pos = M.i.event_pos(e);
		var obj_pos = M.i.get_pos(obj.me.parentNode,true);
		obj.data.ipush = [ev_pos[0]-obj_pos[0],ev_pos[1]-obj_pos[1],obj.me.parentNode.offsetWidth,obj.me.parentNode.offsetHeight];
		obj.me.parentNode.style.zIndex = 1000;
	},"capture":true},drag_area);

	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.undrag = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.undrag(item);},element);
	
	var obj = M.i.get_obj(element);
	M.i.del_event("mousedown",{"func":function(e){
		M.i.cancel_event(e);
		obj.drag = true;
		var ev_pos = M.i.event_pos(e);
		var obj_pos = M.i.get_pos(obj.me,true);
		obj.data.ipush = [ev_pos[0]-obj_pos[0],ev_pos[1]-obj_pos[1],obj_pos[2],obj_pos[3]];
		obj.me.parentNode.style.zIndex = 100;
	},"capture":true},obj.data.drag_area);

	obj.data.limits = false;
	obj.data.drag_area = false;
	obj.data.ipush = false;
	obj.drag = false;
	
	M.i.unwrap(element);
	
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.unresize = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.undrag(item);},element);
	
	M.i.del("#"+element.parentNode.id+" > [class*zdelib-resize]");
	
	var obj = M.i.get_obj(element);
	obj.data.ipush = false;
	obj.data.resize_obj = false;
	obj.data.resize = false;
	
	M.i.set_sty("overflow:visible;",element);
	
	M.i.unwrap(element);
	
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.max_wrap = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	var node = element.parentNode && element.parentNode.id && element.parentNode.id.search(/_wrap/) > -1 ? element.parentNode : false;
	var snode = node;
	while(node){
		node = node.parentNode && node.parentNode.id && node.parentNode.id.search(/_wrap/) > -1 ? node.parentNode : false;
		snode = node ? node : snode;
	}
	return snode;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
	
}
M.prototype.resize = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.resize(item);},element);
	
	if(element.parentNode && element.parentNode.id && element.parentNode.id.search(/_wrap/) > -1) element = element.parentNode;
	
	var obj;
	if(M.i.get_obj(element)){obj = M.i.get_obj(element);}else{M.i.obj_reg("resize",element);obj = M.i.get_obj(element);}
	
	M.i.wrap("",element);
	obj.data.resize_obj = M.i.max_wrap(element);
	obj.data.resize_obj = obj.data.resize_obj ? obj.data.resize_obj : (element.parentNode ? element.parentNode : element);

	var parent = element.parentNode;
	var elems = [];
	var temp_obj;
	var delete_elems = true;

	for(var i=parent.childNodes.length;i>0;i--){
		if(parent.childNodes[i] === element) delete_elems = false;
		if(delete_elems && parent.childNodes[i]) elems.push(parent.removeChild(parent.childNodes[i]));
	}

	temp_obj = parent.removeChild(parent.childNodes[parent.childNodes.length-1]);
	M.i.set_sty("float:left;",temp_obj);

	var rox = 5;
	var roy = 5;

	M.i.append(temp_obj,parent);
	var twSize = M.i.get_pos(temp_obj);
	var tmp = M.i.getElement(temp_obj);
	twSize[2] = tmp.scrollWidth ? tmp.offsetWidth : twSize[2];
	twSize[3] = tmp.scrollHeight ? tmp.offsetHeight : twSize[3];
	M.i.set_sty("width:"+(twSize[2]+(rox*2))+"px;height:"+(twSize[3]+(roy*2))+"px;",obj.data.resize_obj);
	parent.removeChild(temp_obj);

	M.i.append(M.i.create("div",element.id+"_win_rul",{"attr":"class=zdelib-resize-rul;","sty":"width:"+rox+"px;height:"+roy+"px;float:left;"}),parent);
	M.i.append(M.i.create("div",element.id+"_win_ruc",{"attr":"class=zdelib-resize-ruc;","sty":"height:"+roy+"px;width:"+twSize[2]+"px;float:left;"}),parent);
	M.i.append(M.i.create("div",element.id+"_win_rur",{"attr":"class=zdelib-resize-rur;","sty":"width:"+rox+"px;height:"+roy+"px;float:left;"}),parent);
	M.i.append(M.i.create("div",element.id+"_win_rue",{"attr":"class=zdelib-resize-rue;","sty":"float:none;clear:both;"}),parent);
	M.i.append(M.i.create("div",element.id+"_win_rl",{"attr":"class=zdelib-resize-rl;","sty":"width:"+rox+"px;height:"+twSize[3]+"px;float:left;"}),parent);
	M.i.append(temp_obj,parent);
	M.i.append(M.i.create("div",element.id+"_win_rr",{"attr":"class=zdelib-resize-rr;","sty":"width:"+rox+"px;height:"+twSize[3]+"px;float:left;"}),parent);
	M.i.append(M.i.create("div",element.id+"_win_re",{"attr":"class=zdelib-resize-re;","sty":"float:none;clear:both;"}),parent);
	M.i.append(M.i.create("div",element.id+"_win_rdl",{"attr":"class=zdelib-resize-rdl;","sty":"width:"+rox+"px;height:"+roy+"px;float:left;"}),parent);
	M.i.append(M.i.create("div",element.id+"_win_rdc",{"attr":"class=zdelib-resize-rdc;","sty":"height:"+roy+"px;width:"+twSize[2]+"px;float:left;"}),parent);
	M.i.append(M.i.create("div",element.id+"_win_rdr",{"attr":"class=zdelib-resize-rdr;","sty":"width:"+rox+"px;height:"+roy+"px;float:left;"}),parent);
	M.i.append(M.i.create("div",element.id+"_win_rde",{"attr":"class=zdelib-resize-rde;","sty":"float:none;clear:both;"}),parent);
	for(var i=0;i<elems.length;i++) parent.appendChild(elems[i]);
	
	/*var csize = _(element).get_pos();
	M.i.set_sty("width:"+(csize[2]-(rox+7))+"px;",element.id+"_win_ruc");
	M.i.set_sty("height:"+(csize[3]-(roy+3))+"px;",element.id+"_win_rl");
	M.i.set_sty("width:"+(csize[2]-(rox+7))+"px;float:left;",element.id);
	M.i.set_sty("height:"+(csize[3]-(roy+3))+"px;",element.id+"_win_rr");
	M.i.set_sty("width:"+(csize[2]-(rox+7))+"px;",element.id+"_win_rdc");*/

	var getResizeSize = function(e,side){
		M.i.cancel_event(e);
		var obj_pos = M.i.get_pos(obj.me,true);
		// TODO: use the width and height of get_pos but reduce only to viewport with scroll discount
		obj.data.ipush = [obj_pos[0],obj_pos[1],M.i.get_sty("width",obj.me,true)[0],M.i.get_sty("height",obj.me,true)[0]];
		obj.resize = side;
	}

	M.i.add_event("mousedown",{"func":function(e){getResizeSize(e,"rul");},"capture":true},element.id+"_win_rul");
	M.i.add_event("mousedown",{"func":function(e){getResizeSize(e,"ruc");},"capture":true},element.id+"_win_ruc");
	M.i.add_event("mousedown",{"func":function(e){getResizeSize(e,"rur");},"capture":true},element.id+"_win_rur");
	M.i.add_event("mousedown",{"func":function(e){getResizeSize(e,"rue");},"capture":true},element.id+"_win_rue");
	M.i.add_event("mousedown",{"func":function(e){getResizeSize(e,"rl");},"capture":true},element.id+"_win_rl");
	M.i.add_event("mousedown",{"func":function(e){getResizeSize(e,"rr");},"capture":true},element.id+"_win_rr");
	M.i.add_event("mousedown",{"func":function(e){getResizeSize(e,"re");},"capture":true},element.id+"_win_re");
	M.i.add_event("mousedown",{"func":function(e){getResizeSize(e,"rdl");},"capture":true},element.id+"_win_rdl");
	M.i.add_event("mousedown",{"func":function(e){getResizeSize(e,"rdc");},"capture":true},element.id+"_win_rdc");
	M.i.add_event("mousedown",{"func":function(e){getResizeSize(e,"rdr");},"capture":true},element.id+"_win_rdr");
	M.i.add_event("mousedown",{"func":function(e){getResizeSize(e,"rde");},"capture":true},element.id+"_win_rde");

	M.i.set_sty("overflow:auto;",element);
	
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
// HTML FUNCTIONS
M.prototype.open_wait_msg = function(options,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	M.i.add("div",options["name"]+"_zdemsgwrap",(options["container"] ? options["container"] : {sty:"display:inline;"}),(element ? element : M.i.base_doc.body));
	M.i.add("img",options["name"],(options["img"] ? options["img"] : {attr:"alt=loading;border=0;src="}),options["name"]+"_zdemsgwrap");
	if(options["center"]) M.i.center(options["name"]+"_zdemsgwrap");
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.close_wait_msg = function(name){
	try{M.i.del(name+"_zdemsgwrap");
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.show_wait_msg = function(options,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(_("#"+options["name"]+"_zdemsgwrapD")) _("#"+options["name"]+"_zdemsgwrapC").set_sty("display:inline;"); else M.i.open_wait_msg(options,element);
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.hide_wait_msg = function(name){
	try{if(_("#"+name+"_zdemsgwrapD")) _("#"+name+"_zdemsgwrapC").set_sty("display:none;");
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
// COMMON JS FUNCTIONS
M.prototype.val = function(value,check,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i.val(value,item);},element);
	var final_val = false;
	switch(element.tagName.toUpperCase()){
		case "INPUT":
			if(check != "undefined") element.checked = check;
			if(value){
				element.value = value;
			}else{
				final_val = element.value;
			}
			break;
		case "SELECT":
			if(!value){
				if(element.multiple){
					var res = [];
					for(var i=0;i<element.options.length;i++) if(element.options[i].selected) res.push(element.options[i].value);
					final_val = res;
				}else{
					for(var i=0;i<element.options.length;i++) if(i == element.selectedIndex || element.options[i].selected) final_val = element.options[i].value;
				}
			}else{
				if(value.length != "undefined" && value.length > 1){
					for(var i=0;i<element.options.length;i++) for(var j=0;j<value.length;j++) if(element.options[i].value == value[j]) element.options[i].selected = true;
				}else{
					for(var i=0;i<element.options.length;i++) if(element.options[i].value == value) element.selectedIndex = i;
				}
			}
			break;
		case "TEXTAREA":
			if(value) M.i.setText(value,element); else final_val = M.i.getText(element);
			break;
	}
	final_val = !isNaN(final_val) ? (final_val != Math.floor(final_val) ? parseFloat(final_val) : parseInt(final_val)): final_val;
	return final_val;
	}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.in_array = function(val,subject){
	try{var res = false;
	for(var i=0;i<subject.length;i++) if(subject[i] === val) res = true;
	return res;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.getElementsByClassName = function(clname){
	try{var elems = M.i.base_doc.body.getElementsByTagName("*");
	var res = new Array();
	for(var i=0;i<elems.length;i++) if(elems[i].className) if(elems[i].className.toString().search(M.i.trim(clname)) > -1) res.push(elems[i]);
	return res;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.str_cmp = function(str1,str2){
	try{if(str1 && str2){
		var count = 0;
		if(str1.length == str2.length) for(var i=0;i<str1.length;i++) if(str1.charCodeAt(i) == str2.charCodeAt(i)) count++;
		return str1.length == str2.length && count == str1.length ? true : false;
	}else{
		return false;
	}}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.trim = function(str){
	try{if(str){
		var start,end;
		for(var i=0;i<str.length;i++) if((start == undefined || start == null) && str.charCodeAt(i) != 32) start = i;
		for(var j=str.length-1;j>=0;j--) if((end == undefined || end == null) && str.charCodeAt(j) != 32) end = j;
		return str.substring(start,end+1);
	}else{
		return false;
	}}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.wait = function(mili){
	try{var d_temp,d;
	d_temp = d = new Date();
	var ac_t = d.getTime()+mili;
	while(d_temp.getTime() < ac_t){d_temp = new Date();}}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.ready = function(to,func,i){
	try{var id = setInterval(function(){if(M.i.base_doc.getElementById(to) != undefined && M.i.base_doc.getElementById(to) != null){func();clearInterval(id);}},i);}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.debounce = function(fn,delay,scope){
    try{var lastExecution;
    return function() {
        var args = arguments;
        clearTimeout(lastExecution);
        lastExecution = setTimeout(function() {
            fn.apply(scope, args);
        }, delay);
    }}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.throttle = function(fn,delay,scope){
    try{var lastExecution = 0;
    return function() {
        var d = +new Date;
        if(d - lastExecution < delay ) return;
        lastExecution = d;
        fn.apply(scope, arguments);
    }}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.is_ie = function(){
	try{var rv = -1; // Return value assumes failure.
	if (navigator.appName == 'Microsoft Internet Explorer'){
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
	}
	return rv;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.is_ff = function(){
	try{if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) var ffversion=new Number(RegExp.$1);
	return ffversion ? ffversion : -1;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.is_op = function(){
	try{if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) var oprversion=new Number(RegExp.$1);
	return oprversion ? oprversion : -1;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.is_touch = function(){
	try{return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.empty = function(value){
	try{if((!value || value == false || value == null || value == undefined || value == "") && value !== 0) return true; else return false;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.EJSON = function(data){
	//var res = "[";
	
}
M.prototype.DJSON = function(options){
	try{
		if(!options["json"] || options["json"] == "") return false;
		// format json string
		var j = M.i.trim(options["json"]);
		if(options["json"].charAt(0) == "["){
			j = j.substr(1);
			j = j.substr(0,j.length-1);
			j = M.i.trim(j);
		}
		// vars
		var check = true;
		var index = 0;
		var objs = [];
		var a_focus = {};
		var l_str = "";
		var a_str = "";
		var in_array = false;
		var res = [];
		res[index] = a_focus;
		objs.push([a_focus,0,-1]);
		
		// validate functions (validate key and value)
		// for value convert to unicode and replace specials
		var funicode = function(val){
			var res = val;
			var temp = "";
			var uni = [];
			var rsol = [];
			if(typeof val == "string"){
				for(var i=0;i<val.length;i++){
					var next_char = val.charAt(i+1);
					if(val.charAt(i) == "\\" && next_char == "u"){
						uni.push(val.substring(i,i+6));
					}else if(val.charAt(i) == "\\"){
						var rep = true;
						switch(next_char){case "b":case "f":case "n":case "r":case "t":case "\"":case '\'':rep=false;break;}
						if(rep) rsol[i] = true;
					}
				}
				for(var i=0;i<uni.length;i++) res = res.replace(uni[i],String.fromCharCode(parseInt(uni[i].substr(2),16)));
				for(var i=0;i<res.length;i++) if(!rsol[i]) temp = temp+res.charAt(i);
				res = temp;
				res = res.replace(/\\/gi,"\\\\");
				res = res.replace(/\\\\r\\\\n/gi,"\n");
				res = res.replace(/\\\\r/gi,"\r");
				res = res.replace(/\\\\n/gi,"\n");
				res = res.replace(/\\\\b/gi,"\b");
				res = res.replace(/\\\\f/gi,"\f");
				res = res.replace(/\\\\t/gi,"\t");
				res = res.replace(/\\\\"/gi,'"');
				res = res.replace(/\\\\'/gi,"'");
			}
			return res;
		}
		var convert = function(val){
			var res = "";
			if(val.indexOf("null")>-1)res=null;
			if(res==""&&val.indexOf("false")>-1)res=false;if(res==""&&val.indexOf("true")>-1)res=true;if(res==""&&val.indexOf("NaN")>-1)res=NaN;if(res==""&&val.indexOf("undefined")>-1)res=undefined;
			if(res == "" && !isNaN(val)){
				if(!isFinite(val)){if(val.indexOf("-") > 0) res=-Infinity; else res = Infinity;}
				if(res == ""){if(val.indexOf(".") > 0) res=parseFloat(val); else res=parseInt(val);}
			}else if(isNaN(val)){
				res = val;
			}
			if(typeof res == "string") res = funicode(res);
			return res;
		};
		
		// for key convert unicode and eliminate specials
		var invalid = function(c){return c == " " || c == "\n" || c == "\r" || c == "\t" || c == "" || c == "\\" || c == "\b" || c == "\f" ? true : false;};
		var validate = function(str){if(str){var res = "";for(var i=0;i<str.length;i++) if(!invalid(str.charAt(i))) res = res+str.charAt(i);return funicode(res);}};
		var found = function(p,c,s){
			if(s == "f"){for(var i=p+1;i<j.length;i++){if(!invalid(j.charAt(i)) && j.charAt(i) == c){return true;}else if(invalid(j.charAt(i))){}else{return false}}};
			if(s == "b"){for(var i=p-1;i>=0;i--){if(!invalid(j.charAt(i)) && j.charAt(i) == c){return true;}else if(invalid(j.charAt(i))){}else{return false;}}};
		}
		// assign val in object or array
		var assign = function(){
			if(a_str && a_str != null && a_str != undefined){
				a_str = convert(a_str);
				l_str = validate(l_str);
				
				if(typeof a_focus[l_str] != "object"){
					if(!in_array){
						if(l_str && l_str != null && l_str != undefined){
							a_focus[l_str] = a_str;
						}
					}else{
						a_focus.push(a_str);
					}
				}
			}
			l_str = "";
			a_str = "";
		}
		// assign last current object/array val and get last non-closed obect/array
		var get_last = function(p){
			assign();
			for(var i=objs.length-1;i>=0;i--){if(objs[i][2] < 0){objs[i][2] = p;break;}}
			for(var i=objs.length-1;i>=0;i--){if(objs[i][2] < 0){a_focus = objs[i][0];break;}}
			in_array = a_focus.constructor == Array ? true : false;
		};
		// the characters "{","[","}","]","," and ":" has own representation and function attached
		var SO = function(i){if(in_array && !found(i,":","b")){var elem = {};a_focus.push(elem);a_focus = elem;objs.push([a_focus,i+1,-1]);in_array=false;}},
			SA = function(i){if(in_array && !found(i,":","b")){var elem = [];a_focus.push(elem);a_focus = elem;objs.push([a_focus,i+1,-1]);in_array=true;}},
			EO = function(i){get_last(i);},EA = function(i){get_last(i);},
			CD = function(i){
				if(found(i,"}","b") && found(i,"{","f") && !in_array){
					index++;
					objs = [];
					a_focus = {};
					l_str = "";
					a_str = "";
					in_array = false;
					res[index] = a_focus;
					objs.push([a_focus,0,-1]);
				}else{
					assign();
				}
			},
			ID = function(i){
				var ch;
				for(var z=i+1;z<j.length;z++){if(j.charAt(z) == "{" || j.charAt(z) == "["){ch = j.charAt(z);break;}else if(j.charAt(z) == "," || j.charAt(z) == "}" || j.charAt(z) == "]"){break;}};
				a_str = validate(a_str);
				var elem = a_str;
				var is_obj = false;
				if(ch == "{"){
					is_obj = true;
					elem = {};
				}else if(ch == "["){
					is_obj = true;
					elem = [];
				}else{
					is_obj = false;
				}
				if(is_obj){
					if(!in_array){
						a_focus[a_str] = elem;
						a_focus = elem;
						objs.push([a_focus,i+1,-1]);
						a_str = "";
						in_array = a_focus.constructor == Array ? true : false;
					}else{
						a_focus.push(elem);
						a_focus = elem;
						objs.push([a_focus,i+1,-1]);
						a_str = "";
						in_array = a_focus.constructor == Array ? true : false;
					}
				}else{
					l_str=a_str;
					a_str = "";
				}
			};
		// assign function chars to array
		var del = {"{":SO,"}":EO,"[":SA,"]":EA,",":CD,":":ID};
		// walk json string
		for(var i=0;i<j.length;i++){
			if(j.charAt(i) == "'" || j.charAt(i) == '"') check = check ? false : true;
			if(del[j.charAt(i)] && check) del[j.charAt(i)](i); else if(j.charAt(i) != "'" && j.charAt(i) != '"') a_str=a_str+j.charAt(i); else if(j.charAt(i-1) == "\\") a_str=a_str+j.charAt(i);
		}
		return res;
	}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
// LIB FUNCTIONS
// request related functions
M.prototype.poll_exist = function(name){
	try{var found = false;
	for(var i=0;i<M.i.poll_request.length;i++) if(M.i.poll_request[i][0] == name) found = true;
	return found;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.start_poll = function(name){
	try{var found = false;
	for(var i=0;i<M.i.poll_request.length;i++) if(M.i.poll_request[i][0] == name) found = i;
	if(found === false) M.i.poll_request.push([name,true,0]); else M.i.poll_request[found][1] = true;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.stop_poll = function(name){
	try{var found = false;
	for(var i=0;i<M.i.poll_request.length;i++) if(M.i.poll_request[i][0] == name) found = i;
	if(found || found === 0) M.i.poll_request[found][1] = false;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.poll_live = function(name){
	try{var found = false;
	for(var i=0;i<M.i.poll_request.length;i++) if(M.i.poll_request[i][0] == name) found = M.i.poll_request[i][1];
	return found;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.update_poll = function(name){
	try{var found = false;
	for(var i=0;i<M.i.poll_request.length;i++) if(M.i.poll_request[i][0] == name) M.i.poll_request[i][2] = M.i.poll_request[i][2] >= 0 ? M.i.poll_request[i][2]+1 : 0;
	return found;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.poll_count = function(name){
	try{var found = false;
	for(var i=0;i<M.i.poll_request.length;i++) if(M.i.poll_request[i][0] == name) found = M.i.poll_request[i][2];
	return found;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.poll_restart = function(name){
	try{var found = false;
	for(var i=0;i<M.i.poll_request.length;i++) if(M.i.poll_request[i][0] == name){ M.i.poll_request[i][2] = 0;found = true;}
	return found;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.clear_poll = function(){
	try{M.i.poll_request = [];}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
// for add and reg_obj functions add simple reference navigation
M.prototype.nav = function(i){
	try{M.i.me = false;if(isNaN(i)){
		M.i.me = M.i.getElement(i);
		// if not found try assuming op char pass true
		if(!M.i.me){
			var op_char = i.charAt(i.length-1);
			var name = i.slice(0,i.length-1);
			if(M.i.in_array(op_char,["C","D","O"])) M.i.me = M.i.getElement(name);
		}
		M.i.nav_reg.push(M.i.me);
		M.i.selector = i;
	}else{
		M.i.me = M.i.nav_reg[i < 0 ? M.i.nav_reg.length-1 : i];
	}
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.ix = function(x){
	try{if(M.i.me.length){
		if(x >= M.i.me.length){
			M.i.me = M.i.me[M.i.me.length-1];
		}else if(x < 0){
			M.i.me = M.i.me[0];
		}else{
			M.i.me = M.i.me[x];
		}
	}
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.guid = function(){
	try{
		return parseInt(M.i.zt.d().getTime()).toString(16);
	}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.error = function(err,arg){
	try{
	var msg = M.i.base_doc.createElement("p");
	
	var background = 'if(event.preventDefault){event.preventDefault();}else{event.cancelBubble=true;event.returnValue=false;}var e = document.getElementById("zdlib_log");if(e.style.backgroundColor == "") e.style.backgroundColor = "black";\
		else e.style.backgroundColor = "";';
	var win_size = new Array(M.i.base_win.innerWidth ? M.i.base_win.innerWidth : M.i.base_doc.getElementsByTagName("html")[0].offsetWidth,
		M.i.base_win.innerHeight ? M.i.base_win.innerHeight : M.i.base_doc.getElementsByTagName("html")[0].offsetHeight);
		
	var maximize = 'if(event.preventDefault){event.preventDefault();}else{event.cancelBubble=true;event.returnValue=false;}var e = document.getElementById("zdlib_log");if(e.style.width == "300px"){e.style.left = 0;e.style.right = "auto";e.style.width = "'+win_size[0]+'px";\
		e.style.height = "'+win_size[1]+'px";}else{e.style.right = 0;e.style.left = "auto";e.style.width = "300px";e.style.height = "300px"}';
	
	var clear = 'if(event.preventDefault){event.preventDefault();}else{event.cancelBubble=true;event.returnValue=false;}var e = document.getElementById("zdlib_log");for(var i=e.childNodes.length;i >= 1;i--) if(e.childNodes[i]) e.removeChild(e.childNodes[i]);';
	
	msg.style.color = "red";
	
	var stack = "Error: "+err+" [";
	for(var k in err) stack = stack+k+":"+err[k]+"|";
	stack = stack+"]";
	
	var focus = arg.callee;
	var focus_arg = arg;
	
	var error_loop_control = (new Date()).getTime();
	while(focus){
		var found = false;
		for(k in this) if(this[k] == focus) found = k;
		if(found){
			stack = stack+"\n called by: "+found+"(";
			for(var i=0;i<focus_arg.length;i++) stack = stack+focus_arg[i]+",";
			stack = stack+")";
		}else{
			var name = focus_arg.callee.toString().match(/function\s+([^\s\(]+)/);
			if(name && name[1]){
				stack = stack+"\n called by: "+name[1]+"(";
				for(var i=0;i<focus_arg.length;i++) stack = stack+focus_arg[i]+",";
				stack = stack+")";
			}else{
				stack = stack+"\n called by: Anonymous(";
				for(var i=0;i<focus_arg.length;i++) stack = stack+focus_arg[i]+",";
				stack = stack+")";
			}
		}
		focus = focus.caller;
		if(focus) focus_arg = focus.arguments;
		if((new Date()).getTime() - error_loop_control > 1000) break;
	}
	
	msg.innerHTML = stack;
	
	if(M.i.base_doc.getElementById("zdlib_log")){
		M.i.base_doc.getElementById("zdlib_log").appendChild(msg);
	}else{
		var log = M.i.base_doc.createElement("div");
		log.id = "zdlib_log";
		log.style.position = "absolute";
		log.style.right = 0;
		log.style.top = 0;
		log.style.width = "300px";
		log.style.height = "300px";
		log.style.overflow = "scroll";
		log.style.zIndex = 1000;
		log.innerHTML = "<p style='background-color:white;'><a href='#' onclick='"+clear+"'>C</a>&nbsp;<a href='#' onclick='"+background+"'>B</a>&nbsp;<a href='#' onclick='"+maximize+"'>M</a></p>";
		log.appendChild(msg);
		M.i.base_doc.body.appendChild(log);
	}}catch(e){}
}
M.prototype.debug = function(mode){
	M.i.debug_mode = mode;
	return M.i;
}
// item selector
M.prototype.z_selector = function(path){
	try{
	var path_array = path.split(">");
	var path_len = path_array.length;
	var path_result = false;
	var token_result = [];
	path_result = M.i.getElement(M.i.trim(path_array[0]));
	
	for(var i=1;i<path_len;i++){
		if(path_result){
			if(path_result instanceof Array){
				for(var j=0;j<path_result.length;j++){
					var ok = true;
					for(var x=0;x<j;x++) if(path_result[j].parentNode === path_result[x]) ok = false;
					if(ok){
						var temp_result = M.i.getChild(path_result[j],M.i.trim(path_array[i]));
						if(temp_result){
							if(temp_result instanceof Array){
								for(var k=0;k<temp_result.length;k++) if(temp_result[k]) token_result.push(temp_result[k]);
							}else{
								token_result.push(temp_result);
							}
						}
					}
				}
			}else{
				var temp_result = M.i.getChild(path_result,M.i.trim(path_array[i]));
				if(temp_result){
					if(temp_result instanceof Array){
						for(var k=0;k<temp_result.length;k++) if(temp_result[k]) token_result.push(temp_result[k]);
					}else{
						token_result.push(temp_result);
					}
				}
			}
			if(token_result){
				if(token_result.length){
					path_result = false;
					path_result = token_result.slice(0);
					token_result = [];
				}else{
					path_result = token_result;
				}
			}else{
				path_result = false;
			}
		}
	}
	
	path_result = path_result instanceof Array && path_result.length < 1 ? false : path_result;
	return path_result;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
// extend static like function to main semi-singleton function
M.prototype.add_func = function(func_name,func){
	try{M.prototype[func_name] = func;
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.add_class = function(class_name,obj){
	try{M.prototype[class_name] = obj;
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.derives = function(class_name,parent_name){
	try{M.prototype[class_name].prototype = new M.prototype[parent_name];
	M.prototype[class_name].prototype.constructor = M.prototype[class_name];
	M.prototype[class_name].prototype.baseClass = M.prototype[parent_name].prototype.constructor;
	for(key in M.prototype[parent_name]) if(!M.prototype[class_name][key]) M.prototype[class_name][key] = M.prototype[parent_name][key]; 
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.implement = function(class_name,impc_name){
	try{
	for(key in M.prototype[impc_name]) if(!M.prototype[class_name][key]) M.prototype[class_name][key] = M.prototype[impc_name][key]; 
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype._class = function(class_name,args,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	if(element instanceof Array) return M.i.iter(function(item,index){M.i._class(class_name,args,item);},element);
	var selector = M.i.selector;
	
	if(!M.i.class_instances[selector]){
		if(!M.i._is_class(element)){
			M.i.class_instances[selector] = [class_name,[]];
			var final_args = args ? args : {};
			final_args.focus = element;
			final_args.selector = selector;
			var cobj = new M.prototype[class_name](final_args);
			cobj.prototype = M.prototype[class_name].prototype;
			// attach node to class
			M.i.class_instances[selector][1].push(cobj);
		}
	}else{
		if(!M.i._is_class(element)){
			var final_args = args ? args : {};
			final_args.focus = element;
			final_args.selector = selector;
			var cobj = new M.prototype[class_name](final_args);
			cobj.prototype = M.prototype[class_name].prototype;
			M.i.class_instances[selector][1].push(cobj);
		}
	}
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype._unclass = function(to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	var selector = M.i.selector;
	
	var ins = false;
	var sel = "";
	if(M.i.class_instances[selector]){ins = M.i.class_instances[selector][1];sel = selector;}else if(M.i.class_instances[to]){ins = M.i.class_instances[to][1];sel = to;}
	if(ins){
		for(var i=ins.length-1;i >= 0;i--){
			ins[i].prototype.focus = null;
			try{ins[i]._delete();}catch(e){}
			delete ins[i];
			ins[i] = false;
			ins.splice(i,1);
		}
		M.i.class_instances[sel] = false;
		delete M.i.class_instances[sel];
	}else{
		if(element instanceof Array){
			return M.i.iter(function(item,index){
				var found = M.i._is_class(item);
				if(found){
					M.i.class_instances[found[0]][found[1]].prototype.focus = null;
					try{M.i.class_instances[found[0]][found[1]]._delete();}catch(e){}
					delete M.i.class_instances[found[0]][found[1]];
					M.i.class_instances[found[0]][found[1]] = false;
					M.i.class_instances[found[0]].splice(i,1);
				}
			},element);
		}else{
			var found = M.i._is_class(element);
			if(found){
				M.i.class_instances[found[0]][found[1]].prototype.focus = null;
				try{M.i.class_instances[found[0]][found[1]]._delete();}catch(e){}
				delete M.i.class_instances[found[0]][found[1]];
				M.i.class_instances[found[0]][found[1]] = false;
				M.i.class_instances[found[0]].splice(i,1);
			}
		}
	}
	
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype._unclass_type = function(class_name){
	try{var classes = M.i.class_instances;
	for(key in classes){
		if(classes[key]){
			if(classes[key][0] == class_name){
				for(var i=classes[key][1].length-1;i >= 0;i--){
					classes[key][1][i].prototype.focus = null;
					try{classes[key][1][i]._delete();}catch(e){}
					delete classes[key][1][i];
					classes[key][1][i] = false;
					classes[key][1].splice(i,1);
				}
				classes[key] = false;
				delete classes[key];
			}
		}
	}
	
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype._unclass_all = function(){
	try{var classes = M.i.class_instances;
	for(key in classes){
		if(classes[key]){
			for(var i=classes[key][1].length-1;i >= 0;i--){
				classes[key][1][i].prototype.focus = null;
				try{classes[key][1][i]._delete();}catch(e){}
				delete classes[key][1][i];
				classes[key][1][i] = false;
				classes[key][1].splice(i,1);
			}
			classes[key] = false;
			delete classes[key];
		}
	}
	M.i.class_instances = [];
	
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.invoke = function(method,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	
	var ins = false;
	var sel = "";
	var args = [];
	var selector = M.i.selector;
	
	for(var i=0;i<arguments.length;i++) if(i > 0) args[i-1] = arguments[i];
	args.length = arguments.length-1;
	if(M.i.class_instances[selector]){ins = M.i.class_instances[selector][1];sel = selector;}else if(M.i.class_instances[to]){ins = M.i.class_instances[to][1];sel = to;}
	if(ins){
		if(ins.length == 1){
			return ins[0][method].apply(ins[0],args);
		}else{
			for(var i=0;i<ins.length;i++) ins[i][method].apply(ins[i],args);
		}
	}else{
		if(element instanceof Array){
			return M.i.iter(function(item,index){
				var res = M.i._is_class(item);
				if(res) M.i.class_instances[res[0]][res[1]][method].apply(ins[i],args);
			},element);
		}else{
			var res = M.i._is_class(element);
			if(res) M.i.class_instances[res[0]][res[1]][method].apply(ins[i],args);
		}
	}
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.invoke_s = function(method,to){
	try{var element = to != undefined && to != null ? M.i.getElement(to) : M.i.getMe();
	
	var ins = false;
	var sel = "";
	var args = [];
	var selector = M.i.selector;
	
	for(var i=0;i<arguments.length;i++) if(i > 0) args[i-1] = arguments[i];
	args.length = arguments.length-1;
	if(M.i.class_instances[selector]){ins = M.i.class_instances[selector][1];sel = selector;}else if(M.i.class_instances[to]){ins = M.i.class_instances[to][1];sel = to;}
	if(ins){
		if(ins.length == 1){
			return ins[0].prototype[method].apply(ins[0],args);
		}else{
			for(var i=0;i<ins.length;i++) ins[i].prototype[method].apply(ins[i],args);
		}
	}else{
		if(element instanceof Array){
			return M.i.iter(function(item,index){
				var res = M.i._is_class(item);
				if(res) M.i.class_instances[res[0]][res[1]].prototype[method].apply(ins[i],args);
			},element);
		}else{
			var res = M.i._is_class(item);
			if(res) M.i.class_instances[res[0]][res[1]].prototype[method].apply(ins[i],args);
		}
	}
	
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype._i_class_selector = function(selector){
	try{var classes = M.i.class_instances;
	var res = [];
	for(key in classes){
		if(classes[key]){
			if(key == selector){
				for(var i=0;i<classes[key][1].length;i++) res.push(classes[key][1][i]);
			}
		}
	}
	
	return res;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype._i_class_name = function(class_name){
	try{var classes = M.i.class_instances;
	var res = [];
	for(key in classes){
		if(classes[key]){
			if(classes[key][0] == class_name){
				for(var i=0;i<classes[key][1].length;i++) res.push(classes[key][1][i]);
			}
		}
	}
	
	return res;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype._i_class_all = function(){
	try{var classes = M.i.class_instances;
	var res = [];
	for(key in classes){
		if(classes[key]){
			for(var i=0;i<classes[key][1].length;i++) res.push(classes[key][1][i]);
		}
	}
	
	return res;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype._is_class = function(to){
	try{var res = false;
	var classes = M.i.class_instances;
	for(key in classes){
		if(classes[key]){
			for(var i=0;i<classes[key][1].length;i++){
				if(classes[key][1][i].prototype.focus === to){
					res = [key,i];
				}
			}
		}
	}
	return res;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.loadScript = function(src,callback){
	try{var script = M.i.create("script"),loaded;
	script.setAttribute('src', src);
	if (callback) {script.onreadystatechange = script.onload = function() {if (!loaded) {callback();}loaded = true;};}
	M.i.base_doc.getElementsByTagName('head')[0].appendChild(script);
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.loadImage = function(src,callback){
	try{var image = new Image(),loaded;
	image.src = src;
	image.onload = function() {if (!loaded) {callback(image);}loaded = true;};
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
M.prototype.exceptions = {
  zg2_bounds:function zg2_bounds(value){
    this.value = value;
    this.message = "limits have been exceeded";
    this.toString = function(){return this.value + this.message};
  }
}
M.prototype.isMobile = function(options){
	try{
		var width = window.outerWidth ? (window.outerWidth < window.innerWidth ? window.outerWidth : window.innerWidth) : window.innerWidth;
		var height = window.outerHeight ? (window.outerHeight < window.innerHeight ? window.outerHeight : window.innerHeight) : window.innerHeight;
		width = window.devicePixelRatio ? width/window.devicePixelRatio : width;
		height = window.devicePixelRatio ? height/window.devicePixelRatio : height;
		return width <= options["width"] && height <= options["height"];
	return M.i;}catch(e){if(M.i.debug_mode) M.i.error(e,arguments);}
}
// lib vars
if(typeof M.i == 'undefined') M.i = (function(){ return new M();})();
if(typeof M.i.me == 'undefined') M.i.me = undefined;
if(typeof M.i.base_win == 'undefined') M.i.base_win = window;
if(typeof M.i.base_doc == 'undefined') M.i.base_doc = M.i.base_win.document;
if(typeof M.i.load_queue == 'undefined') M.i.load_queue = [];
if(typeof M.i.unload_queue == 'undefined') M.i.unload_queue = [];
if(typeof M.i.reg_objs == 'undefined') M.i.reg_objs = [];
if(typeof M.i.rect == 'undefined') M.i.rect = [0,0,0,0];
if(typeof M.i.actual_focus == 'undefined') M.i.actual_focus = false;
if(typeof M.i.nav_reg == 'undefined') M.i.nav_reg = [];
if(typeof M.i.svg_ns == 'undefined') M.i.svg_ns = 'http://www.w3.org/2000/svg';
if(typeof M.i.xhtml_ns == 'undefined') M.i.xhtml_ns = 'http://www.w3.org/1999/xhtml';
if(typeof M.i.debug_mode == 'undefined') M.i.debug_mode = false;
if(typeof M.i.xhr_queue == 'undefined') M.i.xhr_queue = [];
if(typeof M.i.jsonp_handler == 'undefined') M.i.jsonp_handler = {};
if(typeof M.i.class_instances == 'undefined') M.i.class_instances = [];
if(typeof M.i.selector == 'undefined') M.i.selector = "";
if(typeof M.i.bind_events == 'undefined') M.i.bind_events = [];
if(typeof M.i.poll_request == 'undefined') M.i.poll_request = [];
if(typeof M.i.zg2_enablebounds == 'undefined') M.i.zg2_enablebounds = false;
if(typeof M.i.zg2_bounds == 'undefined') M.i.zg2_bounds = {x:[0,0],y:[0,0]};
if(typeof M.i.zg2_pixel_ratio == 'undefined') M.i.zg2_pixel_ratio = false;
if(typeof M.i.zg2_store_ratio == 'undefined') M.i.zg2_store_ratio = false;
if(typeof M.i.zg2_computed_ratio == 'undefined') M.i.zg2_computed_ratio = false;
if(typeof M.i.zg2_base_resolution == 'undefined') M.i.zg2_base_resolution = [300,150];
if(typeof M.i.zg2_device_resolution == 'undefined') M.i.zg2_device_resolution = false;
if(typeof M.i.zg2_enableCv == 'undefined') M.i.zg2_enableCv = true;
if(typeof M.i.zg2_base_fps == 'undefined') M.i.zg2_base_fps = 60;
if(typeof M.i.mobile_host == 'undefined') M.i.mobile_host = false;
if(typeof M.i.bindings == 'undefined') M.i.bindings = {"bindHandlers":[]};								     
// lib document function events to set
M.i.init();
})();
//z._ = function(id,sub_id){return M(id,sub_id);};
// use short version
//}
if(!window._) window._ = function(id,sub_id){return M(id,sub_id);};
