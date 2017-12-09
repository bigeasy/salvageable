'use strict';
/*
 * https://research.swtch.com/field
 * https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Finite_field_arithmetic
 */

function Field (size, primitive) {
    this.size = size
    this.primitive = primitive
    let exp_length = size * 2
    /*
    this.exponents = Array.apply(null, new Array(exp_length)).map(function () { return 1 })
    // need to use polyfill
    this.logs = Array.apply(null, new Array(size)).map(function () { return 0 })

    var x = 1, i = 1, k = 0

     while (i < size) {
        x <<= 1
        if (x > size)  x ^= primitive
        this.exponents[i] = x
        this.logs[x] = i //identity double as log
        i++

        if (k == 16) {
            k = 0
            i++
        } else {
            k++
        }
    }

    while (i < exp_length) {
        this.exponents[i] = this.exponents[i - size]
        i++
    }
    */

    fill.bind(this)();

    function fill() {
        this.exponents = this.polyfill(exp_length)
        this.logs = this.polyfill(size)

        var x = 1, i = 1, k = 0, index

        while (i < size) {
            x <<= 1
            if (x > size) x ^= primitive
            index = this.index(i)
            this.exponents[index[0] << index[1]] = x
            this.logs[index[0] << index[1]] = x
            if (k == 16) {
                k = 0
                i++
            } else {
                k++
            }
        }

        while (i < exp_length) {
            index = this.index(i)
            this.exponents[index[0] << index[1]] =
                this.exponents[this.index(i - size)]
            i++
        }
    }
}

Field.prototype.index = function (index) {
    // using index and this.size, figure out which integer
    // has our value and at what position
    
    let result = [index / 32, 0], mod = this.size % index

    while (mod--) result[0]++
    
    return result
}

Field.prototype.exp = function (i) {
    if (i < 0) return 0

    //return this.exponents[ i % this.size ]
 
    let index = this.index(i)
    return this.exponents[ index[0] << index[1] % this.size ]
}

Field.prototype.log = function (i) {
    if (i == 0) return -1

    let index = this.index(i)
    return this.exponents[ index[0] << index[1] ]
}

// instead of x/y, we can use x · 1/y.
Field.prototype.multply = function (x, y) {
    if (x == 0 || y == 0) return 0
    return this.exponents[this.logs[x] + this.logs[y]]
}

Field.prototype.inverse = function (i) {
    if (i == 0) return 0

    return this.exponents[this.size - this.logs[i]]
}

Field.prototype.generatePoly = function(sym_length) {
    // takes # of error-correcting symbols
    // returns default generator poly for given field

    var poly = [ 1 ]

    for (var i = 0; i < sym_length; i++) {
        poly = this.multiplyPoly(poly, [1, this.exponents[i]])
    }

    return poly
}

Field.prototype.scalePoly = function (p, x) {
    var r = []
    for (var i = 0; i < p.length; i++)
        r.push(this.multiply(p[i], x))

    return r
}

Field.prototype.addPoly = function (p, q) {
    var pLen = p.length,
        qLen = q.length,
        maxLen = Math.max(pLen, qLen),
        r = [].apply(null, new Array(maxLen)).map(function () { return 0 }),
        rLen = r.length

    for (var i = 0; i < pLen; i++) {
        r[i + rLen - pLen] = p[i]
    }

    for (var i = 0; i < qLen; i++) {
        r[i + rLen - qLen] ^= q[i]
    }

    return r
}

Field.prototype.multiplyPoly = function (p, q) {
    assert(p.length)
    assert(q.length)

    var r, arraySize = p.length + q.length - 1;

    r = [].apply(null, new Array(arraySize)).map(function () { return 0 })

    for (var j = 0; j < q.length; j++) {
        for (var i = 0; i < p.length; i++) {
            r[i + j] ^= this.multiply(p[i], q[j])
        }
    }

    return r
}

Field.prototype.polyEval = function (p, x) {
    var y = p[0]

    for (var i = 1; i < p.length; i++)
        y = this.multiply(y, x) ^ p[i]

    return y
}

Field.prototype.polyfill = function(x) {

    if (x <= 4) {
        return [ 0 ]
    }

    var arr = [], size = x / 4;

    while (size--) { arr.push(0) }

    size = x % 32;

    while (size--) { arr.push(0) }

    return arr
}

module.exports = Field
