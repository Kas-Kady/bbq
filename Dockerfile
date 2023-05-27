# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /kas-kady-bbq-app

ADD package.json package-lock.json .npmrc postinstall.js ./
RUN npm install --production=false


# Setup production node_modules
FROM base as production-deps

WORKDIR /kas-kady-bbq-app

COPY --from=deps /kas-kady-bbq-app/node_modules /kas-kady-bbq-app/node_modules
ADD package.json package-lock.json .npmrc ./
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /kas-kady-bbq-app

COPY --from=deps /kas-kady-bbq-app/node_modules /kas-kady-bbq-app/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /kas-kady-bbq-app

COPY --from=production-deps /kas-kady-bbq-app/node_modules /kas-kady-bbq-app/node_modules
COPY --from=build /kas-kady-bbq-app/node_modules/.prisma /kas-kady-bbq-app/node_modules/.prisma

COPY --from=build /kas-kady-bbq-app/build /kas-kady-bbq-app/build
COPY --from=build /kas-kady-bbq-app/public /kas-kady-bbq-app/public
COPY --from=deps /kas-kady-bbq-app/public/tinymce /kas-kady-bbq-app/public/tinymce

ADD . .

CMD ["npm", "start"]
