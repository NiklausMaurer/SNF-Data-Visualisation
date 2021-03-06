
function bubbleChart(param) {

	var tooltip = floatingTooltip('gates_tooltip', 240);

	var axisFactory = AxisFactory();
	var xAxis = axisFactory.getXAxis('none');
	var yAxis = axisFactory.getYAxis('none');

	var forceStrength = 0.038;
	var clusterForceStrength = 0.8;

	var svg = null;
	var bubbles = null;
	var nodesBackup = [];
	var nodes = [];
	var clusterManager = ClusterManager();

	var alpha = 0.3;
	var laterAlpha = 1;

	var types = ["Media relations: print media, online media", "New media (web, blogs, podcasts, news feeds etc.)", "Media relations: radio, television", "Talks/events/exhibitions", "Print (books, brochures, leaflets)", "Other activities", "Video/Film", "Start-up", "Software"];

	const cluster = () => {
		var nodes,
			strength = 0.4;
		function force (alpha) {
      // scale + curve alpha value

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
	}).iterations(15).strength(.3))
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
					data: data
				};
			return d;
		});

		myNodes.sort(function (a, b) { return b.value - a.value; });

		return myNodes;
	}

	var chart = function chart(rawData) {

		nodesBackup = createNodes(rawData);
		nodes = nodesBackup.slice();

		initializeBubbles();

		updateAxes();
	} // chart;

	function ticked() {
		bubbles 
			.attr('cx', function (d) { return d.x; })
			.attr('cy', function (d) { return d.y; });
	}

	function initializeBubbles() {
		svg = d3.select('#vis')
			.append('svg')
			.attr('width', 1600)
			.attr('height', yAxis.getLength() + 'px');

		bubbles = svg.selectAll('.bubble')
			.data(nodes, function (d) { return d.id; });

    var typeAxis = axisFactory.getXAxis('Type');

		var bubblesE = bubbles.enter().append('circle')
		.classed('bubble', true)
		.attr('r', 0)
		.attr('fill', function (d) { return fillColor(d.group); })
		.attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
		.attr('stroke-width', 1.3)
		.attr('cx', function (d) { return d.x = xAxis.getCenter() - xAxis.getLength()* 3 * 0.5 + typeAxis.getCenterOffset(d.group) * 3 + (Math.random() - 0.5) * 20; })
		.attr('cy', function (d) { return d.y = yAxis.getCenter() + (Math.random() - 0.5) * 50; })
		.on('mouseover', showDetail)
		.on('mouseout', hideDetail);

		bubbles = bubbles.merge(bubblesE);

		bubbles.transition()
			.duration(1000)
			.attr('r', function (d) { return d.radius; });

		simulation.nodes(nodes);
	}

	function updateAxes() {

		if(xAxis.getProperty() === 'none') svg.selectAll('.xAxisTitle').remove();
		else showXAxisTitles();

		if(yAxis.getProperty() === 'none') svg.selectAll('.yAxisTitle').remove();
		else showYAxisTitles();

		if(xAxis.getProperty() !== 'none' || yAxis.getProperty() !== 'none') {
			simulation.force('cluster', null);
			forceStrength = 0.03;
		}

		simulation.force('x', d3.forceX().strength(xAxis.getForceStrength(forceStrength)).x(xAxis.getNodeOffset));
		simulation.force('y', d3.forceY().strength(yAxis.getForceStrength(forceStrength)).y(yAxis.getNodeOffset));

		simulation.alpha(alpha).restart();
		alpha = laterAlpha;

		svg.transition().duration(1000).attr('height', yAxis.getLength() + 'px');
	}

	function showXAxisTitles() {

		var xTitles = svg.selectAll('.xAxisTitle').data(xAxis.getLevels());

		xTitles.attr('class', 'xAxisTitle')
			.attr('x', function (d) { return xAxis.getCenterOffset(d.value); })
			.text(function (d) { return d.caption; });

		xTitles.exit().remove();

		xTitles.enter().append('text')
			.attr('class', 'xAxisTitle')
			.attr('x', function (d) { return xAxis.getCenterOffset(d.value); })
			.attr('y', 20)
			.attr('text-anchor', 'middle')
			.text(function (d) { return d.caption; });
	}

	function showYAxisTitles() {

		var yTitles = svg.selectAll('.yAxisTitle').data(yAxis.getLevels());

		yTitles.attr('y', function (d) { return yAxis.getLowerBoundry(d.value) + 5; })
			.text(function (d) { return d.caption; });

		yTitles.exit().remove();

		yTitles.enter().append('text')
			.attr('class', 'yAxisTitle')
			.attr('x', 10)
			.attr('y', function (d) { return yAxis.getLowerBoundry(d.value) + 5; })
			.attr('text-anchor', 'left')
			.text(function (d) { return d.caption; });
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
			axisFactory.getXAxis('Type').getLevelCaption(d) +
			'</span><br/>';

		if(xAxis.getProperty() !== 'none' && xAxis.getProperty() !== 'Type') {
			content += '<span class="name">' + xAxis.getCaption() + ': </span><span class="value">' +
				xAxis.getLevelCaption(d) +
				'</span><br/>'
		}

		if(yAxis.getProperty() !== 'none' && yAxis.getProperty() !== xAxis.getProperty()) {
			content += '<span class="name">' + yAxis.getCaption() + ': </span><span class="value">' +
				yAxis.getLevelCaption(d) +
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

	chart.displayTypes = function(typesfilter) {

		nodes = nodesBackup.filter(x => typesfilter.includes(x.data['Type']));

		bubbles = svg.selectAll('.bubble')
			.data(nodes, function (d) { return d.id; });

		var bubblesE = bubbles.enter().append('circle')
		.classed('bubble', true)
		.attr('r', 0)
		.attr('fill', function (d) { return fillColor(d.group); })
		.attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
		.attr('stroke-width', 1.3)
		.attr('cx', function (d) { return d.x = xAxis.getNodeOffset(d) + (Math.random() - 0.5) * 50; })
		.attr('cy', function (d) { return d.y = yAxis.getNodeOffset(d) + (Math.random() - 0.5) * 50; })
		.on('mouseover', showDetail)
		.on('mouseout', hideDetail);

		bubbles.exit().remove();

		bubbles = bubbles.merge(bubblesE);

		var maxAmount = d3.max(nodes, function (d) { return d.value; });

		var radiusScale = d3.scalePow()
		.exponent(0.5)
		.range([2, 25])
		.domain([1, maxAmount]);

		bubbles.each(function(d) {d.radius = radiusScale(d.data['Count'])})

		bubbles.transition()
			.duration(500)
			.attr('r', function (d) { return d.radius; });

		simulation.nodes(nodes);

    clusterManager.reset();
    simulation.force('cluster', null);

		simulation.alpha(Math.max(simulation.alpha(), .5)).restart();
	}

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
	myBubbleChart(data);
}

function updateDataTypes(){
	var choices = [];
	d3.selectAll(".myCheckbox").each(function(d){
		cb = d3.select(this);
		if(cb.property("checked")){
			choices.push(cb.property("name"));
		}
	});
  myBubbleChart.displayTypes(choices);
}

function setupButtons() {


	d3.selectAll(".myCheckbox").on('change',function(){
		updateDataTypes();
	});

	d3.select("#clearAll").on('click', function(){						 
		d3.selectAll(".myCheckbox").each(function(d){
			d3.select(this).property('checked',0);
		});
		updateDataTypes();
	})

	d3.select("#showall").on('click', function(){						 
		d3.selectAll(".myCheckbox").each(function(d){
			d3.select(this).property('checked',1);
		});
		updateDataTypes();
	})


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
	})
		.attr('selected', function(key){
		return key === 'none';
	});

	d3.select('#selectXAxis')
		.on('change', function(){
		var selectedXValue = this.value;
		myBubbleChart.setXAxis(selectedXValue);
		if(selectedXValue == 'none' || d3.select('#selectYAxis').property('value') == selectedXValue) {
			d3.select('#selectYAxis').attr('disabled', true);
			d3.select('#selectYAxis').property('value', 'none') ;
			myBubbleChart.setYAxis('none');
		}
		else {
			d3.select('#selectYAxis').attr('disabled', null);
			var options = d3.select('#selectYAxis').selectAll('option').style('display', null);
			options.filter(function(d) {return d === selectedXValue;}).style('display', 'none');
		}});

	d3.select('#selectYAxis')
		.selectAll("option")
		.data(Object.keys(axisFactory.getSupportedYAxes()))
		.enter()
		.append('option')
		.text(function(key){
		return axisFactory.getYAxis(key).getCaption();
	})
		.attr('value', function(key){
		return axisFactory.getYAxis(key).getProperty();
	})
		.attr('selected', function(key){
		return key === 'none';
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

