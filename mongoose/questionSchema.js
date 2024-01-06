const mongoose = require("mongoose")
// Use an object instead of an array for the schema definition
const questionSchema = new mongoose.Schema({
  questionType: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  question: {
    type: String,
    require: true,
  },
  option1 : {
    data: { type: String,
      require: true},
      checked : {
        type:Boolean,
        require : true
      }
  },
  option2 : {
    data: { type: String,
      require: true},
      checked : {
        type:Boolean,
        require : true
      }
  },
  option3 : {
    data: { type: String,
      require: true},
      checked : {
        type:Boolean,
        require : true
      }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Use default export instead of named exports
const QuestionModel =
  mongoose.models.quizes || mongoose.model("quizes", questionSchema);
module.exports = QuestionModel;
