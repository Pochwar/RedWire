class IndexCtrl {
    static indexLoggedAction(req, res) {
        res.render('indexAuthenticated.twig');
    }
}


module.exports = IndexCtrl;
