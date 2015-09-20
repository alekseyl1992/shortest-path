import _ from 'lodash';

export default class Edge {
    constructor(from, to, cost) {
        this.from = _.min([from, to]);
        this.to = _.max([from, to]);
        this.cost = cost;
    }

    getLabel() {
        return this.from + ',' + this.to;
    }
}