# To build use: docker build -t xosproject/xos-gui .
# To run use: docker run -p 80:80 -d xosproject/xos-gui

FROM nginx

# Set environment vars
ENV CODE_SOURCE .
ENV CODE_DEST /var/www
ENV VHOST /var/www/dist

# Install nodeJs
RUN apt-get update
RUN apt-get install curl git bzip2 -y
RUN curl -sL https://deb.nodesource.com/setup_4.x > install_node.sh
RUN chmod a+x install_node.sh
RUN ./install_node.sh
RUN apt-get install -y nodejs

# Add the app
COPY ${CODE_SOURCE} ${CODE_DEST}

# Install Deps
WORKDIR ${CODE_DEST}
RUN npm install 

# Override nginx configutaion
RUN mkdir -p /var/log/nginx/log
RUN mv ${CODE_SOURCE}/nginx.conf /etc/nginx/conf.d/default.conf

# Build the app
EXPOSE 4000
RUN npm run build