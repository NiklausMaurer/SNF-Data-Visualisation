

DiscreteAxis = function(levels, size){

    var columnWidth = Math.round(size/levels.length);

    var axis = Object();

    axis.getCenterOffset = function(level) {
        return Math.round(columnWidth/2) + levels.indexOf(level) * columnWidth;;
    }

    axis.getLevels = function() {
        return levels;
    }

    return axis;    
}

