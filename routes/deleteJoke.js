"use strict"
module.exports=(app, client)=>{
	app.post("/deleteJoke", (req, res)=>{
		client.query(`DELETE FROM favorites WHERE id = $1 AND user_id = $2`,[req.body.jokeId, req.session.user.id],(err, result)=>{
			if(err) throw err
				client.query(`SELECT * FROM favorites WHERE user_id = $1 ORDER by ID DESC`,[req.session.user.id],(error, result2)=>{
				if (err) throw err

	                var favoriteJokes = []

	                for (var i = 0; i < result2.rows.length; i++) {
	                    var jokesResult = result2.rows[i]
	                    favoriteJokes.push(jokesResult)
	                };
	                res.render("index", { 
	                    user: req.session.user.username, 
	                    favoriteJokes: favoriteJokes});
	            });
	    });
	});
}
