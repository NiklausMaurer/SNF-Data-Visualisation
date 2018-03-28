

DiscreteAxis = function(levels, size){

    var columnWidth = Math.round(size/levels.length);

    var axis = Object();

    axis.getOffset = function(level) {
        return Math.round(columnWidth/2) + levels.indexOf(level) * columnWidth
    }

    return axis;    
}

