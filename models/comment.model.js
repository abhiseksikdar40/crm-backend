const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Leads',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesAgent', 
    required: true,
  },
  commenttext: {
    type: String,
    required: true
  }
},
{
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment
