'use strict';

var dateFormat = require('dateformat');

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title is required'
        }
      }
    },
    author: DataTypes.STRING,
    body: DataTypes.TEXT
  });
  
  Article.prototype.publishedAt = function() {
    return dateFormat(this.createdAt, "dddd, mmmm dS, yyyy, h:MM TT");
  }
  
  Article.prototype.shortDescription = function() {
    return this.body.length > 30 ? this.body.substr(0, 30) + "..." : this.body;
  }

  return Article;
};