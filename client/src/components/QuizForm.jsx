import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/QuizForm.module.css';
import QuizSuccess from './QuizSuccess';
import { HiTrash } from "react-icons/hi";

const QuizForm = ({ handleClose, quizName, quizType, userId, quizData = null, isEdit }) => {
  const [questions, setQuestions] = useState(quizData ? quizData.questions : [{
    questionText: '',
    optionType: 'text',
    options: [{ value: '' }],
    correctOption: null,
    timer: 'off',
  }]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizLink, setQuizLink] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (quizData) {
      setQuestions(quizData.questions);
      setCurrentQuestionIndex(0); // Reset index to 0 for editing
    }
  }, [quizData]);

  const handleAddQuestion = () => {
    if (questions.length < 5 && !isEdit) {
      setQuestions(prevQuestions => [...prevQuestions, {
        questionText: '',
        optionType: 'text',
        options: [{ value: '' }],
        correctOption: null,
        timer: 'off',
      }]);
      setCurrentQuestionIndex(questions.length);
    }
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1 && !isEdit) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);

      if (currentQuestionIndex >= index) {
        setCurrentQuestionIndex(prevIndex => Math.max(0, prevIndex - 1));
      }
    }
  };

  const handleInputChange = (field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex][field] = value;
    setQuestions(updatedQuestions);
  };
  const handleOptionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    const option = updatedQuestions[currentQuestionIndex].options[index];
    
    if (!option) {
      updatedQuestions[currentQuestionIndex].options[index] = { text: '', imageUrl: '', value: '' };
    }
    
    updatedQuestions[currentQuestionIndex].options[index][field] = value;
    setQuestions(updatedQuestions);
  };
  
  
  const handleAddOption = () => {
    if (currentQuestion.options.length < 4 && !isEdit) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex].options.push({ text: '', imageUrl: '' });
      setQuestions(updatedQuestions);
    }
  };
  

  const handleRemoveOption = (index) => {
    if (currentQuestion.options.length > 1 && !isEdit) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex].options = updatedQuestions[currentQuestionIndex].options.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const handleOptionSelection = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].correctOption = index;
    setQuestions(updatedQuestions);
  };

  const handleTimerChange = (timer) => {
    handleInputChange('timer', timer);
  };

  const handleSaveQuiz = async () => {
    try {
      const quizDataToSend = {
        quizName: quizData ? quizData.quizName : quizName,
        quizType: quizData ? quizData.quizType : quizType,
        userId,
        questions
      };
  
      let response;
      let quizId;
  
      if (quizData) {
        // PUT request to update the existing quiz
        response = await axios.put(`https://quizbuilderapp-1iew.onrender.com/${quizData._id}`, quizDataToSend);
        quizId = quizData._id; // Use the existing quiz ID
      } else {
        // POST request to create a new quiz
        response = await axios.post('https://quizbuilderapp-1iew.onrender.com/quizzes', quizDataToSend);
        quizId = response.data._id; // Use the new quiz ID from the response
      }
  
      if (response.status === 200 || response.status === 201) {
        const quizLink = `${window.location.origin}/ShareLink/${quizId}`;
        setQuizLink(quizLink);
        setShowSuccess(true);
        setMessage(quizData ? 'Quiz updated successfully!' : 'Quiz created successfully!');
      } else {
        console.error('Failed to save quiz:', response.data);
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };
  

  const handleShare = () => {
    navigator.clipboard.writeText(quizLink)
      .then(() => setMessage('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy text: ', err));
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
  <div>
      {showSuccess ? (
        <QuizSuccess
          quizLink={quizLink}
          handleShare={handleShare}
          handleClose={handleCancel}
          message={message}
          
        />
      ) : (
        <div className={styles.modalContent1}>
        <div>
          <div className={styles.questionHeader}>
            <div className={styles.questionNumbers}>
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`${styles.questionNumber} ${currentQuestionIndex === index ? styles.activeQuestion : ''}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                  {questions.length > 1 && !isEdit && index > 0 && (
                    <button
                      className={styles.removeQuestionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveQuestion(index);
                      }}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              {!isEdit && questions.length < 5 && (
                <button
                  className={styles.addQuestionBtn}
                  onClick={handleAddQuestion}
                >
                  +
                </button>
              )}
            </div>
            <span className={styles.maxQuestionsText}>Max 5 Questions</span>
          </div>

          <input
            type="text"
            placeholder="Poll Question"
            value={currentQuestion.questionText}
            onChange={(e) => handleInputChange('questionText', e.target.value)}
            className={styles.inField1}
          />

          <div className={styles.optionTypeContainer}>
            <div className={styles.optionTypeOptions}>
              <span className={styles.optionTypeText}>Option Type</span>
              <label className={styles.optionTypeLabel}>
                <input
                  type="radio"
                  name="optionType"
                  value="Text"
                  checked={currentQuestion.optionType === 'Text'}
                  onChange={(e) => handleInputChange('optionType', e.target.value)}
                  disabled={!!quizData}
                />
                <span></span>
                Text
              </label>
              <label className={styles.optionTypeLabel}>
                <input
                  type="radio"
                  name="optionType"
                  value="Image"
                  checked={currentQuestion.optionType === 'Image'}
                  onChange={(e) => handleInputChange('optionType', e.target.value)}
                  disabled={!!quizData}
                />
                <span></span>
                Image URL
              </label>
              <label className={styles.optionTypeLabel}>
                <input
                  type="radio"
                  name="optionType"
                  value="text-image"
                  checked={currentQuestion.optionType === 'text-image'}
                  onChange={(e) => handleInputChange('optionType', e.target.value)}
                  disabled={!!quizData}
                />
                <span></span>
                Text & Image URL
              </label>

            </div>
          </div>

              <div className={styles.optionContainer}>
                  <div className={styles.optionFields}>
                 {currentQuestion.options.map((option, index) => (
                          <div key={index} className={`${styles.optionRow} ${currentQuestion.correctOption === index ? styles.greenBackground : ''}`}>
                          {quizType !== 'Poll' && !quizData && (
                      <label className={styles.correctOptionRadioLabel}>
                                 <input
                                         type="radio"
                                          name="correctOption"
                                           value={index}
                                              checked={currentQuestion.correctOption === index}
                               onChange={() => handleOptionSelection(index)}
                                className={styles.correctOptionRadio}
                                 />
                               <span></span>
          </label>
        )}
        {currentQuestion.optionType === 'text-image' ? (
  <>
    <input
      type="text"
      placeholder="Text"
      value={option.text}
      onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
      className={`${styles.inField1_2} ${styles.optionTextInput} ${currentQuestion.correctOption === index ? styles.greenBackground : ''}`}
      disabled={!!quizData}
    />
    <input
      type="text"
      placeholder="Image URL"
      value={option.imageUrl}
      onChange={(e) => handleOptionChange(index, 'imageUrl', e.target.value)}
      className={`${styles.inField1_2} ${styles.optionImageInput} ${currentQuestion.correctOption === index ? styles.greenBackground : ''}`}
      disabled={!!quizData}
    />
  </>
) : (
  <input
    type="text"
    placeholder={`${currentQuestion.optionType}`}
    value={option.value}
    onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
    className={`${styles.inField1_2} ${currentQuestion.correctOption === index ? styles.greenBackground : ''}`}
    disabled={!!quizData && !quizData.questions[currentQuestionIndex].options[index]}
  />
)}

        {!quizData && !isEdit && index > 0 && (
          <HiTrash
            className={styles.removeOptionBtn}
            onClick={() => handleRemoveOption(index)}
          >
            &times;
          </HiTrash>
        )}
      </div>
    ))}
    {!isEdit && !quizData && currentQuestion.options.length < 4 && (
      <button
        className={styles.addOptionBtn}
        onClick={handleAddOption}
      >
        Add Option
      </button>
    )}
  </div>



            {quizType !== 'Poll' && (
              <div className={styles.timerContainer}>
                <span className={styles.timerText}>Timer</span>
                <button
                  className={`${styles.timerButton} ${currentQuestion.timer === 'off' ? styles.activeTimer : ''}`}
                  onClick={() => handleTimerChange('off')}
                >
                  Off
                </button>
                <button
                  className={`${styles.timerButton} ${currentQuestion.timer === '5sec' ? styles.activeTimer : ''}`}
                  onClick={() => handleTimerChange('5sec')}
                >
                  5 sec
                </button>
                <button
                  className={`${styles.timerButton} ${currentQuestion.timer === '10sec' ? styles.activeTimer : ''}`}
                  onClick={() => handleTimerChange('10sec')}
                >
                  10 sec
                </button>
              </div>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
            <button className={styles.createQuizButton} onClick={handleSaveQuiz}>
              {quizData ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </div>
    </div>

      )}
    </div>
  );
};

export default QuizForm;
