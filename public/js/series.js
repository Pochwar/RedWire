var expandPanel = function (index) {
    
    // get data
    var title = $('#data-'+index+' .data-title').text();
    var overview = $('#data-'+index+' .data-overview').text();
    var img = $('#poster-'+index).src;

    // update panel
    $('#panel-title').text(title);
    $('#panel-overview').text(overview);
    $('#panel-poster').attr("src", img);
    $('#panel-poster').attr("alt", title);
     $('#panel-poster').attr("title", title);
}