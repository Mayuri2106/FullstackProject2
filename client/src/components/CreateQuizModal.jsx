import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/CreateQuizModal.module.css';
import QuizForm from './QuizForm';

function CreateQuizModal({ showModal, handleClose, userId }) {
  const [quizName, setQuizName] = useState('');
  const [quizType, setQuizType] = useState('');
  const [isQuizFormVisible, setIsQuizFormVisible] = useState(false);

  useEffect(() => {
    if (showModal) {
      setQuizName('');
      setQuizType('');
      setIsQuizFormVisible(false);
    }
  }, [showModal]);

  const saveQuizToBackend = async () => {
    try {
      if (!quizName || !quizType || !userId) {
        throw new Error('Missing required fields');
      }

      const response = await axios.post('https://quizbuilderapp-1iew.onrender.com/prepare-quiz', {
        quizName,
        quizType,
        userId,
      });

      if (response.status === 201) {
        console.log('Quiz metadata saved:', response.data);
        // Proceed to show QuizForm to add questions
        setIsQuizFormVisible(true);
      } else {
        console.error('Failed to save quiz metadata:', response.data);
      }
    } catch (error) {
      console.error('Error saving quiz metadata:', error);
    }
  };

  const handleContinue = () => {
    if (!isQuizFormVisible) {
      saveQuizToBackend(); // Save the quiz metadata and show the form
    }
  };

  const isContinueDisabled = !quizName || !quizType;

  return (
    <div className={styles.modalOverlay}>
      {isQuizFormVisible ? (
        <QuizForm
          handleClose={handleClose}
          quizName={quizName}
          quizType={quizType}
          userId={userId}
        />
      ) : (
        <div className={styles.modalContent}>
          <input
            type="text"
            placeholder="Quiz Name"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className={styles.inField}
          />
          <div className={styles.quizTypeContainer}>
            <span className={styles.quizTypeLabel}>Quiz Type</span>
            <button
              className={`${styles.quizTypeBtn} ${quizType === 'Q&A' ? styles.active : ''}`}
              onClick={() => setQuizType('Q&A')}
            >
              Q & A
            </button>
            <button
              className={`${styles.quizTypeBtn} ${quizType === 'Poll' ? styles.active : ''}`}
              onClick={() => setQuizType('Poll')}
            >
              Poll
            </button>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.cancelBtn} onClick={handleClose}>
              Cancel
            </button>
            <button
              className={`${styles.continueBtn} ${isContinueDisabled ? styles.disabled : ''}`}
              onClick={handleContinue}
              disabled={isContinueDisabled}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateQuizModal;
