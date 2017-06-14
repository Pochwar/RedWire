$(document).ready(function() {
    console.log('serie.js loaded');

    $(".viewed").click(function(e) {
        e.preventDefault();
        console.log(e.target.id);

        var data = {
            id: e.target.id,
        }

	    $.ajax({
	       url : '/login', 
	       type : 'PUT', 
	       data : data,
	       success: response => {
	       	console.log(response);
	       },
	       error: error => {
	       	 console.log(error);
	       }
	    });

    });
});