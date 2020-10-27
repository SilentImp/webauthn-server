module.exports = (f2l, HOST) => async(request, reply) => {
  const challenge = request.session.get('challenge');
  request.session.set('challenge', undefined);

  const assertionExpectations = {
    challenge,
    origin: `https://${HOST}`,
    factor: "either",
    publicKey: request.session.get("publicKey"),
    prevCounter: request.session.get("counter"),
    userHandle: null,
  };

  const clientAssertionResponse = JSON.parse(request.body);
  clientAssertionResponse.rawId = Buffer.from(clientAssertionResponse.id, 'base64').buffer;

  const assertionResult = await f2l.assertionResult(clientAssertionResponse, assertionExpectations);
  reply.code(204);
}