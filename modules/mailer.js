/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var nodemailer = require('nodemailer')
var mailerPass = process.env.MAILER_PASS;
var mailID = process.env.MAILER_ID;

if (!mailerPass) throw "Need a password in environmental variables!";
if (!mailID) throw "Need a gmail address in environmental variables!";

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: mailID,
    pass: mailerPass
  }
});

function sendEmail(to, subject, body) {
  var mailOptions = {
    from: 'Class Transcribe Team <' + mailID + '>',
    to: to,
    subject: subject, 
    text: body
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}

function progressEmail(netId, className, transcriptionCount) {
  if (netId != null) {
    var emailSuffix = '@illinois.edu';
    var subject = className + ' Class Transcribe Progress';
    var faqLink = 'https://github.com/cs-education/classTranscribe/blob/master/documentation/student_faq.md';
    var body = [
      'Hi,',
      'You have completed ' + transcriptionCount + ' transcriptions for ' + className + '.',
      'An FAQ is available at ' + faqLink + '. If you have any questions/concerns please email ' + mailID + '.',
      'Thank you for participating!',
      'The Class Transcribe Team'
    ].join('\n\n');
    sendEmail(netId + emailSuffix, subject, body);
  }
}

module.exports = {
  sendEmail: sendEmail,
  progressEmail: progressEmail
};
