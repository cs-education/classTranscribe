$(document).ready(function () {
    $('#signup-form').submit(function(event) {
        event.preventDefault();
        $.ajax({
            url: "/signup/submit",
            type: "POST",
            data: $('#signup-form').serialize(),
            error: function() {
            },
            success: function(message) {
                console.log(message);
                alert(message);
            }
        });
    });
});

// $(document).ready(function () {
//     $('#login-form').submit(function(event) {
//         event.preventDefault();
//         $.ajax({
//             url: "/login/submit",
//             type: "POST",
//             data: $('#login-form').serialize(),
//             error: function() {
//             },
//             success: function(message) {
//                 alert(message);
//             }
//         });
//     });
// });

// $(document).ready(function () {
//     $('#reset-password-form').submit(function(event) {
//         event.preventDefault();
//         $.ajax({
//             url: "/resetPassword/submit",
//             type: "POST",
//             data: $('#reset-password-form').serialize(),
//             error: function() {
//             },
//             success: function(message) {
//                 alert(message);
//             }
//         });
//     });
// });

// $(document).ready(function () {
//     $('#change-password-form').submit(function(event) {
//         event.preventDefault();
//         $.ajax({
//             url: "/changePassword/submit",
//             type: "POST",
//             data: $('#change-password-form').serialize(),
//             error: function() {
//             },
//             success: function(message) {
//                 alert(message);
//             }
//         });
//     });
// });