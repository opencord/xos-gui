# xosproject/xos-gui
# docker build -f Dockerfile -t xosproject/xos-gui:candidate .

# xos-gui-base container
FROM xosproject/xos-gui-builder:candidate as xos-gui-base

ENV CODE_SOURCE .
ENV CODE_DEST /var/www
ENV VHOST /var/www/dist

COPY ${CODE_SOURCE}/package.json \
     ${CODE_SOURCE}/typings.json \
     ${CODE_SOURCE}/gulpfile.js \
     ${CODE_SOURCE}/tsconfig.json \
     ${CODE_SOURCE}/tslint.json \
     ${CODE_DEST}/
COPY ${CODE_SOURCE}/conf/ ${CODE_DEST}/conf/
COPY ${CODE_SOURCE}/gulp_tasks/ ${CODE_DEST}/gulp_tasks/
COPY ${CODE_SOURCE}/src/ ${CODE_DEST}/src/

WORKDIR ${CODE_DEST}
RUN npm install \
 && npm run typings \
 && npm run build


# xos-gui container
FROM nginx:candidate

ENV CODE_SOURCE .
ENV VHOST /var/www/dist

WORKDIR ${VHOST}

RUN mkdir -p /var/log/nginx/log

COPY ${CODE_SOURCE}/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=xos-gui-base ${VHOST} .

EXPOSE 4000

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

