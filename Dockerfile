FROM node:12 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=6060

EXPOSE 6060

CMD ["npm", "run", "dev"]