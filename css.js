_().load(function(){
	var footerWidth = 100;

	var baseRules = [
			["@import","https://fonts.googleapis.com/css?family=Work+Sans"],
			["@import","https://fonts.googleapis.com/css?family=Open+Sans"],
			["*","margin:0;padding:0;"],
			["html","height:100%;"],
			["body","height:100%;background-color:white;font-family: 'Open Sans', regular;font-size:1em;"],
			["h1","font-family: 'Work Sans', regular;padding:4% 0%;font-size:1.3em;"],
			["input","display:inline-block;border:2px solid teal;background-color:white;"],
			["input:focus","background-color:white;outline: none;"],
			["input:hover","background-color:white;border:2px solid aqua;"],
			[".container","width:100%;height:100%;min-height: 100%;margin-bottom: -"+footerWidth+"px;position: relative;"],
			[".header","width:100%;background-color:aqua;margin-bottom:1%;"],
			[".panel-left","width:20%;margin:1%;padding:1%;background-color:white;float:left;"],
			[".panel-left a","display:inline-block;padding-bottom:3%;"],
			[".panel-center","width:50%;padding:1%;margin:1%;background-color:white;float:left;"],
			[".panel-right","width:15%;padding:2%;float:left;"],
			[".clearFooter","float:none;clear:both;height: "+footerWidth+"px;"],
			[".footer","width:100%;height: "+footerWidth+"px;position: relative;background-color:white;"],
			[".footer-content","color:teal;padding:1%;text-align:right;"],
			[".menu-list","list-style:none;"],
			[".menu-list li","padding-top:2%;text-align:left;"],
			["a","color:teal;cursor:pointer;text-decoration:none;font-family: 'Work Sans', regular;font-size:1.1em;"],
			["a:hover","color:black;"],
			[".stock-suggestions","border:1px solid black;margin:0;padding:0;border-collapse: collapse;background-color:white;font-family:Arial;font-weight:bold;"],
			[".stock-suggestions tr:hover","background-color:#51ff76;border-bottom:1px dashed black;cursor:pointer;"],
			[".quote-detail","margin-top:50px;border:1px dashed black;background-color:#fff59f;font-family:Times New Roman;font-size:0.8em;margin-left:auto;margin-right:auto;table-layout: fixed;width:100%;word-wrap:break-word;"],
			[".quote-detail td","border-bottom:1px dashed black;width:33%;"],
			[".info-tip","padding:5px;-moz-border-radius: 15px;border-radius: 15px;border:2px solid teal;font-family: 'Work Sans', thin;font-size:0.8em;font-style:italic;background-color:white;"],
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
			[".gallery-scope",""],
			[".gallery-thumbnail","-moz-border-radius: 1em;-webkit-border-radius: 1em;border-radius: 1 em;padding:1%;width:50px;height:50px;"],
	];

	var mobileRules = baseRules.concat([
		[".panel-left","width:97%;padding: 2% 1% 2% 1%;background-color:white;float:none;clear:both;"],
		[".panel-center","width:97%;padding: 2% 1% 2% 1%;background-color:white;float:none;clear:both;"],
		[".panel-right","width:97%;padding: 2% 1% 2% 1%;float:none;clear:both;"],
		[".menu-list li","padding-top:2%;text-align:center;"],
		["h1","font-family: 'Work Sans', regular;padding:3% 0%;text-align: center;"],
		["body","height:100%;background-color:white;font-family: 'Open Sans', regular;font-size:1.1em;"],
		["a","color:teal;cursor:pointer;text-decoration:none;font-family: 'Work Sans', regular;font-size:1.2em;"],
		["h1","font-family: 'Work Sans', regular;padding:0% 0% 5% 0%;font-size:1.4em;"],
	]);


	// prepare css
	_().createCSS("decoration",{"attr":"type=text/css;"});
	_().addRule(baseRules,"decoration");

	_().zb.addBindHandler({"scope":"zdelib","target":"mobile_host","func":function(detail){
		_().deleteRule(mobileRules,"decoration");

		if(detail.newValue) _().addRule(mobileRules,"decoration"); else _().addRule(baseRules,"decoration");
	},"this":this});
});
