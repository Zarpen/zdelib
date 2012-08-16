/* MAIN PAGE CLASS */
function Index(){}
Index.prototype.show_example = function(example_id){
	if(_("|td>|inputD")) _("|td > |inputC")._unclass();
	if(_("#stock-inputD")) _("#stock-inputC")._unclass();
	_().clear_poll();
	
	_("#panel-centerC").set_sty("visibility:visible;");
	_("#panel-centerC").clear();
	
	switch(example_id){
		case "tip-example":
			_("#panel-centerC").addm("<form><table><tr><td>Name:&nbsp;&nbsp;</td><td><input title='Enter your Name' /></td></tr><tr>\
				<td colspan='2'>&nbsp;</td></tr><tr><td>Last Name:&nbsp;&nbsp;</td><td><input title='Enter your Last Name' /></td></tr></table></form>").nav("|td > |inputC")._class("Infotip");
		break;
		case "stock-example":
			_("#panel-centerC").addm("<form><table><tr><td>Search Stock&nbsp;&nbsp;</td><td><input id='stock-input' type='text' />&nbsp;&nbsp;(Real time quotes)&nbsp;&nbsp;</td></tr></table></form>");
			_("#stock-inputC")._class("Qsearch",null,{
				ajax:{
					url:"http://d.yimg.com/aq/autoc?query=$&region=ES&lang=es-ES",
					pcallback:"YAHOO.util.ScriptNodeDataSource.callbacks",
					type:"jsonp",
					id:"stock_search",
					pfunc:function(data){if(_('#stock-inputD')) _('#stock-inputC').invoke("result",data);},
					wrap:{key:"YAHOO",value:{util:{ScriptNodeDataSource:{callbacks:0}}},function_key:"callbacks"}
				},
				delay:500,
				suggestion_columns:["symbol","name","exchDisp","typeDisp"]
			});
			_('#stock-inputC').invoke("bind","select",function(options){
				var symbol = options["data"].ResultSet.Result[options["item"]]["symbol"];
				_("#quote_detailC").del();
				_("#panel-centerC").show_wait_msg({name:"stock-detail-loading",img:{attr:"border=0;alt=loading;src=resources/img/loading.gif"},container:{sty:"padding:1%;"}});
				_().request({
					url:"http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol = '"+symbol+"'&env=store://datatables.org/alltableswithkeys&format=json",
					type:"jsonp",
					id:"stock_detail",
					pfunc:function(json){
						//if(_().poll_live("stock_detail_poll")){
							try{
								_().hide_wait_msg("stock-detail-loading");
								var quote = json.query.results.quote;
								if(_("#quote_detailD")){
									for(key in quote) _("#"+key+"C").setText(key+": "+quote[key]);
								}else{
									_("#panel-centerC").addm("<table id='quote_detail' class='quote-detail' ></table>");
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
					},
					poll:"stock_detail_poll",
					poll_delay:1000
				});
			});
			_("#panel-centerC").addm("<div id='poll_test' ></div>");
		case "social-example":
			
		break;
		break;
	}
}
/* -------------- */
_().load(function(){
	_().debug(true);
	_().add_class("Index",Index);
	_().add_class("Infotip",Infotip);
	_().add_class("Qsearch",Qsearch);
	
	_("|bodyC")._class("Index");
	
	_("|bodyC").addm("<div id='container' class='container' ><div id='header' class='header' ><div id='logo' ><img alt='zdelib' border='0' src='resources/img/logo.png' /></div></div>"
		+"<div id='panel-left' class='panel-left' style='float:left' ><ul id='examples-list' class='menu-list' >"
		+"<li><a id='tip-example' href='#'>Simple tip example</a></li>"
		+"<li><a id='stock-example' href='#'>Stock search example</a></li>"
		+"<li><a id='social-example' href='#'>Social example</a></li></ul></div>"
		+"<div id='panel-center' class='panel-center' style='float:left' ></div><div id='panel-right' style='float:left' class='panel-right' ></div><div style='float:none;clear:both' ></div><div id='footer' class='footer' ></div></div>");
		
	_("#examples-list > |li > |aC").add_event("click",{"func":function(){_("|bodyC").invoke("show_example",this.id);},"capture":true});
	
	_("#panel-centerC").set_sty("visibility:hidden;");
});