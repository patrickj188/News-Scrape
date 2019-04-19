const mongoose = require('mongoose');
const Schema = mongoose.Schema;






const Comments = new Schema({
  name: {
    type: String
  },
  body: {
    type: String,
    required: true
  }
});

const Comment = mongoose.model("Comment", Comments);

module.exports = Comment;