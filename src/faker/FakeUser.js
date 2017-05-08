import faker from 'faker';

export default class FakeUser {
    constructor(){
        //user lang : random between "fr" and "en"
        // let locale;
        this.randLangId = Math.round(Math.random());
        switch (this.randLangId){
            case 0:
                this.locale = "fr";
                break;

            case 1:
                this.locale = "en";
                break;
        }

        //user role : random between 0 and 5
        this.randRoleId =Math.floor(Math.random()*5);

        //set locale
        faker.locale = this.locale;

        //generate fake user
        this.firstname = faker.name.firstName();
        this.lastname = faker.name.lastName();
        this.pseudo = faker.internet.userName(this.firstname, this.lastname);
        this.bDay = faker.date.past(50, new Date("Sat Sep 20 1992 21:35:02 GMT+0200 (CEST)"));
        this.mail = faker.internet.email(this.firstname, this.lastname);
        this.inscrDay = faker.date.recent();
        this.pass = faker.internet.password();
        this.avatar = faker.internet.avatar();
        this.ban = faker.random.boolean();
        this.lanId = this.randLangId;
        this.roleId = this.randRoleId;
    }
}
