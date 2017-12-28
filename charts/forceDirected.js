!function(){
    var model = raw.model();
    var formatCount = d3.format(",.0f");
        
    var group = model.dimension()
        .title('Group')
        .required(true)
        .multiple(true)
        .types(Number);
    
    var nodes = model.dimension()
        .title('Nodes')
        .required(true)
        .multiple(true);
    
    var source = model.dimension()
        .title('Source')
        .required(true)
        .multiple(true);
    
    var target = model.dimension()
        .title('Target')
        .required(true)
        .multiple(true);
    
    var value = model.dimension()
        .title('Value')
        .required(true)
        .multiple(true)
        .types(Number);
   
    var color = d3.scale.ordinal(d3.schemeCategory20);
    
    model.map(function (data){
        if (!group() || !nodes() || !source() || !target() || !value()) return [];

       var nodeList = data.map(function(d){
            if ((nodes(d)) != " ") {
                
                return {
                    "name" : nodes(d)[0],
                    "group" : Number(group(d)[0])
                }
            }
        });
        nodeList = nodeList.filter(item => item !== undefined);
        
        var linkList = data.map(function(d){
            if ((source(d)) != " ") {
                
                //find the index of source node.
                var sourceNode = nodeList.filter(function(obj) {
                  return obj.name == source(d)[0];
                })[0];
                var sourceIndex = nodeList.indexOf(sourceNode);
                
                //find the index of target node.
                
                var targetNode = nodeList.filter(function(obj) {
                  return obj.name == target(d)[0];
                })[0];
                var targetIndex = nodeList.indexOf(targetNode);
                
                return {
                    "source" : sourceIndex,
                    "target" : targetIndex,
                    "value" : Number(value(d)[0])
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
        .description("This simple force-directed graph shows character co-occurence in Les Misérables. A physical simulation of charged particles and springs places related characters in closer proximity, while unrelated characters are farther apart.")
        .thumbnail("imgs/forceDirected.png")
        .category('Other')
        .model(model);

    var width = chart.number()
        .title('Width')
        .defaultValue(800)
    
    var height = chart.number()
        .title('Height')
        .defaultValue(500)
    

    chart.draw(function(selection, data) {
        var color = d3.scale.category20();
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
              .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = selection.append("g")
              .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
              .attr("r", 5)
              .attr("fill", function(d) { return color(d.group); })
              .call(force.drag);
        
        node.append("text")
          .attr("dx", 12)
          .attr("dy", ".35em")
          .attr("font-size", 10)
          .attr("font-family", "sans-serif")
          .attr("fill", "#999")
          .text(function(d) { return d.name });
        
        
//        console.log(data.nodes);
//        console.log(data.links);
//        console.log(json.links);
        
        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });
    })
}();


