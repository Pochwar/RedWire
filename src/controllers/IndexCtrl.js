export default class IndexCtrl {
    constructor(title){
        this.title = title;
    }

    get(req, res) {
        //connected home page
        if (req.session.connected) {
            res.render('indexAuth.twig', {
                title : `${this.title} - Home`,
                })
        } else {
            res.render('indexUnauth.twig',{
                title : `${this.title} - Home`,
            });
        }
    }
}
