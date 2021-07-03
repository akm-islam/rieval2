var selectionRect = {
	element			: null,
	previousElement : null,
	currentY		: 0,
	currentX		: 0,
	originX			: 0,
	originY			: 0,
	setElement: function(ele) {
		this.previousElement = this.element;
		this.element = ele;
	},
	getNewAttributes: function() {
		var x = this.currentX<this.originX?this.currentX:this.originX;
		var y = this.currentY<this.originY?this.currentY:this.originY;
		var width = Math.abs(this.currentX - this.originX);
		var height = Math.abs(this.currentY - this.originY);
		return {x:x,y:y,width: width,height:height}; // returning the javascript object
	},
	getCurrentAttributes: function() {
		// use plus sign to convert string into number
        var x = +this.element.attr("x");
        //console.log(x,this.element.attr("x"))
		var y = +this.element.attr("y");
		var width = +this.element.attr("width");
		var height = +this.element.attr("height");
		return {x1:x,y1:y,x2:x + width,y2:y + height}; // returning the javascript object
	},
	getCurrentAttributesAsText: function() {
		var attrs = this.getCurrentAttributes();
		return "x1: " + attrs.x1 + " x2: " + attrs.x2 + " y1: " + attrs.y1 + " y2: " + attrs.y2;
	},
	init: function(newX, newY) {
        //console.log(newX,newY)
		var rectElement = svg.append("rect")
        .attr('rx',4).attr('ry',4).attr("x",0).attr("y",0)
        .attr('width',0).attr('height',0).classed("selection", true);    
        //console.log(rectElement)
	    this.setElement(rectElement);
		this.originX = newX;
		this.originY = newY;
		this.update(newX, newY);
	},
	update: function(newX, newY) {
        //console.log(newX,newY)
		this.currentX = newX;
        this.currentY = newY;
        var NewAttr=this.getNewAttributes()
		this.element.attr("x",NewAttr.x).attr("y",NewAttr.y)
        .attr('width',NewAttr.width).attr('height',NewAttr.height)
	},
	focus: function() {
        this.element
            .style("stroke", "#DE695B")
            .style("stroke-width", "4");
    },
    remove: function() {
    	this.element.remove();
    	this.element = null;
    },
    removePrevious: function() {
    	if(this.previousElement) {
    		this.previousElement.remove();
    	}
    }
};

//-----------------

var svg = d3.select("svg");
var attributesText = d3.select("#attributestext");
function dragStart() {
    //console.log("dragstart");
    var p = d3.mouse(this);
    selectionRect.init(p[0], p[1]);
	selectionRect.removePrevious();
}
function dragMove() {
	//console.log("dragMove");
	var p = d3.mouse(this);
    selectionRect.update(p[0], p[1]);
    attributesText
    	.text(selectionRect.getCurrentAttributesAsText());
}
function dragEnd() {
	//console.log("dragEnd");
	var finalAttributes = selectionRect.getCurrentAttributes();
	console.dir(finalAttributes);
	if(finalAttributes.x2 - finalAttributes.x1 > 1 && finalAttributes.y2 - finalAttributes.y1 > 1){
		//console.log("range selected");
		// range selected
		d3.event.sourceEvent.preventDefault();
		selectionRect.focus();
	} else {
		//console.log("single point");
        selectionRect.remove();
    }
}
var dragBehavior = d3.drag()
    .on("start", dragStart)    
    .on("drag", dragMove)
    .on("end", dragEnd);
svg.call(dragBehavior);
