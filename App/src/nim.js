

DiscreteAxis = function(levels, size, padding){

    var columnWidth = Math.round((size - 2 * padding)/levels.length);

    var axis = Object();

    axis.getCenterOffset = function(level) {
        return padding + Math.round(columnWidth/2) + levels.indexOf(level) * columnWidth;;
    }

    axis.getLevels = function() {
        return levels;
    }

    return axis;    
}

