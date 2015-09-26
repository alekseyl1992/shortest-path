import _ from 'lodash';

export default class Chromosome {
    constructor(config, empty) {
        this.config = config;
        this.path = [];
        this.fitness = 0;

        if (empty)
            return;

        // random genome
        var genomeSize = _.random(0, config.genomeMaxSize);
        for (let i = 0; i < genomeSize; ++i) {
            do {
                var nodeId = _.random(0, config.nodesCount - 1);
                var node = config.nodes.get()[nodeId];
            } while(_.contains(this.path, node));

            this.path.push(node);
        }
    }

    crossover(another) {
        var result = new Chromosome(this.config, true);
        var chromosomes = [this, another];

        // copy positions
        chromosomes[0].pos = 0;
        chromosomes[1].pos = 0;

        var sourceId = _.random(0, 1);
        var source = chromosomes[sourceId];

        var minLen = _.min([this.path.length, another.path.length]);
        var maxLen = _.max([this.path.length, another.path.length]);

        var resultLen = _.random(minLen, maxLen);

        while (result.path.length < resultLen) {
            var partLen = _.random(0, resultLen);
            if (partLen + result.path.length > resultLen)
                partLen -= resultLen - result.path.length;

            var sourceRestLen = source.path.length - source.pos;

            if (partLen > sourceRestLen)
                partLen = sourceRestLen;

            for (let i = 0; i < partLen; ++i) {
                result.path.push(source.path[source.pos++]);
            }

            sourceId = +!sourceId;
            source = chromosomes[sourceId];
        }

        return result;
    }

    mutate() {
        this.fitness = 0;  // reset fitness
        var len = (this.path.length + this.config.genomeMaxSize) / 2;

        for (let i = 0; i < len * this.config.insertPercent; ++i) {
            const pos = _.random(0, this.path.length - 1);
            const nodeId = _.random(0, this.config.nodesCount - 1);
            const node = this.config.nodes.get()[nodeId];

            this.path.splice(pos, 0, node);
        }

        for (let i = 0; i < len * this.config.removePercent; ++i) {
            const pos = _.random(0, this.path.length - 1);
            this.path.splice(pos, 1);
        }

        for (let i = 0; i < len * this.config.replacePercent; ++i) {
            const pos = _.random(0, this.path.length - 1);
            const nodeId = _.random(0, this.config.nodesCount - 1);
            const node = this.config.nodes.get()[nodeId];

            this.path[pos] = node;
        }
    }

    evalFitness(genetic, noCache) {
        if (this.fitness && !noCache)
            return this.fitness;

        this.fitness = 0;
        var from = this.config.from;
        for (let i = 0; i < this.path.length; ++i) {
            var to = this.path[i];

            let cost = genetic.net.getEdgeCost(from, to);
            this.fitness += cost;

            from = to;
        }

        // add last path part
        to = this.config.to;
        let cost = genetic.net.getEdgeCost(from, to);
        this.fitness += cost;

        return this.fitness;
    }
}