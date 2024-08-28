const express = require('express');
const { registerUser, loginUser, logoutUser, createquiz, prepareQuiz, getQuiz, getQuizId, updateQuiz, submitQuiz, deleteQuiz, getDashboard, getQuestion, optionSelect} = require('../controllers/authController');

const router = express.Router();

// Register
router.post('/signup', registerUser);

// Login
router.post('/login', loginUser);

// Logout
router.post('/logout', logoutUser);
router.post('/quizzes', createquiz);
router.post('/prepare-quiz', prepareQuiz);
router.get('/quizzes/:userId', getQuiz);
router.get('/:quizId', getQuizId);
router.put('/:quizId', updateQuiz);
router.post('/quizzes/:quizId/submit', submitQuiz);
router.delete('/quizzes/:quizId', deleteQuiz);
router.get('/dashboard/:userId',getDashboard)
router.get('/quizzes/:quizId/questions', getQuestion);
router.post('/quizzes/:quizId/questions/:questionIndex/answer', optionSelect);

module.exports = router;
