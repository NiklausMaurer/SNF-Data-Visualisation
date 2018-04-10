/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */
function bubbleChart(param) {

  var width = param.xAxis.length;
  var height = param.yAxis.length;

  var tooltip = floatingTooltip('gates_tooltip', 240);

  var xAxis = DiscreteAxis(param.xAxis);
  var yAxis = DiscreteAxis(param.yAxis);

  // @v4 strength to apply to the position forces
  var forceStrength = 0.0295;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  //  add forces to it.
  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(xAxis.getCenter()))
    .force('y', d3.forceY().strength(forceStrength).y(yAxis.getCenter()))
    .force('collision', d3.forceCollide().radius(function(d) {
      return d.radius
    }).iterations(5))
    .on('tick', ticked);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();

  // Nice looking colors - no reason to buck the trend
  // @v4 scales now have a flattened naming scheme
  var fillColor = d3.scaleOrdinal()
    .domain(["Media relations: print media, online media"
    , "New media (web, blogs, podcasts, news feeds etc.)"
    , "Media relations: radio, television"
    , "Talks/events/exhibitions"
    , "Print (books, brochures, leaflets)"
    , "Other activities"
    , "Video/Film"
    , "Start-up"
    , "Software"])
    .range(['#92c0e0', '#2a8dd4', '#e6f2fa',
            '#004d85', '#b1b1b1', '#e1e1e1',
            '#663399', '#b95f00', '#F93']);

  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */
  function createNodes(rawData) {
    
    var maxAmount = d3.max(rawData, function (d) { return +d[param.radiusProperty.name]; });

    var radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([2, 40])
      .domain([0, maxAmount]);

    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    var myNodes = rawData.map(function (d) {
      return {
        id: d.Id,
        radius: radiusScale(parseInt(d[param.radiusProperty.name])),
        value: parseInt(d[param.radiusProperty.name]),
        group: d["Type"],
        xLevel: d[param.xAxis.property],
        yLevel: d[param.yAxis.property],
        x: Math.random() * param.xAxis.length,
        y: Math.random() * param.yAxis.length
      };
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
    groupBubbles();
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

  function nodeXPos(d) {
    return xAxis.getCenterOffset(d.xLevel);
  }

  function nodeYPos(d) {
    return yAxis.getCenterOffset(d.yLevel);
  }

  /*
   * Sets visualization in "single group mode".
   * The x-axis labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles() {
    hideXAxisTitles();

    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(xAxis.getCenter()));
    simulation.force('y', d3.forceY().strength(forceStrength).y(yAxis.getCenter()));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }


  /*
   * Sets visualization in "split by x-axis mode".
   * The x-axis labels are shown and the force layout
   * tick function is set to move nodes to the
   * x-axisCenter of their data's x-axis.
   */
  function splitBubbles() {
    showAxisTitles();

    svg.append("line")
      .attr("x1", 50)
      .attr("y1", 50)
      .attr("x2", xAxis.getLength())
      .attr("y2", 50)
      .attr("style","stroke:rgb(255,0,0);stroke-width:2");

    // @v4 Reset the 'x' force to draw the bubbles to their x-axis centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeXPos));
    simulation.force('y', d3.forceY().strength(forceStrength).y(nodeYPos));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function hideXAxisTitles() {
    svg.selectAll('.xAxisTitle').remove();
    svg.selectAll('.yAxisTitle').remove();
  }

  function showAxisTitles() {
    // Another way to do this would be to create
    // the x-axis texts once and then just hide them.
    var xTitles = svg.selectAll('.xAxisTitle').data(xAxis.getLevels());

    xTitles.enter().append('text')
      .attr('class', 'xAxisTitle')
      .attr('x', function (d) { return xAxis.getCenterOffset(d); })
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });

    var yTitles = svg.selectAll('.yAxisTitle').data(yAxis.getLevels());

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
                  '<span class="name">'+ param.radiusProperty.caption +': </span><span class="value">' +
                  addCommas(d.value) +
                  '</span><br/>' +
                  '<span class="name">'+ param.xAxis.caption +': </span><span class="value">' +
                  d.xLevel +
                  '</span>';

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

  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by x-axis" modes.
   *
   * displayName is expected to be a string and either 'x-axis' or 'all'.
   */
  chart.toggleDisplay = function (displayName) {
    if (displayName === 'year') {
      splitBubbles();
    } else {
      groupBubbles();
    }
  };


  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = bubbleChart({
  groupProperty: {
    caption: 'Art'
  },
  radiusProperty: {
    name: 'Count',
    caption: 'Anzahl'
  },
  xAxis: {
    property: 'Year',
    caption: 'Jahr',
    levels: ['2014', '2015', '2016', '2017'],
    padding: 200,
    length: 1400,
    center: 400
  },
  yAxis: {
    property: 'Discipline',
    caption: 'Forschungsdisziplin',
    levels: ["Basic Biological Research"
            ,"Basic Medical Sciences"
            ,"Clinical Medicine"
            ,"Experimental Medicine"
            ,"General Biology"
            ,"Preventive Medicine (Epidemiology/Early Diagnosis/Prevention)"
            ,"Social Medicine"
            ,"Art studies, musicology, theatre and film studies, architecture"
            ,"Economics, law"
            ,"Ethnology, social and human geography"
            ,"Linguistics and literature, philosophy"
            ,"Psychology, educational studies"
            ,"Sociology, social work, political sciences, media and communication studies, health"
            ,"Theology & religious studies, history, classical studies, archaeology, prehistory and early history"
            ,"Chemistry"
            ,"Earth Sciences"
            ,"Engineering Sciences"
            ,"Environmental Sciences"
            ,"Physics"],
    padding: 50,
    length: 2800,
    center: 400
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
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
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
d3.csv('data/output_by_year_and_discipline.csv').then(display);

// setup the buttons.
setupButtons();
