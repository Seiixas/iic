FROM node:20.12.2-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

RUN npm run build
RUN npm prune --production

EXPOSE 3000

CMD ["node", "dist/http/server.js"]