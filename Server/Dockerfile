FROM node:18-alpine
WORKDIR /app
COPY ./package*.json /
RUN npm install -f
COPY . .
CMD npx ts-node src/index.ts