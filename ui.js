function zui_win(){
	this.getName = function(){
		return "The new color is: ";
	}
}
function zui_diag(dim){
	this.getName = function(color){
		alert(this.prototype.getName()+color);
		_(this.focus).set_sty("backgroundColor:"+color+";");
	}
}
_().add_class("zui_win",zui_win);
_().add_class("zui_diag",zui_diag);
_().derives("zui_diag","zui_win");