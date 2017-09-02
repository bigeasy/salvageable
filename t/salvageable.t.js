require('proof')(1, prove)

function prove (okay) {
    var salvagable = require('..')
    okay(salvagable, 'require')
}
