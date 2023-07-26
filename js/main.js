async function drawForce() {
    // read data
    const dataset = await d3.json("./data/harry_potter.json")
    console.log(dataset)

    const nodes = dataset.nodes
    const links = dataset.links

    console.log(dataset.nodes)
    console.log(dataset.links)

    for (let i = 0; i < dataset.nodes.length; i++) {
        const item = dataset.nodes[i]
        console.log(item)
        
        // Add a new column to each item
        if (item.team == 'Head_Master') {
          item.colorHex = '#000'
        } else if(item.team == 'Gryffindor'){
          item.colorHex = '#DC143C'
        }else if(item.team == 'Hufflepuff'){
          item.colorHex ='#FFFF00'
        }
        else if(item.team == 'Ravenclaw'){
          item.colorHex = '#0000CD'
        }else {
          item.colorHex = '#228B22'
        }
      }

    const width = 900
    const height = 600

    const svg = d3.select("#chart-area")
        .attr("width", width)
        .attr("height", height)

    const defs= svg.append("defs")
        
        
    defs.selectAll("pattern")
        .data(dataset.nodes)
        .enter()
        .append("pattern") 
        .attr("id", d => d.id)
        .attr("width", "100%")    // set width and height of pattern
        .attr("height", "100%")
        .append('image')
        .attr("xlink:href", d => "./img/img" + d.id +".jpeg")
        .attr("width", "50")      // set width and height of image
        .attr("height", "50")
        .attr("preserveAspectRatio", "none")

    
    console.log(defs)


    const force = d3.forceSimulation()
        .nodes(dataset.nodes)
        .force("link", d3.forceLink()
        .id(d => d.id)
        .links(dataset.links))
        .force("charge", d3.forceManyBody().strength(function(d) { return -d.group*40; }))
        //added strength
        .force("center", d3.forceCenter(width / 2, height / 2))

    const link = svg.selectAll(".link")
        .data(dataset.links)
        .enter().append("line")
        .attr("class", "link")

    const node = svg.selectAll(".node")
        .data(dataset.nodes)
        .enter()
        .append("circle")
        .attr("class",d => d.team)
        .attr("id", d => `node_${d.id}`)
        .attr("r", d => (4-d.group)*7.5)
        .attr("fill", d => d.colorHex)
        // add mouse event
        .on('mouseover', (event,d) => mouseOver(event,d))
        .on('mouseout', (event,d) => mouseOut(event,d))
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))

    function mouseOver(event,d) { 
        d3.select(`#node_${d.id}`)
            .attr("fill", d => `url(#${d.id})`)
            .attr("r", 25)
    }

    function mouseOut(event,d) { 

    d3.select(`#node_${d.id}`)
        .attr("r", i => (4-i.group)*7.5)
        .attr("fill", d => d.colorHex)
        

    }

    node.append("title")
        .text(d => d.first_name +" "+d.last_name )

    force.on("tick", function() {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y)
    });


    function dragstarted(event, d) {
        if (!event.active) force.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) force.alphaTarget(0);
        d.fx = null;
        d.fy = null;

    }
}
    
    drawForce()