'use strict';

var loader = require('../src/index.js');

describe('java-properties-flat-loader', function () {

  /* proof of concept test */
  it ('should return text of JS module', function () {
    let source         = 'key1.part1.subpart1: value1\nkey1.part1.subpart2 = value2\nkey1.part2 = val\\\n   ue3',
        expectedResult = 'module.exports = {"key1.part1.subpart1":"value1","key1.part1.subpart2":"value2","key1.part2":"value3"};';

    expect(loader(source)).toBe(expectedResult);
  })
});
