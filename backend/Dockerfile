FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

RUN npx prisma generate

ENV PORT=1212
ENV DATABASE_URL="postgresql://postgres:root@db:5432/golderRouteDB?schema=public"

EXPOSE 1212

CMD [ "/wait-for-db.sh","npm", "start" ]
