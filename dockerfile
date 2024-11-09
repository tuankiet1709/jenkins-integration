FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY app.ts ./

RUN npm run build

COPY . .

EXPOSE 3080

CMD ["npm", "run", "start:prod"]