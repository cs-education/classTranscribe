FROM mahipal2/classtranscribe-base:latest

RUN git -C /MSTranscription pull
RUN dotnet publish -c release -o /MSTranscription/Release/ -r linux-x64 -f netcoreapp2.1 --self-contained false

WORKDIR /classTranscribe
