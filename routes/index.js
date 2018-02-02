"use strict"
module.exports=(app,client)=>{
	app.get("/",(req,res)=>{
		if (req.session.user) {
            //get all jokes from db
            client.query(`SELECT * FROM favorites WHERE user_id = $1 ORDER by ID DESC`,[req.session.user.id], (err, result) => {
				if (err) throw err

                var favoriteJokes = []

                for (var i = 0; i < result.rows.length; i++) {
                    var jokesResult = result.rows[i]
                    favoriteJokes.push(jokesResult)
                };
                res.render("index", { 
                    user: req.session.user.username, 
                    favoriteJokes: favoriteJokes})
            });
        } else res.render("index")
	});
};