FROM node:20.10.0-alpine AS install
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM install AS builder
COPY . .
RUN npm install && npm run build

FROM node:20-alpine AS final
WORKDIR /app
COPY --from=install ./app/node_modules ./node_modules
COPY --from=builder ./app/package*.json ./
COPY --from=builder ./app/app.js ./app.js

EXPOSE 3080
CMD npm run start:prod
