const validateLoginCredential = async credential => {
  const authenticator = {
    id: credential.id,
    type: credential.type,
    response: {
      authenticatorData: btoa(String.fromCharCode.apply(null, new Uint8Array(credential.response.authenticatorData))),
      clientDataJSON: btoa(String.fromCharCode.apply(null, new Uint8Array(credential.response.clientDataJSON))),
      signature: btoa(String.fromCharCode.apply(null, new Uint8Array(credential.response.signature))),
    },
    userHandle: null,
  };

  await fetch(`https://${window.HOST}/login`, {
    method: "POST",
    body: JSON.stringify(authenticator),
  });

  alert('User authenticated');
};

const signInHandler = async event => {
  const response = await fetch(`https://${window.HOST}/challenge/login`, {
    method: 'POST'
  });
  const credentialRequestOptions = await response.json();
  
  credentialRequestOptions.challenge = Uint8Array.from(atob(credentialRequestOptions.challenge), c => c.charCodeAt(0)).buffer;

  const credentialId = localStorage.getItem('credentialId');
  credentialRequestOptions.allowCredentials = [{ type: "public-key", id: Uint8Array.from(atob(credentialId), c => c.charCodeAt(0)).buffer }];

  const credential = await navigator.credentials.get({
    publicKey: credentialRequestOptions
  });

  await validateLoginCredential(credential);
};

(async() => {
  if ('PublicKeyCredential' in window) {
    const button = document.getElementById('sign-in');
    button.addEventListener('click', signInHandler);
  }
})();