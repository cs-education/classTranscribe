#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import mmap
import sys
from os import listdir
from os.path import isfile, join
import time



def findfiles():
    if(len(sys.argv)<2):
        print("Error: less than 2 arguments")
        return
    #etime = time.perf_counter()
    mypath="..\\public\\javascripts\\data\\captions\\"
    files = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    #print(files)
    for f in files:
        with open(mypath+f, 'rb') as file, \
             mmap.mmap(file.fileno(), 0, access=mmap.ACCESS_READ) as s:
            if s.find(sys.argv[1].encode("utf-8")) != -1:
                print(f)
                #sys.stdout.write(f)
    #sys.stdout.flush()
    #etime = time.perf_counter()
    #sys.stderr.write("Time spent searching for "+str(etime)+"s\n")



if __name__ == "__main__":
    findfiles()