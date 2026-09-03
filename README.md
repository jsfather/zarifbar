# Zarifbar

React/Vite frontend with an Express API, SQLite database, and local media uploads.

## Local development

Requires Node.js 22 or newer.

```bash
npm ci
cp .env.example .env
npm run dev
```

The development server listens on `http://localhost:3000` by default. The database and uploaded files are stored in the project root unless `DATA_DIR` is set.

## Deploy on Dokploy

This repository includes a production multi-stage `Dockerfile` and a Dokploy-ready `docker-compose.yml`.

### 1. Create the Compose service

1. Push this repository to GitHub, GitLab, Bitbucket, or another Git provider Dokploy can access.
2. In Dokploy, create a project and add a **Docker Compose** service.
3. Select the repository and branch.
4. Set **Compose Path** to `./docker-compose.yml`.

### 2. Configure secrets

Add these values in the service's **Environment** tab:

```dotenv
JWT_SECRET=replace-with-at-least-32-random-characters
ADMIN_DEFAULT_PASSWORD=replace-with-a-secure-password-of-at-least-12-characters
WRITER_DEFAULT_PASSWORD=replace-with-a-secure-password-of-at-least-12-characters
JWT_EXPIRES_IN=7d
```

Generate a JWT secret locally with:

```bash
openssl rand -base64 48
```

On the first production startup, the configured account passwords replace the known development passwords if those defaults are still present. Changing these environment values later does not overwrite passwords that were already changed through the application.

### 3. Deploy and attach the domain

1. Deploy the Compose service.
2. In **Domains**, add the public domain and select service **app** with container port **3000**.
3. Enable HTTPS in Dokploy.
4. Confirm `https://your-domain.example/health` returns `{"status":"ok"}`.

Do not add a host port mapping: Dokploy routes the domain to the exposed container port through Traefik.

### Persistent data and backups

The Compose service stores both `zarifbar.db` and uploaded media in the named volume `zarifbar_data` mounted at `/app/data`. Dokploy preserves this volume across deployments.

The first volume is initialized from the database and uploads committed in this repository. Later image deployments never overwrite the live volume. Configure a **Volume Backup** in Dokploy for `zarifbar_data`; SQLite and uploaded files must be backed up together.

Avoid running more than one app replica while SQLite is in use. For horizontal scaling, migrate the database and uploads to shared production services first.

## Production commands

```bash
npm run lint
npm run build
npm start
```

When running without Compose, set `NODE_ENV=production`, all three required secrets above, and `DATA_DIR` to a persistent writable directory.
