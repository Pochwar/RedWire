function searchBy(e, val) {
    e.preventDefault();
    //$('#search-by').val(val);
    
    // set placeholder
    var text = $('#search-'+val).text();
    $('#search-input').attr('placeholder', text);

    // set form action
    $('#search-form').attr('action', '/search/'+val);
}

// init when document ready
$( document ).ready( function(){
   
   $('#search-title').click( function($event) {
       searchBy($event, 'title');
   });

   $('#search-actor').click( function($event) {
       searchBy($event, 'actor');
   });
});