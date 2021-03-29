const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
    ]
}

app.get("/games", (req, res) => {
    res.statusCode = 200;
    res.json(db.games);
});

app.get("/game/:id", (req, res) => {
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

app.post("/game", (req, res) => {

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

app.delete("/game/:id", (req, res) => {

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

app.put("/game/:id", (req, res) => {

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

app.listen(4001, () => {
    console.log("API REST RODANDO!");
});