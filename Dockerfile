FROM node:18

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=development
ENV PORT=3006

EXPOSE 3006

CMD ["pnpm", "dev", "--hostname", "0.0.0.0", "--port", "3006"]
