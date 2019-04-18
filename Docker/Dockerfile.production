FROM mahipal2/classtranscribe-base:latest

WORKDIR /

RUN git -C /MSTranscription pull
RUN dotnet publish -c release -o /MSTranscription/Release/ -r linux-x64 -f netcoreapp2.1 --self-contained false

RUN git clone https://github.com/cs-education/classTranscribe.git
WORKDIR classTranscribe

ADD cert /classTranscribe/cert
RUN npm install
