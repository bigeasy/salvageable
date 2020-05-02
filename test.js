'use strict';

const Field = require('./ff.js')

let field = new Field(256, 0x012D)

let i = field.exponents.length
let k = field.logs.length

console.log('exponents')
for (var b = 0; b < i;b++) {
    var next

    while (next = field.exponents.pop()) {
        log(next)
    }
}
console.log('logs')
for (var b = 0; b < k;b++) {

    while (next = field.logs.pop()) {
        log(next)
    }
}

function log(n, x) {
    var x = 4
    while (x) {
        let index = x * 8
        var mask = (1 << ((index + 8) - index)) - 1
        console.log((n >> index) & mask)
        x--
    }
}
