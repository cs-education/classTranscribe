#!/bin/sh
for file in *m4v; do mv "$file" `echo $file | tr ' ' '_'`  ; done
for file in *m4v; do mv "$file" `echo $file | tr -d '('`  ; done
for file in *m4v; do mv "$file" `echo $file | tr -d ')'`  ; done
for i in *.m4v ; do
	ffmpeg -i "$i" -q:v 9 -c:v libvpx -c:a libvorbis $(basename "${i/.m4v}").webm
	ffmpeg -i "$i" -f wav $(basename "${i/.m4v}").wav
done