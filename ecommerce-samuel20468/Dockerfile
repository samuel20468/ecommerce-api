FROM node:18
WORKDIR /app
COPY ./ecommerce-samuel20468/package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
