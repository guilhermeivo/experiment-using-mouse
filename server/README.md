## NPM Install
```bash
$ npm i dotenv
$ npm i sqlite3

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
$ npm run start:nodemon
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
    "exec": "npx ts-node ./Api/index.ts"
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
        "outDir": "build",
        "rootDir": "./",
        "strict": true,
        "noImplicitAny": true,
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "sourceMap": true,
        "baseUrl": "./", 
        "paths": {
            "@Application/*": ["./Application/*"],
            "@Domain/*": ["./Domain/*"],
            "@Infrastructure/*": ["Infrastructure/*"],
            "@Api/*": ["./Api/*"]
        }
    }
}
```

## Initial migrations
```bash
# 01_create_mazes
$ npx ts-node ./Infrastructure/Persistence/migrations/01_create_mazes.ts
```