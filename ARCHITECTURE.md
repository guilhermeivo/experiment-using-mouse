## Architecture
- `app/`
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
        - `Api/`
            - `Controllers/`
                - `[ControllerName].ts`
            - `routes.ts`
            - `index.ts`
        - `Application/`
            - `[CQSName]/`
                - `commands/`
                - `queries/`
        - `Domain/`
            - `Entities/`
                - `[EntitiesName].ts`
        - `Infrastructure/`
            - `Persistence/`
                - `migrations/`
                - `connection.ts`

## Overview - Client side

## Overview - Server side
