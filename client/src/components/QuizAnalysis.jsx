import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/QuizAnalysis.module.css';
import { BiEdit } from "react-icons/bi";
import { HiTrash, HiCheckCircle } from "react-icons/hi";
import { GiShare } from "react-icons/gi";
import QuizForm from './QuizForm';

const QuizAnalysis = ({ userId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [editQuiz, setEditQuiz] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/quizzes/${userId}`)
        .then(response => setQuizzes(response.data))
        .catch(error => console.error('Error fetching quizzes:', error.response ? error.response.data : error.message));
    }
  }, [userId]);

  const handleEdit = (quiz) => setEditQuiz(quiz);
  const handleUpdateQuiz = (updatedQuiz) => {
    setQuizzes(quizzes.map(quiz => quiz._id === updatedQuiz._id ? updatedQuiz : quiz));
    setEditQuiz(null);
  };

  const handleDeleteQuiz = (quizId) => {
    setQuizToDelete(quizId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:5000/quizzes/${quizToDelete}`)
      .then(() => {
        setQuizzes(quizzes.filter(quiz => quiz._id !== quizToDelete));
        setShowConfirmDialog(false);
        setQuizToDelete(null);
      })
      .catch(error => console.error('Error deleting quiz:', error.response ? error.response.data : error.message));
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setQuizToDelete(null);
  };

  const handleShare = (quizId) => {
    const quizLink = `${window.location.origin}/ShareLink/${quizId}`;
    navigator.clipboard.writeText(quizLink)
      .then(() => setCopySuccess('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy text: ', err));
  };
  

  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
    const [day, month, year] = formattedDate.split(' ');
    return `${day} ${month}, ${year}`;
  };

  return (
    <div>
      <div className={styles.headingContainer}>
        <h2 className={styles.heading}>Quiz Analysis</h2>
        {copySuccess && (
          <div className={styles.copySuccessMessage}>
            <HiCheckCircle style={{ fontSize: '20px', color: '#60B84B' }} />
            {copySuccess}
            <button className={styles.closeButton} onClick={() => setCopySuccess('')}>
              &times;
            </button>
          </div>
        )}
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Quiz Name</th>
            <th>Created On</th>
            <th>Impression</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {quizzes.length > 0 ? (
            quizzes.map((quiz, index) => (
              <tr key={quiz._id}>
                <td>{index + 1}</td>
                <td>{quiz.quizName}</td>
                <td>{formatDate(quiz.createdOn)}</td>
                <td>{quiz.views || 0}</td>
                <td>
                  <BiEdit 
                    onClick={() => handleEdit(quiz)} 
                    className={styles.edit}
                    style={{ fontSize: '26px', color: '#854CFF', cursor: 'pointer' }} 
                  />
                  <HiTrash 
                    onClick={() => handleDeleteQuiz(quiz._id)} 
                    className={styles.delete}
                    style={{ fontSize: '26px', color: '#D60000', cursor: 'pointer' }} 
                  />
                  <GiShare 
                    onClick={() => handleShare(quiz._id)} 
                    className={styles.share}
                    style={{ fontSize: '26px', color: '#60B84B', cursor: 'pointer' }} 
                  />
                </td>
                <td>
                  <Link 
                    to={`/dashboard/${userId}/question-analysis/${quiz._id}`} 
                    style={{ color: 'black' }}
                  >
                    Question wise analysis
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No quizzes available</td>
            </tr>
          )}
        </tbody>
      </table>

      {editQuiz && (
        <div className={styles.modalBackground}>
          <div className={styles.modalContent1}>
          <QuizForm
        quizData={editQuiz}
        handleClose={() => setEditQuiz(null)}
        handleSave={handleUpdateQuiz}
        userId={userId}
        isEdit={true}
      />
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className={styles.confirmDialog}>
          <div className={styles.confirmDialogContent}>
            <p>Are you sure you want to delete this quiz?</p>
            <div className={styles.confirmDialogButtons}>
              <button onClick={confirmDelete} className={styles.confirmButton}>Confirm Delete</button>
              <button onClick={cancelDelete} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizAnalysis;
