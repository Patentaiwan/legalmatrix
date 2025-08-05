FROM node:18-bullseye

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
# RUN pnpm add -D @oxc-parser/binding-linux-arm64-gnu
RUN rm -rf node_modules .nuxt
RUN pnpm add -D tailwindcss @tailwindcss/vite @tailwindcss/postcss autoprefixer
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev", "--host", "0.0.0.0"]