## NPM Install
```bash
$ npm i dotenv

$ npm i -D @types/node
$ npm i -D nodemon
$ npm i -D ts-node
$ npm i -D typescript
# OR
$ npm i
$ npm i -D
```

## NPM Run
```bash
$ npm start
```

## Environment configuration
`.env`
```
```

## Files configuration
`nodemon.json`
```json
{
    "watch": ["./"],
    "ext": ".ts,.js",
    "ignore": [],
    "exec": "npx ts-node index.ts"
}
```
`tsconfig.json`
```json
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "lib": ["es6"],
        "allowJs": true,
        "outDir": "build",
        "rootDir": "./",
        "strict": true,
        "noImplicitAny": true,
        "esModuleInterop": true,
        "resolveJsonModule": true
    }
}
```