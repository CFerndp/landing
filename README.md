# cferndp Landing Infrastructure

This repository now contains two independent Docker Compose projects:

- `infra/caddy` – edge reverse proxy (Caddy) that terminates TLS for `cferndp.com` and routes traffic to subdomains/containers on the shared Docker network `caddy_net`.
- `apps/landing` – the static landing page (nginx) that serves the HTML bundle and exposes itself on the internal network so Caddy can proxy it.

## First-time setup

```bash
# Create the shared Docker network once
docker network create caddy_net

# Bring up the landing app (serves on caddy_net only)
cd apps/landing
docker-compose up -d

# Bring up the Caddy edge proxy (listens on :80 and :443)
cd ../../infra/caddy
docker-compose up -d
```

Caddy is configured to route `https://cferndp.com` to the `landing-app` container. To add new subdomains in the future, duplicate the example block in `infra/caddy/Caddyfile` and point it to the corresponding service on `caddy_net`.

## Development

The landing HTML lives in `apps/landing/html`. Update it normally, run `docker-compose up -d --build` in `apps/landing` to refresh, and Caddy will serve the new assets immediately.

Remember that all code changes must go through a pull request and add **@CFerndp** as reviewer.
