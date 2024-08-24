"use client";
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { signOut } from 'firebase/auth';

const Container = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  background: 'url(https://png.pngtree.com/thumb_back/fh260/background/20210429/pngtree-futuristic-design-background-with-hud-ui-image_676643.jpg) no-repeat center center fixed',
  backgroundSize: 'cover',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  overflow: 'hidden',
  position: 'relative', 
});

const Content = styled('div')({
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  padding: '30px',
  maxWidth: '1000px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
});

const Title = styled('h1')({
  color: '#2c3e50',
  fontFamily: 'Roboto, sans-serif',
  marginBottom: '20px',
  letterSpacing: '2px',
  fontSize: '3rem',
  textAlign: 'center',
});

const Input = styled(TextField)({
  marginBottom: '20px',
  
  width: '100%',
  maxWidth: '500px',
  '& .MuiInputLabel-root': {
    color: '#2c3e50',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#2c3e50',
    },
    '&:hover fieldset': {
      borderColor: '#3498db',
    }
  },
  '& input': {
    color: '#2c3e50',
  },
});

const ButtonContainer = styled('div')({
  display: 'flex',
  gap: '20px',
  marginBottom: '30px',
  width: '100%',
  justifyContent: 'center',
});

const FlashcardGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '15px',
  width: '100%',
  maxWidth: '1000px',
  marginTop: '20px',
});

const FlashcardWrapper = styled('div')({
  perspective: '1000px',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
  },
});
const FlashcardInner = styled('div')(({ flipped }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '90%',
  transition: 'transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
  transformStyle: 'preserve-3d',
  transform: flipped ? 'rotateY(180deg)' : 'none',
}));
const FlashcardFace = styled('div')({
  position: 'absolute',
  top: '10px', 
  left: '10px', 
  right: '10px',
  bottom: '10px', 
  backfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center', 
  padding: '15px', 
  borderRadius: '8px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.5s ease, background-color 0.3s ease',
  textAlign: 'center',
  wordWrap: 'break-word',
  wordBreak: 'break-word',
  boxSizing: 'border-box',
  overflowY: 'auto', 
  height: '100%',
  fontSize: 'calc(0.8rem + 0.3vw)', 
  lineHeight: '1.5',
  whiteSpace: 'normal',
  justifyContent: 'flex-start',
});
const FlashcardFront = styled(FlashcardFace)({
  backgroundColor: '#59A3AC',
  color: '#fff',
});

const FlashcardBack = styled(FlashcardFace)({
  backgroundColor: '#8BCDBC',
  color: '#fff',
  transform: 'rotateY(180deg)',
  fontWeight: 'bold',
  fontStyle: 'italic',
});

const LogoutButton = styled(Button)({
  position: 'absolute',
  top: '20px',
  right: '20px',
  background: '#59A3AC',
  color: '#fff',
  '&:hover': {
    background: '#c0392b',
  },
  zIndex: 2, 
});

const LinkBtn = styled(Button)({
  position: 'absolute',
  top: '20px',
  left: '20px',
  background: '#59A3AC',
  color: '#fff',
  '&:hover': {
    background: '#c0392b',
  },
});


const FlashcardGenerator = () => {
  const [category, setCategory] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [savedSets, setSavedSets] = useState([]);
  const [setName, setSetName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);






  const handleGenerate = async () => {
    console.log(category)
    try{
      const response = await fetch("/api/gen-flash",{
      method:"POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text:category   })
    })

    const d = await response.json();
    console.log(d)
    
    const str = d?.substring(d.indexOf("["),d.indexOf("]")+1);
    const res = await JSON.parse(str);
    console.log("res =>",res)
    setTimeout(() => {
      if(res)
      {
        setFlashcards(res);
      }
      
    }, 2000);
    // console.log(typeof(d.a),"Response by browser")
  }



    catch(e){
      console.log("abcd",e);
    }
    setFlippedIndex(null);
  };
  const handleFlip = (index) => {
    setFlippedIndex(index === flippedIndex ? null : index);
  };

  const handleSave = async () => {



    if (setName) {

      const uid= JSON.parse(sessionStorage.getItem("user")).userId;

      const collRef  = collection(db,"flashcards");
try{

  flashcards?.map(async (f)=>{
    console.log("1234",f)
   let res=  await addDoc(collRef,{
      topic:setName,
      question: f.question,
      answer: f.answer,
      userId:uid
    })
    console.log("response found")
    console.log(res);
    window.open('/savedFlashcards', '_blank');

  })
}
catch(e){
  alert("Something went wrong");
  console.error(e)
}
finally{

  setSetName('');
  setFlashcards([]);
  setCategory('');
  setOpenDialog(false);
}

      // const newSet = { name: setName, flashcards, };
      // setSavedSets([...savedSets, newSet]);
      // sessionStorage.setItem('savedSets', JSON.stringify([...savedSets, newSet]));
    }
  };

  const handleLogout = async () => {

    try{
      const res = await signOut(auth);
      sessionStorage.removeItem('user'); 
      window.location.href = '/login';

    }
    catch(e){
      console.error(e)
    }

    

  };

  return (
    <Container>
      <Content>

        <LinkBtn href='/savedFlashcards'>Saved Flash Cards</LinkBtn>

        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        <Title>Generate Flashcards</Title>
        <Input
          label="Enter Text"
          // rows={10}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          variant="outlined"
          multiline
  rows={8} // Set the initial height with rows
  
        />
        <ButtonContainer>
          <Button variant="contained" color="primary" onClick={handleGenerate}>
            Generate
          </Button>
          {flashcards?.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
            >
              Save Set
            </Button>
          )}
        </ButtonContainer>

        {flashcards?.length > 0 && (
          <FlashcardGrid>
            {flashcards?.map((flashcard, index) => (
              <FlashcardWrapper key={index} onClick={() => handleFlip(index)}>
                <FlashcardInner flipped={flippedIndex === index}>
                  <FlashcardFront>{flashcard?.question}</FlashcardFront>
                  <FlashcardBack>{flashcard?.answer}</FlashcardBack>
                </FlashcardInner>
              </FlashcardWrapper>
            ))}
          </FlashcardGrid>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Save Flashcard Set</DialogTitle>
          <DialogContent>
            <TextField
              label="Set Name"
              fullWidth
              variant="standard"
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </Content>
    </Container>
  );
};

export default FlashcardGenerator;
