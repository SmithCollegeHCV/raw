!function(){
    
    var model = raw.model();
    var formatCount = d3.format(",.0f");

    var dimensions = model.dimension()
        .title('Amount')
        .required(true)
        .multiple(true)
        .types(Number);
    
    model.map(function(data) {
        console.log(data)
        if(dimensions() != null){
            var index = 0;
            var nest = d3.nest()
            .key(function(d) {
              return dimensions() ? dimensions(d) : ++index; })
            .entries(data);

            console.log(nest);
            return nest;
        }
    })
    
    var chart = raw.chart()
        .title("Histogram chart")
        .description("description.")
        .thumbnail("imgs/histogram.png")
        .category('Other')
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
        
        var x = d3.scaleLinear().domain([0, d3.max(data, function (d){ return d.key; })]).range([0, widthNum]);
        
        console.log(data.map(function(d){
                return d.key;
            }))
        console.log(x.domain())
        var bins = d3.histogram()
            .domain(x.domain())
            .thresholds(+ticks())
            (data.map(function(d){
                return d.key;
            }))
        
        console.log(bins)
        
        var y = d3.scaleLinear().domain([0, d3.max(bins, function(d) { return d.length; })]).range([(heightNum - 20), 0]);

        console.log(bins)
        var bar = g.selectAll(".bar")
            .data(bins)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) {return "translate(" + x(d.x0) + "," + (y(d.length))  + ")"; });
        

        bar.append("rect")
            .attr("x", 1)
            .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
            .attr("height", function(d) { return heightNum - 20 - y(d.length); })
            .style("fill", "steelblue");

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) { return formatCount(d.length); })
            .style("fill", "#fff")
            .style("font", "10px sans-serif");

        console.log(height())
        
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (heightNum - 20)+ ")")
            .call(d3.axisBottom(x));
        })

}()