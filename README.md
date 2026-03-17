# Second Piece

## Project Structure

```
second-piece/
├── .env                          # Local env vars (gitignored)
├── .env.example                  # Template for others
├── .gitignore
├── .prettierrc
├── docker-compose.yml            # PostgreSQL on port 25432
├── eslint.config.mjs
├── package.json                  # Yarn workspaces root
├── tsconfig.base.json
├── turbo.json
└── packages/
    ├── shared/
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── src/sharedConstants.ts
    ├── server/
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── knexfile.ts
    │   └── src/
    │       ├── index.ts           # Koa server on port 4000
    │       ├── db.ts              # Knex connection
    │       └── migrations/.gitkeep
    └── client/
        ├── package.json
        ├── tsconfig.json
        ├── vite.config.ts         # Dev server on port 3000, proxies /api to server
        ├── index.html
        └── src/
            ├── main.tsx           # React Query provider setup
            └── App.tsx            # Hello World with health check
```

## Getting Started

1. `corepack enable`
2. `yarn` to install dependencies
3. `cp .env.example .env` to create your environment file
4. `docker compose up -d` to start PostgreSQL
5. `yarn dev` to start both client (port 3000) and server (port 4000)
