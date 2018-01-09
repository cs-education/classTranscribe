$(document).ready(function () {
    $('#signup-form').submit(function(event) {
        event.preventDefault();
        $.ajax({
            url: "/signup/submit",
            type: "POST",
            data: $('#signup-form').serialize(),
            error: function() {
            },
            success: function(response) {
                if (response.message == 'success') {
                    window.location.href = response.html;
                } else {
                    alert(response.message);
                }
            }
        });
    });
});

$(document).ready(function () {
    $('#login-form').submit(function(event) {
        event.preventDefault();
        $.ajax({
            url: "/login/submit",
            type: "POST",
            data: $('#login-form').serialize(),
            error: function() {
            },
            success: function(response) {
                if (response.message == 'success') {
                    window.location.href = response.html;
                } else {
                    alert(response.message);
                }
            }
        });
    });
});

$(document).ready(function () {
    $('#settings-form').submit(function(event) {
        event.preventDefault();
        $.ajax({
            url: "/settings/submit",
            type: "POST",
            data: $('#settings-form').serialize(),
            error: function() {
            },
            success: function(response) {
                if (response.message == 'success') {
                    window.location.href = response.html;
                } else {
                    alert(response.message);
                }
            }
        });
    });
});

$(document).ready(function () {
    $('#reset-password-form').submit(function(event) {
        event.preventDefault();
        $.ajax({
            url: "/resetPassword/submit",
            type: "POST",
            data: $('#reset-password-form').serialize(),
            error: function() {
            },
            success: function(response) {
                if (response.message == 'success') {
                    window.location.href = response.html;
                } else {
                    alert(response.message);
                }
            }
        });
    });
});

$(document).ready(function () {
    $('#change-password-form').submit(function(event) {
        event.preventDefault();
        $.ajax({
            url: "/changePassword/submit",
            type: "POST",
            data: $('#change-password-form').serialize(),
            error: function() {
            },
            success: function(response) {
                if (response.message == 'success') {
                    window.location.href = response.html;
                } else {
                    alert(response.message);
                }
            }
        });
    });
});