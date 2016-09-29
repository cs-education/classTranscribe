var fs = require('fs');
var readline = require('readline');
var sleep = require('sleep');

var mailer = require('../modules/mailer');

segments = [ 'Full_Lecture_Video_01_part0',
  'Full_Lecture_Video_01_part1',
  'Full_Lecture_Video_01_part2',
  'Full_Lecture_Video_01_part3',
  'Full_Lecture_Video_01_part4',
  'Full_Lecture_Video_01_part5',
  'Full_Lecture_Video_01_part6',
  'Full_Lecture_Video_01_part7',
  'Full_Lecture_Video_01_part8',
  'Full_Lecture_Video_01_part9',
  'Full_Lecture_Video_02_part0',
  'Full_Lecture_Video_02_part1',
  'Full_Lecture_Video_02_part10',
  'Full_Lecture_Video_02_part11',
  'Full_Lecture_Video_02_part2',
  'Full_Lecture_Video_02_part3',
  'Full_Lecture_Video_02_part4',
  'Full_Lecture_Video_02_part5',
  'Full_Lecture_Video_02_part6',
  'Full_Lecture_Video_02_part7',
  'Full_Lecture_Video_02_part8',
  'Full_Lecture_Video_02_part9',
  'Full_Lecture_Video_03_part0',
  'Full_Lecture_Video_03_part1',
  'Full_Lecture_Video_03_part2',
  'Full_Lecture_Video_03_part3',
  'Full_Lecture_Video_03_part4',
  'Full_Lecture_Video_03_part5',
  'Full_Lecture_Video_03_part6',
  'Full_Lecture_Video_03_part7',
  'Full_Lecture_Video_03_part8',
  'Full_Lecture_Video_03_part9',
  'Full_Lecture_Video_04_part0',
  'Full_Lecture_Video_04_part1',
  'Full_Lecture_Video_04_part2',
  'Full_Lecture_Video_04_part3',
  'Full_Lecture_Video_04_part4',
  'Full_Lecture_Video_04_part5',
  'Full_Lecture_Video_04_part6',
  'Full_Lecture_Video_04_part7',
  'Full_Lecture_Video_04_part8',
  'Full_Lecture_Video_04_part9',
  'Full_Lecture_Video_05_part0',
  'Full_Lecture_Video_05_part1',
  'Full_Lecture_Video_05_part2',
  'Full_Lecture_Video_05_part3',
  'Full_Lecture_Video_05_part4',
  'Full_Lecture_Video_05_part5',
  'Full_Lecture_Video_05_part6',
  'Full_Lecture_Video_05_part7',
  'Full_Lecture_Video_05_part8',
  'Full_Lecture_Video_05_part9',
  'Full_Lecture_Video_06_part0',
  'Full_Lecture_Video_06_part1',
  'Full_Lecture_Video_06_part2',
  'Full_Lecture_Video_06_part3',
  'Full_Lecture_Video_06_part4',
  'Full_Lecture_Video_06_part5',
  'Full_Lecture_Video_06_part6',
  'Full_Lecture_Video_06_part7',
  'Full_Lecture_Video_06_part8',
  'Full_Lecture_Video_06_part9',
  'Full_Lecture_Video_07_part0',
  'Full_Lecture_Video_07_part1',
  'Full_Lecture_Video_07_part10',
  'Full_Lecture_Video_07_part2',
  'Full_Lecture_Video_07_part3',
  'Full_Lecture_Video_07_part4',
  'Full_Lecture_Video_07_part5',
  'Full_Lecture_Video_07_part6',
  'Full_Lecture_Video_07_part7',
  'Full_Lecture_Video_07_part8',
  'Full_Lecture_Video_07_part9'];


// var people = ['aahuntr2', 'abeeman2', 'aburket2', 'acao6', 'achang17', 'achndrs4', 'acldwll2', 'aclin7', 'acourtn2', 'adaud2', 'adohert2', 'aekumar2', 'afmirza2', 'agoel9', 'agou2', 'ahassa26', 'ahclark3', 'aherwan2', 'ahluwal2', 'aikeliu2', 'ajhung2', 'ajzhang2', 'alangan2', 'alchang2', 'aliang6', 'alilly2', 'alin36', 'alteng2', 'amanoj2', 'amdougl2', 'amei10', 'amotan2', 'andylai2', 'anpham2', 'anshah6', 'anumula2', 'apho2', 'apsun2', 'ardange2', 'arensdo2', 'arjunak2', 'arkalgu2', 'armarco2', 'asachde4', 'asathis2', 'asgilbe2', 'asriram3', 'assethi2', 'aswang3', 'atfaust2', 'avancha2', 'aveselo2', 'avjykmr2', 'avramesh', 'awang47', 'awdisho2', 'awei3', 'awzhang3', 'aykim4', 'ayu22', 'baids2', 'bartmes2', 'basak3', 'bblue2', 'bbogue2', 'bcannel2', 'bcheng9', 'bchoi17', 'bcongdo2', 'bdpower2', 'beitel2', 'belani2', 'bershan2', 'bgirard2', 'bgmoren2', 'bhjhnsn2', 'bilgrie2', 'bkhong2', 'bkurek2', 'blambet2', 'bmin5', 'bniu2', 'bplane2', 'brabe2', 'brianhu2', 'bruckne2', 'bryanju2', 'bsndrsn2', 'bstrone2', 'btao2', 'bttsai2', 'buksa2', 'bvargas2', 'bvien2', 'bwberna2', 'bweibel2', 'bwzhou2', 'bzhang64', 'bzloh2', 'calbers2', 'cbrom2', 'ccheng32', 'cchopp2', 'cdunawa2', 'cecott2', 'cfang12', 'chadri2', 'changhe3', 'chen359', 'chern3', 'cheshir2', 'chkim12', 'choo8', 'cilee2', 'cjfisch2', 'cjfourn2', 'clee158', 'cleetus2', 'colinli2', 'conglin3', 'crofts2', 'cuzmank2', 'cwkelly2', 'cygnus2', 'czhou16', 'davidhe2', 'dbansal4', 'dcgrand2', 'dchen48', 'dchen51', 'ddalmas2', 'ddavis14', 'dekate2', 'deverex2', 'dgobrie2', 'dhefner2', 'dhiman3', 'dhjoo2', 'dhlim3', 'dixit5', 'dlee126', 'dmessin2', 'dmoon8', 'dpfeifr2', 'drong4', 'dsgonza2', 'dshan3', 'dsun18', 'durg2', 'dusad2', 'dwyuan2', 'dxtian2', 'dywong2', 'dzogra2', 'eau3', 'eayala6', 'egacek2', 'eguzman6', 'ehnoh2', 'eicken2', 'ejwang4', 'elee132', 'elsong2', 'elvelez2', 'elwllms2', 'emurray3', 'eni3', 'eqi2', 'evankay2', 'ewinter3', 'ezhuang2', 'fanyang9', 'felixli2', 'feng42', 'ffahmed2', 'ffukui2', 'franzon2', 'galeks2', 'gcgreen2', 'gchen46', 'geldean2', 'ggupta8', 'ghelsel2', 'glindqu2', 'grkale2', 'grshen2', 'grudolp2', 'gwang24', 'gyang14', 'hakhan2', 'hamzah3', 'hangli8', 'hanke2', 'haus2', 'hbae13', 'hcmagnu2', 'hding13', 'hennenf2', 'hgao17', 'hhsieh9', 'hhuang74', 'hillers2', 'hip2', 'hjlynch2', 'hkhokha2', 'hmodhe2', 'hornits2', 'hparker2', 'hpineda2', 'hquan3', 'hu61', 'huachen4', 'hwang236', 'hwu63', 'hyang82', 'hyao8', 'ifitzge2', 'ighosh3', 'ilhardt2'];
var people = ['omelvin2', 'macknic2'];

var counter = 0;
var className = 'CS225-SP16'
var subj = 'CS225 - ClassTranscribe (EC opportunity)'
var body = [
    'Hi,',
    'In CS225 we will be using ClassTranscribe, which facilitates search through lecture videos. This is done by breaking lecture videos into chunks which are transcribed by students.',
    'To try this out try searching "buffer overflow" or "malloc" at http://classtranscribe.com/CS241.',
    'Over the course of the semester you will receive two tasks to complete, each for 0.5% of extra credit. Considering each task only takes about 20 minutes, this is a great time/credit ratio.',
    'If you have any questions/concerns please email omelvin2@illinois.edu.',
    'Below you will find a link to your assigned task.',
    'You can complete a tutorial at http://tinyurl.com/classtranscribetutorial',
    'Normally you will just until the next lecture to complete your task. However, for this first set you have until Monday (2/8) to complete your task - link: '
  ].join('\n\n');

for (var batch_num = 0; batch_num < 3; batch_num++) {
  segments.forEach(function (task) {
    if(counter < 2) {
      var netID = people[counter++];
      var url = 'http://classtranscribe.com/first/' + className + '/' + netID + '/?task=' + task

      console.log('sending to ' + netID);
      mailer.sendEmail(netID + '@illinois.edu', subj, body + url);
    }

    sleep.usleep(1200000); // 1.2s - not sure if rate limiting is an issue
  });
}


