
function bubbleChart(param) {

  var tooltip = floatingTooltip('gates_tooltip', 240);

  var axisFactory = AxisFactory();
  var xAxis = axisFactory.getXAxis('none');
  var yAxis = axisFactory.getYAxis('none');

  var width = 2000;
  var height = 2000;

  var forceStrength = 0.032;
  var clusterForceStrength = 0.8;

  var svg = null;
  var bubbles = null;
  var nodes = [];
  var doClustering = true;
  var clusterManager = ClusterManager();

  var alpha = 0.3;
  var laterAlpha = 1;

  var types = ["Media relations: print media, online media", "New media (web, blogs, podcasts, news feeds etc.)", "Media relations: radio, television", "Talks/events/exhibitions", "Print (books, brochures, leaflets)", "Other activities", "Video/Film", "Start-up", "Software"];

  const cluster = () => {
    var nodes,
      strength = 0.4;
    function force (alpha) {
      // scale + curve alpha value
      if(!doClustering) return;

      alpha *= clusterForceStrength * alpha;

      nodes.forEach(function(d) {
        var cluster = clusterManager.getClusterNode(d);
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
    .velocityDecay(0.15)
    .force('collision', d3.forceCollide().radius(function(d) {
      return d.radius
    }).iterations(15))
    .force('cluster', cluster().strength(clusterForceStrength))
    .on('tick', ticked);

  simulation.stop();

  var fillColor = d3.scaleOrdinal()
    .domain(types)
    .range(['#92c0e0', '#2a8dd4', '#e6f2fa', '#004d85', '#b1b1b1', '#e1e1e1', '#663399', '#b95f00', '#F93']);

  function createNodes(rawData) {
    
    var maxAmount = d3.max(rawData, function (d) { return +d[param.areaProperty.name]; });

    var radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([2, 25])
      .domain([1, maxAmount]);

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
            x: xAxis.getCenter() + Math.cos(i / 9 * 2 * Math.PI) * 800 + Math.random(),
            y: yAxis.getCenter() + Math.sin(i / 9 * 2 * Math.PI) * 800 + Math.random()
          };
      return d;
    });

    myNodes.sort(function (a, b) { return b.value - a.value; });

    return myNodes;
  }

  var chart = function chart(selector, rawData) {

    nodes = createNodes(rawData);

    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });

    var bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.group); })
      .attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
      .attr('stroke-width', 1.3)
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

    bubbles = bubbles.merge(bubblesE);

    bubbles.transition()
      .duration(1000)
      .attr('r', function (d) { return d.radius; });

    simulation.nodes(nodes);

    updateAxes();
  };

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

    simulation.alpha(alpha).restart();
    alpha = laterAlpha;
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

  function showDetail(d) {

    var nodesInSameCluster = clusterManager.getNodesInSameCluster(d, xAxis.getProperty(), yAxis.getProperty());
    nodesInSameCluster.attr('stroke', 'black')
                      .attr('fill', d3.rgb(fillColor(d.group)).darker());

    var totalCount = 0;
    nodesInSameCluster.each(function(d) {
      totalCount += d.value;
    })

    var content = '<span class="name">'+ param.groupProperty.caption +': </span><span class="value">' +
                  d.group +
                  '</span><br/>';

    if(xAxis.getProperty() != 'None' && xAxis.getProperty() != 'Type') {
      content += '<span class="name">' + xAxis.getProperty() + ': </span><span class="value">' +
                    d.data[xAxis.getProperty()] +
                  '</span><br/>'
    }

    if(yAxis.getProperty() != 'None' && yAxis.getProperty() !== xAxis.getProperty()) {
      content += '<span class="name">' + yAxis.getProperty() + ': </span><span class="value">' +
                    d.data[yAxis.getProperty()] +
                  '</span><br/>'
    }

    content +=  '<span class="name">'+ param.areaProperty.caption +' Total: </span><span class="value">' +
                  addCommas(totalCount) +
                '</span><br/>';

    tooltip.showTooltip(content, d3.event);
  }

  function hideDetail(d) {

    clusterManager.getNodesInSameCluster(d, xAxis.getProperty(), yAxis.getProperty())
      .attr('stroke', d3.rgb(fillColor(d.group)).darker())
      .attr('fill', d3.rgb(fillColor(d.group)));

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

  return chart;
} // buubleChart

var myBubbleChart = bubbleChart({
  groupProperty: {
    caption: 'Art'
  },
  areaProperty: {
    name: 'Count',
    caption: 'Anzahl'
  }
});

function display(data) {
  myBubbleChart('#vis', data);
}

function setupButtons() {

  var axisFactory = AxisFactory();

  d3.select('#selectXAxis')
    .selectAll("option")
    .data(Object.keys(axisFactory.getSupportedXAxes()))
    .enter()
    .append('option')
    .text(function(key){
      return axisFactory.getXAxis(key).getCaption();
    })
    .attr('value', function(key){
      return axisFactory.getXAxis(key).getProperty();
    });

  d3.select('#selectXAxis')
    .on('change', function(){
      myBubbleChart.setXAxis(this.value);
    });

    d3.select('#selectYAxis')
    .selectAll("option")
    .data(['none', 'Discipline', 'InstitutionType', 'FundingInstrument', 'AmountCatecory', 'Type'])
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


d3.csv('data/data.csv').then(display);

setupButtons();
