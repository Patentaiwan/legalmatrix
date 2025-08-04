FROM arm64v8/node:18-bullseye

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm add -D @oxc-parser/binding-linux-arm64-gnu
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev", "--host", "0.0.0.0"]