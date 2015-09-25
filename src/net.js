import _ from 'lodash';

export default class Net {
    constructor(edges) {
        this.edges = edges;
    }

    getEdgeCost(from, to) {
        var edge = this.getEdge(from, to);
        if (edge)
            return edge.cost;
        else
            return Infinity;
    }

    getEdge(from, to) {
        var arr = this.edges.get({
            filter: (item) => (item.from == from.id && item.to == to.id) ||
                (item.to == from.id && item.from == to.id)
        });

        return arr[0];
    }
}