
FROM node:16-alpine

WORKDIR /usr/app

COPY . /usr/app

RUN npm ci
RUN npm run build

RUN npx prisma db push

CMD ["npm", "start"]
