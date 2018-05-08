
function bubbleChart(param) {

  var tooltip = floatingTooltip('gates_tooltip', 240);

  var axisFactory = AxisFactory();
  var xAxis = axisFactory.getXAxis('none');
  var yAxis = axisFactory.getYAxis('none');

  var width = 2000;
  var height = 2000;

  var forceStrength = 0.02;
  var clusterForceStrength = 0.8;

  var svg = null;
  var bubbles = null;
  var nodes = [];
  var doClustering = true;

  var types = ["Media relations: print media, online media"
  , "New media (web, blogs, podcasts, news feeds etc.)"
  , "Media relations: radio, television"
  , "Talks/events/exhibitions"
  , "Print (books, brochures, leaflets)"
  , "Other activities"
  , "Video/Film"
  , "Start-up"
  , "Software"];

  const clusters = new Array(types.length);

  const cluster = () => {
    var nodes,
      strength = 0.3;
    function force (alpha) {
      // scale + curve alpha value
      if(!doClustering) return;

      alpha *= clusterForceStrength * alpha;

      nodes.forEach(function(d) {
        var cluster = clusters[d.cluster];
        if (cluster === d) return;
        
        let x = d.x - cluster.x,
          y = d.y - cluster.y,
          l = Math.sqrt(x * x + y * y),
          r = d.radius + cluster.radius;
  
        if (l != r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      });
    }
  
    force.initialize = function (_) {
      nodes = _;
    }
  
    force.strength = _ => {
      strength = _ == null ? strength : _;
      return force;
    };
  
    return force;
  }

  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('collision', d3.forceCollide().radius(function(d) {
      return d.radius
    }).iterations(15))
    .force('cluster', cluster().strength(clusterForceStrength))
    .on('tick', ticked);

  // @v4 Force starts up automatically, which we don't want as there aren't any nodes yet.
  simulation.stop();

  var fillColor = d3.scaleOrdinal()
    .domain(types)
    .range(['#92c0e0', '#2a8dd4', '#e6f2fa',
            '#004d85', '#b1b1b1', '#e1e1e1',
            '#663399', '#b95f00', '#F93']);

  function createNodes(rawData) {
    
    var maxAmount = d3.max(rawData, function (d) { return +d[param.areaProperty.name]; });

    var radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([2, 30])
      .domain([0, maxAmount]);

    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    var myNodes = rawData.map(function (data) {
      let i = types.indexOf(data["Type"]),
          r = radiusScale(parseInt(data[param.areaProperty.name])),
          d = {
            id: data.Id,
            radius: r,
            value: parseInt(data[param.areaProperty.name]),
            group: data["Type"],
            cluster: i,
            data: data,
            x: 300 + Math.cos(i / 9 * 2 * Math.PI) * 400 + 20 * Math.random(),
            y: 300 + Math.sin(i / 9 * 2 * Math.PI) * 400 + 20 * Math.random()
          };
      if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
      return d;
    });

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.value - a.value; });

    return myNodes;
  }

  var chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    //  enter selection to apply our transtition to below.
    var bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.group); })
      .attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
      .attr('stroke-width', 1.3)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(1000)
      .attr('r', function (d) { return d.radius; });

    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    // Set initial layout to single group.
    updateAxes();
  };

  /*
   * Callback function that is called after every tick of the
   * force simulation.
   * Here we do the acutal repositioning of the SVG circles
   * based on the current x and y values of their bound node data.
   * These x and y values are modified by the force simulation.
   */
  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }

  function updateAxes() {

    if(xAxis.getProperty() === 'None') svg.selectAll('.xAxisTitle').remove();
    else showXAxisTitles();
    
    if(yAxis.getProperty() === 'None') svg.selectAll('.yAxisTitle').remove();
    else showYAxisTitles();
    
    if(xAxis.getProperty() !== 'None' || yAxis.getProperty() !== 'None') {
      doClustering = false;
      forceStrength = 0.03;
    }

    simulation.force('x', d3.forceX().strength(xAxis.getForceStrength(forceStrength)).x(xAxis.getNodeOffset));
    simulation.force('y', d3.forceY().strength(yAxis.getForceStrength(forceStrength)).y(yAxis.getNodeOffset));

    simulation.alpha(1).restart();
  }

  function showXAxisTitles() {

    var xTitles = svg.selectAll('.xAxisTitle').data(xAxis.getLevels());

    xTitles.attr('class', 'xAxisTitle')
      .attr('x', function (d) { return xAxis.getCenterOffset(d); })
      .text(function (d) { return d; });

    xTitles.exit().remove();

    xTitles.enter().append('text')
      .attr('class', 'xAxisTitle')
      .attr('x', function (d) { return xAxis.getCenterOffset(d); })
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }

  function showYAxisTitles() {

    var yTitles = svg.selectAll('.yAxisTitle').data(yAxis.getLevels());

    yTitles.attr('y', function (d) { return yAxis.getCenterOffset(d); })
      .text(function (d) { return d; });

    yTitles.exit().remove();

    yTitles.enter().append('text')
      .attr('class', 'yAxisTitle')
      .attr('x', 10)
      .attr('y', function (d) { return yAxis.getCenterOffset(d); })
      .attr('text-anchor', 'left')
      .text(function (d) { return d; });
  }

  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');

    var content = '<span class="name">'+ param.groupProperty.caption +': </span><span class="value">' +
                  d.group +
                  '</span><br/>' +
                  '<span class="name">Discipline: </span><span class="value">' +
                  d.data.Discipline +
                  '</span><br/>' +
                  '<span class="name">Funding size: </span><span class="value">' +
                  d.data.AmountCatecory +
                  '</span><br/>' +
                  '<span class="name">Institution type: </span><span class="value">' +
                  d.data.InstitutionType +
                  '</span><br/>' +
                  '<span class="name">'+ param.areaProperty.caption +': </span><span class="value">' +
                  addCommas(d.value) +
                  '</span><br/>';

    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', d3.rgb(fillColor(d.group)).darker());

    tooltip.hideTooltip();
  }

  chart.setXAxis = function (property) {
    xAxis = axisFactory.getXAxis(property);
    updateAxes();
  };

  chart.setYAxis = function (property) {
    yAxis = axisFactory.getYAxis(property);
    updateAxes();
  };

  // return the chart function from closure.
  return chart;
}

var myBubbleChart = bubbleChart({
  groupProperty: {
    caption: 'Art'
  },
  areaProperty: {
    name: 'Count',
    caption: 'Anzahl'
  }
});

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(data) {
  myBubbleChart('#vis', data);
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {

  d3.select('#selectXAxis')
    .selectAll("option")
    .data(['none', 'Discipline', 'InstitutionType','AmountCatecory'])
    .enter()
    .append('option')
    .text(function(d) {
      return d;
    });

  d3.select('#selectXAxis')
    .on('change', function(){
      myBubbleChart.setXAxis(this.value);
    });

    d3.select('#selectYAxis')
    .selectAll("option")
    .data(['none', 'Discipline', 'InstitutionType', 'AmountCatecory'])
    .enter()
    .append('option')
    .text(function(d) {
      return d;
    });

  d3.select('#selectYAxis')
    .on('change', function(){
      myBubbleChart.setYAxis(this.value);
    });

}

/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

// Load the data.
d3.csv('data/data.csv').then(display);

// setup the buttons.
setupButtons();
