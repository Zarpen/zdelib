_().load(function(){
	// prepare css
	_().createCSS("decoration",{"attr":"type=text/css;"});
	_().addRule([
			["body","margin:0;padding:0"],
			[".container","width:100%;height:100%"],
			[".header","width:100%;background-color:#82ffdd;"],
			[".top-menu","background-color:black;width:100%;"],
			[".menu-list","list-style:none;margin:0;padding:0 40% 0 40%;"],
			[".menu-list li","float:left;"],
			[".menu-list-a","text-decoration:none;display:block;padding:6px;text-align:center;color:white;"],
			[".menu-list-on","background-color:white;border-top:1px solid black;text-decoration:none;display:block;padding:6px;text-align:center;color:black;"],
			[".menu-list-off","background-color:none;border:none;text-decoration:none;display:block;padding:6px;text-align:center;color:white;"],
			[".menu-list-sub","position:absolute;display:none;float:none;border:1px solid black;border-top:none;width:300px;background-color:white;"],
			[".menu-list-sub a","text-decoration:none;display:block;text-align:center;color:black;"],
			[".menu-list-sub a:hover","background-color:#82ffa2;"],
			[".panel-left","width:15%;float:left;padding:30px;"],
			[".panel-center","width:40%;float:left;padding:30px;margin-left:15%;border-right:5px solid #d8cdff;background-color:#82ffdd;display:none;"],
			[".panel-right","width:30%;float:left;padding:30px;"],
			[".footer","width:100%;clear:both;"],
			[".function-left","list-style-image:none;list-style:none;"],
			[".function-left li","background-image:url('img/marker-off.jpg');background-repeat:no-repeat;padding-left:15px;background-position:left center;"],
			[".function-left li a","text-decoration:none;color:black;"],
			[".function-left li a:hover","cursor:pointer;font-family:Arial;font-weight:bold;font-style:italic;"],
			[".function-title","background-color:#fffed6;border:1px dashed black;padding:2%;"],
			[".function-header","background-color:white;margin:2%;padding:2%;"],
			[".function-content","background-color:white;margin:2%;padding:2%;"]
	],"decoration");
});