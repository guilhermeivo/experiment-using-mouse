## Validators

```bash
npm i @experiment-using-mouse/validators
```

#### How to work?

```JavaScript
import validators from '@experiment-using-mouse/validators'

const email = 'test@test.com'
const result = validators.isEmail(email)
console.log(result)
// Output should be: true
```