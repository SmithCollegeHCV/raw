(function(){
    // newly added
    var model = raw.model();

    var group = model.dimension()
        .title('Group')

    var date = model.dimension()
        .title('Date')
        .types(Number, Date, String)
        .accessor(function (d){ return this.type() == "Date" ? Date.parse(d) : this.type() == "String" ? d : +d; })
        .required(1)

    var size = model.dimension()
        .title('Size')
        .types(Number)
        .required(1)

    // Mapping function.
    // For each record in the dataset a pie chart abstraction is created.
    // Records are grouped according the 'group' variable.

    model.map(function(data) {

        var nest = d3.nest()
            .key(group)
            .rollup(function (g) {
                return g.map(function (d) {
                    return [new Date(date(d)), +size(d)]
                }).sort( function(a,b){return a[0] - b[0]}) //sort temporally
            })
            .entries(data)

        return nest;

    })


    // newly added (create chart object)
    var chart = raw.chart()
        .title("Spiral Plot")
        .description("Plots time-based data along an Archimedean spiral, beginning at the center and then progressing outwards. Ideal for drawing a compact representation of large data sets, highlighting trends over a large time period.")
        .thumbnail("imgs/conspiral.png")
        .model(model)
        .category('Time Series')


    var width = chart.number()
		.title('Width')
		.defaultValue(500)
		.fitToWidth(true)

	var height = chart.number()
		.title("Height")
		.defaultValue(500)

	var padding = chart.number()
		.title("Padding")
		.defaultValue(5)

	var start = chart.number()
		.title("Start")
		.defaultValue(0)

	var end = chart.number()
		.title("End")
		.defaultValue(2.25)

	var numSpirals = chart.number()
		.title("numSpirals")
		.defaultValue(3)



	var margin = chart.number()
	    .title("margin")
		.defaultValue(50) // set default margin to 50


  chart.draw(function(selection, data) {
      var r = d3.min([width, height]) / 2 - 40;

      var radius = d3.scaleLinear()
          .domain([start, end])
          .range([40, r]);

      var color = d3.scaleOrdinal(d3.schemeCategory10);


      var theta = function(r) {
        return numSpirals * Math.PI * r;
      };


       var svg = d3.select("#chart").append("svg")
          .attr("width", width + margin + margin)
          .attr("height", height + margin + margin)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

       var points = d3.range(start, end + 0.001, (end - start) / 1000);
       
       console.log("Points", points)

       var spiral = d3.radialLine()
          .curve(d3.curveCardinal)
          .angle(theta)
          .radius(radius);

       var path = svg.append("path")
          .datum(points)
          .attr("id", "spiral")
          .attr("d", spiral)
          .style("fill", "none")
          .style("stroke", "steelblue");

       var spiralLength = path.node().getTotalLength(),
            N = 365,
            barWidth = (spiralLength / N) - 1;
            
       console.log("Spiral length: ", spiralLength);
            
       var someData = [];
       for (var i = 0; i < N; i++) {
          var currentDate = new Date();
          currentDate.setDate(currentDate.getDate() + i);
          someData.push({
            date: currentDate,
            value: Math.random(),
            group: currentDate.getMonth()
          });
        }

       var timeScale = d3.scaleTime()
          .domain(d3.extent(someData, function(d){
            return d.date;
          }))
          .range([0, spiralLength]);

        // yScale for the bar height
       var yScale = d3.scaleLinear()
          .domain([0, d3.max(someData, function(d){
            return d.value;
          })])
          .range([0, (r / numSpirals) - 30]);

        svg.selectAll("rect")
          .data(someData)
          .enter()
          .append("rect")
          .attr("x", function(d,i){

            var linePer = timeScale(d.date),
                posOnLine = path.node().getPointAtLength(linePer),
                angleOnLine = path.node().getPointAtLength(linePer - barWidth);

            d.linePer = linePer; // % distance are on the spiral
            d.x = posOnLine.x; // x postion on the spiral
            d.y = posOnLine.y; // y position on the spiral

            d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

            return d.x;
          })
          .attr("y", function(d){
            return d.y;
          })
          .attr("width", function(d){
            return barWidth;
          })
          .attr("height", function(d){
            return yScale(d.value);
          })
          .style("fill", function(d){return color(d.group);})
          .style("stroke", "none")
          .attr("transform", function(d){
            return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
          });

        // add date labels
        var tF = d3.timeFormat("%b %Y"),
            firstInMonth = {};

// 		svg.selectAll("text")
// 		  .data(someData)
// 		  .enter()
// 		  .append("text")
// 		  .attr("dy", 10)
// 		  .style("text-anchor", "start")
// 		  .style("font", "10px arial")
// 		  .append("textPath")
// 		  // only add for the first of each month
// 		  .filter(function(d){
// 			var sd = tF(d.date);
// 			if (!firstInMonth[sd]){
// 			  firstInMonth[sd] = 1;
// 			  return true;
// 			}
// 			return false;
// 		  })
// 		  .text(function(d){
// 			return tF(d.date);
// 		  })
// 		  // place text along spiral
// 		  .attr("xlink:href", "#spiral")
// 		  .style("fill", "grey")
// 		  .attr("startOffset", function(d){
// 			return ((d.linePer / spiralLength) * 100) + "%";
// 		  })


        var tooltip = d3.select("#chart")
        .append('div')
        .attr('class', 'tooltip');

        tooltip.append('div')
        .attr('class', 'date');
        tooltip.append('div')
        .attr('class', 'value');

        svg.selectAll("rect")
        .on('mouseover', function(d) {

            tooltip.select('.date').html("Date: <b>" + d.date.toDateString() + "</b>");
            tooltip.select('.value').html("Value: <b>" + Math.round(d.value*100)/100 + "<b>");

            d3.select(this)
            .style("fill","#FFFFFF")
            .style("stroke","#000000")
            .style("stroke-width","2px");

            tooltip.style('display', 'block');
            tooltip.style('opacity',2);

        })
        .on('mousemove', function(d) {
            tooltip.style('top', (d3.event.layerY + 10) + 'px')
            .style('left', (d3.event.layerX - 25) + 'px');
        })
        .on('mouseout', function(d) {
            d3.selectAll("rect")
            .style("fill", function(d){return color(d.group);})
            .style("stroke", "none")

            tooltip.style('display', 'none');
            tooltip.style('opacity',0);
        });
  })

})();


