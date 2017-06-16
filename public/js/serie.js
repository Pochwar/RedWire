$(document).ready(function() {

    $(".viewed").click(function(e) {
        e.preventDefault();

		var button = $("#" + e.target.id);
		var data = {};

		if (button.hasClass("btn-warning")) {
			button.removeClass("btn-warning");
			button.addClass("btn-success");
			button.html("&#10003; Vu");

			data.episodeId = e.target.id;
			data.remove = false;

		} else {
			button.removeClass("btn-success");
			button.addClass("btn-warning");
			button.html("Pas vu");

			data.episodeId = e.target.id;
			data.remove = true;

		}

		$.ajax({
			url : '/user/episodes', 
			type : 'PUT', 
			data : data,
		success: response => {
			// console.log(response);
			},
		error: error => {
			console.log(error);
			}
		});
    });

    $(".followed").click(function(e) {
        e.preventDefault();

		var button = $("#" + e.target.id);
		var data = {};

		if (button.hasClass("btn-warning")) {
			button.removeClass("btn-warning");
			button.addClass("btn-success");
			button.html("&#10003; {{ __(\"FOLLOWED_TRUE\") }}");

			data.serieId = e.target.id;
			data.remove = false;

		} else {
			button.removeClass("btn-success");
			button.addClass("btn-warning");
			button.html("{{ __(\"FOLLOWED_FALSE\") }}");

			data.serieId = e.target.id;
			data.remove = true;

		}

		$.ajax({
			url : '/user/series', 
			type : 'PUT', 
			data : data,
		success: response => {
			// console.log(response);
			},
		error: error => {
			console.log(error);
			}
		});

		$.ajax({
			url : '/series/'+ e.target.id + '/follow',
			type : 'PUT', 
			data : data,
		success: response => {
			// console.log(response);
			},
		error: error => {
			console.log(error);
			}
		});
    });
});