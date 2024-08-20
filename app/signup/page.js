"use client";
import React, { useState } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { TextField, Button, Typography, IconButton, Snackbar, Alert } from '@mui/material';
import Link from 'next/link';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase.config';
import { addDoc, collection } from 'firebase/firestore';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Container = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  background: 'url(https://png.pngtree.com/thumb_back/fh260/background/20210429/pngtree-futuristic-design-background-with-hud-ui-image_676643.jpg) no-repeat center center fixed',
  backgroundSize: 'cover',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  animation: `${fadeIn} 1s ease-in`,
});

const FormContainer = styled('div')({
  width: '100%',
  maxWidth: '380px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  padding: '40px',
  animation: `${slideIn} 0.5s ease-out`,
  position: 'relative',
});

const Header = styled('div')({
  textAlign: 'center',
  marginBottom: '30px',
  animation: `${slideIn} 0.5s ease-out`,
});

const Title = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '10px',
  animation: `${slideIn} 0.5s ease-out`,
});

const Subtitle = styled(Typography)({
  fontSize: '1.5rem',
  color: '#7f8c8d',
  animation: `${slideIn} 0.5s ease-out`,
});

const Description = styled(Typography)({
  fontSize: '1rem',
  color: '#7f8c8d',
  marginTop: '10px',
});

const StyledInput = styled(TextField)({
  marginBottom: '20px',
  width: '100%',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: '8px',
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: '#3498db',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3498db',
    },
  },
  '& input': {
    padding: '12px 14px',
  },
});

const StyledButton = styled(Button)({
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  background: 'linear-gradient(to right, #3498db, #2980b9)',
  color: '#fff',
  fontWeight: 'bold',
  '&:hover': {
    background: 'linear-gradient(to right, #2980b9, #3498db)',
  },
});

const FooterLinks = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '20px',
});



const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


  


  const handleSignup = async (e) => {

    
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      setSnackbarMessage('Please enter a valid email address.');
      setSnackbarOpen(true);
      return;
    }
    
    if (password !== confirmPassword) {
      setSnackbarMessage('Passwords do not match.');
      setSnackbarOpen(true);
      return;
    }

    try{

      const res = await createUserWithEmailAndPassword(auth,email,password)

      console.log(res.user.uid+"hello")

      sessionStorage.setItem('user', JSON.stringify({userId:res.user.uid}));
      setSnackbarMessage('Signup successful!');
      setSnackbarOpen(true);
      setTimeout(() => {
        window.location.href = '/flashcard-generator';
      }, 1500); // Delay to show Snackbar
      

      
    }
catch(e){
  console.error(e)
}
};
    

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <FormContainer>
        <Header>
          <Title>Join Us,</Title>
          <Subtitle>Sign Up!</Subtitle>
          <Description>Create your account and start generating flashcards.</Description>
        </Header>
        <form onSubmit={handleSignup}>
          <StyledInput
            label="Email Address"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <StyledInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <StyledInput
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <FooterLinks>
            <Link href="/login" passHref>
              <Typography variant="body2" color="primary" style={{ cursor: 'pointer' }}>
                Already have an account? Log in
              </Typography>
            </Link>
          </FooterLinks>
          <StyledButton type="submit">Sign Up</StyledButton>
        </form>
      </FormContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Signup;
