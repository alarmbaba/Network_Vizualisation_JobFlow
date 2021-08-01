root = eval("(" + root + ')');

var width = window.innerWidth * .8,
    height = window.innerHeight * .8,
    root,
    gravity = 0.01,
    charge = -300,
    linkStrength = 0.1,
    count = 0,
    root_element, linkDistance = width * 0.03;

window.addEventListener("resize", updateWindow);

function updateWindow() {
    width = window.innerWidth;
    height = window.innerHeight;
    svg.attr("width", width * .8).attr("height", height * .8);
}

var fill = d3.scale.category20();

d3.select(window).on('resize', updateWindow);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "graph");

var link = svg.selectAll("link"),
    node = svg.selectAll("node");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("id", "toolstip")
    .style("opacity", 0);

var force = d3.layout.force()
    .linkDistance(linkDistance)
    .charge(charge)
    .gravity(gravity)
    .linkStrength(linkStrength)
    .size([width, height])
    .on("tick", tick)
    .size([width, height]);

root.fixed = true;
root_element = root.name;
update();
if (root.children == "children") {
    root.children.fixed = true;
}


var drag = force.drag()
    .on("dragstart", dragstart);
function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true);
}

function update() {

    var nodes = getNodes(root),
        links = d3.layout.tree().links(nodes);

    force
        .nodes(nodes)
        .links(links)
        .start();

    node = node.data(nodes, function (d) {
        return d.id;
    });

    var startTime;
    var endTime;

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .on('mousedown', function () { startTime = new Date(); })
        .on('mouseup', function (d) {
            endTime = new Date();
            if ((endTime - startTime) < 300) {
                click(d);
            }
        })
        .style("fill", function (d) { return fill(d.group); })
        .call(force.drag);

    nodeEnter.append('image')
        .attr('xlink:href', function (d) {
            return images_path + "\\" + get_name(d) + ".png";
        })
        .attr("x", function (d) { return -25; })
        .attr("y", function (d) { return -25; })
        .attr("height", 75)
        .attr("width", 75);

    nodeEnter.append("text")
        .attr("dy", function (d) { return 65; })
        .attr("dx", function (d) { return -25; })
        .attr("class", "texts")
        .style("font-size", "1.1em")
        .style("left", "-25px")
        .style('fill', "white")
        .text(function (d) {
            if (d.name == "email") {
                return d.name
            }
            name = d.name.charAt(0).toUpperCase() + d.name.slice(1).toLowerCase();
            name = name.replace("_", " ")
            return name;
        })
        ;

    node.exit().remove();


    link = link.data(links, function (d) {
        return d.target.id;
    });

    link.exit().remove();

    link.enter().insert("line", ".node")
        .attr("class", "link");

}

function click(d) {

    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update();
}

function isDirectChild(val) {

    for (var key in root.children) {
        if ((root.children[key].name) == val)
            return true;
    }
    return false;

}

function tick() {

    link.attr("x1", function (d) {

        if (d.source.name.value == d.root_element && (isDirectChild(d.target.name))) {
            return width / 2;
        }
        return d.source.x;
    })
        .attr("y1", function (d) {
            if (d.target.name.value == d.root_element && (isDirectChild(d.target.name))) {
                return height / 2;
            }
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });

    node.attr("transform", function (d) {
        let translate;
        if (root_element != d.name) {
            d.x = Math.max(25, Math.min(width - 50, d.x));
            d.y = Math.max(25, Math.min(height - 50, d.y));
            translate = "translate(" + d.x + "," + d.y + ")";
        } else {
            translate = "translate(" + width / 2 + "," + height / 2 + ")";
        }
        return translate;
    });

    node.on('mouseover', function (d) {
        hovercard.transition()
            .duration(100)
            .style('opacity', 1);

        var tip = get_hover_card(d);

        hovercard.html(tip)
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY + 'px');

    });

    node.on('mouseout', function (d) {

        hovercard.transition()
            .duration(100)
            .style('opacity', 0);
    });

}

function getNodes(root) {
    var nodes = [],
        i = 0;


    function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        if (!node.id) node.id = ++i;
        nodes.push(node);
    }
    recurse(root);
    return nodes;
}

function get_name(data) {
    let name_list = ["flow", "job", "validation", "downstream", "environment", "pdu"]
    let name = data.name
    let isNum = false   
	
	
    let lastChar;
    while (!isNum) {
        //lastChar = name.substr(-1);
        if (isNaN(lastChar)) {
            name = name.toLowerCase();
            console.log(name)
            if (name_list.includes(name)) {
                return name;
            } else {
                return "unknown";
            }
        } else {
            try {
                name = name.substr(0, name.length - 1)
            } catch (err) {
                name = "unknown";
            }
        }
    }
}

function update_nodeDistance(val) {
    let newLinkDistance = linkDistance * (val / 10);
    force
        .linkDistance(newLinkDistance)
        .start();
}


function update_attraction(val) {
    force
        .charge(val)
        .start();
}

function update_stiffness(val) {
    force
        .gravity(val)
        .start();
}

function element_hold() {
    let val = document.getElementById("element_hold");

    if (val.checked) {
        var drag = force.drag()
            .on("dragstart", dragstart);
        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = true);
        }

    } else {
        var drag = force.drag()
            .on("dragstart", dragstart);
        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = false);
        }
    }
    update();
}


var hovercard = d3.select('body').append('div')
    .attr('class', 'hovercard')
    .style('opacity', 0)
    .style('width', 400);

function get_hover_card(d) {
    let node_details;
    node_details = "<table class = 'hover-table'><tr><th  colspan='2' class='hover-title'><h2>" + d.name + "</h2></th></tr>";
    for (let key_value in d) {
        if (!((key_value == "name") || (key_value == "id") || (key_value == "index") || (key_value == "weight") || (key_value == "x") || (key_value == "y") || (key_value == "px") || (key_value == "py") || (key_value == "fixed") || (key_value == "children") || (key_value == "_children"))) {
            node_details = node_details + "<tr class = 'hover-row'><td><b>" + key_value + ":</b></td><td class='hover-row'>" + d[key_value] + "</td></tr>";
        }
    }
    node_details = node_details + "</table>";
    return node_details;
}