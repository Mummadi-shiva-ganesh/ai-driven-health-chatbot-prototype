import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaRobot, 
  FaShieldAlt, 
  FaGlobe, 
  FaChartLine, 
  FaMobile, 
  FaHeart,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const HeroSection = styled.section`
  padding: 60px 0;
  text-align: center;
  
  @media (min-width: 768px) {
    padding: 80px 0;
  }
  
  @media (min-width: 1024px) {
    padding: 100px 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (min-width: 768px) {
    padding: 0 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 3.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1.25rem;
  }
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    gap: 1rem;
    margin-bottom: 3rem;
  }
`;

const CTAButton = styled(Link)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.9rem;
  min-height: 44px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  @media (min-width: 768px) {
    padding: 15px 30px;
    font-size: 1rem;
  }
`;

const FeaturesSection = styled.section`
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  
  @media (min-width: 768px) {
    padding: 60px 0;
  }
  
  @media (min-width: 1024px) {
    padding: 80px 0;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 2.5rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 2.5rem;
    margin-bottom: 3rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 2.5rem;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    margin-top: 3rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
  
  @media (min-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ffd700;
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const FeatureDescription = styled.p`
  opacity: 0.9;
  line-height: 1.6;
  font-size: 0.9rem;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const StatsSection = styled.section`
  padding: 40px 0;
  
  @media (min-width: 768px) {
    padding: 60px 0;
  }
  
  @media (min-width: 1024px) {
    padding: 80px 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  text-align: center;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
`;

const StatItem = styled(motion.div)`
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 0.5rem;
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const BenefitsSection = styled.section`
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  
  @media (min-width: 768px) {
    padding: 60px 0;
  }
  
  @media (min-width: 1024px) {
    padding: 80px 0;
  }
`;

const BenefitsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 2.5rem;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 3rem;
  }
`;

const BenefitItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  
  @media (min-width: 768px) {
    gap: 1rem;
    padding: 1rem;
    border-radius: 15px;
  }
`;

const BenefitIcon = styled.div`
  color: #4ade80;
  font-size: 1.2rem;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const BenefitText = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const Home = () => {
  const features = [
    {
      icon: <FaRobot />,
      title: "AI-Powered Chatbot",
      description: "Get instant health advice and information using advanced AI technology powered by Google Gemini."
    },
    {
      icon: <FaGlobe />,
      title: "Multilingual Support",
      description: "Access health information in multiple languages to serve diverse rural and semi-urban populations."
    },
    {
      icon: <FaShieldAlt />,
      title: "Disease Prevention",
      description: "Learn about preventive measures, symptoms, and early detection of common diseases."
    },
    {
      icon: <FaChartLine />,
      title: "Health Analytics",
      description: "Track your health conversations and get personalized insights and recommendations."
    },
    {
      icon: <FaMobile />,
      title: "Mobile-First Design",
      description: "Optimized for mobile devices to ensure accessibility in rural areas with limited technology."
    },
    {
      icon: <FaHeart />,
      title: "Community Health",
      description: "Stay informed about local health alerts and vaccination schedules in your area."
    }
  ];

  const benefits = [
    "24/7 Health Support",
    "Personalized Health Advice",
    "Disease Symptom Checker",
    "Vaccination Reminders",
    "Outbreak Alerts",
    "Health Education Resources",
    "Multilingual Interface",
    "Mobile Accessibility"
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <Container>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Your AI Health Assistant
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empowering rural and semi-urban communities with accessible, multilingual healthcare information and AI-driven health guidance.
          </HeroSubtitle>
          <CTAButtons
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <CTAButton to="/register">
              Get Started <FaArrowRight />
            </CTAButton>
            <CTAButton to="/login">
              Sign In
            </CTAButton>
          </CTAButtons>
        </Container>
      </HeroSection>

      <FeaturesSection>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Key Features
          </SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      <StatsSection>
        <Container>
          <StatsGrid>
            <StatItem
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <StatNumber>24/7</StatNumber>
              <StatLabel>Available Support</StatLabel>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <StatNumber>10+</StatNumber>
              <StatLabel>Languages</StatLabel>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <StatNumber>100+</StatNumber>
              <StatLabel>Diseases Covered</StatLabel>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <StatNumber>AI</StatNumber>
              <StatLabel>Powered</StatLabel>
            </StatItem>
          </StatsGrid>
        </Container>
      </StatsSection>

      <BenefitsSection>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Why Choose HealthBot?
          </SectionTitle>
          <BenefitsList>
            {benefits.map((benefit, index) => (
              <BenefitItem
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <BenefitIcon>
                  <FaCheckCircle />
                </BenefitIcon>
                <BenefitText>{benefit}</BenefitText>
              </BenefitItem>
            ))}
          </BenefitsList>
        </Container>
      </BenefitsSection>
    </HomeContainer>
  );
};

export default Home;
