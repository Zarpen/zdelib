_().load(function(){
	// prepare css
	_().createCSS("decoration",{"attr":"type=text/css;"});
	_().addRule([
			["body","margin:0;padding:0;background:url('resources/img/bg.png') repeat scroll 0 0 transparent;font-family:Verdana;font-size:1em;"],
			["input","display:inline-block;border:2px solid #ff5353;background-color:#97ff86;"],
			["input:focus","background-color:white;"],
			[".container","width:100%;height:100%"],
			[".header","width:100%;background-color:white;margin-bottom:1%;border-bottom:1px solid black;"],
			[".panel-left","width:20%;margin:1%;padding:1%;-moz-border-radius: 15px;border-radius: 15px;border:3px solid black;background-color:white;"],
			[".panel-center","width:50%;padding:1%;margin:1%;-moz-border-radius: 15px;border-radius: 15px;background-color:white;border:1px solid black;"],
			[".panel-right","width:15%;padding:2%;"],
			[".footer","width:100%;"],
			[".menu-list","list-style:none;"],
			[".menu-list li","padding-top:2%;text-align:left;"],
			[".menu-list li a","text-decoration:none;color:black;"],
			[".menu-list li a:hover","cursor:pointer;font-family:Arial;font-weight:bold;font-style:italic;font-size:1.2em;"],
			[".stock-suggestions","border:1px solid black;margin:0;padding:0;border-collapse: collapse;background-color:white;font-family:Arial;font-weight:bold;"],
			[".stock-suggestions tr:hover","background-color:#51ff76;border-bottom:1px dashed black;cursor:pointer;"],
			[".quote-detail","margin-top:50px;border:1px dashed black;background-color:#fff59f;font-family:Times New Roman;font-size:0.8em;margin-left:auto;margin-right:auto;"],
			[".quote-detail td","border-bottom:1px dashed black;"],
			[".info-tip","padding:5px;-moz-border-radius: 15px;border-radius: 15px;border:2px solid black;font-family:Verdana;font-size:0.8em;font-style:italic;font-weight:bold;background-color:#ffa3a3;"],
			[".calendar-box","text-align:center;background-color:#b5ddff;"],
			[".calendar-header","border:1px solid black;border-collapse:collapse;"],
			[".calendar-header td","padding:2px;"],
			[".calendar-body","border-collapse:collapse;"],
			[".calendar-valid-day","cursor:pointer;"],
			[".calendar-valid-day:hover","background-color:yellow;"],
			[".calendar-invalid-day","background-color:red;"],
			[".calendar-no-day","background-color:white;"],
			[".calendar-separator","background-color:#c4c4c4;"],
			[".dialog-box","background-color:white;border:1px solid black;"],
			[".dialog-header","background-color:green;"],
			[".dialog-header:hover","cursor:move;"],
			[".dialog-content",""],
			[".dialog-rul",""],
			[".dialog-rul:hover","cursor:se-resize;"],
			[".dialog-ruc",""],
			[".dialog-ruc:hover","cursor:n-resize;"],
			[".dialog-rur",""],
			[".dialog-rur:hover","cursor:sw-resize;"],
			[".dialog-rl",""],
			[".dialog-rl:hover","cursor:w-resize;"],
			[".dialog-rr",""],
			[".dialog-rr:hover","cursor:w-resize;"],
			[".dialog-rdl",""],
			[".dialog-rdl:hover","cursor:sw-resize;"],
			[".dialog-rdc",""],
			[".dialog-rdc:hover","cursor:n-resize;"],
			[".dialog-rdc",""],
			[".dialog-rdc:hover","cursor:se-resize;"],
	],"decoration");
});