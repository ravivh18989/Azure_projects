/* eslint-env mocha */
'use strict';
require('../initialiseTests.js');
const Context = require('../../lib/contexts/context.js');

const fooCommand = () => 'foo';
const barCommand = () => 'bar';

describe('Context', () => {
  let subject;

  beforeEach(() => {
    subject = new Context('test subject');
    subject.addCommand('foo', fooCommand);
    subject.addCommand('bar', barCommand);
  });

  it('match works with exact match', () => {
    subject.match('foo').command.should.equal(fooCommand);
    subject.match('bar').command.should.equal(barCommand);
  });

  it('match works with inexact match', () => {
    subject.match('fop').command.should.equal(fooCommand);
  });
});
