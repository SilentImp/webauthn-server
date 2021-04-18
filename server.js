const fs = require('fs');
const path = require('path');
const { Fido2Lib } = require("fido2-library");
const fastify = require('fastify')({
  logger: true
});

const HOST = "light-hound-42.loca.lt";

const f2l = new Fido2Lib({
  rpId: HOST,
  attestation: "none",
  authenticatorUserVerification: "discouraged",
});

fastify.register(require('fastify-multipart'), {
  addToBody: true,
});
fastify.register(require('fastify-formbody'));
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
})
fastify.register(require('fastify-secure-session'), {
  cookieName: 'session_id',
  secret: fs.readFileSync(path.join(__dirname, 'secret-key')),
  cookie: {
    path: '/'
  }
});

fastify.post('/challenge/register', require('./routes/register-challenge.js')(f2l));
fastify.post('/challenge/login', require('./routes/login-challenge.js')(f2l));
fastify.post('/register', require('./routes/register.js')(f2l, HOST));
fastify.post('/login', require('./routes/login.js')(f2l, HOST));

fastify.listen(3000, (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});