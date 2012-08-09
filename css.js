_().load(function(){
	// prepare css
	_().createCSS("decoration",{"attr":"type=text/css;"});
	_().addRule([
			["body","margin:0;padding:0"],
			[".container","width:100%;height:100%"],
			[".header","width:100%;"],
			[".panel-left","width:20%;padding:5%;"],
			[".panel-center","width:60%;padding:5%;"],
			[".panel-right","width:20%;padding:5%;"],
			[".footer","width:100%;"],
			[".menu-list","list-style:none;"],
			[".menu-list li a","text-decoration:none;color:black;"],
			[".menu-list li a:hover","cursor:pointer;font-family:Arial;font-weight:bold;font-style:italic;"],
			[".stock-suggestions","border:1px solid black;margin:0;padding:0;border-collapse: collapse;background-color:white;"],
			[".stock-suggestions tr:hover","background-color:#51ff76;border-bottom:1px dashed black;cursor:pointer;"],
			[".quote-detail","margin-top:50px;border:1px dashed black;background-color:#fff59f;"],
			[".quote-detail td","border-bottom:1px dashed black;"],
	],"decoration");
});