const e = require('express');
var express = require('express');
var path = require('path')
var app = express();

app.use(express.json())
app.use(express.static(path.join(__dirname,'./')));
app.set('view engine','ejs')
app.get('/', function(req, res){
    res.render('TextGame');
})

app.listen(process.env.PORT || 15604, function(){
    console.log("Listening on Portal 15604")
})

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://wzhou29:Id231850793!@mangodb.ia0ne7z.mongodb.net/?retryWrites=true&w=majority";
let collection = null;
MongoClient.connect(uri)
.then(client => {
    collection = client.db('DMS321').collection('PlayerData');
    console.log('Connected to MongoDB successfully');
})
.catch(error => {
    console.log('Error connecting to MongoDB:', error);
});

app.post('/CheckUserID', (req,res) => {
    id = req.body.ID
    collection.findOne({'ID': id}, function(err,doc){
        if (err) {
            res.status(500).send('error on database')
        }
        else if (doc == null){
            collection.insertOne({'ID':id},function(err,doc){
                if (err){
                    res.status(500).send('error on database')
                }
            })
            res.status(200).send('success')
        }
        else{
            res.status(400).send('Contain UID')
        } 
    })
})
app.post('/LoadUID', (req,res) =>{
    id = req.body.ID
    collection.findOne({'ID':id}, function(err,doc){
        if (err){
            res.status(500).send('error on database')
        }
        else if (doc == null){
            res.status(400).send("Didn't find UID")
        }
        else{
            res.status(200).json(doc)
        }
    })
})
app.post('/RemoveUID', (req,res)=>{
    id = req.body.ID
    collection.deleteOne({'ID':id}, function(err,doc){
        if (err){
            res.status(500).send('error on database')
        }
        else{
            res.status(200).send('UID deleted')
        }
    })
})
app.post('/UpdateData',(req,res)=>{
    id = req.body.ID
    item = req.body
    delete item._id
    collection.updateOne(
        {'ID':id},
        {$set:item},
        {upsert:true},
        function (err,doc){
            if (err) {
                res.status(500).send('error on databse')
            }else{
                res.status(200).send('Data updated')
            }
        })
})