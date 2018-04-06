

DiscreteAxis = function(axisParam){

    var levels = axisParam.levels;
    var padding = axisParam.padding;
    var length = axisParam.length;

    var columnWidth = Math.round((length - 2 * padding)/levels.length);

    var axis = Object();

    axis.getCenterOffset = function(level) {
        return padding + Math.round(columnWidth/2) + levels.indexOf(level) * columnWidth;;
    }

    axis.getLevels = function() {
        return levels;
    }

    return axis;    
}

