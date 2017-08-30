/* source: http://stackoverflow.com/questions/11406605/how-to-make-a-link-act-as-a-file-input */
/* when "upload-link" is clicked, trigger the event for the upload button*/
$(function(){
	$("#upload-link").on('click', function(event){
		event.preventDefault();
		$("#upload-file:hidden").trigger('click');
        $("#upload-file").data('clicked', true);
	})
});

/* after the file has been uploaded, display it so the user knows which file was chosen*/
function getFilename(file_upload) {
    var file = file_upload.files[0];  
    var filename = file.name;
    $("#filename i").html(filename);
}

/* parse the text box of instructors */
$(function() {
    $("#instructor-button").on('click', function(event) {
        var instructors = $("#instructor-box").val();
        $("#i-test").html(instructors);
    })
});

/* parse the text box of students or the uploaded file */
$(function() {
    $("#student-button").on('click', function(event) {
        var students = $("#student-box").val();
        $("#s-test").html(students);
        if($("#upload-file").data('clicked')) {

        }
        else {

        }
    })
});

/* filters searches */
function filter() {
    $.ajax({
        type: "GET",
        url: "/manageCourse/get_user_courses",
        success: function(data) {
            console.log(data);
        }
    });
}
