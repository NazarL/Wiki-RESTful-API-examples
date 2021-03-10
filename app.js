//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = { title: String, content: String};
const Article = mongoose.model("Article", articleSchema);

//------------------------------ requests targeting all articles ------------------------------------------//

app.route("/articles")
.get(function(req, res){
    Article.find({}, function(err, articles){
        if(!err) {
            res.send(articles);
        } else {
            res.send(err);
        }
    });
})
.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err) {
            res.send("Successfully added a new article to the wikiDB");
        } else {
            res.send(err);
        }
    });
})
.delete(function(req, res){
    Article.deleteMany({}, function(err){
        if(!err) {
            res.send("Successfully deleted all articles!");
        } else {
            res.send(err);
        }
    });
});

//------------------------------ requests targeting specific articles ------------------------------------------//

app.route("/articles/:articleTitle")
.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No matching articles titles was found.");
        }
    });
})
.put(function(req, res){
    Article.update(
        {title: req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err) {
                res.send("Successfully updated article!");
            } else {
                res.send(err);
            }
        }
    );
})
.patch(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        //req.body - to take what ever user decides to change
        {$set: req.body},
        function(err){
            if(!err) {
                res.send("The article was updated successfully!");
            } else {
                res.send(err);
            }
        }
    );
})
.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err) {
                res.send("The article was deleted successfully!");
            } else {
                res.send(err);
            }
        });
});

app.listen(3000, function() {
    console.log("Server started on port 3000.");
});

