import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { useParams } from 'react-router-dom';
import styles from '../styles/ShareLink.module.css';
import image from '../assets/image.jpg'

const ShareLink = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Debounced function to fetch quiz data
  const fetchQuizData = debounce(async () => {
    try {
      const response = await axios.get(`https://quizbuilderapp-1iew.onrender.com/${quizId}`);
      console.log('Quiz data received:', response.data);
      setQuizData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching quiz data:', err);
      setError('Failed to load quiz data');
      setLoading(false);
    }
  }, 3000);
  
  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (quizData && quizData.questions && quizData.questions.length > 0) {
      const currentQuestion = quizData.questions[currentQuestionIndex];
      if (currentQuestion && currentQuestion.timer !== 'off') {
        setTimer(parseInt(currentQuestion.timer, 10));
      }
    }
  }, [quizData, currentQuestionIndex]);

  useEffect(() => {
    if (timer > 0) {
      const timerId = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timer === 0) {
      handleNext();
    }
  }, [timer]);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
    
    // Send the selected option to the backend
    axios.post(`https://quizbuilderapp-1iew.onrender.com/quizzes/${quizId}/questions/${currentQuestionIndex}/answer`, {
      selectedOption: index,
    })
    .then(response => {
      console.log('Question statistics updated:', response.data);
    })
    .catch(error => {
      console.error('Error updating question statistics:', error);
    });
  };

  const handleNext = () => {
    if (quizData && quizData.questions) {
      const currentQuestion = quizData.questions[currentQuestionIndex];
      const isCorrect = quizData.quizType === 'Q&A' && selectedOption === currentQuestion.correctOption;

      if (selectedOption !== null) {
        setAnsweredQuestions(prev => [...prev, { question: currentQuestionIndex, answer: selectedOption }]);
        if (isCorrect) {
          setScore(prevScore => Math.min(prevScore + 1, quizData.questions.length)); // Ensure score does not exceed total questions
        }
      }

      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedOption(null);
        const nextQuestion = quizData.questions[currentQuestionIndex + 1];
        setTimer(nextQuestion?.timer !== 'off' ? parseInt(nextQuestion.timer, 10) : null);
      } else {
        handleSubmit();
      }
    }
  };
  
  const handleSubmit = async () => {
    try {
      await axios.post(`https://quizbuilderapp-1iew.onrender.com/quizzes/${quizId}/submit`, {
        answers: [...answeredQuestions, { question: currentQuestionIndex, answer: selectedOption }],
      });
      setShowResult(true);
    } catch (err) {
      console.error('Error submitting answers:', err);
      setError('Failed to submit your answers.');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return <div className={styles.error}>No quiz data available</div>;
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <div className={styles.quizBox}>
        {showResult ? (
          <div className={styles.result}>
            {quizData.quizType === 'Q&A' ? (
              <>
                <h2>Congratulations!</h2>
                <img src={image} alt="Congratulations" className={styles.congratulationsImage} />
                <p className={styles.message1}>Your score is <span style={{ color: 'green' }}> 0{score}/0
                  {quizData.questions.length}</span></p>
              </>
            ) : (
              <p className={styles.message2}>Thank you for participating in the Poll!</p>
            )}
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <span className={styles.questionNumber}>
                {currentQuestionIndex + 1} / {quizData.questions.length}
              </span>
              {timer !== null && (
                <span className={styles.timer}>
                  {` ${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`}
                </span>
              )}
            </div>
            <div className={styles.question}>
              <h3>{currentQuestion.questionText}</h3>
            </div>
            <div className={styles.options}>
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.option} ${selectedOption === index ? styles.selectedOption : ''}`}
                  onClick={() => handleOptionSelect(index)}
                >
                  {currentQuestion.optionType === 'Image' && option.value && (
                    <img
                      src={option.value}
                      alt={`Option ${index}`}
                      className={styles.optionImage}
                      onError={(e) => console.error('Error loading image:', e.target.src)}
                    />
                  )}
                  {currentQuestion.optionType === 'text-image' && (
                    <div className={styles.box}>
                      {option.text && <p className={styles.optionText}>{option.text}</p>}
                      {option.imageUrl && (
                        <img
                          src={option.imageUrl}
                          alt={`Option ${index}`}
                          className={styles.optionImage}
                          onError={(e) => console.error('Error loading image:', e.target.src)}
                        />
                      )}
                    </div>
                  )}
                  {currentQuestion.optionType === 'Text' && (
                    <p className={styles.optionText}>{option.value}</p>
                  )}
                </div>
              ))}
              <button
                className={styles.nextButton}
                onClick={handleNext}
                disabled={selectedOption === null}
              >
                {currentQuestionIndex === quizData.questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareLink;
