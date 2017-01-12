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

# Add the app deps
COPY ${CODE_SOURCE}/package.json ${CODE_DEST}/package.json
COPY ${CODE_SOURCE}/typings.json ${CODE_DEST}/typings.json

# Install Deps
WORKDIR ${CODE_DEST}
RUN npm install
RUN npm run typings

# Create folder for logs
RUN mkdir -p /var/log/nginx/log

# Build the app
EXPOSE 4000
COPY ${CODE_SOURCE}/conf ${CODE_DEST}/conf
COPY ${CODE_SOURCE}/gulp_tasks ${CODE_DEST}/gulp_tasks
COPY ${CODE_SOURCE}/src ${CODE_DEST}/src
COPY ${CODE_SOURCE}/gulpfile.js ${CODE_DEST}/gulpfile.js
COPY ${CODE_SOURCE}/tsconfig.json ${CODE_DEST}/tsconfig.json
COPY ${CODE_SOURCE}/tslint.json ${CODE_DEST}/tslint.json
RUN npm run build

# Override nginx configutaion
COPY ${CODE_SOURCE}/nginx.conf ${CODE_DEST}/nginx.conf
RUN mv ${CODE_SOURCE}/nginx.conf /etc/nginx/conf.d/default.conf
