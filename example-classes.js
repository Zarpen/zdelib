// EXAMPLE CLASSES
/* INFOTIP SIMPLE CLASS */
function Infotip(args){
	var me = this;
	me.focus = args.focus;
	me.selector = args.selector;
	me.title = me.focus.title;
	
	_().add_event("mousemove",{"func":me.show,"capture":true,"with":me},me.focus);
	_().add_event("mouseout",{"func":me.hide,"capture":true,"with":me},me.focus);
	_().set_attr("title=;",me.focus);
}
Infotip.prototype.show = function(e){
	_().cancel_event(e);
	var me = this;
	var select = "|body > [title="+me.title+"_tip]";
	if(_(select+"D").length < 1){_("|bodyC").add("div","",{"attr":"class=info-tip;title="+me.title+"_tip;","text":me.title,"sty":"display:none;backgroundColor:yellow;"});
	_(select+"C").set_sty("position:absolute;left:"+(_().event_pos(e)[0]+10)+"px;top:"+(_().event_pos(e)[1]+10)+"px;zIndex:100;display:block;");}else{
		_(select+"C").set_sty("position:absolute;left:"+(_().event_pos(e)[0]+10)+"px;top:"+(_().event_pos(e)[1]+10)+"px;display:block;");}
}
Infotip.prototype.hide = function(e){
	_().cancel_event(e);
	var me = this;
	var select = "|body > [title="+me.title+"_tip]";
	_(select+"C").set_sty("display:none;");
}
Infotip.prototype._delete = function(){
	var me = this;
	_().del_event("mousemove",{"func":me.show,"capture":true},me.focus);
	_().del_event("mouseout",{"func":me.hide,"capture":true},me.focus);
	me.focus.title = me.title;
}
/* QSEARCH CLASS*/
function Qsearch(args){
	var me = this;
	me.focus = args.focus;
	me.selector = args.selector;
	me.ajax = args.ajax;
	me.delay = args.delay;
	me.suggestion_columns = args.suggestion_columns;
	me.last_search = false;
	me.events = {select:[],close:[]};
	me.bind_count = 0;
	
	_().add_event("keydown",{"func":me.search,"capture":true,"with":me},me.focus);
	_().add_event("mousedown",{"func":function(e){
		var f = e.target ? e.target : e.srcElement;
		if((f.id && f.id.search(me.focus.id) >= 0) || (f.parentNode && f.parentNode.id && f.parentNode.id.search(me.focus.id) >= 0)){
		}else{if(_("#qsearch_container_"+me.focus.id+"D"))_("#qsearch_container_"+me.focus.id+"C").del();}
	},"capture":true,"with":me},_().getBase());
	_().add_event("keypress",{"func":function(e){
		var unicode=e.charCode? e.charCode : e.keyCode;
		if(unicode != 27){}else{if(_("#qsearch_container_"+me.focus.id+"D"))_("#qsearch_container_"+me.focus.id+"C").del();}
	},"capture":true,"with":me},_().getBase());
}
Qsearch.prototype.bind = function(event_name,func){
	var me = this;
	me.events[event_name].push([me.bind_count,func]);
	me.bind_count++;
	return me.bind_count;
}
Qsearch.prototype.unbind = function(event_name,bind_code){
	var me = this;
	for(var i=0;i<me.events[event_name].length;i++) if(me.events[event_name][i][0] == bind_code) me.events[event_name].slice(i,i);
}
Qsearch.prototype.run_bind = function(event_name,options){
	var me = this;
	for(var i=0;i<me.events[event_name].length;i++) me.events[event_name][i][1].apply(me,[options]);
}
Qsearch.prototype.search = function(){
	var me = this;
	var final_params = {};
	for(key in me.ajax) final_params[key] = me.ajax[key];
	
	_().debounce(function(){
		if(me.ajax.type != "jsonp"){
			if(me.last_search.abort) me.last_search.abort();
		}
		final_params.url = final_params.url.replace("$",me.focus.value);
		_().request(final_params);
	},me.delay,me)();
}
Qsearch.prototype.result = function(json){
	var me = this;
	var counter = 0;
	// response as json type
	var pos = _(me.focus).get_pos(null,true);
	pos[1] = pos[1]+me.focus.offsetHeight;
	if(_("#qsearch_container_"+me.focus.id+"D")) _("#qsearch_container_"+me.focus.id+"C").del();
	_(_().getBase().body).addm("<div id='qsearch_container_"+me.focus.id+"' style='position:absolute' ><table class='stock-suggestions' ><tbody></tbody></table></div>");
	_("#qsearch_container_"+me.focus.id+"C").set_pos(pos);
	for(index in json.ResultSet.Result){
		_("#qsearch_container_"+me.focus.id+" > |tbodyC").add("tr",me.focus.id+"_"+index);
		_("#qsearch_container_"+me.focus.id+" > |tbody > |trC").ix(counter).add_event("click",{width:me,capture:true,func:function(i){return function(){me.close();me.run_bind("select",{data:json,item:i});}}(index)});
		for(key in json.ResultSet.Result[index]) if(_().in_array(key,me.suggestion_columns))
			_("#qsearch_container_"+me.focus.id+" > |tbody > |trC").ix(counter).add("td","",{text:json.ResultSet.Result[index][key],sty:"paddingRight:10px;"});
		counter++;
	}
}
Qsearch.prototype.close = function(){
	var me = this;
	if(_("#qsearch_container_"+me.focus.id+"D")) _("#qsearch_container_"+me.focus.id+"C").del();
	me.run_bind("close",{});
}
Qsearch.prototype._delete = function(){
	var me = this;
	if(_("#qsearch_container_"+me.focus.id+"D")) _("#qsearch_container_"+me.focus.id+"C").del();
	_().del_event("keydown",{"func":me.search,"capture":true,"with":me},me.focus);
}
/* -------------------- */