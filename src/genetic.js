import _ from 'lodash';

import Chromosome from './chromosome';

export default class Genetic {
    constructor(net, config) {
        this.net = net;
        this.config = config;

        this.population = [];
        for (let i = 0; i < config.populationSize; ++i) {
            let ch = new Chromosome(config);
            ch.evalFitness(this);
            this.population.push(ch);
        }
    }

    step(visualize) {
        this.population = _.sortByAll(this.population, ['fitness', (ch) => ch.path.length ]);
        visualize(this.population);

        let children = [];

        for (let i = 0; i < this.config.crossoversCount; ++i) {
            var ch1 = _.random(0, this.config.selectionCount - 1);
            var ch2 = _.random(0, this.config.selectionCount - 1);

            let child = this.population[ch1].crossover(this.population[ch2]);

            if (_.random(0, 1, true) > this.config.mutationProb)
                child.mutate();

            child.evalFitness(this);
            children.push(child);
        }

        children = _.sortByAll(children, ['fitness', (ch) => ch.path.length ]);

        // merge sort
        let newPopulation = [];
        let parentId = 0;
        let childId = 0;

        while (newPopulation.length < this.population.length) {
            if (childId >= children.length ||
                this.population[parentId].fitness < children[childId].fitness) {

                newPopulation.push(this.population[parentId]);
                ++parentId;
            } else {
                newPopulation.push(children[childId]);
                ++childId;
            }
        }

        this.population = newPopulation;
    }

    recalcFitness() {
        _.each(this.population, (ch) => ch.evalFitness(this, true));
    }
}