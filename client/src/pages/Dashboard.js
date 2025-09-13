import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaComments, 
  FaVirus, 
  FaSyringe, 
  FaExclamationTriangle,
  FaDownload,
  FaChartLine,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLanguage,
  FaPhone
} from 'react-icons/fa';
import axios from 'axios';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #667eea;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6c757d;
  font-weight: 500;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ActionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ActionIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #667eea;
`;

const ActionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const ActionDescription = styled.p`
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const ProfileSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ProfileIcon = styled.div`
  font-size: 3rem;
  color: #667eea;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ProfileDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-size: 0.9rem;
`;

const DetailIcon = styled.div`
  color: #667eea;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(102, 126, 234, 0.3);
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    chatSessions: 0,
    diseasesViewed: 0,
    vaccinesScheduled: 0,
    alertsReceived: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/user/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // In a real app, you'd fetch these from your backend
      // For now, we'll use mock data
      setStats({
        chatSessions: 12,
        diseasesViewed: 8,
        vaccinesScheduled: 3,
        alertsReceived: 2
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await axios.get('/export-data');
      const { excel_data, filename } = response.data;
      
      // Create download link
      const link = document.createElement('a');
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excel_data}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <Container>
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        </Container>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Container>
        <Header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title>Welcome back, {user?.full_name || 'User'}!</Title>
          <Subtitle>Your health dashboard at a glance</Subtitle>
        </Header>

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <StatIcon>
              <FaComments />
            </StatIcon>
            <StatNumber>{stats.chatSessions}</StatNumber>
            <StatLabel>Chat Sessions</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <StatIcon>
              <FaVirus />
            </StatIcon>
            <StatNumber>{stats.diseasesViewed}</StatNumber>
            <StatLabel>Diseases Researched</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <StatIcon>
              <FaSyringe />
            </StatIcon>
            <StatNumber>{stats.vaccinesScheduled}</StatNumber>
            <StatLabel>Vaccines Scheduled</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <StatIcon>
              <FaExclamationTriangle />
            </StatIcon>
            <StatNumber>{stats.alertsReceived}</StatNumber>
            <StatLabel>Health Alerts</StatLabel>
          </StatCard>
        </StatsGrid>

        <QuickActions>
          <ActionCard
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            onClick={() => window.location.href = '/chat'}
          >
            <ActionIcon>
              <FaComments />
            </ActionIcon>
            <ActionTitle>Start Chat</ActionTitle>
            <ActionDescription>
              Get instant health advice and information from our AI-powered chatbot.
            </ActionDescription>
            <ActionButton>
              Chat Now
            </ActionButton>
          </ActionCard>

          <ActionCard
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={() => window.location.href = '/diseases'}
          >
            <ActionIcon>
              <FaVirus />
            </ActionIcon>
            <ActionTitle>Disease Information</ActionTitle>
            <ActionDescription>
              Learn about symptoms, prevention, and treatment of various diseases.
            </ActionDescription>
            <ActionButton>
              Explore
            </ActionButton>
          </ActionCard>

          <ActionCard
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            onClick={() => window.location.href = '/vaccination'}
          >
            <ActionIcon>
              <FaSyringe />
            </ActionIcon>
            <ActionTitle>Vaccination Schedule</ActionTitle>
            <ActionDescription>
              Check vaccination schedules and get reminders for important vaccines.
            </ActionDescription>
            <ActionButton>
              View Schedule
            </ActionButton>
          </ActionCard>

          <ActionCard
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            onClick={() => window.location.href = '/alerts'}
          >
            <ActionIcon>
              <FaExclamationTriangle />
            </ActionIcon>
            <ActionTitle>Health Alerts</ActionTitle>
            <ActionDescription>
              Stay informed about disease outbreaks and health alerts in your area.
            </ActionDescription>
            <ActionButton>
              View Alerts
            </ActionButton>
          </ActionCard>
        </QuickActions>

        <ProfileSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <ProfileHeader>
            <ProfileIcon>
              <FaUser />
            </ProfileIcon>
            <ProfileInfo>
              <ProfileName>{user?.full_name || 'User'}</ProfileName>
              <p style={{ color: '#6c757d', margin: 0 }}>{user?.email}</p>
            </ProfileInfo>
            <ActionButton onClick={handleExportData}>
              <FaDownload />
              Export Data
            </ActionButton>
          </ProfileHeader>

          <ProfileDetails>
            <DetailItem>
              <DetailIcon>
                <FaUser />
              </DetailIcon>
              <span>Username: {user?.username}</span>
            </DetailItem>
            
            {user?.phone && (
              <DetailItem>
                <DetailIcon>
                  <FaPhone />
                </DetailIcon>
                <span>Phone: {user.phone}</span>
              </DetailItem>
            )}
            
            {user?.age && (
              <DetailItem>
                <DetailIcon>
                  <FaCalendarAlt />
                </DetailIcon>
                <span>Age: {user.age} years</span>
              </DetailItem>
            )}
            
            {user?.location && (
              <DetailItem>
                <DetailIcon>
                  <FaMapMarkerAlt />
                </DetailIcon>
                <span>Location: {user.location}</span>
              </DetailItem>
            )}
            
            <DetailItem>
              <DetailIcon>
                <FaLanguage />
              </DetailIcon>
              <span>Language: {user?.preferred_language?.toUpperCase() || 'EN'}</span>
            </DetailItem>
          </ProfileDetails>
        </ProfileSection>
      </Container>
    </DashboardContainer>
  );
};

export default Dashboard;
