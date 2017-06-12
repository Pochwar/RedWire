var addEpisode = function(){
	var id = document.getElementById('episodes').childNodes.length;

	var div = document.createElement('div');
	div.setAttribute("id", "ep_" + id);

	var labelTitle = document.createElement('label');
	labelTitle.innerText = "{{ __('TITLE') }}" + " *";
	labelTitle.className = "ct-txt-white";
	labelTitle.setAttribute("for", "title_" + id);

	var inputTitle = document.createElement('input');
	inputTitle.setAttribute("type", "text"); 
	inputTitle.setAttribute("name", "title_" + id); 
	inputTitle.className = "form-control"; 
	inputTitle.setAttribute("id", "title_" + id); 
	inputTitle.setAttribute("placeholder", "{{ __('TITLE') }}"); 
	inputTitle.setAttribute("minlength", 1); 
	inputTitle.setAttribute("maxlength", 50); 


	var labelNumberSeason = document.createElement('label');
	labelNumberSeason.innerText = "{{ __('NUMBERSEASON') }}" + " *";
	labelNumberSeason.className = "ct-txt-white";
	labelNumberSeason.setAttribute("for", "numberSeason_" + id);

	var inputNumberSeason = document.createElement('input');
	inputNumberSeason.setAttribute("type", "number"); 
	inputNumberSeason.setAttribute("name", "numberSeason_" + id); 
	inputNumberSeason.className = "form-control"; 
	inputNumberSeason.setAttribute("id", "numberSeason_" + id); 
	inputNumberSeason.setAttribute("placeholder", "{{ __('NUMBERSEASON') }}"); 
	inputNumberSeason.setAttribute("value", 0); 
	inputNumberSeason.setAttribute("min", 1); 

	
	var labelNumberEpisode = document.createElement('label');
	labelNumberEpisode.innerText = "{{ __('NUMBEREPISODE') }}" + " *";
	labelNumberEpisode.className = "ct-txt-white";
	labelNumberEpisode.setAttribute("for", "numberEpisode" + id);

	var inputNumberEpisode = document.createElement('input');
	inputNumberEpisode.setAttribute("type", "number"); 
	inputNumberEpisode.setAttribute("name", "numberEpisode" + id); 
	inputNumberEpisode.className = "form-control"; 
	inputNumberEpisode.setAttribute("id", "numberEpisode" + id); 
	inputNumberEpisode.setAttribute("placeholder", "{{ __('NUMBEREPISODE') }}"); 
	inputNumberEpisode.setAttribute("value", 0); 
	inputNumberEpisode.setAttribute("min", 1); 

	
	var labelOverview = document.createElement('label');
	labelOverview.innerText = "{{ __('OVERVIEW') }}";
	labelOverview.className = "ct-txt-white";
	labelOverview.setAttribute("for", "overview" + id);

	var inputOverview = document.createElement('input');
	inputOverview.setAttribute("type", "text"); 
	inputOverview.setAttribute("name", "overview" + id); 
	inputOverview.className = "form-control"; 
	inputOverview.setAttribute("id", "overview" + id); 
	inputOverview.setAttribute("placeholder", "{{ __('OVERVIEW') }}"); 
	inputOverview.setAttribute("minlength", 3); 

	var hr = document.createElement('hr');

	div.appendChild(labelTitle);
	div.appendChild(inputTitle);

	div.appendChild(labelNumberSeason);
	div.appendChild(inputNumberSeason);

	div.appendChild(labelNumberEpisode);
	div.appendChild(inputNumberEpisode);

	div.appendChild(labelOverview);
	div.appendChild(inputOverview);

	div.appendChild(hr);

	$("#episodes").append(div);

	var counter = $("#counterEpisode").val();
	counter++;
	$("#counterEpisode").val(counter);

}

$("#add_episode").click(function(){
	addEpisode();
})