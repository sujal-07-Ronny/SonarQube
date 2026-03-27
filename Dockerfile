FROM node:20

WORKDIR /app

# Install dependency-check (FIXED VERSION)
RUN apt-get update && \
    apt-get install -y wget unzip && \
    wget https://github.com/jeremylong/DependencyCheck/releases/download/v12.1.0/dependency-check-12.1.0-release.zip && \
    unzip dependency-check-*.zip && \
    mv dependency-check /opt/ && \
    ln -s /opt/dependency-check/bin/dependency-check.sh /usr/bin/dependency-check && \
    rm -rf dependency-check-*.zip

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

EXPOSE 5173

CMD ["node", "node_modules/vite/bin/vite.js", "--host"]