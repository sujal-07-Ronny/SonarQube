FROM node:20

WORKDIR /app

# Install Java + tools
RUN apt-get update && \
    apt-get install -y wget unzip openjdk-17-jdk && \
    wget https://github.com/jeremylong/DependencyCheck/releases/download/v12.1.0/dependency-check-12.1.0-release.zip && \
    unzip dependency-check-12.1.0-release.zip && \
    mv dependency-check /opt/ && \
    ln -s /opt/dependency-check/bin/dependency-check.sh /usr/bin/dependency-check.sh && \
    rm -rf dependency-check-12.1.0-release.zip

# Set Java path
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["node", "node_modules/vite/bin/vite.js", "--host"]