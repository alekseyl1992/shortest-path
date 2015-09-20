import _ from 'lodash';

import Edge from './edge';

export default class Net {
    constructor(edges, nodesCount) {
        this.edges = {};
        this.nodesCount = nodesCount;

        _.each(edges, (edge) => {
            this.edges[edge.getLabel()] = edge;
        });
    }

    getEdgeCost(from, to) {
        if (from == to) {
            return 0;
        }

        var edgeLabel = new Edge(from, to).getLabel();
        var edge = this.edges[edgeLabel];

        if (edge)
            return edge.cost;
        else
            return Infinity;  // no such edge in net
    }
}