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
    
    // set serach by title
   $('#search-title').click( function($event) {
       searchBy($event, 'title');
   });

   // set search by actor
   $('#search-actor').click( function($event) {
       searchBy($event, 'actor');
   });

   // prevent submit if empty search
   $( '#search-form').on('submit', function(e) {
        if( $('#search-input').val().trim() === '') {

            e.preventDefault();
        }
    });
});

