ClusterManager = function() {


    var manager = {};

    manager.getNodesInSameCluster = function(node, xProperty, yProperty) {
        
        var nodesInSameCluster = d3.selectAll('circle').filter(function(d) {return d.group == node.group;})

        if(xProperty !== 'none') nodesInSameCluster = nodesInSameCluster.filter(n => n.data[xProperty] === node.data[xProperty]);
        if(yProperty !== 'none') nodesInSameCluster = nodesInSameCluster.filter(n => n.data[yProperty] === node.data[yProperty]);

        return nodesInSameCluster;
    }

    return manager;
}