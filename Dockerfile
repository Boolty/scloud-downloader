FROM node:18-alpine

# Install Python, build dependencies and yt-dlp for downloading
RUN apk add --no-cache python3 py3-pip make g++ ffmpeg && \
    pip3 install --break-system-packages yt-dlp

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Create downloads directory
RUN mkdir -p downloads

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]