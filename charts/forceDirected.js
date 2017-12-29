!function(){
    var model = raw.model();
    var formatCount = d3.format(",.0f");
    
    var source = model.dimension()
        .title('Source')
        .required(true);
    
    var target = model.dimension()
        .title('Target')
        .required(true);
        
    var weight = model.dimension()
    	.title("Edge Weight")
    	.types(Number)

    var color = d3.scale.ordinal(d3.schemeCategory20);
    
    model.map(function (data){
        if (!source() || !target()) return [];
        
       var nodeList = jQuery.unique(data.map(function(d) {
       			return source(d);
       		}).concat(data.map(function(d) {
       			return target(d);
       		})));

       var nodeList = nodeList.map(function(d){
                return {
                    "name" : d
                }
            }
        );
        
        nodeList = nodeList.filter(item => item !== undefined);
        
        var linkList = data.map(function(d){
            if ((source(d)) != " ") {
                
                //find the index of source node.
                var sourceNode = nodeList.filter(function(obj) {
                  return obj.name == source(d);
                })[0];
                var sourceIndex = nodeList.indexOf(sourceNode);
                
                //find the index of target node.
                
                var targetNode = nodeList.filter(function(obj) {
                  return obj.name == target(d);
                })[0];
                var targetIndex = nodeList.indexOf(targetNode);
                
                return {
                    "source" : sourceIndex,
                    "target" : targetIndex,
                    "weight" : weight() ? weight(d) : 1
                }
            }
        });
        linkList = linkList.filter(item => item !== undefined);
            
        var nest = {};
        nest['nodes'] = nodeList;
        nest['links'] = linkList;
        
        return nest;
        
    })

    
    var chart = raw.chart()
        .title("Force-Directed Graph")
        .description("A simple force-directed graph generated from a edge list, drawn with nodes as circles and edges as links between them. A physical simulation of charged particles and springs places connected nodes in closer proximity, while disconnected nodes are farther apart.")
        .thumbnail("imgs/forceDirected.png")
        .category('Network')
        .model(model);

    var width = chart.number()
        .title('Width')
        .defaultValue(800)
    
    var height = chart.number()
        .title('Height')
        .defaultValue(500)
    

    chart.draw(function(selection, data) {
    
        var edgeWeight = d3.scale.linear()
        	.domain([0, d3.max(data, function(d) { return d.weight; })])
        	.range([1,10])
        
        var margin = {top: 10, right: 30, bottom: 40, left: 30}
        selection
            .attr("width", +width() - margin.left - margin.right)
            .attr("height", +height() - margin.bottom);

     
        var force = d3.layout.force()
            .gravity(0.05)
            .charge(-100)
            .distance(100)
            .size([+width(), +height()])
       
        force
          .nodes(data.nodes)
          .links(data.links)
          .start();
        
        var link = selection.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
              .attr("stroke", "#999")
              .attr("stroke-opacity", "0.6")
              .attr("stroke-width", function(d) {
              	return d.weight;
              	});

        var node = selection.append("g")
              .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
              .attr("r", 5)
              .attr("fill", "#00F")
              .call(force.drag);
        
        node.append("text")
          .attr("dx", 12)
          .attr("dy", ".35em")
          .attr("font-size", 10)
          .attr("font-family", "sans-serif")
          .attr("fill", "#999")
          .text(function(d) { return d.name });
        
        
        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });
    })
}();


