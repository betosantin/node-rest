const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const JWTSecret = "asifjsdhfwejthwelkgjdvnxcmvndgsl2sdv325";

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function auth(req, res, next){

    const authToken = req.headers['authorization'];

    if(authToken != undefined){
        const bearer = authToken.split(' ');

        var token = bearer[1];

        jwt.verify(token, JWTSecret, (err, data) =>{
            if(err){
                res.status(401);
                res.json({err: "Token inválido"});
            } else {
                req.token = token;
                req.loggedUser = {id: data.id, email: data.email};
                next();
            }
        });


    } else {
        res.status(401);
        res.json({err: "Token inválido"});
    }

   
}


var db = {
    games: [
        {
            id: 23,
            title: "Call",
            year: 2019,
            price: 59.90,
        },
        {
            id: 34,
            title: "Grid",
            year: 2012,
            price: 24.99,
        },
        {
            id: 55,
            title: "Fifa",
            year: 2021,
            price: 103.27,
        },
    ],
    users: [
        {
            id: 1,
            name: "Roberto Santin",
            email: "betosantin@gmail.com",
            password: "123"
        },
        {
            id: 2,
            name: "Roberto Santin 2",
            email: "betosantin@hotmail.com",
            password: "123"
        }
    ]
}

app.get("/games", auth, (req, res) => {
    res.statusCode = 200;
    res.json(db.games);
});

app.get("/game/:id", auth, (req, res) => {
    var id = req.params.id;

    if (isNaN(id)) {
        res.sendStatus(400);
    } else {
        id = parseInt(id);

        var game = db.games.find(g => g.id == id);

        if (game != undefined) {
            res.statusCode = 200;
            res.json(game);
        } else {
            res.sendStatus(404);
        }
    }
});

app.post("/game", auth, (req, res) => {

    var { title, price, year } = req.body;

    if (!title || !price || !year) {
        res.sendStatus(400);
    }

    db.games.push({
        id: Math.floor(Math.random() * 100000000) + 1,
        title,
        price,
        year
    });

    res.sendStatus(200);
});

app.delete("/game/:id", auth, (req, res) => {

    var id = req.params.id;

    if (isNaN(id)) {
        res.sendStatus(400);
    } else {
        id = parseInt(id);

        var index = db.games.findIndex(g => g.id == id);

        if (index == -1) {
            res.sendStatus(404)
        } else {
            db.games.splice(index, 1)

            res.sendStatus(200);
        }
    }
});

app.put("/game/:id", auth, (req, res) => {

    var id = req.params.id;

    if (isNaN(id)) {
        res.sendStatus(400);
    } else {
        id = parseInt(id);

        var game = db.games.find(g => g.id == id);

        if (game != undefined) {

            var { title, price, year } = req.body;

            if (title != undefined) {
                game.title = title;
            }

            if (price != undefined) {
                game.price = price;
            }

            if (year != undefined) {
                game.year = year;
            }

            res.sendStatus(200)

        } else {
            res.sendStatus(404)
        }
    }
});

app.post("/auth", (req, res) =>{

    var { email, password } = req.body;

    if (email != undefined && password != undefined) {

        var user = db.users.find(u => u.email == email);

        if(user != undefined) {

            if(user.password == password){

                jwt.sign({id: user.id, email: user.email}, JWTSecret, {expiresIn: '1h'}, (err, token)=>{
                    if(err){
                        res.status(400);
                        res.json({err: "Falha interna"});
                    } else{
                        res.status(200);
                        res.json({token: token});
                    }
                });
            } else {
                res.status(401);
                res.json({token: "Senha inválida"});
            }

        } else {
            res.status(404);
            res.json({ err: "Usuário não encontrado" });
        }

    } else {
        res.status(400);
        res.json({ err: "E-mail ou Senha inválido" });
    }

});

app.listen(4001, () => {
    console.log("API REST RODANDO!");
});