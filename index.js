/* MAIN PAGE CLASS */
function Index(){}
Index.prototype.show_example = function(example_id){
	if(_("|td>|inputD")) _("|td> |inputC")._unclass();
	if(_("#stock-inputD")) _("#stock-inputC")._unclass();
	if(_("#date-input-startD")) _("#date-input-startC")._unclass();
	if(_("#date-input-endD")) _("#date-input-endC")._unclass();
	if(_(".dialog-boxD")) _()._unclass_type("Dialog");
	if(_("#gallery-areaD")) _("#gallery-areaC")._unclass();
	
	_().clear_poll();
	
	_("#panel-centerC").set_sty("visibility:visible;");
	_("#panel-centerC").clear();
	
	switch(example_id){
		case "introduction-example":
			_("#panel-centerC").addm("<article><h1>Introduction</h1><div>Simple examples using zdelib!</div></article>");
		break;
		case "tip-example":
			_("#panel-centerC").addm("<article><h1>Simple tip example</h1><div><form><table><tr><td>Name:&nbsp;&nbsp;</td><td><input title='Enter your Name' /></td></tr><tr>\
				<td colspan='2'>&nbsp;</td></tr><tr><td>Last Name:&nbsp;&nbsp;</td><td><input title='Enter your Last Name' /></td></tr></table></form></div></article>").nav("|td > |inputC")._class("Infotip");
		break;
		case "stock-example":
			_("#panel-centerC").addm("<article><h1>Stock search example</h1><div><form><table><tr><td>Search Stock&nbsp;&nbsp;</td><td><input id='stock-input' type='text' />&nbsp;&nbsp;(Real time quotes)&nbsp;&nbsp;</td></tr></table></form></div></article>");
			_("#stock-inputC")._class("Qsearch",{
				ajax:{
					url:"https://yfapi.net/v6/finance/autocomplete?region=US&lang=en&query=$",
					method: "GET",
					async: true,
					type:"json",
					id:"stock_search",
					headers: [["X-API-KEY","jioYjveyala37vGzhV0DCHzwoSeGy6G5Ah1nNm4j"]],
					func:function(data){if(_('#stock-inputD')) _('#stock-inputC').invoke("result",data);}
				},
				delay:500,
				suggestion_columns:["symbol","name","exchDisp","typeDisp"]
			});
			_('#stock-inputC').invoke("bind","select",function(options){
				let requestCallback = function(json){
					//if(_().poll_live("stock_detail_poll")){
						try{
							json = json[0];
							_().hide_wait_msg("stock-detail-loading");
							var quote = json.quoteResponse.result[0];
							if(_("#quote_detailD")){
								for(key in quote) _("#"+key+"C").setText(key+": "+quote[key]);
							}else{
								_("#panel-centerC").addm("<article><table id='quote_detail' class='quote-detail' ></table></article>");
								var max_columns = 3;
								var td_count = 0,tr_count = 0;
								_("#quote_detailC").add("tr");
								for(key in quote){
									_("#quote_detail > |tbody > |trC").ix(tr_count).add("td",key,{text:key+": "+quote[key],sty:"paddingRight:10px;"});
									td_count++;
									if(td_count >= max_columns){_("#quote_detailC").add("tr");td_count = 0;tr_count++;}
								}
							}
						}catch(e){
							if(!_("#quote_detailD")) 
								_("#panel-centerC").show_wait_msg({name:"stock-detail-loading",img:{attr:"border=0;alt=loading;src=resources/img/loading.gif"},container:{sty:"padding:1%;"}});
						}
					//}
				};
				var symbol = options["data"].ResultSet.Result[options["item"]]["symbol"];
				_("#quote_detailC").del();
				_("#panel-centerC").show_wait_msg({name:"stock-detail-loading",img:{attr:"border=0;alt=loading;src=resources/img/loading.gif"},container:{sty:"padding:1%;"}});
				_().request({
					url:"https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=" + symbol,
					method: "GET",
					async: true,
					type:"json",
					id:"stock_detail",
					headers: [["X-API-KEY","jioYjveyala37vGzhV0DCHzwoSeGy6G5Ah1nNm4j"]],
					func:requestCallback,
					poll: {
						poll:"stock_detail_poll",
						poll_delay:60000,
						pfunc:requestCallback
					}
				});
			});
		break;	
		case "calendar-example":
			_("#panel-centerC").addm("<article><h1>Calendar example</h1><div><form><table><tr><td>Select Start Date:</td><td><input id='date-input-start' type='text' size='10' /></td>"+
			"<td>&nbsp;&nbsp;&nbsp;&nbsp;Select End Date:</td><td><input id='date-input-end' type='text' size='10' /></td></tr></table></form></div></article>")
			.nav("#date-input-startC")._class("Calendar").nav("#date-input-endC")._class("Calendar");
		break;
		case "dialog-example":
			_("#panel-centerC").addm("<article><h1>Dialog example</h1><div><p>Clik <a id='open_window' href='#' >here</a> for window open</p></div></article>").nav("#open_windowC").add_event("click",{func:function(e){
				_().cancel_event(e);
				var id = _().guid();
				_("|bodyC").addm("<div id='"+id+"' ><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt"+ 
					"ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco"+ 
					"laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in"+
					"voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat"+
					"non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p></div>").nav("#"+id+"C")._class("Dialog",{
						width:500,height:500,autoOpen:true,center:true
					});
			},capture:true});
		break;
		case "gallery-example":
			_("#panel-centerC").add("div","gallery-area").nav("#gallery-areaC")._class("Gallery");
		break;
	}
}
/* -------------- */
_().load(function(){
	_().debug(true);
	_().add_class("Index",Index);
	_().add_class("Infotip",Infotip);
	_().add_class("Qsearch",Qsearch);
	_().add_class("Calendar",Calendar);
	_().add_class("Dialog",Dialog);
	_().add_class("Gallery",Gallery);
	
	_("|bodyC")._class("Index");
	
	_("|bodyC").addm("<main id='container' class='container' ><header id='header' class='header' ><div id='logo' ><img alt='zdelib' border='0' src='resources/img/logo.png' /></div></header>"
		+"<aside id='panel-left' class='panel-left' ><nav><ul id='examples-list' class='menu-list' >"
		+"<li><a id='introduction-example' href='#'>Introduction</a></li>"
		+"<li><a id='tip-example' href='#'>Simple tip example</a></li>"
		+"<li><a id='stock-example' href='#'>Stock search example</a></li>"
		+"<li><a id='calendar-example' href='#'>Calendar example</a></li>"
		+"<li><a id='dialog-example' href='#'>Dialog example</a></li>"
		+"<li><a id='gallery-example' href='#'>Gallery example</a></li></ul></nav></aside>"
		+"<section id='panel-center' class='panel-center' ></section><section id='panel-right' class='panel-right' ></section><div class='clearFooter' ></div><footer id='footer' class='footer' ><div class='footer-content' ><a href='https://github.com/Zarpen//zdelib' target='_blank' >Github</a></div></footer></main>");
		
	_("#examples-list > |li > |aC").add_event("click",{"func":function(){_("|bodyC").invoke("show_example",this.id);},"capture":true});
	
	_("#panel-centerC").set_sty("visibility:hidden;");
});
