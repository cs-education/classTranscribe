//
//
// /** Copyright 2015 Board of Trustees of University of Illinois
//  * All rights reserved.
//  *
//  * This source code is licensed under the MIT license found in the
//  * LICENSE file in the root directory of this source tree.
//  */
//
// highDensityQueue = function(response, className, netId, attemptNum) {
//     var args = ["ClassTranscribe::Tasks::" + className, "0", "99999", "WITHSCORES", "LIMIT", "0", "1"];
//     client.zrangebyscore(args, function (err, result) {
//         if (err) {
//             throw err;
//         }
//
//         // Tasks will only be empty if there are no tasks left or they've moved to PrioritizedTasks
//         if (!result.length) {
//             var args = ["ClassTranscribe::PrioritizedTasks::" + className, "0", "99999",
//                 "WITHSCORES", "LIMIT", "0", "1"];
//             client.zrangebyscore(args, function (err, result) {
//                 if (!result.length) {
//                     response.end("No more tasks at the moment. Please email classtranscribe@gmail.com.");
//                 } else {
//                     taskName = result[0];
//                     taskScore = parseInt(result[1], 10);
//
//                     queueResponse(response, "PrioritizedTasks", netId, className, taskName, attemptNum);
//                 }
//             });
//         } else {
//             var taskName = result[0];
//             var taskScore = parseInt(result[1], 10);
//
//             if (taskScore >= 2) {
//                 initPrioritizedTask(response, className, attemptNum);
//             } else {
//                 queueResponse(response, "Tasks", netId, className, taskName, attemptNum);
//             }
//         }
//     });
// }
//
// initPrioritizedTask = function(response, className, netId, attemptNum) {
//     var numTasksToPrioritize = 10;
//     // Can't call zcard if doesn't exist. Unable to be directly handled by err in zcard call
//     // due to how the redis client works
//     client.exists("ClassTranscribe::PrioritizedTasks::" + className, function (err, code) {
//         if (err) {
//             throw err;
//         }
//
//         if (code === 0) {
//             moveToPrioritizedQueue(response, className, netId, 0, numTasksToPrioritize, attemptNum);
//         } else {
//             client.zcard("ClassTranscribe::PrioritizedTasks::" + className, function (err, numberTasks) {
//                 if (err) {
//                     throw err;
//                 }
//
//                 moveToPrioritizedQueue(response, className, netId, numberTasks, numTasksToPrioritize, attemptNum);
//             });
//         }
//     });
// }
//
// queueResponse = function(response, queueName, netId, className, chosenTask, attemptNum) {
//     console.log(chosenTask);
//
//     if (attemptNum === 10) {
//         response.end('It looks like you have already completed the available tasks.\n' +
//             'If you believe this is incorrect please contact classtranscribe@gmail.com')
//         return;
//     }
//
//     var incrArgs = ["ClassTranscribe::" + queueName + "::" + className, "1", chosenTask];
//     client.zincrby(incrArgs);
//
//     var netIDTaskTuple = netId + ":" + chosenTask;
//     console.log('tuple ' + netIDTaskTuple);
//     var date = new Date();
//     var dateString = date.getTime();
//     var hsetArgs = ["ClassTranscribe::ActiveTranscribers::" + className, netIDTaskTuple, dateString];
//     client.hset(hsetArgs);
//
//     var fileName = chosenTask + "-" + netId + ".txt";
//     var isMemberArgs = ["ClassTranscribe::First::" + className, fileName]
//     client.sismember(isMemberArgs, function (err, result) {
//         if (result) {
//             highDensityQueue(response, className, netId, attemptNum + 1);
//         } else {
//             // If not in First it may be in Finished
//             isMemberArgs = ["ClassTranscribe::Finished::" + className, fileName]
//             client.sismember(isMemberArgs, function (err, result) {
//                 if (result) {
//                     highDensityQueue(response, className, netId, attemptNum + 1);
//                 } else {
//                     response.end(chosenTask);
//                 }
//             });
//         }
//     });
// }
//
// /**
//  *  This function moves tasks from the Tasks to PrioritizedTasks queue, if needed.
//  *  Then returns a task to be completed
//  *
//  * @param  {int} Number of tasks already in set
//  * @param  {int} Number tasks desired in set
//  * @return {string} task to be completed
//  */
//
//
// moveToPrioritizedQueue = function(response, className, netId, numberTasks, numTasksToPrioritize, attemptNum) {
//     if (numberTasks < numTasksToPrioritize) {
//         var numDifference = numTasksToPrioritize - numberTasks;
//         var args = ["ClassTranscribe::Tasks::" + className, "0", "99999",
//             "WITHSCORES", "LIMIT", "0", numDifference];
//         client.zrangebyscore(args, function (err, tasks) {
//             if (err) {
//                 throw err;
//             }
//
//             for (var i = 0; i < tasks.length; i += 2) {
//                 var taskName = tasks[i];
//                 var score = parseInt(tasks[i + 1], 10);
//                 client.zrem("ClassTranscribe::Tasks::" + className, taskName);
//                 client.zadd("ClassTranscribe::PrioritizedTasks::" + className, score, taskName);
//             }
//             getPrioritizedTask(response, className, netId, attemptNum);
//         });
//     } else {
//         getPrioritizedTask(response, className, netId, attemptNum);
//     }
// }
//
// getPrioritizedTask = function(response, className, netId, attemptNum) {
//     var args = ["ClassTranscribe::PrioritizedTasks::" + className, "0", "99999", "LIMIT", "0", "1"];
//     client.zrangebyscore(args, function (err, tasks) {
//         if (err) {
//             throw err;
//         }
//         var task = tasks[0]
//         console.log('tasks from priority ' + task);
//         queueResponse(response, "PrioritizedTasks", netId, className, task, attemptNum);
//     });
// }
//
// clearInactiveTranscriptions = function() {
//     var classesToClear = ["CS241-SP16", "CHEM233-SP16", "CS225-SP16"];
//     var curDate = new Date();
//
//     classesToClear.forEach(function (className) {
//         client.hgetall("ClassTranscribe::ActiveTranscribers::" + className, function (err, result) {
//             if (err) {
//                 console.log(err);
//                 return;
//             }
//
//             if (result !== null) {
//                 for (var i = 0; i < result.length; i += 2) {
//                     var netIDTaskTuple = result[i].split(":");
//                     var netId = netIDTaskTuple[0];
//                     var taskName = netIDTaskTuple[1];
//                     var startDate = new Date(result[i + 1]);
//
//                     var timeDiff = Math.abs(curDate.getTime() - startDate.getTime());
//                     var diffHours = Math.ceil(timeDiff / (1000 * 3600));
//
//                     if (diffHours >= 2) {
//                         client.hdel("ClassTranscribe::ActiveTranscribers::" + className, result[i]);
//                         // dont' know which queue task is currently in
//                         var taskArgs = ["ClassTranscribe::Tasks::" + className, taskName];
//                         client.zscore(taskArgs, function (err, result) {
//                             if (err) {
//                                 throw err;
//                             } else if (result !== null) {
//                                 client.zincrby("ClassTranscribe::Tasks::" + className, -1, taskName);
//                             }
//                         })
//
//                         var priorityArgs = ["ClassTranscribe::PrioritizedTasks::" + className, taskName];
//                         client.zscore(priorityArgs, function (err, result) {
//                             if (err) {
//                                 throw err;
//                             } else if (result !== null) {
//                                 client.zincrby("ClassTranscribe::Tasks::" + className, -1, taskName);
//                             }
//                         })
//                     }
//                 }
//             }
//         })
//     });
//
// }
