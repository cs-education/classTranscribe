/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
$(function(){
	$("#upload-link").on('click', function(event){
		event.preventDefault();
		$("#upload-file:hidden").trigger('click');
        $("#upload-file").data('clicked', true);
    })
    
    initializeDropzone()

    courseId = 'CS225'
    $.ajax({
        type: "GET", 
        url: `students/${courseId}`, 
        dataType: 'json',
        success: data => {
            let students = document.createElement('ul')
			console.log(data.students)
            data.students.forEach(student => {
                let studentEntry = document.createElement('li')
                studentEntry.innerText = student
                students.appendChild(studentEntry)
            })
            $('#s-test').append(students)
        }
    })
});

/* after the file has been uploaded, display it so the user knows which file was chosen*/
function getFilename(file_upload) {
    var file = file_upload.files[0];  
    var filename = file.name;
    $("#filename i").html(filename);
}

$(function(){
    $("#upload-video-link").on('click', function(event){
        event.preventDefault();
        $("#upload-video:hidden").trigger('click');
        $("#upload-video").data('clicked', true);
    })
});

/* after the file has been uploaded, display it so the user knows which file was chosen*/
function getVideoname(video_upload) {
    var video = video_upload.files[0];  
    var videoname = video.name;
    $("#videoname i").html(videoname);
}

/* parse the text box of instructors */
$(function() {
    $("#instructor-button").on('click', function(event) {
        var instructors = $("#instructor-box").val();
        $("#i-test").html(instructors);
        $.ajax({
            type: "POST", 
            url: "/addInstructors", 
            data: {
                "instructors": instructors 
            },
            success: function(data) {
                alert(data);
            }
        })
    })
});

/* parse the text box of students or the uploaded file */
$('#uploadStudentsFileForm').submit(function(event) {
    event.preventDefault();
    $(this).ajaxSubmit({
        error: function(xhr) {
            console.log('Error: ' + xhr.status);
        },
        success: function(response) {
            console.log(response);
        }
    });
    //disable the page refresh
    //return false;
});    

$(function() {
    $("#student-button").on('click', event => {
        var students = $("#student-box").val();
        // $("#s-test").html(students);
        // if($("#upload-file").data('clicked')) {
        //     var file = document.getElementById("upload-file").files[0];
        //     var filename = file.name;
        //     var formData = new FormData();
        //     formData.append(filename, file);
        //     $.ajax({
        //         type: "POST",
        //         url: "/addStudentsFile",
        //         data: {
        //             //"filename": filename,
        //             "formData": formData
        //         },
        //         processData: false,
        //         contentType: false,
        //         success: function(data) {
        //             alert(data);
        //         }
        //     })
        // } else {
        $.ajax({
            type: "PUT", 
            url: "/students/CS225", 
            data: {
                "students": students
            },
            success: data => {
                alert(`Following students have been added: ${data.addedStudents}`)
                let students = $('#s-test').children()
                data.addedStudents.forEach(student => {
                    let studentEntry = document.createElement('li')
                    studentEntry.innerText = student
                    students.append(studentEntry)
                })
            }
        })
        // }
    })
});

/* filters searches */
function filter() {
    alert(this);
    $.ajax({
        type: "GET",
        url: "/getUserCourses",
        success: function(data) {
            alert(data);
        }
    });
} 

function initializeDropzone(){
    /** dropzone video upload **/
    //Dropzone.autoDiscover = false;
    Dropzone.options.uploadLectureVideos = {
        //paramName: 'test_file',
        maxFilesize: 1000, // MB
        //maxFiles: 1,
        dictDefaultMessage: 'Drag a file here to upload, or click to select one',
        acceptedFiles: ".mp4, .avi, .flv, .wmv, .mov, .wav, .ogv, .mpg, .m4v",
        init: function () {
            console.log('init');
            this.on('addedfile', function (file) {
                console.log("in addedfile");
            });
        },
    };

    /* dropzone file upload */
    Dropzone.options.uploadStudentsFiles = {
        //paramName: 'test_file',
        maxFilesize: 100, // MB
        //maxFiles: 1,
        dictDefaultMessage: 'Drag a file here to upload, or click to select one',
        acceptedFiles: ".txt, .csv, .xl*",
        init: function () {
            self = this;
            this.on('addedfile', function (file) {
                console.log("in addedfile");
            });
        },
    };
}