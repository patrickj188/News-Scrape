const mongoose = require('mongoose');
const Schema = mongoose.Schema;





const Articles= new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  comment: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

const Article = mongoose.model("Article", Articles);

module.exports = Article;