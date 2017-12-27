(function(){

	var tree = raw.models.tree();
	
	// Size in inferred using proportion
	tree.dimensions().remove("size");

	var chart = raw.chart()
        .title('Mosaic Plot')
		.description(
            "The mosaic plot is a graphical method for visualizing data from two or more qualitative variables. It is the multidimensional extension of spineplots, which graphically display the same information for only one variable. It gives an overview of the data and makes it possible to recognize relationships between different variables.")
        .thumbnail("imgs/mosaic.png")
	    .category('Hierarchy (weighted)')
		.model(tree)

	var width = chart.number()
		.title('Width')
		.defaultValue(100)
		.fitToWidth(true)

	var height = chart.number()
		.title("Height")
		.defaultValue(500)

	var colors = chart.color()
		.title("Color scale")

	chart.draw(function (selection, data){
	
		var format = d3.format(",d");

		var layout = d3.layout.treemap()
			.mode('slice-dice')
			.sticky(true)
            .size([+width()-60, +height()-30])
            .value(function(d) { return d.size; })

		var g = selection
    	    .attr("width", +width())
    	    .attr("height", +height())
    	  	.append("g")
    	    .attr("transform", "translate(40,10)");


		var nodes = layout.nodes(data)
	  	    .filter(function(d) { return !d.children; });

        colors.domain(nodes, function (d){ return d.color; });

		var cell = g.selectAll("g")
    	    .data(nodes)
    	    .enter().append("g")
    	    .attr("class", "cell")
    	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		cell.append("svg:rect")
    	    .attr("width", function (d) { return d.dx; })
    	    .attr("height", function (d) { return d.dy; })
    	    .style("fill", function (d) { return colors()(d.color); })
    	    .style("fill-opacity", function (d) {  return d.children ? 0 : 1; })
			.style("stroke","#fff")

		cell.append("svg:title")
			.text(function(d) { return d.name + ": " + format(d.size); });

		cell.append("svg:text")
    	    .attr("x", function(d) { return d.dx / 2; })
    	    .attr("y", function(d) { return d.dy / 2; })
    	    .attr("dy", ".35em")
    	    .attr("text-anchor", "middle")
    	   	.style("font-size","11px")
    		.style("font-family","Arial, Helvetica")
    	    .text(function(d) { return d.label ? d.label.join(", ") : ""; });
    	    
    	var xAxis = d3.svg.axis()
    					.scale(d3.scale.linear().range([0, layout.size()[0]]))
    					.tickFormat(d3.format("%"))
    					.orient("bottom");
    	    
    	g.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, " + (+height()-30) + ")")
			.call(xAxis);
			
		var yAxis = d3.svg.axis()
						.scale(d3.scale.linear().range([layout.size()[1], 0]))
						.tickFormat(d3.format("%"))
						.orient("left");

		g.append("g")
			.attr("class", "y axis")
			.call(yAxis);
			
		d3.selectAll(".x.axis line, .x.axis path, .y.axis line, .y.axis path")
            .style("shape-rendering","crispEdges")
            .style("fill","none")
            .style("stroke","#ccc");

	})
})();
