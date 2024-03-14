ARG NODE_VERSION=20.3.0-bullseye-slim

FROM node:${NODE_VERSION}

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

RUN npm install bcrypt

COPY . .

ENV PORT=4000

ENV NODE_ENV=development

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]