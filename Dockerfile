# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/init-db.js ./init-db.js
COPY --from=builder /app/app ./app
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/jsconfig.json ./jsconfig.json
COPY --from=builder /app/next.config.cjs ./next.config.cjs
COPY --from=builder /app/tailwind.config.cjs ./tailwind.config.cjs
COPY --from=builder /app/postcss.config.cjs ./postcss.config.cjs

EXPOSE 3000

CMD ["node", "server.js"]
