FROM nginx:latest

ARG BUILD_MACHINE=aarch64

SHELL ["/bin/bash", "-c"]
##=============================================================
#RUN apt update && apt -y install tzdata
#ENV TZ=Asia/Tokyo
#RUN dpkg-reconfigure tzdata
##=============================================================
RUN apt update && apt -y install locales
RUN sed -i 's/# ja_JP/ja_JP/' /etc/locale.gen
RUN locale-gen
RUN update-locale LANG=ja_JP.UTF-8
##=============================================================
RUN apt -y install git wget pulseaudio

##=============================================================
RUN apt -y install build-essential zlib1g-dev libsdl2-dev libasound2-dev unzip

RUN mkdir -p /app/model \
    && cd /app/model \
    && wget --trust-server-names 'https://ymu.dl.osdn.jp/julius/71011/dictation-kit-4.5.zip' \
    && unzip dictation-kit-4.5.zip \
    && rm dictation-kit-4.5.zip

WORKDIR /opt
RUN git clone https://github.com/julius-speech/julius.git

WORKDIR /opt/julius
RUN git checkout v4.5
RUN ./configure --enable-words-int --build=${BUILD_MACHINE} --with-mictype=pulseaudio
RUN make && make install
WORKDIR /opt/julius/model

EXPOSE 10500/tcp
EXPOSE 10500/udp
##=============================================================
