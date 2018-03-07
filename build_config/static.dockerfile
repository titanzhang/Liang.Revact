FROM nginx:1.10.3
COPY build_config/static.nginx.conf /etc/nginx/nginx.conf
COPY build /usr/share/nginx/site
