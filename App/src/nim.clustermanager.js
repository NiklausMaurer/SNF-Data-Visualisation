ClusterManager = function() {


    var manager = {};
    var nodesCache = null;
    var clusterCache = new Array();
    var clusterNodeCache = new Array();

    function generateCacheKey(node, properties)
    {
        var cacheKey = node.group + properties[0] + properties[1];
        if(properties[0] !== 'None') cacheKey += node.data[properties[0]];
        if(properties[1] !== 'None') cacheKey += node.data[properties[1]];

        return cacheKey;
    }

    manager.getNodesInSameCluster = function(node, xProperty, yProperty) {
        
        var properties = [xProperty, yProperty];
        properties.sort();

        var cacheKey = generateCacheKey(node, properties);
        if(cacheKey in clusterCache) return clusterCache[cacheKey];

        if(nodesCache === null) nodesCache = d3.selectAll('circle');
        var nodesInSameCluster = nodesCache.filter(function(d) {return d.group == node.group;})
        if(xProperty !== 'none') nodesInSameCluster = nodesInSameCluster.filter(n => n.data[properties[0]] === node.data[properties[0]]);
        if(yProperty !== 'none') nodesInSameCluster = nodesInSameCluster.filter(n => n.data[properties[1]] === node.data[properties[1]]);

        clusterCache[cacheKey] = nodesInSameCluster;

        return nodesInSameCluster;
    }

    manager.getClusterNode = function(node, xProperty, yProperty) {
        
        var properties = [xProperty, yProperty];
        properties.sort();

        var cacheKey = generateCacheKey(node, properties);
        if(cacheKey in clusterNodeCache) return clusterNodeCache[cacheKey];

        var nodesInSameCluster = this.getNodesInSameCluster(node, properties[0], properties[1]);
        
        var clusterNode = null;
        nodesInSameCluster.each(function(d) {
            if(clusterNode === null || d.value > clusterNode.value) clusterNode = d;
        });

        clusterNodeCache[cacheKey] = clusterNode;

        return clusterNode;
    }

    return manager;
}