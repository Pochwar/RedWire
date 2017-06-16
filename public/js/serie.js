$(document).ready(function() {

    $(".viewed").click(function(e) {
        e.preventDefault();

		var button = $("#" + e.target.id);
		var data = {};

		if (button.hasClass("btn-warning")) {
			button.removeClass("btn-warning");
			button.addClass("btn-success");
			// button.html("&#10003; {{ __(\"VIEWED_TRUE\") }}");
			$("#button-viewed-false").toggle();
			$("#button-viewed-true").toggle();

			data.episodeId = e.target.id;
			data.remove = false;

		} else {
			button.removeClass("btn-success");
			button.addClass("btn-warning");
			// button.html("{{ __(VIEWED_FALSE) }}");
			$("#button-viewed-false").toggle();
			$("#button-viewed-true").toggle();

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

		var buttonFollow = $("#" + e.target.id);
		var data = {};

		if (buttonFollow.hasClass("btn-warning")) {
			buttonFollow.removeClass("btn-warning");
			buttonFollow.addClass("btn-success");
			// buttonFollow.html("&#10003; {{ __(\"FOLLOWED_TRUE\") }}");
			$("#button-followed-false").toggle();
			$("#button-followed-true").toggle();

			data.serieId = e.target.id;
			data.remove = false;

		} else {
			buttonFollow.removeClass("btn-success");
			buttonFollow.addClass("btn-warning");
			// buttonFollow.html(notFollowed);
			$("#button-followed-true").toggle();
			$("#button-followed-false").toggle();

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