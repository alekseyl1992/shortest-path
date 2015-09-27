// Bootstrap 3 doesn't support UMD properly (BS4 will do though)
global.$ = global.jQuery = require('jquery');
require('bootstrap');

import _ from 'lodash';
import vis from 'vis';
import alertify from 'alertifyjs';
import handlebars from 'handlebars';

import Net from './net';
import Genetic from './genetic';

export default class UI {
    constructor() {
        this.templates = {
            config: handlebars.compile($('#config-template').html()),
            log: handlebars.compile($('#log-template').html())
        };

        this.$config = $('#config');
        this.$log = $('#log');
        this.$start = $('#start');
        this.$step = $('#step');
        this.$burst = $('#burst');
        this.$stepsCount = $('#stepsCount');

        this.$stepsCount.click((e) => false);

        this.$start.click(this.start.bind(this));
        this.$step.click(this.step.bind(this));
        this.$burst.click(this.burst.bind(this, 10));

        this.$save = $('#save');
        this.$load = $('#load');
        this.$save.click(this.save.bind(this));
        this.$load.click(this.load.bind(this));

        $('.nav-tabs a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });

        this.initVis();

        this.defaultConfig = {
            from: '',
            to: '',
            populationSize: 10,
            crossoversCount: 10,
            selectionCount: 5,
            mutationProb: 0.1,
            insertPercent: 0.5,
            removePercent: 0.5,
            replacePercent: 0.5,
            segmentsCount: 4,
            genomeMinSize: '',
            genomeMaxSize: '',
            mutateDuplicates: 'yes'
        };
        this.renderConfig(this.defaultConfig);
    }

    initVis(nodes, edges) {
        this.nodes = new vis.DataSet(nodes);
        this.edges = new vis.DataSet(edges);

        var container = $('#net')[0];
        this.network = new vis.Network(container, {
            nodes: this.nodes,
            edges: this.edges
        }, {
            manipulation: {
                addNode: this.onEditNode.bind(this),
                editNode: this.onEditNode.bind(this),
                addEdge: this.onEditEdge.bind(this),
                editEdge: this.onEditEdge.bind(this)
            },
            physics: false,
            edges: {
                smooth: {
                    enabled: false
                }
            },
            autoResize: true
        });
    }

    start() {
        var config = this.getConfig();
        this.config = _.clone(config);

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
            alertify.error('Should be at least one node and edge');
            return;
        }

        if (config.genomeMaxSize == '')
            config.genomeMaxSize = config.nodesCount - 2;

        this.net = new Net(this.edges);
        this.genetic = new Genetic(this.net, config);

        // recalculate fitness for whole population on topology change
        this.edges.on('*', () => this.genetic.recalcFitness());

        this.unhighlight();
        this.$stepsCount.text('Steps: 0');

        console.log('Genetic object created');
    }

    step () {
        if (!this.genetic) {
            alertify.error('Press start');
            return;
        }

        this.genetic.step((population) => {
            this.unhighlight();
            this.log(population);

            var ch = population[0];

            // highlight best path
            var from = ch.config.from;
            for (let i = 0; i < ch.path.length; ++i) {
                var to = ch.path[i];

                var edge = this.net.getEdge(from, to);
                if (edge) {
                    edge.width = 3;
                    this.edges.update(edge);
                }

                from = to;
            }

            // add last path part
            to = ch.config.to;
            edge = this.net.getEdge(from, to);
            if (edge) {
                edge.width = 3;
                this.edges.update(edge);
            }
        });

        this.$stepsCount.text('Steps: ' + this.genetic.stepsCount);
    }

    burst(count) {
        if (!this.genetic) {
            alertify.error('Press start');
            return;
        }

        _.times(count - 1, () => this.genetic.step(_.noop));

        // visualize last step only
        this.step();
    }

    save() {
        this.network.storePositions();
        window.localStorage.setItem('nodes', JSON.stringify(this.nodes.get()));
        window.localStorage.setItem('edges', JSON.stringify(this.edges.get()));
        window.localStorage.setItem('config', JSON.stringify(this.getConfig()));
    }

    load() {
        var nodes = JSON.parse(window.localStorage.getItem('nodes'));
        var edges = JSON.parse(window.localStorage.getItem('edges'));
        var config = JSON.parse(window.localStorage.getItem('config'));
        this.initVis(nodes, edges);
        this.renderConfig(config);
    }

    unhighlight() {
        _.each(this.edges.get(), (edge) => {
            edge.width = 1;
            this.edges.update(edge);
        });
    }

    log (population) {
        var html = this.templates.log({
            population: population,
            from: this.config.from,
            to: this.config.to
        });
        this.$log.html(html);
    }

    onEditNode (data, callback) {
        alertify.prompt("Enter node name", data.label,
            function(evt, value) {
                data.label = value;
                callback(data);
            },
            function() {
                callback(null);
            }
        );
    }

    onEditEdge(data, callback) {
        alertify.prompt("Enter edge weight", parseInt(data.label) || 1,
            function(evt, value) {
                data.label = value;
                data.cost = parseInt(data.label) || 1;

                if (data.from == data.to) {
                    var r = confirm("Do you want to connect the node to itself?");
                    if (r == true) {
                        callback(data);
                    }
                } else {
                    callback(data);
                }
            });
    }

    renderConfig(config) {
        this.config = config;
        var html = this.templates.config({
            config: config
        });
        this.$config.html(html);
    }

    getConfig() {
        var config = {};

        this.$config.find('input').each((id, input) => {
            var $input = $(input);
            var val = parseFloat($input.val());
            if (_.isNaN(val))
                val = $input.val();

            config[$input.data('key')] = val;
        });

        return config;
    }
}