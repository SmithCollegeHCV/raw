!function(){
    
    var model = raw.model();
    var formatCount = d3.format(",.0f");

    var dimensions = model.dimension()
        .title('Amount')
        .required(true)
        .multiple(true)
        .types(Number);
    
    //Extract dimension field in the dataset, which is the field needed to be plotted.
    model.map(function(data) {
        if(dimensions() != null){
            var index = 0;
            var nest = d3.nest()
            .key(function(d) {
              return dimensions() ? dimensions(d) : ++index; })
            .entries(data);

            return nest;
        }
    })
    
    var chart = raw.chart()
        .title("Histogram chart")
        .description("Histograms are graphs of a distribution of data designed to show centering, dispersion (spread), and shape (relative frequency) of the data. Histograms can provide a visual display of large amounts of data that are difficult to understand in a tabular, or spreadsheet form.")
        .thumbnail("imgs/histogram.png")
        .category('Other')
        .model(model);
    
    var width = chart.number()
        .title('Width')
        .defaultValue(800)
    
    var height = chart.number()
        .title('Height')
        .defaultValue(400)
    
    //Size of bar, same unit as the dimension field.
    var size = chart.number()
        .title('Bar size')
    
    chart.draw(function(selection, data) {
        
        var margin = {top: 10, right: 30, bottom: 40, left: 30}
        selection
            .attr("width", +width() - margin.left - margin.right)
            .attr("height", +height() - margin.bottom);
        g = selection.append("g");
        var widthNum = +width() - margin.left - margin.right;
        var heightNum = +height() - margin.top - margin.bottom;
        var formatCount = d3.format(",.0f"); 
        
        //Function for mapping x coordinates.
        var x = d3.scaleLinear().domain([0, d3.max(data, function (d){ return d.key; })]).range([0, widthNum]);
        
        
        var yMax = d3.max(data, function(d){
            return d.key;
        })
        
        //The max number of bars allowed is 50. 
        var barNum = (yMax / +size()) < 50 ? (yMax / +size()) : 50
        
        //If the number of bars exceeds 50, a warning message will be displayed.
        if (size() && (yMax / +size()) > 50) {
            g.append("text")
                .attr("x", (widthNum / 2))             
                .attr("y", margin.top)
                .attr("text-anchor", "middle")  
                .text("The max number of bars is 50.")
                .style('fill', '#666666')
                .style("font", "14px sans-serif");;
        }
        
        var bins = d3.histogram()
            .domain(x.domain())
            .thresholds(size() ? barNum : 20)
            (data.map(function(d){
                return d.key;
            }))
                
        var y = d3.scaleLinear().domain([0, d3.max(bins, function(d) { return d.length; })]).range([(heightNum - 20), 0]);

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
        
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (heightNum - 20)+ ")")
            .call(d3.axisBottom(x));
        })

}()