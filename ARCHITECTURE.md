## Architecture
- `app/`
    - `dist/`
    - `public/`
    - `src/`
        - [Overview - Client side](#overview---client-side)
        - `assets/`
            - `images/`
            - `styles/`
        - `Common/`
        - `Components/`
            - `[ComponentName]`
                - `index.js`
                - `style.module.scss`
        - `Pages/`
            - `[PageName]`
                - `index.js`
                - `style.module.scss`
        - `Services/`
        - `app.js`
    - `index.html`
- `server/`
    - [Overview - Server Side](#overview---server-side)
    - `dist/`
    - `src/`
        - `controllers/`
            - `[controllerName].ts`
        - `db/`
            - `migrations/`
            - `connection.ts`
        - `entities/`
            - `[entityName].ts`
        - `middleware/`
            - `authGuard.ts`
        - `repository/`
            - `[repositoryName].ts`
        - `index.ts`
    - `test/`

## Overview - Client side

## Overview - Server side
