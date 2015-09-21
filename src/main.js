var $ = require('jquery');
window.$ = window.jQuery = $;

import vis from 'vis';
import alertify from 'alertifyjs';

import Net from './net';
import Edge from './edge';
import Genetic from './genetic';

import UI from './ui';

function start() {
    var net = new Net([
        new Edge(0, 1, 1),
        new Edge(0, 2, 1),
        new Edge(0, 3, 1),

        new Edge(1, 0, 1),
        new Edge(1, 2, 1),
        new Edge(1, 3, 1),

        new Edge(2, 1, 1),
        new Edge(2, 0, 1),
        new Edge(2, 3, 1),

        new Edge(3, 1, 1),
        new Edge(3, 2, 1),
        new Edge(3, 0, 1)
    ], 4);

    var genetic = new Genetic(net, {
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
    });

    $(() => {
        var ui = new UI();
        ui.renderConfig({
            config: genetic.config
        });
    });

    for (var i = 0; i < 100; ++i)
        genetic.step();
}

start();


