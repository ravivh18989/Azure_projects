/* eslint-env mocha */
require('../initialisedChai.js');
const moment = require('moment');
const sendMessage = require('../../lib/sms/sender.js');

const phone = '447771845842';

xdescribe('Sender tests', () => {
  it('basic send works', () => {
    const now = moment();
    const msg = `Test message sent at ${now.hour()}:${now.minute()}:${now.second()}`;
    return sendMessage(phone, msg).should.eventually.equal(true);
  });
});