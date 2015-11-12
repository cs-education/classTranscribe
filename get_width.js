//check for arguments
if(process.argv.length<3){
	console.log("not enough arguments");
	process.exit(1);
}
//get filename
var aligned_file=process.argv[2];
console.log(aligned_file);


var output="[";

//read aligned output
var fs = require('fs');
fs.readFile(aligned_file, 'utf8', function (err, data) {
	if (err) throw err;
	var alligned_output = JSON.parse(data);
  	array=alligned_output.words;
  
	var sentance="{\"text\":\"";  
	var flag=1;
	var start,end=0;

	for(var i=0;i<array.length;i++){
		//check to record start time
	  	if(flag){
	  		if(i==0){// ensure that the start time starts at 0
	  			start=0;
	  		}
	  		else{
	  			start=array[i].start;
	  		}
	  		flag=0;
	  	}
  		var word=array[i].word;
  		word=word.replace("\"","\\\"");
  		word=word.replace("<<",",");//
  		//check for sentence end
  		if(word[word.length-1]=='.' || word[word.length-1]=='?' || word[word.length-1]=='!'){
  			if(i<array.length-1 && array[i+1].word=="{p}"){//peek into the starting of next sentence to checl for sp
  				end=array[i+1].end;
  				i++;
  			}
  			else{
  				end=array[i].end;//record end time
  			}

	  		sentance=sentance.concat(word+"\",");
	  		console.log(start," ",end);
	  		var width=parseInt(((end-start)*64).toFixed())-2;//calculate width
	  		sentance=sentance.concat("\"width\":",width,"},");
	  		output=output.concat(sentance);
	  		sentance="{\"text\":\"";//initialise sentance for next iteration
	  		flag=1;
  		}
  		else{
  			if(word!="{p}"){
	  			sentance=sentance.concat(word+" ");
	  		}
  		}
     }


     //in case student forget to add punctuation for the last sentence
     if(sentance.length>10){
     	end=array[array.length-1].end;

     	var width=parseInt(((end-start)*64).toFixed()) - 2;//calculate width
	  	sentance=sentance.concat("\"width\":",width,"},");
	  	output=output.concat(sentance);
	  	console.log(start," ",end);
     }
     
 
	output=output.concat("]");
	output=output.replace(",]",']');
	//write to file
	var wf = require('fs');
	wf.writeFile("width.json", output, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	}); 
});
