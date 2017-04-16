# To build use: docker build -t xosproject/xos-gui .
# To run use: docker run -p 4000:4000 --volumes-from gui-extensions-store -d xosproject/xos-gui

FROM nginx

# label image
ARG org_label-schema_schema-version=1.0
ARG org_label-schema_name=xos-gui
ARG org_label-schema_version=dirty
ARG org_label-schema_vcs-url=unknown
ARG org_label-schema_vcs-ref=unknown
ARG org_label-schema_build-date=unknown
ARG org_opencord_vcs-commit-date=unknown

LABEL org.label-schema.schema-version=org_label-schema_schema-version \
      org.label-schema.name=org_label-schema_name \
      org.label-schema.version=org_label-schema_version \
      org.label-schema.vcs-url=org_label-schema_vcs-url \
      org.label-schema.vcs-ref=org_label-schema_vcs-ref \
      org.label-schema.build-date=org_label-schema_build-date \
      org.opencord.vcs-commit-date=org_opencord_vcs-commit-date

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
