## Architecture
- `app/`
    - `src/`
        - [Overview - Client side](#overview---client-side)
        - `assets/`
            - `images/`
            - `styles/`
        - `components/`
            - `[ComponentName]`
                - `index.js`
                - `style.module.scss`
        - `dist/`
            - `bundle.min.js`
        - `pages/`
            - `[PageName]`
                - `index.js`
                - `style.module.scss`
        - `scripts/`
            - `app.js`
        - `services/`
        - `utils/`
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