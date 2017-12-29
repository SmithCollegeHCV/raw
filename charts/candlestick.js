(function(){

	// Set up the model
	var candlestick = raw.model();
	
	var date = candlestick.dimension()
		.title('Date')
        .types(Date)
        .accessor(function (d){ return this.type() == "Date" ? Date.parse(d) : +d; })
        .required(1)
	
	var open = candlestick.dimension()
        .title('Open')
        .types(Number)
        .required(1)
	
	var high = candlestick.dimension()
        .title('High')
        .types(Number)
        .required(1)
	
	var low = candlestick.dimension()
        .title('Low')
        .types(Number)
        .required(1)
	
	var close = candlestick.dimension()
        .title('Close')
        .types(Number)
        .required(1)
	
	
	// Map data
	candlestick.map(function (data) {
	
		return data.map(function (d){
		return {
			date  : date(d),
			open  : +open(d),
			high  : +high(d),
			low   : +low(d),
			close : +close(d)
		}
	})
	
	});
	
	// Set up chart and options
	var chart = raw.chart()
        .title('Candlestick (OHLC) Chart')
        .thumbnail("imgs/candlestick.png")
        .description("A candlestick chart is used to describe price movements of a security, derivative, or currency. Each candlestick encodes four important pieces of information for that day: the open, the close, the high and the low. ")
        .category('Time series, financial')
        .model(candlestick)

    var width = chart.number()
        .title("Width")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("Height")
        .defaultValue(500)
    
    // Draw chart
    chart.draw(function (selection, data) {
    
        var w = +width(),
            h = +height();
    
    	var svg = selection
            .attr("width", +width())
            .attr("height", +height());

        var x = d3.time.scale()
            .range([30, w])
			.domain([
				d3.min(data, function(d) { return d.date; }),
				d3.max(data, function(d) { return d.date; })
			]);
        
        var y = d3.scale.linear()
            .range([h-45, 0])
            .domain([
            	d3.min(data, function(d) { return d.low; }),
				d3.max(data, function(d) { return d.high; })
            ]);
        
        var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.tickFormat(d3.time.format("%d-%b"));
					
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

        svg.append("g")
            .attr("class", "x axis")
            .style("stroke-width", "1px")
            .style("font-size","8px")
            //.style("font-family","Arial, Helvetica")
            .attr("transform", "translate(" + 0 + "," + (height()-45) + ")")
            .call(xAxis)
            	.selectAll("text")
            	.attr("y", 0)
				.attr("x", 9)
				.attr("dy", ".35em")
				.attr("transform", "rotate(90)")
				.style("text-anchor", "start");
				
		svg.append("g")
			.attr("class", "y axis")
			.style("font-size","8px")
			.attr("transform", "translate(30,0)")
			.call(yAxis);

        d3.selectAll(".x.axis line, .x.axis path, .y.axis line, .y.axis path")
            .style("shape-rendering","crispEdges")
            .style("fill","none")
            .style("stroke","#ccc")
            
        svg.selectAll("line.ext")
		   .data(data)
		   .enter().append("svg:line")
		   .attr("class", "ext")
		   .attr("x1", function(d) { return x(d.date)})
		   .attr("x2", function(d) { return x(d.date)})
		   .attr("y1", function(d) { return y(d.low);})
		   .attr("y2", function(d) { return y(d.high);})
		   .style("stroke", "#000");

    		svg.selectAll("line.ext1")
		  .data(data)
		  .enter().append("svg:line")
		  .attr("class", "ext")
		  .attr("x1", function(d) { return x(d.date)+3})
		  .attr("x2", function(d) { return x(d.date)-3})
		  .attr("y1", function(d) { return y(d.low);})
		  .attr("y2", function(d) { return y(d.low); })
		  .style("stroke", "#000");

		svg.selectAll("line.ext2")
		  .data(data)
		  .enter().append("svg:line")
		  .attr("class", "ext")
		  .attr("x1", function(d) { return x(d.date)+3})
		  .attr("x2", function(d) { return x(d.date)-3})
		  .attr("y1", function(d) { return y(d.high);})
		  .attr("y2", function(d) { return y(d.high); })
		  .style("stroke", "#000");

		 svg.selectAll("rect")
		   .data(data)
		   .enter().append("svg:rect")
		   .attr("x", function(d) { return x(d.date)-3; })
		   .attr("y", function(d) { return y(Math.max(d.open, d.close));})
		   .attr("height", function(d) {
			   return y(Math.min(d.open, d.close))-y(Math.max(d.open, d.close));})
		   .attr("width", 6)
		   .attr("fill", function(d) {
			   return d.open > d.close ? "darkred" : "darkgreen" ;});
			 });
	

})();