$(document).ready(function() {
	$("#login_form").on("submit", function(e){
	    e.preventDefault();

		const data ={
	            "mail" : $('#connection_email').val(),
	            "password" : $('#connection_pwd').val(),
	        }

	    $.ajax({
	       url : '/login', 
	       type : 'POST', 
	       data : data,
	       success: response => {
	       	console.log(response.msg);
	       	if (response.msg === "loginOk") {
	       		$('#modal_connection').modal('toggle');
	       		window.location.replace("/home");
	       	} else {
	       		alert('Erreur de login');
	       	}

	       },
	       error: error => {
	       	 alert('Erreur de login');
	       }
	    });
	   
	});
});
