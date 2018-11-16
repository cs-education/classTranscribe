FROM ubuntu:16.04
# MAINTAINER Thom Nichols "thom@thomnichols.org"

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get -qq update
RUN apt-get install -y nodejs npm
# TODO could uninstall some build dependencies

# debian installs `node` as `nodejs`
RUN update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10


# done installing node

RUN apt-get -y update
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:fkrull/deadsnakes
RUN apt-get -y update

# RUN apt-get install -y make
# RUN apt-get install -y vim
RUN apt-get install -y git
RUN apt-get install -y wget
RUN apt-get install -y python2.7
RUN apt-get install -y llvm
RUN apt-get install -y build-essential
RUN apt-get install -y clang-3.6
RUN apt-get install -y gcc-multilib
RUN apt-get install -y g++-multilib
RUN apt-get install -y libx11-dev
RUN apt-get install -y python-dev
RUN apt-get install -y sox
RUN apt-get install -y libsox-fmt-all
RUN apt-get install -y libasound2-plugins
RUN apt-get install -y php7.0-cli
# RUN apt-get install -y ffmpeg

# RUN npm install -g yarn

# RUN mkdir home/class_transcribe; wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=0B4iG4F78AllkNi1vSnU4QUs4SnM' -O home/htk.tar.gz;tar -xvf home/htk.tar.gz -C home

# WORKDIR home/htk
# RUN ./configure --disable-hslab --prefix=/usr/local; make all; make install

# WORKDIR ..
RUN git clone https://github.com/ucbvislab/p2fa-vislab
RUN wget https://bootstrap.pypa.io/get-pip.py; python get-pip.py; pip install numpy

WORKDIR p2fa-vislab
RUN pip install -r requirements.txt; git submodule init; git submodule update

WORKDIR /
RUN git clone -b fa18-demo https://github.com/cs-education/classTranscribe.git
WORKDIR classTranscribe

#VOLUME ["/data"]
ADD cert /classTranscribe/cert
RUN npm install

RUN npm cache clean -f
RUN npm install -g n
RUN n stable

EXPOSE 8000