import sys
import json
import os

if len(sys.argv) != 2:
  print 'not enough arguments'
  sys.exit(0)

transcript_file = sys.argv[1]

def stage_1():
  stat_json_data = open(transcript_file).read()
  statistic = json.loads(stat_json_data)
  try:
    totalTime = int(statistic['totalTime'])
  except:
    totalTime = 0

  if totalTime < 1000:
    print 0
  else:
    print 1

stage_1()