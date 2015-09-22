// Bootstrap 3 doesn't support UMD properly (BS4 will do though)
window.$ = window.jQuery = require('jquery');
require('bootstrap');

import _ from 'lodash';
import vis from 'vis';
import alertify from 'alertifyjs';
import handlebars from 'handlebars';


export default class UI {
    constructor() {
        this.templates = {
            config: handlebars.compile($('#config-template').html())
        };

        this.$config = $('#config');
        this.$start = $('#start');

        this.$start.click(this.start.bind(this));

        $('.nav-tabs a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });

        this.initVis();
    }

    initVis() {
        var nodes = new vis.DataSet([
            {id: 1, label: 'Node 1'},
            {id: 2, label: 'Node 2'},
            {id: 3, label: 'Node 3'},
            {id: 4, label: 'Node 4'},
            {id: 5, label: 'Node 5'}
        ]);

        // create an array with edges
        var edge = {from: 1, to: 3};
        var edges = new vis.DataSet([
            edge,
            {from: 1, to: 2},
            {from: 2, to: 4},
            {from: 2, to: 5}
        ]);

        // create a network
        var container = $('#net')[0];

        // provide the data in the vis format
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {
            manipulation: {
                addNode: this.onEditNode.bind(this),
                editNode: this.onEditNode.bind(this),
                addEdge: this.onEditEdge.bind(this),
                editEdge: this.onEditEdge.bind(this)
            }
        };

        // initialize your network!
        var network = new vis.Network(container, data, options);

        setTimeout(() => {
            edge.width = 3;
            edges.update([edge]);
        }, 2000);
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
        alertify.prompt("Enter edge weight", data.label,
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
        var html = this.templates.config(config);
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

    start() {
        var config = this.getConfig();
        console.log(config);
    }
}