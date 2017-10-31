# xosproject/xos-gui
# To build use: docker build -t xosproject/xos-gui .
# To run use: docker run -p 4000:4000 --volumes-from gui-extensions-store -d xosproject/xos-gui
FROM nginx:candidate

# Set environment vars
ENV CODE_SOURCE .
ENV CODE_DEST /var/www
ENV VHOST /var/www/dist

# Install Node.js
COPY ${CODE_SOURCE}/nodesource.gpg.key /tmp/nodesource.gpg.key
RUN apt-get update \
 && apt-get install -y gnupg apt-transport-https \
 && apt-key add /tmp/nodesource.gpg.key \
 && echo "deb https://deb.nodesource.com/node_7.x trusty main" \
    > /etc/apt/sources.list.d/nodesource.list \
 && apt-get update \
 && apt-get install -y curl git bzip2 nodejs \
 && rm -rf /var/lib/apt/lists/*

# copy over files
COPY ${CODE_SOURCE}/package.json \
     ${CODE_SOURCE}/typings.json \
     ${CODE_SOURCE}/gulpfile.js \
     ${CODE_SOURCE}/tsconfig.json \
     ${CODE_SOURCE}/tslint.json \
     ${CODE_DEST}/
COPY ${CODE_SOURCE}/conf/ ${CODE_DEST}/conf/
COPY ${CODE_SOURCE}/gulp_tasks/ ${CODE_DEST}/gulp_tasks/
COPY ${CODE_SOURCE}/src/ ${CODE_DEST}/src/

# Install deps, build and create logdir
WORKDIR ${CODE_DEST}
RUN npm install \
 && npm run typings \
 && npm run build \
 && mkdir -p /var/log/nginx/log

# Override nginx configutaion
COPY ${CODE_SOURCE}/nginx.conf /etc/nginx/conf.d/default.conf

# expose the app port
EXPOSE 4000

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

