const validateRegistrationCredential = async credential => {
  const attestation = {
    id: credential.id,
    response: {
      clientDataJSON: btoa(String.fromCharCode.apply(null, new Uint8Array(credential.response.clientDataJSON))),
      attestationObject: btoa(String.fromCharCode.apply(null, new Uint8Array(credential.response.attestationObject))),
    },
    type: credential.type,
  };

  response = await fetch(`https://${window.HOST}/register`, {
    method: "POST",
    body: JSON.stringify(attestation),
  });

  const attestationObject = await response.json();
  
  // Сохраним credentialId в локал-сторэдж или куку,
  // Он нужен для логина
  localStorage.setItem('credentialId', attestationObject.credentialId);
};

const submitHandler = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);

  // Регистрируем пользователя в системе
  // Вместе с ответом присылаем challenge для ключа и данные о пользователе
  const response = await fetch(`https://${window.HOST}/challenge/register`, {
    method: 'POST',
    body: JSON.stringify({
      name: data.get('name'),
      email: data.get('email'),
      'new-password': data.get('new-password'),
    }),
  });
  const publicKeyCredentialCreationOptions = await response.json();

  publicKeyCredentialCreationOptions.user.id = Uint8Array.from(publicKeyCredentialCreationOptions.user.id, c => c.charCodeAt(0)).buffer;
  publicKeyCredentialCreationOptions.challenge = Uint8Array.from(atob(publicKeyCredentialCreationOptions.challenge), c => c.charCodeAt(0)).buffer;

  const credential = await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions
  });
  await validateRegistrationCredential(credential);
  form.setAttribute('hidden', true);
  document.getElementById('sign-in').removeAttribute('hidden');
};


(async() => {
  if ('PublicKeyCredential' in window) {
    const form = document.querySelector('form');
    const button = form.querySelector('button');
    form.addEventListener('submit', submitHandler);
  }
})();