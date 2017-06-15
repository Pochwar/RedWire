$(document).ready(function() {

    $(".viewed").click(function(e) {
        e.preventDefault();

		var button = $("#" + e.target.id);

		if (button.hasClass("btn-warning")) {
			button.removeClass("btn-warning");
			button.addClass("btn-success");
			button.html("&#10003; Vu");

			$.ajax({
				url : '/user', 
				type : 'PUT', 
				data : {
					episodeId: e.target.id,
					remove: false,
				},
			success: response => {
				// console.log(response);
				},
			error: error => {
				console.log(error);
				}
			});

		} else {
			button.removeClass("btn-success");
			button.addClass("btn-warning");
			button.html("Pas vu");

			$.ajax({
				url : '/user', 
				type : 'PUT', 
				data : {
					episodeId: button.id,
					remove: true,
				},
			success: response => {
				// console.log(response);
				},
			error: error => {
				console.log(error);
				}
			});
		}
		

    });
});