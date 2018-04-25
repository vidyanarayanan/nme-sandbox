const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;

const app = express();
var db;

app.use(bodyParser.urlencoded({extended: true}));


mongoClient.connect('mongodb://localhost:27017', (err, connection) => {
    if (err) {
        console.log('error connecting');
    } else {
        db = connection.db('quotes');
        app.listen(3000, () => {
            console.log('listening on 3000');
        });
    }
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.get('/quotes', (req, res) => {
    db.collection('quotes').find().toArray((err, resArray) => {
        console.log('results ' + resArray);
        res.format({
            'application/text': () => {
                console.log(getResultText(resArray));
                res.send(getResultText(resArray));
            }
        });
    });
});

app.post('/quotes', (req, res) => {
    console.log('req ' + JSON.stringify(req.body));
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
    });
    res.sendStatus(201);
});

function getResultText(results) {
    var text = "";
    results.forEach((result) => {
        var line = "\"" + result.quote + "\" - " + result.name + "\t\t\n";
        text += line;
    });
    return text;
}