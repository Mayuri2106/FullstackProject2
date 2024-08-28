const User = require('../models/user');
const Quiz = require('../models/quiz');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate user and get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};



// Save quiz metadata (e.g., when initializing a new quiz)
const prepareQuiz = async (req, res) => {
  try {
    const { quizName, quizType, userId } = req.body;
    if (!quizName || !quizType || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    res.status(201).json({ message: 'Quiz metadata saved', quizName, quizType, userId });
  } catch (error) {
    console.error('Error saving quiz metadata:', error);
    res.status(500).json({ error: 'Failed to save quiz metadata' });
  }
};

 const createquiz = async (req, res) => {
  try {
    const newQuiz = new Quiz({
      ...req.body,
      createdOn: new Date(),
      views: 0,
    });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const updateQuiz = async (req, res) => {
  try {
    const { questions } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    quiz.questions = questions;
    await quiz.save();

    res.json({ message: 'Quiz updated successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Fetch all quizzes for a specific user and sort them by creation date in descending order
const getQuiz = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch and sort quizzes by 'createdOn' in descending order
    const quizzes = await Quiz.find({ userId: userId })
      .sort({ createdOn: 1 }) // Sort by createdOn in descending order (newest first)
      .exec();

    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch a specific quiz by its ID and increment the view count
const getQuizId = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    quiz.views += 1;
    await quiz.save();

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load quiz data' });
  }
};












const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Optional: You might still want to calculate the user's score for the submitted quiz
    let correctCount = 0;
    answers.forEach((answer) => {
      const question = quiz.questions[answer.question];
      if (question.correctOption === answer.answer) {
        correctCount += 1;
      }
    });

    // Since the statistics are updated immediately when an answer is selected,
    // there's no need to update them here.

    // Optionally store the submission or any other post-submission logic

    res.status(200).json({ correctCount });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
};





const getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    const quizzes = await Quiz.find({ userId });

    const totalQuizzes = quizzes.length;
    const totalQuestions = quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);
    const totalViews = quizzes.reduce((acc, quiz) => acc + quiz.views, 0);

    res.json({
      totalQuizzes,
      totalQuestions,
      totalViews,
      quizzes
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};





const getQuestion = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({
      quizName: quiz.quizName,
      createdOn: quiz.createdOn,
      views: quiz.views,
      questions: quiz.questions
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};







const optionSelect = async (req, res) => {
  try {
    const { quizId, questionIndex } = req.params;
    const { selectedOption } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const question = quiz.questions[questionIndex];

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Update statistics
    question.attemptedCount += 1;
    if (question.correctOption === selectedOption) {
      question.correctCount += 1;
    } else {
      question.incorrectCount += 1;
    }

    await quiz.save();

    res.status(200).json({ message: 'Question statistics updated' });
  } catch (error) {
    console.error('Error updating question statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  createquiz,
  prepareQuiz,
  getQuiz,
  getQuizId,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getDashboard,
  getQuestion,
  optionSelect,
};
