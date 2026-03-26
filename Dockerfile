FROM node:18
WORKDIR /app
# Copy package files 
COPY package*.json ./

# Install dependencies 
RUN npm install 
# Copy project files 
COPY . .
 EXPOSE 5173 
 # Run vite dev server directly 
 CMD ["node", "node_modules/vite/bin/vite.js", "--host"]