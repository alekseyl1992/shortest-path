import _ from 'lodash';

import Chromosome from './chromosome';

export default class Genetic {
    constructor(net, config) {
        this.net = net;
        this.config = config;
        this.stepsCount = 0;

        this.population = [];
        for (let i = 0; i < config.populationSize; ++i) {
            let ch = new Chromosome(config);
            ch.evalFitness(this);
            this.population.push(ch);
        }
    }

    static sort(population) {
        return _.sortByAll(population, [
            (ch) => ch.fitness.cost,
            (ch) => ch.fitness.gapesCount,
            (ch) => ch.path.length
        ]);
    }

    static compare(ch1, ch2) {
        if (_.isUndefined(ch1))
            return true;
        if (_.isUndefined(ch2))
            return false;

        if (ch1.fitness.cost != ch2.fitness.cost)
            return ch1.fitness.cost > ch2.fitness.cost;

        if (ch1.fitness.gapesCount != ch2.fitness.gapesCount)
            return ch1.fitness.gapesCount > ch2.fitness.gapesCount;

        return ch1.path.length > ch2.path.length;
    }

    step(visualize) {
        if (this.stepsCount == 0)
            this.population = Genetic.sort(this.population);

        visualize(this.population);

        let children = [];
        let has = (population, newCh) => _.any(population, (ch) => _.eq(ch.path, newCh.path));

        for (let i = 0; i < this.config.crossoversCount; ++i) {
            let ch1 = _.random(0, this.config.selectionCount - 1);
            let ch2 = _.random(0, this.config.selectionCount - 1);

            let child = this.population[ch1].crossover(this.population[ch2]);

            if (_.random(0, 1, true) < this.config.mutationProb)
                child.mutate();

            if (this.config.mutateDuplicates &&
                (has(children, child) || has(this.population, child))) {

                child.mutate();
            }

            child.evalFitness(this);
            children.push(child);
        }

        children = Genetic.sort(children);

        // merge sort
        let newPopulation = [];
        let parentId = 0;
        let childId = 0;

        while (newPopulation.length < this.population.length) {
            let ch1 = this.population[parentId];
            let ch2 = children[childId];

            if (Genetic.compare(ch1, ch2)) {
                newPopulation.push(ch2);
                ++childId;
            } else {
                newPopulation.push(ch1);
                if (parentId >= this.config.selectionCount) {
                    ch1.mutate();
                    ch1.evalFitness(this);
                }

                ++parentId;
            }
        }

        this.population = newPopulation;
        this.stepsCount++;
    }

    recalcFitness() {
        _.each(this.population, (ch) => ch.evalFitness(this, true));
    }
}