/* parse the text box of instructors */
$(function() {
    $("#instructor-button").on('click', function(event) {
        var instructors = $("#instructor-box").val();
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


/* parse the text box of students */
$(function() {
    $("#student-button").on('click', function(event) {
        var students = $("#student-box").val();
        $.ajax({
            type: "POST", 
            url: "/addStudents", 
            data: {
                "students": students
            },
            success: function(data) {
                alert(data);
            }
        })
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


/** dropzone video upload **/
//Dropzone.autoDiscover = false;
$(function() {
    Dropzone.options.uploadLectureVideos = {
      //paramName: 'test_file',
      maxFilesize: 1000, // MB
      //maxFiles: 1,
      dictDefaultMessage: 'Drag a file here to upload, or click to select one',
      acceptedFiles: ".mp4, .avi, .flv, .wmv, .mov, .wav, .ogv, .mpg, .m4v",
      init: function() {
        console.log('init');
        this.on('addedfile', function(file) {
            console.log("in addedfile");
        });
      },
    };
});


/* dropzone file upload */
$(function() {
    Dropzone.options.uploadStudentsFiles = {
      //paramName: 'test_file',
      maxFilesize: 100, // MB
      //maxFiles: 1,
      dictDefaultMessage: 'Drag a file here to upload, or click to select one',
      acceptedFiles: ".txt, .csv, .xl*",
      init: function() {
        self = this;
        this.on('addedfile', function(file) {
            console.log("in addedfile");
        });
      },
    };
});

