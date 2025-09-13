import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaSyringe, 
  FaCalendarAlt, 
  FaShieldAlt, 
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaBaby,
  FaChild,
  FaUser,
  FaUserTie
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const VaccinationContainer = styled.div`
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

const VaccinesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const VaccineCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
  }
`;

const VaccineHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const VaccineIcon = styled.div`
  font-size: 2.5rem;
  color: #28a745;
`;

const VaccineInfo = styled.div`
  flex: 1;
`;

const VaccineName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const AgeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const AgeIcon = styled.div`
  color: #667eea;
`;

const MandatoryBadge = styled.span`
  background: ${props => props.mandatory ? '#dc3545' : '#6c757d'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const VaccineDescription = styled.p`
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const VaccineDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
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

const getAgeIcon = (ageGroup) => {
  if (ageGroup.includes('0-2') || ageGroup.includes('2-4') || ageGroup.includes('6-9')) {
    return <FaBaby />;
  } else if (ageGroup.includes('12-15') || ageGroup.includes('18')) {
    return <FaChild />;
  } else if (ageGroup.includes('Adult')) {
    return <FaUser />;
  } else {
    return <FaUserTie />;
  }
};

const Vaccination = () => {
  const [vaccines, setVaccines] = useState([]);
  const [filteredVaccines, setFilteredVaccines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVaccines();
  }, []);

  useEffect(() => {
    filterVaccines();
  }, [vaccines, searchTerm, selectedAgeGroup]);

  const fetchVaccines = async () => {
    try {
      const response = await axios.get('/vaccination-schedule');
      setVaccines(response.data.schedules);
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      toast.error('Failed to load vaccination schedule');
    } finally {
      setLoading(false);
    }
  };

  const filterVaccines = () => {
    let filtered = vaccines;

    if (searchTerm) {
      filtered = filtered.filter(vaccine =>
        vaccine.vaccine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaccine.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedAgeGroup) {
      filtered = filtered.filter(vaccine =>
        vaccine.age_group === selectedAgeGroup
      );
    }

    setFilteredVaccines(filtered);
  };

  const ageGroups = [...new Set(vaccines.map(vaccine => vaccine.age_group))];

  if (loading) {
    return (
      <VaccinationContainer>
        <Container>
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        </Container>
      </VaccinationContainer>
    );
  }

  return (
    <VaccinationContainer>
      <Container>
        <Header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title>
            <FaSyringe />
            Vaccination Schedule
          </Title>
          <Subtitle>
            Stay up-to-date with recommended vaccinations for all age groups
          </Subtitle>
        </Header>

        <InfoSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <InfoTitle>
            <FaInfoCircle />
            Important Information
          </InfoTitle>
          <InfoContent>
            <p>
              Vaccination is one of the most effective ways to prevent diseases and protect public health. 
              This schedule follows the recommendations of the World Health Organization (WHO) and national health authorities. 
              Please consult with your healthcare provider for personalized vaccination recommendations.
            </p>
            <p style={{ marginTop: '1rem' }}>
              <strong>Note:</strong> Some vaccines are mandatory for children, while others are recommended for specific age groups or risk factors.
            </p>
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
                placeholder="Search vaccines or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchWrapper>
            <FilterSelect
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
            >
              <option value="">All Age Groups</option>
              {ageGroups.map(ageGroup => (
                <option key={ageGroup} value={ageGroup}>
                  {ageGroup}
                </option>
              ))}
            </FilterSelect>
          </SearchContainer>
        </SearchSection>

        {filteredVaccines.length === 0 ? (
          <EmptyState
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <EmptyIcon>
              <FaSearch />
            </EmptyIcon>
            <EmptyTitle>No vaccines found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search terms or age group filter
            </EmptyDescription>
          </EmptyState>
        ) : (
          <VaccinesGrid>
            {filteredVaccines.map((vaccine, index) => (
              <VaccineCard
                key={vaccine.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <VaccineHeader>
                  <VaccineIcon>
                    <FaSyringe />
                  </VaccineIcon>
                  <VaccineInfo>
                    <VaccineName>{vaccine.vaccine_name}</VaccineName>
                    <AgeGroup>
                      <AgeIcon>
                        {getAgeIcon(vaccine.age_group)}
                      </AgeIcon>
                      <span>{vaccine.age_group}</span>
                    </AgeGroup>
                    <MandatoryBadge mandatory={vaccine.is_mandatory}>
                      {vaccine.is_mandatory ? 'Mandatory' : 'Recommended'}
                    </MandatoryBadge>
                  </VaccineInfo>
                </VaccineHeader>

                <VaccineDescription>
                  {vaccine.description}
                </VaccineDescription>

                <VaccineDetails>
                  <DetailItem>
                    <DetailIcon>
                      <FaCalendarAlt />
                    </DetailIcon>
                    <span>Age Group: {vaccine.age_group}</span>
                  </DetailItem>
                  <DetailItem>
                    <DetailIcon>
                      {vaccine.is_mandatory ? <FaExclamationTriangle /> : <FaCheckCircle />}
                    </DetailIcon>
                    <span>{vaccine.is_mandatory ? 'Required' : 'Optional'}</span>
                  </DetailItem>
                </VaccineDetails>
              </VaccineCard>
            ))}
          </VaccinesGrid>
        )}
      </Container>
    </VaccinationContainer>
  );
};

export default Vaccination;
