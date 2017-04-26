# xosproject/xos-gui
# To build use: docker build -t xosproject/xos-gui .
# To run use: docker run -p 4000:4000 --volumes-from gui-extensions-store -d xosproject/xos-gui
FROM nginx:candidate

# Label image
ARG org_label_schema_schema_version=1.0
ARG org_label_schema_name=xos-gui
ARG org_label_schema_version=unknown
ARG org_label_schema_vcs_url=unknown
ARG org_label_schema_vcs_ref=unknown
ARG org_label_schema_build_date=unknown
ARG org_opencord_vcs_commit_date=unknown

LABEL org.label-schema.schema-version=$org_label_schema_schema_version \
      org.label-schema.name=$org_label_schema_name \
      org.label-schema.version=$org_label_schema_version \
      org.label-schema.vcs-url=$org_label_schema_vcs_url \
      org.label-schema.vcs-ref=$org_label_schema_vcs_ref \
      org.label-schema.build-date=$org_label_schema_build_date \
      org.opencord.vcs-commit-date=$org_opencord_vcs_commit_date

# Set environment vars
ENV CODE_SOURCE .
ENV CODE_DEST /var/www
ENV VHOST /var/www/dist

# Install nodeJs
RUN apt-get update
RUN apt-get install curl git bzip2 gnupg -y
RUN curl -sL https://deb.nodesource.com/setup_7.x > node_install.sh
RUN bash node_install.sh
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
