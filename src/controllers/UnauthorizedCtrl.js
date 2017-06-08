// controller for unauthorized access

class UnauthorizedCtrl {

    static indexAction(req, res) {
        res.status(403).render('unauthorization.twig',{});
    }
}

module.exports = UnauthorizedCtrl;