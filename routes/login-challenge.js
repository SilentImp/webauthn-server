const nanoid = require('nanoid').nanoid;

module.exports = f2l => async(request, reply) => {
  const registrationOptions = await f2l.assertionOptions();
  const challengeString = btoa(String.fromCharCode.apply(null, new Uint8Array(registrationOptions.challenge)));
  request.session.set('challenge', challengeString);
  registrationOptions.challenge = challengeString;
  reply.type('application/json').send(registrationOptions);
};