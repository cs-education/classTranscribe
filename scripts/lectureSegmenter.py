import wave
import audioop
import sys
import os
import math

from pydub import AudioSegment


def sampleIndexToSeconds(index, chunk_size, rate):
    return index * (chunk_size) / rate

def printTime(timeInSeconds):
    seconds = timeInSeconds % 60
    minutes = timeInSeconds / 60

    if seconds < 10:
        sys.stdout.write('{}:0{} '.format(minutes, seconds))
    else:
        sys.stdout.write('{}:{} '.format(minutes, seconds))



if __name__ == "__main__":
    """
        This should be ran with a single arguement which is the path to mp3 file that needs to be segmented
    """
    mp3Name = sys.argv[1]
    wavName = mp3Name[:-4] + '.wav'

    song = AudioSegment.from_mp3(mp3Name)
    song.export(wavName, format='wav')

    wav = wave.open(wavName, 'r')

    frames = wav.getnframes()
    rate = wav.getframerate()
    width = wav.getsampwidth()

    numSeconds = frames / float(rate)

    THRESHOLD = 50
    CHUNK_SIZE = 64

    rms_vals = []

    for chunk_num in range(frames/CHUNK_SIZE):
        sample = wav.readframes(CHUNK_SIZE)
        rms_vals.append(audioop.rms(sample, width))

    longest_start = 0
    longest_end = 0

    cur_len = 0
    cur_start = 0

    segment_count = 0
    printTime(0)
    while(True):
        longest_len = 0
        start_search = longest_end + (240 * rate / CHUNK_SIZE)
        end_search = start_search + (120 * rate / CHUNK_SIZE)

        start_time = sampleIndexToSeconds(start_search, CHUNK_SIZE, rate)
        end_time = sampleIndexToSeconds(end_search, CHUNK_SIZE, rate)

        if start_time > numSeconds or (start_time <= numSeconds and end_time >= numSeconds):
            printTime(int(math.floor(numSeconds)))
            break

        for chunk_index in range(start_search, end_search):
            # if sound below threshold then continue quiet streak
            if rms_vals[chunk_index] < THRESHOLD:
                cur_len += 1
            else:
                if cur_len > longest_len:
                    longest_len = cur_len
                    longest_start = cur_start
                    longest_end = chunk_index

                cur_start = chunk_index + 1
                cur_len = 0

        if cur_len > longest_len:
            longest_len = cur_len
            longest_start = cur_start
            longest_end = chunk_index

        segment_count += 1
        printTime(sampleIndexToSeconds(longest_end, CHUNK_SIZE, rate))

    os.remove(wavName)
