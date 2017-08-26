'use strict';

const assert = this.chai ? this.chai.assert : require('assert');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function delay() {
    let a = [];
    let rnd = getRandomInt(5, 11) * 1000000;
    
    for (let x = 0; x < rnd; x++) { a.push(x); }
}

describe('Array', function() {
    describe('#indexOf()', function() {

        for (var i = 0; i < 15; i++) {
            if (i % 5 === 4) {
                it(`(${i}) should fail`, function() {
                    delay();
                    assert.equal(3, [1, 2, 3].indexOf(44));
                });
            } else {
                it(`(${i}) should return -1 when the value is not present`, function() {
                    delay();
                    assert.equal(-1, [1, 2, 3].indexOf(4));
                });
            }
        }
    });
});
