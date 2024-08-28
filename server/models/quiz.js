const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  quizName: { type: String, required: true },
  quizType: { type: String, required: true },
  userId: { type: String, required: true },
  questions: [{
    questionText: String,
    optionType: String, // 'Text', 'Image', or 'text-image'
    options: [{
      text: String, // Only used for 'text-image' optionType
      imageUrl: String, // Only used for 'text-image' optionType
      value: String // Used for 'Text' and 'Image' optionTypes
    }],
    correctOption: Number,
    timer: String,
    attemptedCount: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 }
  }],
  createdOn: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
});

module.exports = mongoose.model('Quiz', quizSchema);
