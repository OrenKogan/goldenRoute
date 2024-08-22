FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

ENV PORT=1212
ENV DATABASE_URL="postgresql://postgres:root@db:5432/golderRouteDB?schema=public"

EXPOSE 1212

CMD ["npm", "start" ]
