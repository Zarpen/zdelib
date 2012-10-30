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
	if(!_(select+"D")){_("|bodyC").add("div","",{"attr":"class=info-tip;title="+me.title+"_tip;","text":me.title,"sty":"display:none;"});
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
	_("|body > [title="+me.title+"_tip]C").del();
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
		_().show_wait_msg({name:"Qsearch_"+me.focus.id+"_loading",img:{attr:"border=0;alt=loading;src=resources/img/loading.gif"}},_().gparent(me.focus));
		_().request(final_params);
	},me.delay,me)();
}
Qsearch.prototype.result = function(json){
	var me = this;
	var counter = 0;
	// hide loading gif
	_().hide_wait_msg("Qsearch_"+me.focus.id+"_loading");
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
	_().del_event("mousedown",{"func":function(e){
		var f = e.target ? e.target : e.srcElement;
		if((f.id && f.id.search(me.focus.id) >= 0) || (f.parentNode && f.parentNode.id && f.parentNode.id.search(me.focus.id) >= 0)){
		}else{if(_("#qsearch_container_"+me.focus.id+"D"))_("#qsearch_container_"+me.focus.id+"C").del();}
	},"capture":true,"with":me},_().getBase());
	_().del_event("keypress",{"func":function(e){
		var unicode=e.charCode? e.charCode : e.keyCode;
		if(unicode != 27){}else{if(_("#qsearch_container_"+me.focus.id+"D"))_("#qsearch_container_"+me.focus.id+"C").del();}
	},"capture":true,"with":me},_().getBase());
}
/* -------------------- */
/* CALENDAR CLASS */
function Calendar(args){
	var me = this;
	me.focus = args.focus;
	me.selector = args.selector;
	me.format = args.format ? args.format : "y/m/d";
	me.id = me.focus.id ? me.focus.id : _().guid();
	
	me.build();
	_(me.focus).add_event("focus",{func:function(){me.hideAll();me.show();},capture:true});
	
	_(me.focus).add_event("mousedown",{"func":function(e){
		var f = e.target ? e.target : e.srcElement;
		if((f.id && f.id.search(me.focus.id) >= 0) || (f.parentNode && f.parentNode.id && f.parentNode.id.search(me.focus.id) >= 0) || 
			(f.className && f.className.search("calendar") >= 0) || (f.parentNode && f.parentNode.className && f.parentNode.className.search("calendar") >= 0)){
		}else{if(_("#calendar_container_"+me.id+"D"))me.hide();}
	},"capture":true,"with":me},_().getBase());
	_().add_event("keypress",{"func":function(e){
		var unicode=e.charCode? e.charCode : e.keyCode;
		if(unicode != 27){}else{if(_("#calendar_container_"+me.id+"D")){me.hide();me.focus.blur();}}
	},"capture":true,"with":me},_().getBase());
}
Calendar.prototype.build = function(){
	var me = this;
	var dt = _().zt.d();
	var y = _("#calendar_year_"+me.id+"D") && !_().empty(_("#calendar_year_"+me.id+"C").val()) ? _("#calendar_year_"+me.id+"C").val() : dt.getFullYear();
	var m = _("#calendar_month_"+me.id+"D") && !_().empty(_("#calendar_month_"+me.id+"C").val()) ? _("#calendar_month_"+me.id+"C").val()+1 : dt.getMonth()+1;
	var d = dt.getDate();

	var day_name = ["Mo","Tu","We","Th","Fr","Sa","Su"];
	var month_name = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	
	var month_days = _().zt.month_days(m,y);
	var month_start = _().zt.week_day(1,m,y) == 0 ? 6 : _().zt.week_day(1,m,y)-1;
	var row = 0;
	
	var pos = _(me.focus).get_pos();
	if(_("#calendar_container_"+me.id+"D")) _("#calendar_container_"+me.id+"C").del();
	
	_(_().getBase().body).addm("<div id='calendar_container_"+me.id+"' style='position:absolute;left:"+pos[0]+"px;top:"+(pos[1]+pos[3])+"px;display:none;' class='calendar-box' >"+
	"<table class='calendar-header' ><tr style='backgroundColor:#c4c4c4;' ><td colspan='7' ><select id='calendar_year_"+me.id+"' ></select>&nbsp;&nbsp;<select id='calendar_month_"+me.id+"' ></select>"+
	"</td></tr><tr id='calendar_header_"+me.id+"' style='backgroundColor:#c4c4c4;' ></tr><tr><td colspan='7' style='padding:0px;' ><table id='calendar_days_"+me.id+"' class='calendar-body' >"+
	"<tr></tr></table></td></tr></table></div>");

	for(var i=dt.getFullYear()-15;i<=dt.getFullYear()+15;i++) _("#calendar_year_"+me.id+"C").add("option","",{"attr":"value="+i+";label="+i+";"+(i == y ? "selected=selected;" : ""),"text":i});
	for(var i=0;i<12;i++) _("#calendar_month_"+me.id+"C").add("option","",{"attr":"value="+i+";label="+month_name[i]+";"+(i == m-1 ? "selected=selected;" : ""),"text":month_name[i]});
	for(var i=0;i<7;i++) _("#calendar_header_"+me.id+"C").add("th","",{"text":day_name[i]});
	_("#calendar_year_"+me.id+"C").add_event("change",{"func":function(){me.build();me.show();},"capture":true});
	_("#calendar_month_"+me.id+"C").add_event("change",{"func":function(){me.build();me.show();},"capture":true});
	
	// draw calendar
	var columns = (parseInt((month_start-1+month_days)/7)+1)*7;
	for(var i=0;i<columns;i++){
		if(parseInt(((i/7.0) - parseInt(i/7))*10) == 7) _("#calendar_days_"+me.id+" > |trC").ix(row).add("td","",{text:"\u0020",attr:"class=calendar-separator;"});
        if(i%7 == 0 && i != 0){_("#calendar_days_"+me.id+"C").add("tr");row++;}
		if(i < month_start || i >= month_days+month_start){
			_("#calendar_days_"+me.id+" > |trC").ix(row).add("td","",{text:"\u0020",attr:"class=calendar-no-day;"});
        }else if(i >= month_start){
			var temp = ((i-month_start)+1);
			if(!(temp > month_days)){
				_("#calendar_days_"+me.id+" > |trC").ix(row).add("td","",{text:temp,sty:(temp == d && m == dt.getMonth()+1 && y == dt.getFullYear()
					? "backgroundColor:#ffc0c0;": false),attr:"class=calendar-valid-day;"}).
				nav(-1).add_event("click",{func:function(c){return function(){me.setDate(c,m,y);}}(temp),capture:true});
			}else{
				_("#calendar_days_"+me.id+" > |trC").ix(row).add("td","",{attr:"class=calendar-invalid-day;",text:temp,sty:(temp == d && m == dt.getMonth()+1 && y == dt.getFullYear()
					? "backgroundColor:#ffc0c0;": false)});
			}
        }  
	}
}
Calendar.prototype.setFormat = function(format){
	var me = this;
	me.format = format;
}
Calendar.prototype.getFormat = function(format){
	var me = this;
	return me.format;
}
Calendar.prototype.setDate = function(d,m,y){
	var me = this;
	_(me.focus).val(me.format.replace("y",y).replace("m",(m >= 10 ? m : "0"+m)).replace("d",(d >= 10 ? d : "0"+d)));
	me.hide();
}
Calendar.prototype.show = function(){
	var me = this;
	_("#calendar_container_"+me.id+"C").set_sty("display:;");
}
Calendar.prototype.hide = function(){
	var me = this;
	_("#calendar_container_"+me.id+"C").set_sty("display:none;");
}
Calendar.prototype.showAll = function(){
	_(".calendar-boxC").set_sty("display:;");
}
Calendar.prototype.hideAll = function(){
	_(".calendar-boxC").set_sty("display:none;");
}
Calendar.prototype._delete = function(){
	var me = this;
	if(_("#calendar_container_"+me.id+"D")) _("#calendar_container_"+me.id+"C").del();
	_(me.focus).del_event("focus",{func:function(){me.hideAll();me.show();},capture:true});
	
	_(me.focus).del_event("mousedown",{"func":function(e){
		var f = e.target ? e.target : e.srcElement;
		if((f.id && f.id.search(me.focus.id) >= 0) || (f.parentNode && f.parentNode.id && f.parentNode.id.search(me.focus.id) >= 0) || 
			(f.className && f.className.search("calendar") >= 0) || (f.parentNode && f.parentNode.className && f.parentNode.className.search("calendar") >= 0)){
		}else{if(_("#calendar_container_"+me.id+"D")) me.hide();}
	},"capture":true,"with":me},_().getBase());
	_().del_event("keypress",{"func":function(e){
		var unicode=e.charCode? e.charCode : e.keyCode;
		if(unicode != 27){}else{if(_("#calendar_container_"+me.id+"D")){me.hide();me.focus.blur();}}
	},"capture":true,"with":me},_().getBase());
}
function Dialog(args){
	var me = this;
	me.focus = args.focus;
	me.selector = args.selector;
	me.bind_count = 0;
	me.id = me.focus.id ? me.focus.id : _().guid();
	
	mb._(me.focus).wrap({id:me.id});
	
	_(_().getBase().body).addm("<div id='"+me.id+"_win_conteiner' ><div id='"+me.id+"_win_resize' style='padding:2px;' ><div id='"+me.id+"_win_content' ></div></div></div>");
	
}
Dialog.prototype.bind = function(event_name,func){
	var me = this;
	me.events[event_name].push([me.bind_count,func]);
	me.bind_count++;
	return me.bind_count;
}
Dialog.prototype.unbind = function(event_name,bind_code){
	var me = this;
	for(var i=0;i<me.events[event_name].length;i++) if(me.events[event_name][i][0] == bind_code) me.events[event_name].slice(i,i);
}
Dialog.prototype.run_bind = function(event_name,options){
	var me = this;
	for(var i=0;i<me.events[event_name].length;i++) me.events[event_name][i][1].apply(me,[options]);
}