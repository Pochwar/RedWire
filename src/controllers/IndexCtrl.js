class IndexCtrl {
    static indexLoggedAction(req, res) {
        res.render('indexAuthenticated.twig', {
            pseudo: req.session.user.pseudo,
        })
    } 
}


module.exports = IndexCtrl;