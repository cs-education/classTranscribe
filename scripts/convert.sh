#!/bin/sh
for file in *m4v; do mv "$file" `echo $file | tr ' ' '_'`  ; done
for file in *m4v; do mv "$file" `echo $file | tr -d '('`  ; done
for file in *m4v; do mv "$file" `echo $file | tr -d ')'`  ; done
for i in *.m4v ; do
	ffmpeg -i "$i" -codec:v libx264 -profile:v high -preset slow -b:v 500k -maxrate 500k -bufsize 1000k -vf scale=-1:480 -threads 0 "${i/.m4v}".mp4
	ffmpeg -i "$i" -f wav -ar 22050 $(basename "${i/.m4v}").wav
done
