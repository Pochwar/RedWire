$("#login_form").submit(function(e){
    e.preventDefault();

	const data ={
            "mail" : $('#connection_email').val(),
            "password" : $('#connection_pwd').val(),
        }

    $.ajax({
       url : '/login', 
       type : 'POST', 
       data : data,
       success: response => {
       	console.log(response.msg);
       	switch (response.msg) {
       		case "emptyError":
      			redirect('/?msg=emptyError');
      			break;

      		case "dbError": 
      			redirect('/?msg=dbError');
      			break;

      		case "ok":
      			redirect('/home');
      			break;

      		case "loginError":
      			redirect('/?msg=loginError');
      			break;

      		case default:
      			redirect('/');
      			break;
       	}
       },
       error: error => {
       	 console.log(error);
       }
    });
   
});

