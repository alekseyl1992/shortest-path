import _ from 'lodash';
import Edge from './edge';

export default class Net {
    constructor(edges, nodesCount) {
        this.edges = edges;
        this.edgesMap = {};

        _.each(edges.get(), (edge) => {
            this.edgesMap[edge.hash] = edge;
        });

        this.nodesCount = nodesCount;
    }

    getEdgeCost(from, to) {
        var edge = this.getEdge(from, to);
        if (edge)
            return edge.cost;
        else
            return Infinity;
    }

    getEdge(from, to) {
        var hash = Edge.getPairHash([from, to]);
        return this.edgesMap[hash];
    }
}