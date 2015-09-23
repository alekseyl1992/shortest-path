// Bootstrap 3 doesn't support UMD properly (BS4 will do though)
window.$ = window.jQuery = require('jquery');
require('bootstrap');

import _ from 'lodash';
import vis from 'vis';
import alertify from 'alertifyjs';
import handlebars from 'handlebars';

import Net from './net';
import Edge from './edge';
import Genetic from './genetic';

export default class UI {
    constructor() {
        this.templates = {
            config: handlebars.compile($('#config-template').html())
        };

        this.$config = $('#config');
        this.$start = $('#start');
        this.$step = $('#step');

        this.$start.click(this.start.bind(this));
        this.$step.click(this.step.bind(this));

        $('.nav-tabs a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });

        this.initVis();

        this.defaultConfig = {
            from: 0,
            to: 3,
            populationSize: 10,
            crossoversCount: 10,
            selectionCount: 5,
            mutationProb: 0.1,
            insertCount: 1,
            removeCount: 1,
            replaceCount: 1,
            genomeMaxSize: 4
        };
        this.renderConfig(this.defaultConfig);
    }

    initVis() {
        this.nodes = new vis.DataSet([]);
        this.edges = new vis.DataSet([]);

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

        // create sequential ids
        var seqId = 0;
        _.each(this.nodes.get(), (node) => {
            node.seqId = seqId++;
            this.nodes.update(node);
        });

        _.each(this.edges.get(), (edge) => {
            edge.cost = parseInt(edge.label) || 1;
            edge.hash = Edge.getEdgeHash(this.nodes, edge);
            this.edges.update(edge);
        });

        var nodesCount = this.nodes.length;
        if (nodesCount == 0 || this.edges.length == 0) {
            alertify.error('Should be at least one node and edge');
            return;
        }

        this.net = new Net(this.edges, nodesCount);
        this.genetic = new Genetic(this.net, config);

        console.log('Genetic object created');
    }

    step () {
        if (!this.genetic) {
            alertify.error('Press start');
            return;
        }

        this.genetic.step((ch) => {
            // un-highlight all edges
            _.each(this.edges.get(), (edge) => {
                edge.width = 1;
                this.edges.update(edge);
            });

            // highlight best path
            var from = ch.config.from;
            for (let i = 0; i < ch.path.length; ++i) {
                var to = ch.path[i];

                var edge = this.net.getEdge(from, to);
                edge.width = 3;
                this.edges.update(edge);

                from = to;
            }

            // add last path part
            to = ch.config.to;
            edge = this.net.getEdge(from, to);
            edge.width = 3;
            this.edges.update(edge);
        });


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