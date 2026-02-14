# cferndp Landing

Static marketing site for cferndp.com served by nginx inside Docker. The container no longer publishes host ports directly; instead it exposes port 8080 on the shared Docker network `caddy_net`, where the external Caddy reverse proxy terminates TLS and routes traffic.

## Prerequisites

1. Caddy (running elsewhere) configured to proxy `cferndp.com` to `landing-app:8080` on the `caddy_net` network. Example snippet:
   ```caddyfile
   cferndp.com {
       reverse_proxy landing-app:8080
   }
   ```
2. Docker network (create once):
   ```bash
   docker network create caddy_net
   ```

## Run locally

```bash
# from repo root
docker-compose up -d
```

The container joins `caddy_net`, exposes port 8080, and serves the contents of `html/`. Caddy handles HTTPS and any future subdomains; adding another app only requires joining that network and adding a proxy block in the Caddyfile.

## Deployment notes

- Volume mounts are read-only to prevent accidental writes inside the container.
- If you update the landing assets, re-run `docker-compose up -d --force-recreate` to refresh nginx.
- Tear down with `docker-compose down` (container leaves `caddy_net` but the external network persists for other services).
