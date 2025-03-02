FROM node:18.18
WORKDIR /home/node/app
RUN npm install -g pnpm
COPY package*.json ./
RUN pnpm install
COPY . .
RUN npx prisma generate
EXPOSE 8080
CMD ["pnpm", "start"]