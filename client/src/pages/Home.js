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
  padding: 100px 0;
  text-align: center;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const CTAButton = styled(Link)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ffd700;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  opacity: 0.9;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  padding: 80px 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const StatItem = styled(motion.div)`
  padding: 2rem;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const BenefitsSection = styled.section`
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const BenefitsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const BenefitItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
`;

const BenefitIcon = styled.div`
  color: #4ade80;
  font-size: 1.5rem;
`;

const BenefitText = styled.div`
  font-weight: 500;
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
