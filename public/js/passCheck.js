$("#passCheck").hide();
let samePasswords;
const checkPasswords = () => {
    if ($("#password").val() !== $("#passwordConf").val()) {
        $("#passCheck").show();
        samePasswords = false;
    } else {
        $("#passCheck").hide();
        samePasswords = true;
    }
};
$("#password").on('keyup', checkPasswords);
$("#passwordConf").on('keyup', checkPasswords);

$('#registrationForm').submit(e => {
    e.preventDefault();

    //passwords
    if (!samePasswords) return;
    e.target.submit();

});