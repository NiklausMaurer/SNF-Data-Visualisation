DiscreteAxis = function(axisParam){

    var levels = axisParam.levels;
    var padding = axisParam.padding;
    var length = axisParam.length;
    var center = axisParam.center;
    var property = axisParam.property;

    var columnWidth = Math.round((length - 2 * padding)/levels.length);

    var axis = Object();

    var getCenterOffset = function(level) {
        return padding + Math.round(columnWidth/2) + levels.indexOf(level) * columnWidth;
    }

    axis.getCenterOffset = function(level) {
        return getCenterOffset(level);
    }

    axis.getCenter = function() {
        return center;
    }

    axis.getLevels = function() {
        return levels;
    }

    axis.getLength = function() {
        return length;
    }

    axis.getColumnWidth = function() {
        return columnWidth;
    }

    axis.getProperty = function() {
        return property;
    }

    axis.getNodeOffset = function(d) {
        if(property === 'None') return center;
        return getCenterOffset(d.data[property]);
    }

    axis.getForceStrength = function(s) {
        if(property === 'None') return s / 2.1;
        return s * 2.2;
    }

    return axis;    
}


AxisFactory = function() {

    var supportedXAxes = {
        Discipline: DiscreteAxis({
            property: 'Discipline',
            caption: 'Forschungsdisziplin',
            levels: ['Biology and Medicine','Humanities and Social Sciences','Mathematics, Natural- and Engineering Sciences'],
            padding: 50,
            length: 1200,
            center: 300,
            orientation: 'x'
          }),
        InstitutionType: DiscreteAxis({
            property: 'InstitutionType',
            caption: 'Institution',
            levels: ['University','ETH Domain','UAS / UTE','Other'],
            padding: 50,
            length: 1200,
            center: 300,
            orientation: 'x'
          }),
        AmountCatecory: DiscreteAxis({
            property: 'AmountCatecory',
            caption: 'Funding size',
            levels: ["1 - 200'000","200'000 - 400'000","800'000 - 1'000'000","400'000 - 600'000","1'000'000+","600'000 - 800'000"],
            padding: 50,
            length: 1200,
            center: 300,
            orientation: 'x'
        }),
        none: DiscreteAxis({
            property: 'None',
            levels: ['Alle'],
            padding: 50,
            length: 1200,
            center: 300,
            orientation: 'x'
          })
    }

    var supportedYAxes = {
        Discipline: DiscreteAxis({
            property: 'Discipline',
            caption: 'Forschungsdisziplin',
            levels: ['Biology and Medicine','Humanities and Social Sciences','Mathematics, Natural- and Engineering Sciences'],
            padding: 50,
            length: 1200,
            center: 300,
            orientation: 'y'
          }),
        InstitutionType: DiscreteAxis({
            property: 'InstitutionType',
            caption: 'Institution',
            levels: ['University','ETH Domain','UAS / UTE','Other'],
            padding: 50,
            length: 1200,
            center: 300,
            orientation: 'y'
          }),
        AmountCatecory: DiscreteAxis({
            property: 'AmountCatecory',
            caption: 'Funding size',
            levels: ["1 - 200'000","200'000 - 400'000","800'000 - 1'000'000","400'000 - 600'000","1'000'000+","600'000 - 800'000"],
            padding: 50,
            length: 1200,
            center: 300,
            orientation: 'y'
        }),
        none: DiscreteAxis({
            property: 'None',
            levels: ['Alle'],
            padding: 50,
            length: 1200,
            center: 300,
            orientation: 'y'
          })
    }

    var axisFactory = Object();

    axisFactory.getXAxis = function(property) {
        return supportedXAxes[property]
    }

    axisFactory.getYAxis = function(property) {
        return supportedYAxes[property]
    }

    return axisFactory;
}