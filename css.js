_().load(function(){
	// prepare css
	_().createCSS("decoration",{"attr":"type=text/css;"});
	_().addRule([
			["body","margin:0;padding:0;background:url('resources/img/bg.png') repeat scroll 0 0 transparent;font-family:Verdana;font-size:1.1em;"],
			["input","display:inline-block;border:2px solid #ff5353;background-color:#97ff86;"],
			["input:focus","background-color:white;"],
			[".container","width:100%;height:100%"],
			[".header","width:100%;background-color:white;margin-bottom:1%;"],
			[".panel-left","width:15%;margin:1%;padding:1%;-moz-border-radius: 15px;border-radius: 15px;border:3px solid black;background-color:white;"],
			[".panel-center","width:55%;padding:1%;margin:1%;-moz-border-radius: 15px;border-radius: 15px;background-color:white;"],
			[".panel-right","width:15%;padding:2%;"],
			[".footer","width:100%;"],
			[".menu-list","list-style:none;"],
			[".menu-list li","padding-top:2%;text-align:left;"],
			[".menu-list li a","text-decoration:none;color:black;"],
			[".menu-list li a:hover","cursor:pointer;font-family:Arial;font-weight:bold;font-style:italic;font-size:1.3em;"],
			[".stock-suggestions","border:1px solid black;margin:0;padding:0;border-collapse: collapse;background-color:white;font-family:Arial;font-weight:bold;"],
			[".stock-suggestions tr:hover","background-color:#51ff76;border-bottom:1px dashed black;cursor:pointer;"],
			[".quote-detail","margin-top:50px;border:1px dashed black;background-color:#fff59f;font-family:Times New Roman;font-size:0.8em;margin-left:auto;margin-right:auto;"],
			[".quote-detail td","border-bottom:1px dashed black;"],
			[".info-tip","padding:5px;-moz-border-radius: 15px;border-radius: 15px;border:2px solid black;font-family:Verdana;font-size:0.8em;font-style:italic;font-weight:bold;background-color:#ffa3a3;"],
	],"decoration");
});