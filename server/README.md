## NPM Install
```bash
$ npm i dotenv
$ npm i sqlite3
$ npm i module-alias

$ npm i -D @types/node
$ npm i -D nodemon
$ npm i -D ts-node
$ npm i -D typescript
$ npm i -D tsconfig-paths
# OR
$ npm i
$ npm i -D
```

## NPM Run
```bash
$ npm run start:dev
```

## Environment configuration
`.env`
```
DATABASE_URL=DATABASE_URL
PORT=PORT
HOSTNAME=HOSTNAME
```

## Files configuration
`nodemon.json`
```json
{
    "watch": ["./src"],
    "ext": ".ts,.js",
    "ignore": [],
    "exec": "tsc & npx ts-node ./src/Api/index.ts"
}
```
`tsconfig.json`
```json
{
    "ts-node": {
        "require": ["tsconfig-paths/register"]
    },
    "compilerOptions": {
        "target": "es6",
        "module": "commonjs",
        "lib": ["es6"],
        "allowJs": true,
        "outDir": "dist",
        "rootDir": "src",
        "strict": true,
        "noImplicitAny": true,
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "sourceMap": true,
        "baseUrl": ".", 
        "paths": {
            "@Application/*": ["./src/Application/*"],
            "@Domain/*": ["./src/Domain/*"],
            "@Infrastructure/*": ["./src/Infrastructure/*"],
            "@Api/*": ["./src/Api/*"]
        }
    }
}
```

## TODO: Connection and DBSet
## TODO: Exceptions