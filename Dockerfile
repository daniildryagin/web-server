FROM node:16.13-alpine
WORKDIR /web-server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "dist/main"]