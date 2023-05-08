## NPM Install
```bash
$ npm i
$ npm i -D
```

## NPM Run
```bash
$ npm start
# OR DEV MODE
$ npm run start:dev
```

## Environment configuration
`.env`
```
JWT_SECRET_KEY=SECRET
EMAIL_HOST=EMAIL_HOST
EMAIL_USER=EMAIL_USER
EMAIL_PASSWORD=EMAIL_PASSWORD
BASE_HOSTNAME=BASE_HOSTNAME
BASE_PORT=BASE_PORT
BASE_URL=BASE_URL
DATABASE_URL=DATABASE_URL
NODE_ENV=DEVELOPMENT
# OR
NODE_ENV=PRODUCTION
```

## Smtp Service for testing
To perform testing in development mode (NODE_ENV=DEVELOPMENT) you can use the [`Ethereal smtp service`](https://ethereal.email/), a fake smtp service aimed at testing, in which messages are never delivered. The messages will be displayed in the terminal in the form: `Preview URL: <URL>`.

## Construction the fetch api
```html
const response = fetch(URL, {
    method: "POST", // GET, POST, etc
    credentials: "include", // for include cookie (access_token)
    body: JSON.stringify(DATA)
})
response.json()
```