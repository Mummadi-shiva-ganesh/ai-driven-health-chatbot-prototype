import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaExclamationTriangle, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaSearch,
  FaFilter,
  FaInfoCircle,
  FaBell,
  FaShieldAlt,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AlertsContainer = styled.div`
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const SearchSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem 1rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
`;

const FilterSelect = styled.select`
  padding: 1rem 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const AlertsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const AlertCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
  position: relative;
  border-left: 5px solid ${props => {
    switch (props.severity) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  }};

  &:hover {
    transform: translateY(-5px);
  }
`;

const AlertHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const AlertIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => {
    switch (props.severity) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  }};
`;

const AlertInfo = styled.div`
  flex: 1;
`;

const AlertTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const AlertMeta = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const SeverityBadge = styled.span`
  background: ${props => {
    switch (props.severity) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const AlertDescription = styled.p`
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const AlertDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
  flex-wrap: wrap;
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

const StatusBadge = styled.span`
  background: ${props => props.active ? '#28a745' : '#6c757d'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 3rem;
  color: white;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.7;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  opacity: 0.8;
`;

const InfoSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const InfoTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoContent = styled.div`
  color: #6c757d;
  line-height: 1.6;
  font-size: 1rem;
`;

const AlertLevels = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const LevelItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 10px;
  background: ${props => {
    switch (props.level) {
      case 'low': return 'rgba(40, 167, 69, 0.1)';
      case 'medium': return 'rgba(255, 193, 7, 0.1)';
      case 'high': return 'rgba(253, 126, 20, 0.1)';
      case 'critical': return 'rgba(220, 53, 69, 0.1)';
      default: return 'rgba(108, 117, 125, 0.1)';
    }
  }};
`;

const LevelColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    switch (props.level) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  }};
`;

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, searchTerm, selectedSeverity]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/outbreak-alerts');
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to load health alerts');
    } finally {
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.disease_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSeverity) {
      filtered = filtered.filter(alert =>
        alert.severity === selectedSeverity
      );
    }

    setFilteredAlerts(filtered);
  };

  const severities = [...new Set(alerts.map(alert => alert.severity))];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AlertsContainer>
        <Container>
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        </Container>
      </AlertsContainer>
    );
  }

  return (
    <AlertsContainer>
      <Container>
        <Header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title>
            <FaExclamationTriangle />
            Health Alerts
          </Title>
          <Subtitle>
            Stay informed about disease outbreaks and health alerts in your area
          </Subtitle>
        </Header>

        <InfoSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <InfoTitle>
            <FaInfoCircle />
            Alert Information
          </InfoTitle>
          <InfoContent>
            <p>
              Health alerts provide important information about disease outbreaks, public health emergencies, 
              and preventive measures in your area. Stay informed and take appropriate precautions to protect 
              yourself and your community.
            </p>
            <AlertLevels>
              <LevelItem level="low">
                <LevelColor level="low" />
                <span><strong>Low:</strong> General awareness</span>
              </LevelItem>
              <LevelItem level="medium">
                <LevelColor level="medium" />
                <span><strong>Medium:</strong> Increased vigilance</span>
              </LevelItem>
              <LevelItem level="high">
                <LevelColor level="high" />
                <span><strong>High:</strong> Take precautions</span>
              </LevelItem>
              <LevelItem level="critical">
                <LevelColor level="critical" />
                <span><strong>Critical:</strong> Immediate action</span>
              </LevelItem>
            </AlertLevels>
          </InfoContent>
        </InfoSection>

        <SearchSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SearchContainer>
            <SearchWrapper>
              <SearchIcon>
                <FaSearch />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search alerts by disease, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchWrapper>
            <FilterSelect
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="">All Severity Levels</option>
              {severities.map(severity => (
                <option key={severity} value={severity}>
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </option>
              ))}
            </FilterSelect>
          </SearchContainer>
        </SearchSection>

        {filteredAlerts.length === 0 ? (
          <EmptyState
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <EmptyIcon>
              <FaBell />
            </EmptyIcon>
            <EmptyTitle>No alerts found</EmptyTitle>
            <EmptyDescription>
              {alerts.length === 0 
                ? "No health alerts at this time. Stay safe and healthy!"
                : "Try adjusting your search terms or severity filter"
              }
            </EmptyDescription>
          </EmptyState>
        ) : (
          <AlertsGrid>
            {filteredAlerts.map((alert, index) => (
              <AlertCard
                key={alert.id}
                severity={alert.severity}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <AlertHeader>
                  <AlertIcon severity={alert.severity}>
                    <FaExclamationTriangle />
                  </AlertIcon>
                  <AlertInfo>
                    <AlertTitle>{alert.disease_name}</AlertTitle>
                    <AlertMeta>
                      <SeverityBadge severity={alert.severity}>
                        {alert.severity}
                      </SeverityBadge>
                      <StatusBadge active={alert.is_active}>
                        {alert.is_active ? 'Active' : 'Resolved'}
                      </StatusBadge>
                    </AlertMeta>
                  </AlertInfo>
                </AlertHeader>

                <AlertDescription>
                  {alert.description}
                </AlertDescription>

                <AlertDetails>
                  <DetailItem>
                    <DetailIcon>
                      <FaMapMarkerAlt />
                    </DetailIcon>
                    <span>{alert.location}</span>
                  </DetailItem>
                  <DetailItem>
                    <DetailIcon>
                      <FaCalendarAlt />
                    </DetailIcon>
                    <span>{formatDate(alert.alert_date)}</span>
                  </DetailItem>
                </AlertDetails>
              </AlertCard>
            ))}
          </AlertsGrid>
        )}
      </Container>
    </AlertsContainer>
  );
};

export default Alerts;
