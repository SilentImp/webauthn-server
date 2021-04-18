const nanoid = require('nanoid').nanoid;

module.exports = f2l => async(request, reply) => {
  console.log(`
  
  
  
  `)
  console.log(request.body);
  console.log(`
  
  
  
  `)
  const {email, name} = JSON.parse(request.body);
  const registrationOptions = await f2l.attestationOptions();
  const challengeString = btoa(String.fromCharCode.apply(null, new Uint8Array(registrationOptions.challenge)));

  // Уникальный идентификатор пользователя, например хеш его id в базе
  const id = nanoid();

  request.session.set('challenge', challengeString);
  request.session.set('id', id);
  request.session.set('name', email);
  request.session.set('displayName', name);

  registrationOptions.challenge = challengeString;
  registrationOptions.user = {
    id,
    name: email,
    displayName: name,
  };    
  reply.type('application/json').send(registrationOptions);
};