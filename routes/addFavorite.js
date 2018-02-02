"use strict"
module.exports = (app, client) => {
    app.get('/addFavorite', (req, res) => {})
    app.post('/addFavorite', (req, res) => {

        var joke = req.body.joke[0]
        var user = req.session.user.id
        console.log("RANDOM JOKE", joke)

        client.query(`SELECT * FROM favorites WHERE user_id = $1`,[user], (error, result) => {
          // console.log("WAAZAAA",result)
            var jokesCheck = []

            for (var i = 0; i < result.rows.length; i++) {
                jokesCheck.push(result.rows[i].jokes)
            };

          console.log("result",favoriteJokes)
            if(result.rows.length == 10) {
                var favoriteJokes = []

                for (var i = 0; i < result.rows.length; i++) {
                  favoriteJokes.push(result.rows[i])
                };

                res.render("index", {
                    error: "You can only have 10 jokes in your favorites list",
                    favoriteJokes: favoriteJokes,
                    user: req.session.user.username
                })
            }
             else if (jokesCheck.indexOf(`${joke}`) > 1) {
                var favoriteJokes = []

                  for (var i = 0; i < result.rows.length; i++) {
                      favoriteJokes.push(result.rows[i])
                  };
                res.render("index", {
                    error: "You already have this joke in your favorites list",
                    favoriteJokes: favoriteJokes,
                    user: req.session.user.username
                })
            }

             else {
              var query

                client.query("INSERT INTO favorites(jokes, user_id) values($1, $2)", [`${joke}`, user], (error1, result1) => {
                    if (error1) throw error1

                    client.query(`SELECT * FROM favorites WHERE user_id = $1 ORDER by ID DESC`,[user], (err, result2) => {

                        if (err) throw err

                        var favoriteJokes = []

                        for (var i = 0; i < result2.rows.length; i++) {
                            favoriteJokes.push(result2.rows[i])
                        };
                        res.render("index", {
                            favoriteJokes: favoriteJokes,
                            user: req.session.user.username
                        })
                    });

                });
            }
        });
    });
}