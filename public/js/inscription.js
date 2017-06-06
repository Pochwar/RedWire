// plugin for inscription form checking
(function(){

    function InscriptionForm(){};

    InscriptionForm.prototype.initChecking = function(){

        // confirmation email
        $('#inscription_email_conf').focusout( 
            this.compareFields('#inscription_email', '#inscription_email_conf', "Les emails ne correspondent pas")
        );
        
        // confirmation password
        $('#inscription_email_conf').focusout( 
            this.compareFields('#inscription_pwd', '#inscription_pwd_conf', "Les mot de passes ne correspondent pas")
        );
    }

    InscriptionForm.prototype.compareFields = function(baseField, comparedField, errorMsg) {
        
        return function() {
            
            var baseInput = document.querySelector(baseField);
            var comparedInput = document.querySelector(comparedField);
            
            if( baseInput.value != comparedInput.value)  {
                comparedInput.setCustomValidity(errorMsg);
            }
            else {
                comparedInput.setCustomValidity("");
            }
        }
    }

    this.InscriptionForm = new InscriptionForm();
})();

// init when document ready
$( document ).ready( function(){

    // init form checking
    InscriptionForm.initChecking();
});