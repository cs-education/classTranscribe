#!/bin/sh
for i in *.m4v ; do
	ffmpeg -i "$i" -q:v 9 -c:v libvpx -c:a libvorbis $(basename "${i/.m4v}").webm
done