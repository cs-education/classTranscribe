import argparse
import json
import os
import sys
import urllib
import urllib2
import requests
from cookielib import CookieJar
from pprint import pprint

host_name = "https://recordings.engineering.illinois.edu:8443"

def handle_args():
	arguments = argparse.ArgumentParser(description="Download lecture videos from ECHO page")
	arguments.add_argument("-uuid", 
			required=True, 
			help="UUID of a course found in URL of the course", 
			metavar="UUID")

	args = vars(arguments.parse_args())
	uuid = args["uuid"]

	return uuid

def main():
	course_uuid = handle_args()

	session_url = "{}/ess/portal/section/{}".format(host_name, course_uuid)
	json_url = "{}/ess/client/api/sections/{}/section-data.json?pageSize=100".format(host_name, course_uuid)

	os.system('./download-echo.sh ' + course_uuid)
	os.system('curl -b cookies ' + json_url + ' > test.json')

	with open('test.json') as data_file:
		data = json.load(data_file)

	section_data = data[unicode('section')]
	course_data = section_data[unicode('course')]
	class_name = course_data[unicode('identifier')]
	presentation_data = section_data[unicode('presentations')]

	video_contents = presentation_data[unicode('pageContents')]
	if not os.path.exists('./Lectures'):
		os.makedirs('Lectures')

	for content in video_contents:
		video_url = content[unicode('richMedia')]
		title = class_name + "_"+(content[unicode('startTime')].split('T')[0])+'.m4v'
		print title
		if os.path.isfile('Lectures/'+title):
			continue
		else:
			os.system('wget ' + video_url + '/mediacontent.m4v')
			os.system('mv mediacontent.m4v Lectures/' + title)

if __name__ == '__main__':
	main()
