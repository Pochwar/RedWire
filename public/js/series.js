var expandPanel = function (index) {
    
    // get data
    var title = $('#data-'+index+' .data-title').text();
    var overview = $('#data-'+index+' .data-overview').text();
    var img = $('#poster-'+index).attr('src');

    // update panel
    $('#panel-title').text(title);
    $('#panel-overview').text(overview);
    $('#panel-poster').attr("src", img);
    $('#panel-poster').attr("alt", title);
    $('#panel-poster').attr("title", title);
}

var timeout;
$(window).on("load resize", function () {
    
    if (timeout) {
        window.clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
        $(".poster-list").removeClass("ct-border-red").each(function () {
             console.log( $(this).offset().top+' -- ' + $(this).next().offset().top);
            if ($(this).next().length && $(this).offset().top < $(this).next().offset().top) {
                $(this).addClass("ct-border-red");
            }
            if ($(this).prev().length && $(this).offset().top > $(this).prev().offset().top) {
                //$(this).addClass("first");
            }
        });
    }, 100);
});