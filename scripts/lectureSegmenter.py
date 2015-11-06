import wave
import audioop
import sys
import math



def sampleIndexToSeconds(index, chunk_size, rate):
    return index * (chunk_size) / rate

def addTime(time_strings, timeInSeconds):
    seconds = timeInSeconds % 60
    minutes = timeInSeconds / 60

    if seconds < 10:
        time_strings.append('{}:0{}'.format(minutes, seconds))
    else:
        time_strings.append('{}:{}'.format(minutes, seconds))



if __name__ == "__main__":
    """
        This should be ran with a single arguement which is the path to wav file that needs to be segmented
    """
    wavName = sys.argv[1]
    wav = wave.open(wavName, 'r')

    frames = wav.getnframes()
    rate = wav.getframerate()
    width = wav.getsampwidth()

    numSeconds = frames / float(rate)

    # threshold for detecting speech. white noise seems to fall below this threshold
    THRESHOLD = math.pow(300, 3)
    CHUNK_SIZE = 64

    rms_vals = []

    for chunk_num in range(frames/CHUNK_SIZE):
        sample = wav.readframes(CHUNK_SIZE)
        rms_vals.append(math.pow(audioop.rms(sample, width), 3))

    longest_start = 0
    longest_end = 0

    cur_len = 0
    cur_start = 0

    segment_count = 0


    time_strings = []
    # easiest solution is just look for inf loop then remove all dupelicate times from the end

    for rms_index, rms_val in enumerate(rms_vals):
        if rms_val > THRESHOLD:
            longest_end = rms_index
            start_of_lec = sampleIndexToSeconds(rms_index, CHUNK_SIZE, rate) - 5
            addTime(time_strings, start_of_lec if start_of_lec >= 0 else 0)
            break

    length_of_noise = 0
    initial_end_of_lecture_time = None
    end_of_lecture_time = None
    reversed_rms = reversed(list(enumerate(rms_vals)))
    for rms_index, rms_val in reversed_rms:
        if rms_val > THRESHOLD:
            length_of_noise = length_of_noise + 1
            if initial_end_of_lecture_time is None:
                initial_end_of_lecture_time = sampleIndexToSeconds(rms_index, CHUNK_SIZE, rate) + 5
            else:
                if length_of_noise > 5:
                    end_of_lecture_time = initial_end_of_lecture_time
                    break
        elif initial_end_of_lecture_time is not None:
            length_of_noise = 0
            end_of_lecture_time = sampleIndexToSeconds(rms_index, CHUNK_SIZE, rate) + 5

    if end_of_lecture_time > numSeconds:
        end_of_lecture_time = int(math.floor(numSeconds))

    while(True):
        longest_len = 0
        start_search = longest_end + (240 * rate / CHUNK_SIZE)
        end_search = start_search + (120 * rate / CHUNK_SIZE)
        
        if sampleIndexToSeconds(end_search, CHUNK_SIZE, rate) >= end_of_lecture_time:
            addTime(time_strings, end_of_lecture_time)
            break

        start_time = sampleIndexToSeconds(start_search, CHUNK_SIZE, rate)
        end_time = sampleIndexToSeconds(end_search, CHUNK_SIZE, rate)

        if start_time > numSeconds or (start_time <= numSeconds and end_time >= numSeconds):
            addTime(time_strings, int(math.floor(numSeconds)))
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
        secs = sampleIndexToSeconds(longest_end, CHUNK_SIZE, rate)
        addTime(time_strings, secs)
        if time_strings[-1] == time_strings[-2]:
            time_strings = time_strings[:-1]
            break
    sys.stdout.write(' '.join(time_strings))
