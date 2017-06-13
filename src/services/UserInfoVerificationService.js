class UserInfoVerificationService {
    constructor(conf) {
        this._conf = conf;
    }

    checkAlphaNumOnly(string) {
        const regexp = /^\w+$/;
        let ok = true;
        if (!string.match(regexp)){
            ok = false
        }
        return ok;
    }

    checkDateFormat(date) {
        const regexp = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
        let ok = true;
        if (!date.match(regexp)){
            ok = false
        }
        return ok;
    }

    checkLangId(langId) {
        let ok = true;
        if (!this._conf.site.lang[langId]){
            ok = false
        }
        return ok;
    }

    checkAvatar(avatar) {
        let avatarChecked = avatar;

        //check file format
        const authExt = ['jpg', 'jpeg', 'gif', 'png'];
        const ext = avatar.mimetype.replace("image/", "");
        if (authExt.indexOf(ext) === -1){
            avatarChecked = false
        }

        //check file size

    }
   
}

module.exports = UserInfoVerificationService;