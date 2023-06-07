## Construction the fetch api

```JavaScript
const response = fetch(URL, {
    method: "POST", // GET, POST, etc
    credentials: "include", // for include cookie (access_token)
    body: JSON.stringify(DATA)
})
response.json()
```