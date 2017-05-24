/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
'use strict';
require('spec/initialiseTests.js');
const BotError = require('lib/errors/BotError.js');
const bye = require('lib/commands/bye.js');
const notUnderstood = require('lib/commands/notUnderstood.js');
const proxyquire = require('proxyquire');
const { spy } = require('sinon');
const { unexpectedErrorMessage } = require('lib/chatbot/respondTo.js');

const sendMessage = spy();
const replyContext = {
  sendMessage
};

const subject = proxyquire('lib/chatbot/respondTo.js', {
  'lib/persistence/getState.js': () => ({
    user: {
      name: 'Alice'
    },
    contexts: []
  })
});

const errorMessage = 'test error msg';
const errorSubject = proxyquire('lib/chatbot/respondTo.js', {
  'lib/persistence/getState.js': () => {
    throw new Error(errorMessage);
  }
});
const botErrorSubject = proxyquire('lib/chatbot/respondTo.js', {
  'lib/persistence/getState.js': () => {
    throw new BotError(errorMessage);
  }
});

describe('respondTo - ', () => {
  beforeEach(() => {
    sendMessage.reset();
  });
  it('replies to gibberish with Not Understood message', async () => {
    await subject(replyContext, 'xyzjkl');
    sendMessage.calledWithExactly(notUnderstood.content).should.be.true;
  });

  it('replies to bye with Bye message', async () => {
    await subject(replyContext, 'bye');
    sendMessage.calledWithExactly(bye.content).should.be.true;
  });

  it('handles an unexpected Error by displaying the Unexpected Error message', async () => {
    await errorSubject(replyContext, 'anything');
    sendMessage.calledWithExactly(unexpectedErrorMessage).should.be.true;
  });

  it('handles a BotError by displaying the BotError\'s message', async () => {
    await botErrorSubject(replyContext, 'anything');
    sendMessage.calledWithExactly(errorMessage).should.be.true;
  });
});
