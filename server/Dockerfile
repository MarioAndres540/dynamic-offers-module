FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build for production usage if needed, but we'll use dev for hot-reload
RUN npm run build

EXPOSE 5000

# Default command remains the production one, but docker-compose overrides it
CMD ["npm", "run", "dev"]
