$(document).ready(function() {
    $('#emailErr').hide();
    $('#modal_connection #cancel').on('click', function() {
        $('#connection_email').val('');
        $('#connection_pwd').val('');
        $('#emailErr').text('');
        $('#emailErr').hide();
    });
    $('#modal_connection .close').on('click', function() {
        $('#connection_email').val('');
        $('#connection_pwd').val('');
        $('#emailErr').text('');
        $('#emailErr').hide();
    });
    $("#login_form").on("submit", function(e) {
        e.preventDefault();

        const data = {
            "mail": $('#connection_email').val(),
            "password": $('#connection_pwd').val(),
        }

        $.ajax({
            url: '/login',
            type: 'POST',
            data: data,
            success: response => {
                $('#modal_connection').modal('toggle');
                window.location.replace("/home");
            },
            error: error => {
                $('#emailErr').text(error.responseJSON.msg);
                $('#emailErr').show();
            }
        });

    });
});