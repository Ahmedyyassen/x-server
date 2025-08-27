From node:18
# Create app directory
WORKDIR /app
# Install app dependencies
COPY package*.json ./
# RUN npm ci --only=production
RUN npm install
# Bundle app source (from the current directory to the working directory)
COPY . .

EXPOSE 3030
# Run the app 
CMD ["node", "src/index.js"]
