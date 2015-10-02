// Bootstrap 3 doesn't support UMD properly (BS4 will do though)
global.$ = global.jQuery = require('jquery');
require('bootstrap');
require('flot');

import _ from 'lodash';
import vis from 'vis';

import Net from './net';
import Genetic from './genetic';


class Experiment {
    constructor() {
        this.nodes = new vis.DataSet([{"id":"9bb00763-1bce-478d-8c7f-2cc0305096d6","x":-298,"y":-71,"label":"A"},{"id":"40b23ea2-43d7-491f-b3df-47e2c17242db","x":-144,"y":-128,"label":"B"},{"id":"4563cbd1-b373-4fdc-9f87-af98e93117b5","x":-202,"y":-21,"label":"C"},{"id":"d9058edf-4608-4559-82c5-b7ce1f226692","x":-55,"y":-108,"label":"E"},{"id":"31428f69-1589-42ec-ac94-fbc28d1be9b5","x":-41,"y":-10,"label":"F"},{"id":"96ce71f9-0061-4682-8e06-d8e1990d7e07","x":180,"y":-18,"label":"X"},{"id":"5736d389-5a16-4712-a0c2-cef08277ff66","x":-11,"y":-171,"label":"D"},{"id":"ab675c19-97dd-44ba-83f0-e2ce5a874471","x":-164,"y":75,"label":"G"},{"id":"6b310deb-f56c-4334-91fa-1d3a13ba76ea","x":117,"y":-130,"label":"H"},{"id":"a67c08e5-e330-4de1-a9e9-59bff1952dc3","x":72,"y":53,"label":"I"}]);
        this.edges = new vis.DataSet([{"from":"9bb00763-1bce-478d-8c7f-2cc0305096d6","to":"40b23ea2-43d7-491f-b3df-47e2c17242db","label":"1","cost":1,"id":"8fb173c5-52f4-40d1-a61a-e0efa6aa7200","width":1},{"from":"40b23ea2-43d7-491f-b3df-47e2c17242db","to":"d9058edf-4608-4559-82c5-b7ce1f226692","label":"1","cost":1,"id":"9a0871c4-dd66-4aa4-aaf1-a74f88479234","width":1},{"from":"d9058edf-4608-4559-82c5-b7ce1f226692","to":"96ce71f9-0061-4682-8e06-d8e1990d7e07","label":"1","cost":1,"id":"2f5700cb-5352-4bcf-b82b-36d79d652aa4","width":1},{"from":"9bb00763-1bce-478d-8c7f-2cc0305096d6","to":"4563cbd1-b373-4fdc-9f87-af98e93117b5","label":"2","cost":2,"id":"ba3bb1e1-a91c-4587-81d3-e03a4689d45c","width":1},{"from":"4563cbd1-b373-4fdc-9f87-af98e93117b5","to":"31428f69-1589-42ec-ac94-fbc28d1be9b5","label":"1","cost":1,"id":"bd17e190-a596-40f7-8916-e6e31119a837","width":1},{"from":"31428f69-1589-42ec-ac94-fbc28d1be9b5","to":"96ce71f9-0061-4682-8e06-d8e1990d7e07","label":"1","cost":1,"id":"0b8c5d10-b023-4b77-ad3e-49c7a768a33d","width":1},{"from":"9bb00763-1bce-478d-8c7f-2cc0305096d6","to":"96ce71f9-0061-4682-8e06-d8e1990d7e07","label":"4","cost":4,"id":"63aac3bb-90b4-465c-aab5-d13ff5fdbddc","width":1},{"from":"d9058edf-4608-4559-82c5-b7ce1f226692","to":"31428f69-1589-42ec-ac94-fbc28d1be9b5","label":"1","cost":1,"id":"03fde5a1-f7c3-4bd6-abc0-d6f1c9d229aa","width":1},{"from":"4563cbd1-b373-4fdc-9f87-af98e93117b5","to":"d9058edf-4608-4559-82c5-b7ce1f226692","label":"2","cost":2,"id":"de89d971-07ba-4c23-9ce7-4ee241eb62fe","width":1},{"from":"40b23ea2-43d7-491f-b3df-47e2c17242db","to":"31428f69-1589-42ec-ac94-fbc28d1be9b5","label":"3","cost":3,"id":"37a7e137-451b-411a-a360-4bf33a3ccb1e","width":1},{"from":"9bb00763-1bce-478d-8c7f-2cc0305096d6","to":"ab675c19-97dd-44ba-83f0-e2ce5a874471","label":"4","cost":4,"id":"60da5d36-5317-4c21-8462-aeaf8c6f9b28"},{"from":"4563cbd1-b373-4fdc-9f87-af98e93117b5","to":"ab675c19-97dd-44ba-83f0-e2ce5a874471","label":"1","cost":1,"id":"8a3cb8e3-e0fb-46e4-8666-54d0b6748d2d"},{"from":"ab675c19-97dd-44ba-83f0-e2ce5a874471","to":"a67c08e5-e330-4de1-a9e9-59bff1952dc3","label":"3","cost":3,"id":"81af297d-2cdb-4177-a8c2-725b584b08a9"},{"from":"a67c08e5-e330-4de1-a9e9-59bff1952dc3","to":"96ce71f9-0061-4682-8e06-d8e1990d7e07","label":"4","cost":4,"id":"4d55d055-8b45-41a0-9b4f-66fc8a9bf79c"},{"from":"40b23ea2-43d7-491f-b3df-47e2c17242db","to":"5736d389-5a16-4712-a0c2-cef08277ff66","label":"4","cost":4,"id":"c423f60e-8c05-4ea1-9002-af3c16b1a472"},{"from":"5736d389-5a16-4712-a0c2-cef08277ff66","to":"6b310deb-f56c-4334-91fa-1d3a13ba76ea","label":"1","cost":1,"id":"b97974ca-d3be-425e-a384-12e1619122b2"},{"from":"6b310deb-f56c-4334-91fa-1d3a13ba76ea","to":"96ce71f9-0061-4682-8e06-d8e1990d7e07","label":"1","cost":1,"id":"e44f8ccb-4e4c-4769-8a16-1a0f60d424cd"},{"from":"40b23ea2-43d7-491f-b3df-47e2c17242db","to":"6b310deb-f56c-4334-91fa-1d3a13ba76ea","label":"1","cost":1,"id":"4ad0b354-8184-49c3-a98b-137fb60ba421"},{"from":"ab675c19-97dd-44ba-83f0-e2ce5a874471","to":"31428f69-1589-42ec-ac94-fbc28d1be9b5","label":"2","cost":2,"id":"6e3f0cf8-ca14-4b67-bc6d-e2bd8efd6390"},{"from":"a67c08e5-e330-4de1-a9e9-59bff1952dc3","to":"31428f69-1589-42ec-ac94-fbc28d1be9b5","label":"1","cost":1,"id":"726b83bf-9f8b-4fcc-92ca-0baa6e30519e"},{"from":"31428f69-1589-42ec-ac94-fbc28d1be9b5","to":"6b310deb-f56c-4334-91fa-1d3a13ba76ea","label":"2","cost":2,"id":"c495ff89-1953-4a70-92e6-74df50b71ca2"},{"from":"5736d389-5a16-4712-a0c2-cef08277ff66","to":"a67c08e5-e330-4de1-a9e9-59bff1952dc3","label":"1","cost":1,"id":"ee0f6cf9-f6ff-420e-812f-1699358e742a"}]);
        this.targetCost = 3;
        this.iterationsPerTest = 100;

        var config = {
            "from": "A",
            "to": "X",
            "populationSize": 10,
            "crossoversCount": 10,
            "selectionCount": 5,
            "mutationProb": 0.05,
            "insertPercent": 0.5,
            "removePercent": 0.5,
            "replacePercent": 0.5,
            "segmentsCount": 4,
            "genomeMinSize": "",
            "genomeMaxSize": "",
            "mutateDuplicates": "yes"
        };

        $('#start').click((e) => {
            e.preventDefault();

            this.plot(
                this.experiment(config, 'selectionCount', 1, 10, 1),
                'selectionCount', 'steps');
            //this.plot(
            //    this.experiment(config, 'populationSize', 4, 20, 2),
            //    'populationSize', 'steps');
            //this.plot(
            //    this.experiment(config, 'mutationProb', 0, 1, 0.05),
            //    'mutationProb', 'steps');
            //this.plot(
            //    this.experiment(config, 'segmentsCount', 2, 5, 1),
            //    'segmentsCount', 'steps');
            //this.plot(
            //    this.experiment(config, 'mutateDuplicates', 0, 1, 1),
            //    'mutateDuplicates', 'steps');
            //this.plot(
            //    this.experiment(config, 'mutateDuplicates', 0, 1, 1),
            //    'mutateDuplicates', 'time');
            //this.plot(
            //    this.experiment(config, 'genomeMinSize', 0, 8, 1),
            //    'genomeMinSize', 'steps');
            //this.plot(
            //    this.experiment(config, 'crossoversCount', 1, 20, 2),
            //    'crossoversCount', 'time');
        });
    }

    experiment(cfg, param, from, to, step) {
        var data = [];

        for (let value = from; value <= to; value += step) {
            var config = _.clone(cfg);
            config[param] = value;
            var result = this.test(config);
            result.value = value;
            data.push(result);
        }

        return data;
    }

    test(cfg) {
        var config = _.clone(cfg);
        config.edges = this.edges;
        config.nodes = this.nodes;

        _.each(this.nodes.get(), (node) => {
            if (node.label === config.from) {
                config.from = node;
            }
            if (node.label === config.to) {
                config.to = node;
            }
        });

        _.each(this.edges.get(), (edge) => {
            edge.cost = parseInt(edge.label) || 1;
            this.edges.update(edge);
        });

        config.nodesCount = this.nodes.length;
        if (config.nodesCount == 0 || this.edges.length == 0) {
            throw 'Should be at least one node and edge';
        }

        if (config.genomeMaxSize == '')
            config.genomeMaxSize = config.nodesCount - 2;

        if (config.selectionCount > config.populationSize)
            config.selectionCount = config.populationSize / 2;

        var time = [];
        var steps = [];
        for (let i = 0; i < this.iterationsPerTest; ++i) {
            var net = new Net(this.edges);
            var genetic = new Genetic(net, config);

            var t0 = new Date().getTime();
            do {
                genetic.step(_.noop);
            } while (genetic.population[0].fitness.cost > this.targetCost);
            var t1 = new Date().getTime();

            time.push(t1 - t0);
            steps.push(genetic.stepsCount);
        }

        time = _.sortBy(time);
        steps = _.sortBy(steps);

        console.log(steps);

        return {
            time: _.reduce(time, (acc, v) => acc + v) / this.iterationsPerTest,
            steps: _.reduce(steps, (acc, v) => acc + v) / this.iterationsPerTest
        };
    }

    plot(data, x, y) {
        data = [{
            label: y + ' vs ' + x,
            data: _.map(data, (obj) => [obj.value, obj[y]])
        }];

        $.plot("#experiment", data, {
            series: {
                lines: { show: true },
                points: { show: true }
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            xaxis: {
                label: x
            },
            yaxis: {
                label: y
            }
        });
    }
}

$(() => new Experiment());
