import _ from 'lodash';

export default class Edge {
    static getEdgeHash(nodes, edge) {
        var from = nodes.get(edge.from).seqId;
        var to = nodes.get(edge.to).seqId;

        return Edge.getPairHash([from, to]);
    }

    static getPairHash(pair) {
        var mFrom = _.min(pair);
        var mTo = _.max(pair);

        return mFrom + ',' + mTo;
    }
}