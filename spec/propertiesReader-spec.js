'use strict';

var loader = require('../src/propertiesReader.js');

describe('Properties loader', function () {

  describe ('Key and value can be separated by', function () {
    it ('equals sign', function () {
      let source = 'key=value';
      expect(loader(source)).toEqual({ key: 'value' })
    });

    it ('colon sign', function () {
      let source = 'key:value';
      expect(loader(source)).toEqual({ key: 'value' })
    });
  });

  describe ('Multiple entries', function () {
    it ('should be separated by \\n symbol', function () {
      let source = 'key1=value1\nkey2=value2';
      expect(loader(source)).toEqual({ key1: 'value1', key2: 'value2' });
    });

    /* Ignored because this behavior does not supported by 'properties' package */
    xit ('should be separated by \\r symbol', function () {
      let source = 'key1=value1\rkey2=value2';
      expect(loader(source)).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it ('should be separated by \\r\\n symbol sequence', function () {
      let source = 'key1=value1\r\nkey2=value2';
      expect(loader(source)).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it ('should be separated by \\n\\r symbol sequence', function () {
      let source = 'key1=value1\n\rkey2=value2';
      expect(loader(source)).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it ('should ignore empty lines', function () {
      let source = '\n\nkey1=value1\n\n\n\n\n\nkey2=value2\n\n\n';
      expect(loader(source)).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it ('should ignore lines that contain only whitespaces', function () {
      let source = '\t\t\t\t\nkey1=value1\n\f\f\f\f\f\f\f\n     \nkey2=value2\n\t\f \n\n';
      expect(loader(source)).toEqual({ key1: 'value1', key2: 'value2' });
    });
  });

  describe ('Whitespaces', function () {
    it ('before key should be ignored', function () {
      let source = '  \t  \f     key=value';
      expect(loader(source)).toEqual({ key: 'value' });
    });

    it ('between key and separator should be ignored', function () {
      let source = 'key \f  \t     =value';
      expect(loader(source)).toEqual({ key: 'value' });
    });

    it ('between separator and value should be ignored', function () {
      let source = 'key=  \f\t    value';
      expect(loader(source)).toEqual({ key: 'value' });
    });

    it ('between value and the end of the line should be considered part of value', function () {
      let source = 'key=value \t     \t \f ';
      expect(loader(source)).toEqual({ key: 'value \t     \t \f ' });
    });
  });

  describe ('Comments', function () {
    it ('should start with "!" symbol and be ignored', function () {
      let source = '!key=value';
      expect(loader(source)).toEqual({});
    });

    it('should start with "#" symbol and be ignored', function () {
      let source = '#key=value';
      expect(loader(source)).toEqual({});
    });

    it ('should ignore whitespaces before "#" symbol where comment starts', function () {
      let source = ' \t   \f \f\f \t    #key=value';
      expect(loader(source)).toEqual({});
    });

    it ('should ignore whitespaces before "!" symbol where comment starts', function () {
      let source = '     !key=value';
      expect(loader(source)).toEqual({});
    });
  });

  describe ('Multiline keys', function () {
    it ('can continue after "\\" symbol on a new line', function () {
      let source = 'key\\\nline2=value';
      expect(loader(source)).toEqual({ keyline2: 'value' });
    });

    /* Ignored because this behavior does not supported by 'properties' package */
    xit ('should include all whitespaces between "\\" symbol and end of the line', function () {
      let source = 'key  \\\nline2=value';
      expect(loader(source)).toEqual({ 'key  line2': 'value' });
    });

    it ('should ignore all whitespaces between beginning of new line first character on it', function () {
      let source = 'key\\\n   line2=value';
      expect(loader(source)).toEqual({ keyline2: 'value' });
    });
  });

  describe ('Multiline property values', function () {
    it ('can continue after "\\" symbol on a new line', function () {
      let source = 'key=value1,\\\nvalue2,\\\nvalue3';
      expect(loader(source)).toEqual({ key: 'value1,value2,value3' });
    });

    it ('should include all whitespaces between "\\" symbol and end of the line', function () {
      let source = 'key=value1,   \\\nvalue2';
      expect(loader(source)).toEqual({ key: 'value1,   value2' });
    });

    it ('should ignore all whitespaces between beginning of new line first character on it', function () {
      let source = 'key=value1,\\\n       value2';
      expect(loader(source)).toEqual({ key: 'value1,value2' });
    });
  });

  describe ('Escaped symbols', function () {
    it ('should be able to add \\n symbol and it should be interpreted correctly', function () {
      let source = 'key=value1\\nvalue2';
      expect(loader(source)).toEqual({ key: 'value1\nvalue2' });
    });

    it ('should be able to add \\r symbol and it should be interpreted correctly', function () {
      let source = 'key=value1\\rvalue2';
      expect(loader(source)).toEqual({ key: 'value1\rvalue2' });
    });

    it ('should be able to add \\t symbol and it should be interpreted correctly', function () {
      let source = 'key=value1\\tvalue2';
      expect(loader(source)).toEqual({ key: 'value1\tvalue2' });
    });

    it ('should be able to add \\ symbol and it should be interpreted correctly', function () {
      let source = 'key=value1\\\\value2';
      expect(loader(source)).toEqual({ key: 'value1\\value2' });
    });

    it ('should ignore backslash if invalid escaping is used', function () {
      let source = 'key=value\\z';
      expect(loader(source)).toEqual({ key: 'valuez' });
    });

    it ('should accept single and double quotes without escaping', function () {
      let source = 'key=\'value"';
      expect(loader(source)).toEqual({ key: '\'value"' });
    });
  });

  describe ('Unicode characters', function () {
    it ('should be entered in Java-way (\\uXXXX)', function () {
      let source = 'key=value1\\u000Avalue2';
      expect(loader(source)).toEqual({ key: 'value1\nvalue2' });
    });
  });

  describe ('Complex keys', function () {
    it ('if parts are separated by "." symbol should be considered as solid string', function () {
      let source = 'part1.part2.part3=value';
      expect(loader(source)).toEqual({ 'part1.part2.part3': 'value' });
    });

    it ('if parts are separated by escaped "=" symbol should be considered as solid string', function () {
      let source = 'part1\\=part2\\=part3=value';
      expect(loader(source)).toEqual({ 'part1=part2=part3': 'value' });
    });

    it ('if parts are separated by escaped ":" symbol should be considered as solid string', function () {
      let source = 'part1\\:part2\\:part3:value';
      expect(loader(source)).toEqual({ 'part1:part2:part3': 'value' });
    });
  });

  describe ('should contain empty value if no separator found on the string', function () {

    /* Ignored because this behavior does not supported by 'properties' package */
    xit ('in a simple case', function () {
      let source = 'key';
      expect(loader(source)).toEqual({ key: '' });
    });

    /* Ignored because this behavior does not supported by 'properties' package */
    xit ('with escaped separators', function () {
      let source = 'key\\:\\=value';
      expect(loader(source)).toEqual({'key:=value': '' });
    });
  });

});
