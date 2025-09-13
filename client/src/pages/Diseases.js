import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaVirus, 
  FaShieldAlt, 
  FaStethoscope,
  FaExclamationTriangle,
  FaInfoCircle,
  FaFilter
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const DiseasesContainer = styled.div`
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

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem 1rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  min-width: 300px;

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

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
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

const DiseasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const DiseaseCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const DiseaseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DiseaseIcon = styled.div`
  font-size: 2.5rem;
  color: #dc3545;
`;

const DiseaseTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const DiseaseCategory = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const DiseaseSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionContent = styled.div`
  color: #6c757d;
  line-height: 1.6;
`;

const SymptomsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SymptomItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: '•';
    color: #dc3545;
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

const PreventionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PreventionItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: '✓';
    color: #28a745;
    font-weight: bold;
    font-size: 1.1rem;
  }
`;

const SeverityBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.severity) {
      case 'mild': return '#28a745';
      case 'moderate': return '#ffc107';
      case 'severe': return '#dc3545';
      case 'chronic': return '#6f42c1';
      default: return '#6c757d';
    }
  }};
  color: white;
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

const Diseases = () => {
  const [diseases, setDiseases] = useState([]);
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiseases();
  }, []);

  useEffect(() => {
    filterDiseases();
  }, [diseases, searchTerm, selectedCategory]);

  const fetchDiseases = async () => {
    try {
      const response = await axios.get('/diseases');
      setDiseases(response.data.diseases);
    } catch (error) {
      console.error('Error fetching diseases:', error);
      toast.error('Failed to load diseases');
    } finally {
      setLoading(false);
    }
  };

  const filterDiseases = () => {
    let filtered = diseases;

    if (searchTerm) {
      filtered = filtered.filter(disease =>
        disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.prevention.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(disease =>
        disease.category === selectedCategory
      );
    }

    setFilteredDiseases(filtered);
  };

  const categories = [...new Set(diseases.map(disease => disease.category))];

  if (loading) {
    return (
      <DiseasesContainer>
        <Container>
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        </Container>
      </DiseasesContainer>
    );
  }

  return (
    <DiseasesContainer>
      <Container>
        <Header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title>
            <FaVirus />
            Disease Information
          </Title>
          <Subtitle>
            Learn about symptoms, prevention, and treatment of various diseases
          </Subtitle>
        </Header>

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
                placeholder="Search diseases, symptoms, or prevention methods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchWrapper>
            <FilterSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </FilterSelect>
          </SearchContainer>
        </SearchSection>

        {filteredDiseases.length === 0 ? (
          <EmptyState
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <EmptyIcon>
              <FaSearch />
            </EmptyIcon>
            <EmptyTitle>No diseases found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search terms or category filter
            </EmptyDescription>
          </EmptyState>
        ) : (
          <DiseasesGrid>
            {filteredDiseases.map((disease, index) => (
              <DiseaseCard
                key={disease.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <DiseaseHeader>
                  <DiseaseIcon>
                    <FaVirus />
                  </DiseaseIcon>
                  <div style={{ flex: 1 }}>
                    <DiseaseTitle>{disease.name}</DiseaseTitle>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      <DiseaseCategory>{disease.category}</DiseaseCategory>
                      <SeverityBadge severity={disease.severity}>
                        {disease.severity}
                      </SeverityBadge>
                    </div>
                  </div>
                </DiseaseHeader>

                <DiseaseSection>
                  <SectionTitle>
                    <FaExclamationTriangle />
                    Symptoms
                  </SectionTitle>
                  <SectionContent>
                    <SymptomsList>
                      {disease.symptoms.split(',').map((symptom, idx) => (
                        <SymptomItem key={idx}>
                          {symptom.trim()}
                        </SymptomItem>
                      ))}
                    </SymptomsList>
                  </SectionContent>
                </DiseaseSection>

                <DiseaseSection>
                  <SectionTitle>
                    <FaShieldAlt />
                    Prevention
                  </SectionTitle>
                  <SectionContent>
                    <PreventionList>
                      {disease.prevention.split(',').map((prevention, idx) => (
                        <PreventionItem key={idx}>
                          {prevention.trim()}
                        </PreventionItem>
                      ))}
                    </PreventionList>
                  </SectionContent>
                </DiseaseSection>

                {disease.treatment && (
                  <DiseaseSection>
                    <SectionTitle>
                      <FaStethoscope />
                      Treatment
                    </SectionTitle>
                    <SectionContent>
                      {disease.treatment}
                    </SectionContent>
                  </DiseaseSection>
                )}
              </DiseaseCard>
            ))}
          </DiseasesGrid>
        )}
      </Container>
    </DiseasesContainer>
  );
};

export default Diseases;
