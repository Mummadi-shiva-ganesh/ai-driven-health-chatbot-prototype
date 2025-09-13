import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: white;
  margin-top: 20px;
  font-size: 18px;
  font-weight: 500;
`;

const LoadingSpinner = () => {
  return (
    <SpinnerContainer>
      <div style={{ textAlign: 'center' }}>
        <Spinner />
        <LoadingText>Loading HealthBot...</LoadingText>
      </div>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
