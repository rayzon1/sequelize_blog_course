var express = require('express');
var router = express.Router();
var Article = require("../models").Article;

/* GET articles listing. */
router.get('/', function(req, res, next) {
  Article.findAll({order: [["createdAt", "DESC"]]}).then(articles => {
    res.render("articles/index", {articles: articles, title: "My Awesome Blog" });
  }).catch(error => {
    res.send(500)
  });
});

/* POST create article. */
router.post('/', function(req, res, next) {
  Article.create(req.body).then(article => {
    res.redirect("/articles/" + article.id);
  }).catch(error => {
    if(error.name === "SequelizeValidationError") {
      res.render("articles/new", {
        article: Article.build(req.body), 
        title: "New Article",
        errors: error.errors
      });
    } else {
      throw error;
    }
  }).catch(error => {
    res.send(500)
  });
});

/* Create a new article form. */
router.get('/new', function(req, res, next) {
  res.render("articles/new", {article: Article.build(), title: "New Article"});
});

/* Edit article form. */
router.get("/:id/edit", function(req, res, next){
  Article.findByPk(req.params.id).then(article => {
    if (article) {
      res.render("articles/edit", {article: article, title: "Edit Article"});  
    } else {
      res.send(404);
    }
  }).catch(error => {
    res.send(500)
  });
});


/* Delete article form. */
router.get("/:id/delete", function(req, res, next){
  // var article = find(req.params.id);  
  Article.findByPk(req.params.id).then(article => {
    if (article) {
      res.render("articles/delete", {article: article, title: "Delete Article"});  
    } else {
      res.send(404);
    }
  });
  
});


/* GET individual article. */
router.get("/:id", function(req, res, next){
  Article.findByPk(req.params.id).then(article => {
    if (article) {
      res.render("articles/show", {article: article, title: article.title});  
    } else {
      res.send(404);
    }
  }).catch(error => {
    res.send(500)
  });
});

/* PUT update article. */
router.put("/:id", function(req, res, next){
  Article.findByPk(req.params.id).then(article => {
    if (article) {
      return article.update(req.body)  
    } else {
      res.send(404);
    }
  }).then(article => {
    res.redirect("/articles/" + article.id);
  }).catch(error => {
    let article = Article.build(req.body);
    article.id = req.params.id;
    if(error.name === "SequelizeValidationError") {
      res.render("articles/edit", {
        article: article, 
        title: "Edit Article",
        errors: error.errors
      });
    } else {
      throw error;
    }
  }).catch(error => {
    res.send(500)
  });
});

/* DELETE individual article. */
router.delete("/:id", function(req, res, next){
  Article.findByPk(req.params.id).then(article => {
    if (article) {
      return article.destroy();  
    } else {
      res.send(404);
    }
  }).then(() => {
    res.redirect("/articles");
  }).catch(error => {
    res.send(500)
  });
});


module.exports = router;