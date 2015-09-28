import _ from 'lodash';

export default class Chromosome {
    constructor(config, empty) {
        this.config = config;
        this.path = [];

        this.fitness = null;

        if (empty)
            return;

        // random genome
        var genomeSize = _.random(+config.genomeMinSize, config.genomeMaxSize);
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

        var sourceId = _.random(0, 1);
        var source = chromosomes[sourceId];

        var segmentsCount = this.config.segmentsCount;
        for (let i = 0; i < segmentsCount; ++i) {
            var segmentSize = source.path.length / segmentsCount;
            for (let j = 0; j < segmentSize; ++j) {
                var node = source.path[i * segmentSize + j];
                if (node) {
                    result.path.push(node);
                } else {
                    sourceId = +!sourceId;
                    source = chromosomes[sourceId];
                }
            }

            sourceId = +!sourceId;
            source = chromosomes[sourceId];
        }

        return result;
    }

    mutate() {
        this.fitness = null;

        var len = (this.path.length + this.config.genomeMaxSize) / 2;

        var insertCount = _.random(0, len * this.config.insertPercent);
        for (let i = 0; i < insertCount; ++i) {
            const pos = _.random(0, this.path.length - 1);
            const nodeId = _.random(0, this.config.nodesCount - 1);
            const node = this.config.nodes.get()[nodeId];

            this.path.splice(pos, 0, node);
        }

        var removeCount = _.random(0, len * this.config.removePercent);
        for (let i = 0; i < removeCount; ++i) {
            const pos = _.random(0, this.path.length - 1);
            this.path.splice(pos, 1);
        }

        var replaceCount = _.random(0, len * this.config.replacePercent);
        for (let i = 0; i < replaceCount; ++i) {
            const pos = _.random(0, this.path.length - 1);
            const nodeId = _.random(0, this.config.nodesCount - 1);
            const node = this.config.nodes.get()[nodeId];

            this.path[pos] = node;
        }
    }

    evalFitness(genetic, noCache) {
        if (this.fitness && !noCache)
            return this.fitness;

        this.fitness = {
            cost: 0,
            gapesCount: 0
        };

        var from = this.config.from;
        for (let i = 0; i < this.path.length; ++i) {
            var to = this.path[i];

            let cost = genetic.net.getEdgeCost(from, to);
            this.fitness.cost += cost;

            if (cost == Infinity)
                ++this.fitness.gapesCount;

            from = to;
        }

        // add last path part
        to = this.config.to;
        let cost = genetic.net.getEdgeCost(from, to);
        this.fitness.cost += cost;
        if (cost == Infinity)
            ++this.fitness.gapesCount;

        this.fitness.gapesCount = Math.floor(this.fitness.gapesCount * 100 / (this.path.length + 2));

        return this.fitness;
    }
}