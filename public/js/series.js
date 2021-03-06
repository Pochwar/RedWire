var expandPanel = function (index) {
   
    // get data
    var title = $('#data-'+index+' .data-title').text();
    var overview = $('#data-'+index+' .data-overview').text();
    var img = $('#poster-'+index).attr('src');
    var link = $('#data-'+index+' .data-link a').attr('href');
    
    // get row
    var row = $('#poster-'+index).parent().parent().parent();

    //setPanelPosition();
    $('#panel').insertAfter( $(row) );

    // update panel
    $('#panel-title').text(title);
    $('#panel-overview').text(overview);
    $('#panel-poster').attr("src", img);
    $('#panel-poster').attr("alt", title);
    $('#panel-poster').attr("title", title);
    $('#panel-details').attr("href", link);

     $("#panel").show();
}

var closePanel = function(e){
    e.preventDefault();
    $("#panel").hide();
}

// init when document ready
$( document ).ready( function(){
   $("#panel").hide();
});