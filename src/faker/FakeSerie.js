const faker = require('faker');

class FakeSerie {
    constructor() {
        //user lang : random between "fr" and "en"
        // let locale;
        this.randLangId = Math.round(Math.random());
        switch (this.randLangId) {
            case 0:
                this.locale = "fr";
                break;

            case 1:
                this.locale = "en";
                break;
        }

        //set locale
        faker.locale = this.locale;

        //generate fake user
        this.local_id = faker.random.number();
        this.api_id = faker.random.number();
        this.title = faker.lorem.sentence();
        this.overview = faker.lorem.sentences();
        this.createdAt = faker.date.recent();
        this.updatedAt = faker.date.recent();
        this.langId = this.randLangId;
        this.validated = faker.random.boolean();

    }
}

module.exports = FakeSerie;