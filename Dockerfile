# Build stage
FROM oven/bun:1.2-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Build the application
RUN bun run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "build/index.js"]
