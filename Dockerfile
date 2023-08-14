FROM node:18-alpine

WORKDIR /app

# Pass build-time arguments using --build-arg
ARG DB_CONNECTION
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD

# Set environment variables without curly braces
ENV DB_CONNECTION=${DB_CONNECTION}
ENV POSTGRES_USER=${POSTGRES_USER}}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}}

COPY package.json ./

COPY yarn.lock ./

RUN rm -rf build

RUN yarn 

COPY . .

RUN yarn build

EXPOSE 8080

CMD ["node", "build/src/app.js"]
