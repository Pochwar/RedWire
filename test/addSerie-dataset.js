module.exports = {
    "route": {
        "name": "Registration route",
        "path": "/series/add",
        "verb": "post"
    },
    "dataset": [
         {
            "name": "valid serie - simplified",
            "status": 200,
            "data": {
                "title":"test",
                "langCode":"fr",
                "overview":"test",
                "poster":"",
                "actors":"typahnei",
                "counterEpisode":0,
            }
        },
        {
            "name": "valid serie with episod",
            "status": 200,
            "data": {
                "title":"test",
                "langCode":"fr",
                "overview":"test",
                "poster":"dl20_proposition2.png",
                "actors":"typahnei",
                "title_0":"episode 1",
                "numberSeason_0":1,
                "numberEpisode0":1,
                "overview0":"épisode 1",
                "counterEpisode":1,
            }
        },
        {
            "name": "valid serie without episod",
            "status": 200,
            "data": {
                "title":"test",
                "langCode":"fr",
                "overview":"test",
                "poster":"dl20_proposition2.png",
                "actors":"typahnei",
            }
        },
        {
            "name": "empty form",
            "status": 403,
            "data": {
            }
        },
        {
            "name": "empty title",
            "status": 403,
            "data": {
                "title":"",
                "langCode":"fr",
                "overview":"test",
                "poster":"dl20_proposition2.png",
                "actors":"typahnei",
                "title_0":"episode 1",
                "numberSeason_0":1,
                "numberEpisode0":1,
                "overview0":"épisode 1",
                "counterEpisode":1,
            }
        },
        {
            "name": "empty episod",
            "status": 403,
            "data": {
                "title":"test",
                "langCode":"fr",
                "overview":"test",
                "poster":"dl20_proposition2.png",
                "actors":"typahnei",
                "title_0":"",
                "numberSeason_0":0,
                "numberEpisode0":0,
                "overview0":"",
                "counterEpisode":1,
            }
        },
        {
            "name": "wrong counter",
            "status": 403,
            "data": {
                 "title":"test",
                "langCode":"fr",
                "overview":"test",
                "poster":"dl20_proposition2.png",
                "actors":"typahnei",
                "title_0":"episode 1",
                "numberSeason_0":1,
                "numberEpisode0":1,
                "overview0":"épisode 1",
                "counterEpisode":5,
            }
        }
    ]
}