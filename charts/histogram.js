!function(){
    
    var model = raw.model();
    var formatCount = d3.format(",.0f");

    var value = model.dimension()
        .title('Value')
        .required(true)
        .multiple(true)
        .types(Number);
    
    model.map(function(data) {
            var index = 0;
            var nest = d3.nest()
            .key(function(d) {
              return value() ? value(d) : ++index; })
            .entries(data);
            return nest;
    })
    
    var chart = raw.chart()
        .title("Histogram")
        .description("Histograms are graphs of a distribution of data designed to show centering, dispersion (spread), and shape (relative frequency) of the data.")
        .thumbnail("imgs/histogram.png")
        .category('Distribution')
        .model(model);
    
    var width = chart.number()
        .title('Width')
        .defaultValue(800)
    
    var height = chart.number()
        .title('Height')
        .defaultValue(400)
    
    var ticks = chart.number()
        .title('Ticks')
        .defaultValue(20)
    
    chart.draw(function(selection, data) {
        
        var margin = {top: 10, right: 30, bottom: 40, left: 30}
        selection
            .attr("width", +width() - margin.left - margin.right)
            .attr("height", +height() - margin.bottom);
            
        g = selection.append("g");
        var widthNum = +width() - margin.left - margin.right;
        var heightNum = +height() - margin.top - margin.bottom;
        var formatCount = d3.format(",.0f"); 
        
        var x = d3.scale.linear().domain([0, d3.max(data, function (d){ return d.key; })]).range([0, widthNum]);
        

        var bins = d3.layout.histogram()
            .bins(x.ticks(+ticks()))
            (data.map(function(d){
                return d.key;
            }))
        
        var y = d3.scale.linear().domain([d3.min(bins, function(d) { return d.y; }), d3.max(bins, function(d) { return d.y; })]).range([(heightNum - 20), 0]);
		
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
    
       var bar = g.selectAll(".bar")
					.data(bins)
				  .enter().append("g")
					.attr("class", "bar")
					.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
        

        bar.append("rect")
            .attr("x", 1)
            .attr("width", (x(bins[0].dx) - x(0)) - 1)
            .attr("height", function(d) { return heightNum - 20 - y(d.y); })
            .style("fill", "steelblue");

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", (x(bins[0].dx) - x(0)) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) { return formatCount(d.y); })
            .style("fill", "#fff")
            .style("font", "10px sans-serif");
        
        g.append("g")
            .attr("class", "x axis")
//			.attr("transform", "translate(0," + heightNum + ")")
			.call(xAxis);
        })

}()