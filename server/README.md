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

## Authentication
`Passwordless otc-based` is used, where a one-time use code (oct) is sent by emai for the customer to login. There is no need for the user to remember the password and increasing security.

<h1 align="center">
    <img alt="passwordless-flow" src="../.github/passwordless-flow.png" />
</h1>

### Passwordless endpoints

#### POST auth/login
Used to initiate the passwordless authentication process by sending a one-time code via email.
The call must be made as follows:

```json
POST https://{ domain }/auth/login
Content-Type: application/json
{
  "connection": "email",
  "email": "{ email }", //set for connection=email
  "send": "code",
}
```

#### POST auth/authenticate
Used to exchange the otc for authentication tokens, after the user inserts the code, it makes the call with the following parameters:

```json
POST https://{ domain }/auth/authenticate
Content-Type: application/json
{
  "email": "{ email }",
  "otp": "CODE",
  "realm": "email",
}
```

After the successful call, the response will have the following properties:

```json
HTTP/2.0 200 OK
Content-Type: application/json
Set-Cookie: access_token={ accessToken }; Path=/; HttpOnly; SameSite=None; Secure
{
    "auth": true,
    "token_type": "jwt",
    "expires_in": 86400 // 24 hours
}
```

## Smtp Service for testing
To perform testing in development mode (NODE_ENV=DEVELOPMENT) you can use the [`Ethereal smtp service`](https://ethereal.email/), a fake smtp service aimed at testing, in which messages are never delivered. The messages will be displayed in the terminal in the form: `Preview URL: <URL>`.

## Construction the fetch api
```js
const response = fetch(URL, {
    method: "POST", // GET, POST, etc
    credentials: "include", // for include cookie (access_token)
    body: JSON.stringify(DATA)
})
response.json()
```