(function(){
    
    var model = raw.model();

    var x = model.dimension() 
		.title('X')
		.types(Number)
    
    var y = model.dimension() 
		.title('Y')
		.types(Number)
    
    model.map(function(data) {
        return data.map(function (d){
            return {
                x : +x(d),
                y : +y(d)
            }
	   })
    })

    var width = chart.number()
        .title('Width')
        .defaultValue(800)
    
    var height = chart.number()
        .title('Height')
        .defaultValue(400)
    
    var chart = raw.chart()
        .title("Histogram chart")
        .description("description.")
        .category('Other')
        .model(model);

    chart.draw(function(selection, data) {
        
        var margin = {top: 10, right: 30, bottom: 30, left: 30},
        selection
            .attr("margin", margin)
            .attr("width", +width() - margin.left - margin.right)
            .attr("height", +height() - margin.top - margin.bottom)
            .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        var formatCount = d3.format(",.0f");    
        
        var xScale = d3.scale.linear()
            .domain([d3.min(data, function (d){ return d.x;}), d3.max(data, function (d){ return d.x;})])
            .range([margin.left, width()-margin.right]);

        var bins = d3.histogram()
            .domain(xScale.domain())
            .thresholds(data.size)
            (data);

        var yScale = d3.scale.linear()
            .domain([0, d3.max(bins, function(d) { return d.length; })])
            .range([height, 0]);

        var bar = selection.selectAll(".bar")
            .data(bins)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });
        

        bar.append("rect")
            .attr("x", 1)
            .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
            .attr("height", function(d) { return height - y(d.length); });

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) { return formatCount(d.length); });

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        })

})