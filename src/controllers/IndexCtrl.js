export default class IndexCtrl {
    get(req, res) {
        /*
        CONNECTED
         */
        //locales
        if (req.session.connected) {
            res.render('indexAuth.twig', {})
        } else {
            /*
            NOT CONNECTED
             */
            res.render('indexUnauth.twig',{});
        }
    }
}
