function searchBy(e, val) {
    e.preventDefault();
    $('#search-by').val(val);
    var text = $('#search-'+val).text();
    $('#search-input').attr('placeholder', text);
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