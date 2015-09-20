import _ from 'lodash';

export default class Chromosome {
    constructor(nodesCount, config) {
        this.nodesCount = nodesCount;
        this.config = config;
        this.path = [];
        this.fitness = 0;

        // random genome
        var genomeSize = _.random(0, config.genomeMaxSize);
        for (let i = 0; i < genomeSize; ++i) {
            do {
                var node = _.random(0, nodesCount - 1)
            } while(_.contains(this.path, node));

            this.path.push(node);
        }
    }

    crossover(another) {
        var result = new Chromosome(this.nodesCount, this.config);
        var chromosomes = [this, another];

        var sourceId = _.random(0, 1);
        var source = chromosomes[sourceId];

        var minLen = _.min([this.length, another.length]);
        var maxLen = _.max([this.length, another.length]);

        var resultLen = _.random(minLen, maxLen);

        while (result.path.length < resultLen) {
            var partLen = _.random(0, resultLen - result.path.length);
            if (partLen + result.path.length > source.path.length)
                partLen = source.path.length - result.path.length;

            for (let i = 0; i < partLen; ++i) {
                result.path.push(source.path[i]);
            }

            sourceId = !sourceId;
            source = chromosomes[sourceId];
        }

        return result;
    }

    mutate(config) {
        this.fitness = 0;  // reset fitness

        for (let i = 0; i < config.insertCount; ++i) {
            const pos = _.random(0, this.path.length - 1);
            const node = _.random(0, this.nodesCount - 1);

            this.path.splice(pos, 0, node);
        }

        for (let i = 0; i < config.removeCount; ++i) {
            const pos = _.random(0, this.path.length - 1);
            this.path.splice(pos, 1);
        }

        for (let i = 0; i < config.replaceCount; ++i) {
            const pos = _.random(0, this.path.length - 1);
            const node = _.random(0, this.nodesCount - 1);

            this.path[pos] = node;
        }
    }

    evalFitness(genetic) {
        if (this.fitness)
            return this.fitness;

        var from = this.config.from;
        for (let i = 0; i < this.path.length; ++i) {
            var to = this.path[i];

            const cost = genetic.net.getEdgeCost(from, to);
            this.fitness += cost;

            from = to;
        }

        // add last path part
        to = this.config.to;
        const cost = genetic.net.getEdgeCost(from, to);
        this.fitness += cost;

        return this.fitness;
    }
}