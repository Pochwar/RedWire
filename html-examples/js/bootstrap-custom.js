// Plugin for bootstrap library
(function(){

    function BootstrapPlugin(){}

    BootstrapPlugin.prototype.initNavigation = function(){
    
        // les liens page-scroll déclenchent un scroll animé
        $('.page-scroll a').bind('click', function(event) {

            // cible & vitesse
            var target = $(this).attr('href');
            var speed = 750;

            // Pour éviter le clignotement dans IE / Firefox, ...
            event.preventDefault();

            // fermeture du menu déroulant
            $('.navbar-toggle:visible').click();

            // animation
            $('html, body').animate( { scrollTop: $(target).offset().top }, speed ); 
        });
    }

    // affect plugin to window
    this.BootstrapPlugin = new BootstrapPlugin();
})();

// init when document ready
$( document ).ready( function(){

    // init bootstrap library
    BootstrapPlugin.initNavigation();
});