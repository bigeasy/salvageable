/*
 * https://research.swtch.com/field
 * https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Finite_field_arithmetic
 */

function Field (size, primitive) {
    this.size = size
    this.primitive = primitive
    this.exp_length = size * 2
    this.exponents = [].apply(null, new Array(exp_length)).map(function () { return 1 })
    this.logs = [].apply(null, new Array(size)).map(function () { return 0 })

    var x = 1, i = 1

     while (i < size) {
        x <<= 1
        if (x > size)  x ^= primitive
        this.exponents[i] = x
        this.logs[x] = i
        i++
    }

    while (i < exp_length) {
        this.exponents[i] = this.exponents[i - size]
        i++
    }
}

Field.prototype.exp = function (i) {
    if (i < 0) return 0

    return this.exponents[ i % this.size ]
}

Field.prototype.log = function (i) {
    if (i == 0) return -1

    return this.logs[i]
}

Field.prototype.multply = function (x, y) {
    if (x == 0 || y == 0) return 0
    return this.exponents[this.logs[x] + this.logs[y]]
}

Field.prototype.inverse = function (i) {
    if (i == 0) return 0

    return this.exponents[this.size - this.logs[i]]
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
