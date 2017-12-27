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
        .description("DESCRIPTION")
        .category('Time series')
        .model(candlestick)

    var width = chart.number()
        .title("Width")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("Height")
        .defaultValue(500)

    var padding = chart.number()
        .title("Padding")
        .defaultValue(5)
        
    var colorCode = chart.checkbox()
        .title("Color code open < close")
        .defaultValue(true)
    
    // STILL WORKING ON THIS
    // Draw chart
    chart.draw(function (selection, data) {
    
        var w = +width(),
            h = +height();
            
        console.log(w,h);
    
    	var svg = selection
            .attr("width", +width())
            .attr("height", +height())

        var x = d3.time.scale()
            .range([0, w]);

        var y = d3.scale.linear()
            .range([h, 0]);
            
        x.domain([
            d3.min(data, function(layer) { return d3.min(layer, function(d) { return d.date; }); }),
            d3.max(data, function(layer) { return d3.max(layer, function(d) { return d.date; }); })
        ])
        
        var xAxis = d3.svg.axis().scale(x).tickSize(-height()+15).orient("bottom");

        svg.append("g")
            .attr("class", "x axis")
            .style("stroke-width", "1px")
            .style("font-size","10px")
            .style("font-family","Arial, Helvetica")
            .attr("transform", "translate(" + 0 + "," + (height()-15) + ")")
            .call(xAxis);

        d3.selectAll(".x.axis line, .x.axis path")
            .style("shape-rendering","crispEdges")
            .style("fill","none")
            .style("stroke","#ccc")
    
    })
        
	

})();