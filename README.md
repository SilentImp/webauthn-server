# Installation

Install dependencies and setup tunnel:

```
npm ci
npm install -g localtunnel
lt --port 3000
```

Copy tunnel https domain and replace HOST in `public/javascript/config.js` on line 12 and `server.js` on line 1. Then start the server.

```
node ./server.js
```

Now you can open tunnel uri in the browser.

> Only HTTPS is supported
