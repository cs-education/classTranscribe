//Example usages
// const vttToJson = require('vtt-json');
// const fs = require('fs');
// const {splitWavParallel, splitWavSequential} = require('./split_wav_by_json');

// (async() => {
//   var vtt = fs.readFileSync('sample.vtt').toString();
//   var json = await vttToJson(vtt);
//   // console.log(json);
//   var ret = await splitWavParallel('sample.wav', json);
//   console.log(ret);
// })();

const {spawn} = require('child-process-promise');
const fs = require('fs');

function deleteDirectoryRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteDirectoryRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};


function createTempDir(prefix, noThrow, noLog) {
  let tempDirName = `${prefix}-tmp`
  if (!fs.existsSync(tempDirName)) {
    try {
      fs.mkdirSync(`${prefix}-tmp`);
    } catch (err) {
      if (!noThrow) {
        throw err;
      }
      if (!noLog) {
        console.error(err);
      }
      return null;
    }
  }
  return tempDirName;
}
//
// function onExit(childProcess, idx, noThrow, noLog) {
//   return new Promise((resolve, reject) => {
//     childProcess.once('exit', (code, signal) => {
//       if (code === 0) {
//         resolve(0);
//       } else {
//         if (!noThrow) {
//           reject(new Error(`Exit code nonzero when trying to produce ${idx + 1}.wav: ${code}, abort.`));
//         }
//         if (!noLog) {
//           console.error(`Exit code nonzero when trying to produce ${idx + 1}.wav: ${code}, abort.`);
//         }
//         resolve(1);
//       }
//     });
//     childProcess.once('error', (err) => {
//       if (!noThrow) {
//         reject(err);
//       }
//       if (!noLog) {
//         console.error(err);
//       }
//       resolve(1);
//     });
//   });
// }

/**
*
* Split a wav file according to an array of instructions in json format, of which
* an instruction item must contain a 'start' and an 'end' field that indicates
* the number of milliseconds into and out of the .wav file to be copied into a
* separate .wav file. Starting from the first instruction, This method only
* executes the command of doing so if the proceeding instruction succeeds.
* By its sequential nature, it runs slower than splitWavParallel but will abort
* earlier if an error occurs early.
*
* @method splitWavSequential
* @param {String} wavFile the path to the wavFile that is going to be splitted.
* @param {String} wavFile all instructions in json format, typically converted
*                 from a .vtt file
* @param {Boolean} noThrow whether the function should throw upon error.
* @param {Boolean} noLog whether the function should console.log upon error.
* @param {Boolean} deleteTmpDirOnFailure whether the function should delete
*                  the temporary directory created to hold the splitted .wav
*                   files upon failure for whatever reason.
* @return {Integer} Returns 0 on success and 1 on failure.
*/
async function splitWavSequential(wavFile, splitInstsInJson, noThrow=true, noLog=true, deleteTmpDirOnFailure=true) {
  let tempDirName = createTempDir(wavFile, noThrow, noLog);
  if (!tempDirName) {
    return 1; //On failure
  }

  for (let i = 0; i < splitInstsInJson.length; i++) {
    let currInst = splitInstsInJson[i];
    const ffmpeg = spawn('ffmpeg', ['-y', '-i', wavFile, '-ss', String(currInst.start / 1000), '-to', String(currInst.end / 1000), '-c', 'copy', `${tempDirName}/${i + 1}.wav`]);
    try {
      await ffmpeg;
    } catch (err) {
      if (deleteTmpDirOnFailure) {
        deleteDirectoryRecursive(tempDirName);
      }
      console.error(`Error encountered trying to produce ${i + 1}.wav, abort.`);
      if (!noThrow) {
        throw err;
      }
      if (!noLog) {
        console.error(err);
      }
      return 1;
    }
  }

  return 0; //On success
}

/**
*
* Split a wav file according to an array of instructions in json format, of which
* an instruction item must contain a 'start' and an 'end' field that indicates
* the number of milliseconds into and out of the .wav file to be copied into a
* separate .wav file. Starting from the first instruction, This method executes
* all the commands of doing so in parallel.
* Not going to abort until all commands finished running even if an error occurs.
*
* @method splitWavSequential
* @param {String} wavFile the path to the wavFile that is going to be splitted.
* @param {String} wavFile all instructions in json format, typically converted
*                 from a .vtt file
* @param {Boolean} noThrow whether the function should throw upon error.
* @param {Boolean} noLog whether the function should console.log upon error.
* @param {Boolean} deleteTmpDirOnFailure whether the function should delete
*                  the temporary directory created to hold the splitted .wav
*                   files upon failure for whatever reason.
* @return {Integer} Returns 0 on success and 1 on failure.
*/
async function splitWavParallel(wavFile, splitInstsInJson, noThrow=true, noLog=true, deleteTmpDirOnFailure=true) {
  let tempDirName = createTempDir(wavFile, noThrow, noLog);
  if (!tempDirName) {
    return 1; //On failure
  }

  let retval = 0;
  const promises = splitInstsInJson.map(async (currInst, idx) => {
    const ffmpeg = spawn('ffmpeg', ['-y', '-i', wavFile, '-ss', String(currInst.start / 1000), '-to', String(currInst.end / 1000), '-c', 'copy', `${tempDirName}/${idx + 1}.wav`]);
    try {
      await ffmpeg;
    } catch (err) {
      console.error(`Error encountered trying to produce ${idx + 1}.wav, abort.`);
      if (!noThrow) {
        throw err;
      }
      if (!noLog) {
        console.error(err);
      }
      retval = 1;
    }
  });

  try {
    await Promise.all(promises);
  } catch(err) {
    if (deleteTmpDirOnFailure) {
      deleteDirectoryRecursive(tempDirName);
    }
    throw err;
  }

  if (retval && deleteTmpDirOnFailure) {
    deleteDirectoryRecursive(tempDirName);
  }

  return retval;
}

module.exports = {
  splitWavParallel: splitWavParallel,
  splitWavSequential: splitWavSequential
}
