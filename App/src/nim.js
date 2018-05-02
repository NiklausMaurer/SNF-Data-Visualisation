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

    var supportedAxes = {
        Discipline: DiscreteAxis({
            property: 'Discipline',
            caption: 'Forschungsdisziplin',
            levels: ['Biology and Medicine','Humanities and Social Sciences','Mathematics, Natural- and Engineering Sciences'],
            padding: 50,
            length: 2000,
            center: 400
          }),
        InstitutionType: DiscreteAxis({
            property: 'InstitutionType',
            caption: 'Institution',
            levels: ['University','ETH Domain','UAS / UTE','Other'],
            padding: 150,
            length: 2000,
            center: 400
          }),
        none: DiscreteAxis({
            property: 'None',
            levels: ['Alle'],
            padding: 50,
            length: 2800,
            center: 400
          })
    }

    var axisFactory = Object();

    axisFactory.getAxis = function(property) {
        return supportedAxes[property]
    }

    return axisFactory;
}