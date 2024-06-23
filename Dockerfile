FROM node:18-slim as build

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@8.7.1
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY pnpm-lock.yaml ./

# If you are building your code for production
# RUN npm ci --omit=dev
RUN pnpm install

COPY . .

RUN pnpm build

FROM node:18-slim

WORKDIR /usr/src/app

COPY --from=build /usr/src/app /usr/src/app

EXPOSE 3000

CMD ["npm","start"]



