# Dockerfile
# preferred node version chosen here (LTS = 18.18 as of 10/10/23)
FROM node:18.18-alpine AS builder

# Create the directory on the node image where our Next.js app will live
WORKDIR /app

# Copy package.json and package-lock.json to the /app working directory
COPY package*.json ./

# Install dependencies in /app
RUN npm install

# Copy the rest of our Next.js folder into /app
COPY . .

# Build the Next.js app
RUN npm run build

# Production stage
FROM node:18.18-alpine AS runner

# Create the directory on the node image where our Next.js app will live
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.mjs ./

# Ensure port 8080 is accessible to our system (uncomment if needed)
# EXPOSE 8080

# Run the production build
CMD ["node_modules/.bin/next", "start"]
