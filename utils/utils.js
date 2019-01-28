async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

function transferJsonToVtt(json, vttFilename) {
    let input = json;
    let data = "WEBVTT\n" +
        "Kind: subtitles\n" +
        "Language: en\n\n"
    for (let i = 0; i < input.length; i++) {
        index = i + 1
        part = input[i]["part"]
        data += index.toString() + "\n" +
            convertMStoTime(input[i]["start"]) + " --> " + convertMStoTime(input[i]["end"]) + "\n"
        data = data.concat(part) + "\n\n"
    }
    fs.writeFile(vttFilename, data, (err) => {
        if (err) throw err;
    })
}

function convertMStoTime(duration) {
    let milliseconds = parseInt((duration % 1000)),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

module.exports = {
    asyncForEach: asyncForEach,
    transferJsonToVtt: transferJsonToVtt,
    convertMStoTime: convertMStoTime
}
