#!/bin/bash

ROOT_DIR=$(readlink -f $(dirname $0))/
source ${ROOT_DIR}src/httpd.config.ini

# Create server.crt and server.key
if [ ! -e "${ROOT_DIR}src/server.key" ]; then
    echo "[INFO] Create server.key"
    openssl genrsa -out ${ROOT_DIR}src/server.key 2048
fi
if [ ! -e "${ROOT_DIR}src/server.crt" ]; then
    echo "[INFO] Create server.crt"
    openssl req -new -key ${ROOT_DIR}src/server.key -out ${ROOT_DIR}src/server.csr
fi
if [ ! -e "${ROOT_DIR}src/server.crt" ]; then
    echo "[INFO] Create server.crt for 4 years"
    openssl x509 -req -days 1461 -in ${ROOT_DIR}src/server.csr -signkey ${ROOT_DIR}src/server.key -out ${ROOT_DIR}src/server.crt
fi

# Remove container from image-name
_CONTAINER_ID=($(docker container ls -a --filter="ancestor=${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VER}" --format="{{.ID}}"))
for item in "${_CONTAINER_ID[@]}" ; do
    echo "[INFO] Remove container: ${item}"
    docker container stop ${_CONTAINER_ID} > /dev/null
    docker container rm ${_CONTAINER_ID} > /dev/null
done

# Remove image from image-name
_IMAGE_ID=($(docker image ls --filter="reference=${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VER}" --format="{{.ID}}"))
for item in "${_IMAGE_ID[@]}" ; do
    echo "[INFO] Remove image: ${item}"
    docker image rm ${_IMAGE_ID} > /dev/null
done

docker build \
    -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VER} \
    -f ${ROOT_DIR}src/Dockerfile .
ret=$?
if [ 0 -eq $ret ]; then
    docker container run --name ${DOCKER_CONTAINER_NAME} \
        -d -v ${ROOT_DIR}http:/usr/local/apache2/htdocs/ \
        -p ${HTTP_SERVER_PORT}:80 \
        -p ${HTTPS_SERVER_PORT}:443 \
        ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VER} > /dev/null
    ret=$?
    echo "[INFO] Sleep 5 seconds"
    sleep 5
    echo "===================================================="
    _CONTAINER_ID=$(docker container ls --filter="name=${DOCKER_CONTAINER_NAME}" --format="{{.ID}}")
    if [ ! -z "${_CONTAINER_ID}" ]; then
        docker container ls --filter="name=${DOCKER_CONTAINER_NAME}"
        #echo "[INFO] Server is running on http://localhost:${HTTP_SERVER_PORT}"
        echo "[INFO] Server is running on https://localhost:${HTTPS_SERVER_PORT}"
    else
        docker logs --details ${DOCKER_CONTAINER_NAME}
        echo "[ERROR] Server is not running"
    fi
fi
