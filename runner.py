#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys
import os

if len(sys.argv) != 3:
	print "number of arguments incorrect"
	sys.exit(1)

course_name = sys.argv[1] #CS225
video_index_netid = sys.argv[2] #Full_Lecture_Video_05_part8-nmathe6
full_lecture_index = "Lecture_" + video_index_netid[19:21] #Lecture_01

#Full_Lecture_Video_02_part3.wav
wav_filename = video_index_netid[:video_index_netid.find("-")]
wav_filename = wav_filename + ".wav"

#https://s3-us-west-2.amazonaws.com/classtranscribes3/CS225/Lecture_02/Full_Lecture_Video_02_part1.wav
wav_url = "https://s3-us-west-2.amazonaws.com/classtranscribes3/"
wav_url = wav_url + course_name + "/" + full_lecture_index + "/" + wav_filename

print "starting to download"
sys.stdout.flush()
if os.system("curl -O " + wav_url) != 0:
	print "download the .wav failed"
	sys.exit(1)
print "finished downloading"
sys.stdout.flush()

print "starting to text_to_transcript"
sys.stdout.flush()
transcription_path = "captions/first/" + course_name + "/" + video_index_netid + ".txt"
if os.system("python p2fa-vislab-master/text_to_transcript.py " + transcription_path + " --output-file out.json") != 0:
	print "text_to_transcript failed"
	sys.exit(1)
print "finish text_to_transcript"
sys.stdout.flush()

print "starting to p2fa"
sys.stdout.flush()
if os.system("p2fa-vislab-master/align.py " + wav_filename + " out.json p2fa_out.json") != 0:
	print "p2fa failed"
	sys.exit(1)
print "finished p2fa"
sys.stdout.flush()

print "starting to getwidth"
sys.stdout.flush()
if os.system("node getWidth.js p2fa_out.json") != 0:
	print "get_width failed"
	sys.exit(1)
print "finished to getwidth"
sys.stdout.flush()

print "check dir"
sys.stdout.flush()
if os.system("mkdir -p " + "captions/second/" + course_name) != 0:
	print "fail to make a dir"
	sys.exit(1)
print "finished creating a dir"
sys.stdout.flush()

print "move to target "
sys.stdout.flush()
target_path = "captions/second/" + course_name
if os.system("mv width.json " + video_index_netid + ".json") != 0:
	print "rename failed"
	sys.exit(1)
if os.system("mv " + video_index_netid + ".json " + target_path) != 0:
	print "move to target_path failed"
	sys.exit(1)
print "finish to target "
sys.stdout.flush()

print "start to clean"
sys.stdout.flush()
if os.path.isfile(wav_filename):
	os.remove(wav_filename)
else:
	print "wav_filename file not exist"

if os.path.isfile("out.json"):
	os.remove("out.json")
else:
	print "out.json file not exist"

if os.path.isfile("p2fa_out.json"):
	os.remove("p2fa_out.json")
else:
	print "p2fa_out.json file not exist"

print "finish to clean "
sys.stdout.flush()
