FROM httpd:latest

COPY src/server.crt /usr/local/apache2/conf
COPY src/server.key /usr/local/apache2/conf

RUN sed -i \
		-e 's/^#\(Include .*httpd-ssl.conf\)/\1/' \
		-e 's/^#\(LoadModule .*mod_ssl.so\)/\1/' \
		-e 's/^#\(LoadModule .*mod_socache_shmcb.so\)/\1/' \
		/usr/local/apache2/conf/httpd.conf

EXPOSE 443
EXPOSE 80
