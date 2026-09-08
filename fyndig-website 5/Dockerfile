# ---------------------------------------------------------------------------
# fyndig website
#
# Multi-stage: install once, build once, ship only the standalone server.
# The final image is Node plus the compiled site — no source, no dev tooling.
#
# IMPORTANT: NEXT_PUBLIC_API_URL is baked in at BUILD time. It must be passed
# here, not set at runtime, or the browser bundle will not know where the API
# is. Changing it means rebuilding.
#
#   docker build --build-arg NEXT_PUBLIC_API_URL=https://fyndig-api.fly.dev -t fyndig-web .
#   fly deploy --build-arg NEXT_PUBLIC_API_URL=https://fyndig-api.fly.dev
# ---------------------------------------------------------------------------

# --- deps: install with the lockfile, cached until package.json changes ------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# `npm ci` when there is a lockfile (reproducible), `npm install` when there
# is not — so a fresh clone still builds.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# --- build ------------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

ARG NEXT_PUBLIC_API_URL=""
ARG NEXT_PUBLIC_SITE_URL=""
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- runner -----------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 10001 -S nextjs && adduser -u 10001 -S -G nextjs nextjs

# The standalone output carries its own minimal node_modules. Static assets and
# /public are not included in it, so they are copied in separately.
COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nextjs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
