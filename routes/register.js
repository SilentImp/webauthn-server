module.exports = (f2l, HOST) => async(request, reply) => {
  const challenge = request.session.get('challenge');
  // Удаляем челендж
  // В реальном приложении нужно контролировать его время жизни
  request.session.set('challenge', undefined); 

  const assertionExpectations = {
    challenge,
    origin: `https://${HOST}`,
    factor: "either"
  };
  const clientAttestationResponse = JSON.parse(request.body);
  clientAttestationResponse.rawId = Buffer.from(clientAttestationResponse.id, 'base64').buffer;

  const result = await f2l.attestationResult(clientAttestationResponse, assertionExpectations);
  const { authnrData } = result;

  // Cохраняем в базе данных в связке с пользователем
  // Cессия использована для упрощения примера
  request.session.set('counter', authnrData.get("counter"));
  request.session.set('credentialId', btoa(String.fromCharCode.apply(null, new Uint8Array(authnrData.get("credId")))));
  request.session.set('publicKey', authnrData.get("credentialPublicKeyPem"));

  reply.type('application/json').code(200).send({
    credentialId: btoa(String.fromCharCode.apply(null, new Uint8Array(authnrData.get("credId")))),
  });
};