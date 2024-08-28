import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/DashboardPage.module.css';
import CreateQuizModal from './CreateQuizModal';
                        
import QuizAnalysis from './QuizAnalysis'; // Import the new component
import { FaEye } from 'react-icons/fa'; // Import eye icon

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://quizbuilderapp-1iew.onrender.com/dashboard/${userId}`);
        setTotalQuizzes(response.data.totalQuizzes);
        setTotalQuestions(response.data.totalQuestions);
        setTotalViews(response.data.totalViews);
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await axios.post('https://quizbuilderapp-1iew.onrender.com/logout');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateQuizClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  function formatNumber(number) {
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
  }
  


  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
    const [day, month, year] = formattedDate.split(' ');
    return `${day} ${month}, ${year}`;
  };


  // Render content based on activeTab
  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <>
          <div className={styles.statsContainer}>
            <div className={styles.statBox}>
              <h2>{formatNumber(totalQuizzes)} </h2>
              <p>Quiz <span>created</span></p>
            </div>
            <div className={styles.statBox}>
              <h2>{formatNumber(totalQuestions)} </h2>
              <p>questions <span>created</span></p>
            </div>
            <div className={styles.statBox}>
              <h2>{formatNumber(totalViews)} </h2>
              <p>Total <span>Impressions</span></p>
            </div>
          </div>
  
          <h2 className={styles.trendingHeading}>Trending Quizzes</h2>
  
          <div className={styles.quizList}>
  {quizzes.map((quiz) => (
    <div key={quiz._id} className={styles.quizCard}>
      <div className={styles.quizCardHeader}>
        
      <h3 className={styles.quizTitle}>{quiz.quizName}</h3>
        <span className={styles.viewCount}>{quiz.views}<FaEye className={styles.eyeIcon} /></span>
        
      </div>
      <p className={styles.quizDate}>Created on: {formatDate(quiz.createdOn)}</p>
    </div>
  ))}
</div>

        </>
      );
    }
    if (activeTab === 'analysis'){
      return (<QuizAnalysis userId={userId} />   )
    }
  };

  

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h1 className={styles.heading}>QUIZZIE</h1>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link
                to={`/dashboard/${userId}`}
                className={activeTab === 'dashboard' ? styles.active : ''}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to={`/dashboard/${userId}`}
                className={activeTab === 'analysis' ? styles.active : ''}
                onClick={() => setActiveTab('analysis')}
              >
                Analytics
              </Link>
            </li>
            <li>
              <Link
                className={`${styles.linkButton} ${activeTab === 'create-quiz' ? styles.active : ''}`}
                onClick={() => handleCreateQuizClick()}
              >
                Create Quiz
              </Link>
            </li>
          </ul>
        </nav>
        <hr className={styles.separator} />
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className={styles.content}>
        {renderContent()}
      </div>
      {showModal && <CreateQuizModal showModal={showModal} handleClose={handleCloseModal} userId={userId} />}
    </div>
  );
}

export default DashboardPage;
