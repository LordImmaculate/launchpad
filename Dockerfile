# Base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package manager files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Copy app source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build Next.js app
RUN pnpm build

# Production image
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Install pnpm globally in production container
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy necessary files from builder stage
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Ensure Prisma is ready
RUN pnpm prisma generate

# Start Next.js app
CMD ["pnpm", "start"]
