ClusterManager = function() {


    var manager = {};
    var nodesCache = null;
    var clusterCache = new Array();
    var clusterNodeCache = new Array();

    function generateCacheKey(node, xProperty, yProperty)
    {
        var cacheKey = node.group + xProperty + yProperty;
        if(xProperty !== 'None') cacheKey += node.data[xProperty];
        if(yProperty !== 'None') cacheKey += node.data[yProperty];

        return cacheKey;
    }

    manager.getNodesInSameCluster = function(node, xProperty, yProperty) {
        
        if(nodesCache === null) nodesCache = d3.selectAll('circle');

        var nodesInSameCluster = nodesCache.filter(function(d) {return d.group == node.group;})

        var cacheKey = generateCacheKey(node, xProperty, yProperty);
        if(cacheKey in clusterCache) return clusterCache[cacheKey];

        if(xProperty !== 'none') nodesInSameCluster = nodesInSameCluster.filter(n => n.data[xProperty] === node.data[xProperty]);
        if(yProperty !== 'none') nodesInSameCluster = nodesInSameCluster.filter(n => n.data[yProperty] === node.data[yProperty]);

        clusterCache[cacheKey] = nodesInSameCluster;

        return nodesInSameCluster;
    }

    manager.getClusterNode = function(node, xProperty, yProperty) {
        
        var nodesInSameCluster = this.getNodesInSameCluster(node, xProperty, yProperty);

        var cacheKey = generateCacheKey(node, xProperty, yProperty);
        if(cacheKey in clusterNodeCache) return clusterNodeCache[cacheKey];
        
        var clusterNode = null;
        nodesInSameCluster.each(function(d) {
            if(clusterNode === null || d.value > clusterNode.value) clusterNode = d;
        });

        clusterNodeCache[cacheKey] = clusterNode;

        return clusterNode;
    }

    return manager;
}