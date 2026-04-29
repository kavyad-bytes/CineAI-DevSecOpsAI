FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV VITE_API_BASE_URL=http://cineai.local/api/movies
ENV VITE_AUTH_BASE_URL=http://cineai.local/api/auth

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80