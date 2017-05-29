export default class AdminHomeCtrl {
    get(req, res) {
        //Connected
        if (req.session.connected) {
            //check level access
            if(req.session.user.roleId >= 4){
                let lang = "fr";
                if(req.cookies.i18n){lang = req.cookies.i18n}

                res.render('admin.twig', {
                    lang: lang,
                    pseudo: req.session.user.pseudo
                })
            } else {
                res.render('unauthorization.twig',{});
            }

        }
        //not connected
        else {
            res.render('unauthentication.twig',{});
        }
    }
}
