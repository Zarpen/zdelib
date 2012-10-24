_().load(function(){
	_().debug(true);
	// set primary containers, panels and menus
	_(document.body).add("div","container",{"attr":"class=container"});
	_("#containerC").add("div","header",{"attr":"class=header"}).nav(1)
	.add("img","header-logo",{"attr":"src=img/logo.png"}).nav(0)
	.add("div","top-menu",{"attr":"class=top-menu"}).nav(3)
	.add("ul","menu-list",{"attr":"class=menu-list"});
	_().request({
		url:"json.php?action=menu&lang=es_es",
		type:"json",
		method:"POST",
		async:true,
		func: function(o,xhr){
			for(var i=0;i<o.length;i++){ 
				if(o[i]["relate"] == "top-menu"){
					_("#menu-listC").add("li",o[i]["name"]).nav("#"+o[i]["name"]).add("a",o[i]["name"]+"-a",{"attr":"href=#;class=menu-list-a;"}).nav("#"+o[i]["name"]+"-a").setText(o[i]["text"]);
					_("#"+o[i]["name"]+"C").add("div",o[i]["name"]+"-sub",{"attr":"class=menu-list-sub;"});
					for(var j=0;j<o.length;j++){
						if(o[j]["relate"] == o[i]["name"]){
							_("#"+o[i]["name"]+"-subC").add("a",o[j]["name"]+"-sub-a",{"attr":"href=#"}).nav(-1).setText(o[j]["text"]);
							_("#"+o[j]["name"]+"-sub-aC").add_event("click",(function(item){return function(e){submenu_section(e,o[item]["name"]);}})(j),true,null,true);
						}
					}
				}
			}
			_("#menu-listC").add("div","",{"sty":"float:none;clear:both;"}).nav("#container")
			.add("div","panel-left",{"attr":"class=panel-left"})
			.add("div","panel-center",{"attr":"class=panel-center"})
			.add("div","panel-right",{"attr":"class=panel-right"})
			.add("div","footer",{"attr":"class=footer"});
			_("#top-menu > |liC").add_event("mouseover",function(){_("#"+this.id+"-aC").set_attr("class=menu-list-on;");_("#"+this.id+"-subC").set_sty("display:block;");},true);
			_("#top-menu > |liC").add_event("mouseout",function(){_("#"+this.id+"-aC").set_attr("class=menu-list-off;");_("#"+this.id+"-subC").set_sty("display:none;");},true);
			submenu_section(false,"functions");
		}
	});
	/*_(document.body).add("div","gtest").nav(-1).add("p","gtest-text",{"text":"Este texto se gira unos 50 grados e intenta centrarse"}).zg.put(700,400,400,400).zg.rotate_2d(50).set_sty("padding:125px;")
	.nav(".zdelib-rotate").ix(0).drag();
	_(document.body).add("div","class-test").nav("#class-test").add("p","",{"attr":"class=win;"}).add("p","",{"attr":"class=win;"}).add("p","",{"attr":"class=win;"}).add("p","",{"attr":"class=win;"});
	_("#class-testC")._class("zui_diag");
	_("#class-test > .winC").invoke("getName","red");
	_("#class-test > .winC")._unclass();
	_(document.body).add("div","class-test",{"sty":"width:200px;height:200px;backgroundColor:blue;"}).nav("#class-test").add("p","",{"text":"prueba"}).drag();
	_("#class-testC").undrag();*/
});
/* ------------------ SUBMENU SECTION  -------------------- */
// determine section to show
function submenu_section(e,section){
	_().cancel_event(e);
	switch(section){
		case "functions": function_section(e); break;
	}
}
/* ------------------ FUNCTION SECTION -------------------- */
// show the function menu and first item on center panel
function function_section(e){
	_("#panel-leftC").clear();
	_("#panel-leftC").add("ul","function-list",{"attr":"class=function-left"});
	_().request({
		url:"json.php?action=menu&lang=es_es&info_parent=functions",
		type:"json",
		method:"POST",
		async:true,
		func: function(o,xhr){
			for(var i=0;i<o.length;i++){ 
				_("#function-listC").add("li",o[i]["name"]+"-lnk").nav(-1).add("a","",{"attr":"href=#;"}).nav(-1).html(o[i]["text"]).add_event("mouseover",
					function(c){return function(){_("#"+o[c]["name"]+"-lnkC").set_sty("backgroundImage:url('img/marker-on.jpg');");}}(i),true,null,true).add_event("mouseout",
					function(c){return function(){_("#"+o[c]["name"]+"-lnkC").set_sty("backgroundImage:url('img/marker-off.jpg');");}}(i),true,null,true).add_event("click",
					function(c){return function(){function_info(o[c]["name"],o[c]["text"]);}}(i),true,null,true);
			}
		}
	});
}
function function_info(function_name,function_title){
	_("#panel-centerC").set_sty("display:none;");
	_("#panel-centerC").clear();
	_("#panel-centerC").add("div","function-title",{"sty":"fontWeight:bold;","attr":"class=function-title;"}).nav(-1).html(function_title).nav(0).
	add("div","function-header",{"attr":"class=function-header;"}).add("div","function-content",{"attr":"class=function-content"});
	_().request({
		url:"json.php?action=content&lang=es_es&info_parent=functions&sections='data-header','data-content'&for="+function_name,
		type:"json",
		method:"POST",
		async:true,
		func: function(o,xhr){
			for(var i=0;i<o.length;i++){
				if(o[i]["section"] == "data-header") _("#function-headerC").html(o[i]["text"]);
				if(o[i]["section"] == "data-content") _("#function-contentC").html(o[i]["text"]);
			}
		}
	});
	_("#panel-centerC").set_sty("display:block;");
}