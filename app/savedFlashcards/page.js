"use client";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { TextField, Button } from "@mui/material";
import { collection, getDoc,getDocs,query,where } from "firebase/firestore";
import { db } from "@/firebase.config";

const Container = styled("div")({
  display: 'flex',
  minHeight: '100vh',
  background: 'url(https://png.pngtree.com/thumb_back/fh260/background/20210429/pngtree-futuristic-design-background-with-hud-ui-image_676643.jpg) no-repeat center center fixed',
  backgroundSize: 'cover',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  overflow: 'hidden',
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

const Title = styled("h1")({
  color: "#2c3e50",
  fontSize: "3rem",
  marginBottom: "30px",
  letterSpacing: "1px",
  fontWeight: "700",
  textShadow: "3px 3px 6px rgba(0, 0, 0, 0.5)",
  textAlign: 'center',
});

const SearchField = styled(TextField)({
  maxWidth: "500px",
  marginBottom: "40px",
  "& label.Mui-focused": {
    color: "#3498db",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#3498db",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3498db",
    },
  },
});

const CardGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "20px",
  justifyContent: "center",
  width: '100%', 
});

const FlashcardSet = styled("div")({
  perspective: "1000px",
  "&:hover .flip-card-inner": {
    transform: "rotateY(180deg)",
  },
});

const FlipCardInner = styled("div")({
  position: "relative",
  width: "300px",
  height: "200px",
  textAlign: "center",
  transition: "transform 0.8s",
  transformStyle: "preserve-3d",
  margin: "0 auto",
});

const FlipCardFront = styled("div")({
  backgroundColor: "#59A3AC",
  color: "white",
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  fontSize: "1.5rem",
  fontWeight: 'bold', 
  fontStyle: 'italic',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'normal',  
  wordBreak: 'break-word',  
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});


const FlipCardBack = styled("div")({
  backgroundColor: "#8BCDBC",
  color: "#2c3e50",
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  transform: "rotateY(180deg)",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  flexDirection: "column",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  fontSize: "1.2rem",
  overflowY: "auto",
});

const QuestionAnswerSet = styled("div")({
  marginBottom: "10px",
  padding: "10px",
  backgroundColor: "#f0f4f5",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
});

const Question = styled("strong")({
  display: "block",
  fontSize: "1rem",
  color: "#34495e",
  marginBottom: "5px",
});

const Answer = styled("p")({
  fontSize: "0.9rem",
  color: "#2c3e50",
  margin: 0,
});

const NoResultsText = styled("p")({
  fontSize: "1.2rem",
  color: "#95a5a6",
  fontWeight: "500",
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
const LogoutButton = styled(Button)({
  position: 'absolute',
  top: '20px',
  right: '20px',
  background: '#59A3AC',
  color: '#fff',
  '&:hover': {
    background: '#c0392b',
  },
});

const SavedFlashcards = () => {
  const [savedSets, setSavedSets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [cards,setCards] = useState({
    "topic":[]
  })

  useEffect(() => {

    const getData = async ()=>{

      const collRef = collection(db,"flashcards");
  
      const uid= JSON.parse(sessionStorage.getItem("user")).userId;
      const q = query(collRef, where("userId" ,"==",uid))
  
      const querySnapshot = await getDocs(q);
  
      let retrieved = []

      let obj ={}
       querySnapshot.forEach( d=>{
        // let dt = await d.data();
        console.log(d.data());

        let data = d.data();

        if (!obj[data.topic]) {
          obj[data.topic] = []; // Initialize the array if it doesn't exist
      }
      
      obj[data.topic].push({
          question: data.question,
          answer: data.answer,
      });
        // retrieved.push(d.data());
      })
      setSavedSets(obj);
    }

    getData();
    // const flashCardDocs = await getDoc

    const saved = JSON.parse(sessionStorage.getItem("savedSets")) || [];
  }, []);

  const filteredSets = Object.keys(savedSets).filter((set) =>
    set.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //[  {topic:"",flashcars:""}  ]
  

  const handleLogout = () => {
    sessionStorage.removeItem("user"); 
    window.location.href = '/login';
  };

  // console.log("saved sets: ",savedSets)
  // console.log("filtered sets: ",filteredSets)

  return (
    <Container>
      <Content>
      
      {/* <div style={{"display":"flex","justifyContent":"space-between"}}> */}
        <LinkBtn href="/flashcard-generator"  >Generate Flashcards</LinkBtn>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>

      {/* </div> */}
        <Title>Saved Flashcard Sets</Title>
        <SearchField
          variant="outlined"
          label="Search Flashcard Sets"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
        {filteredSets.length > 0 ? (
          <CardGrid>
            {filteredSets.map((set, index) => (
              
              <FlashcardSet key={index}>
                <FlipCardInner className="flip-card-inner">
                  <FlipCardFront>
                    <h2>{set}</h2>
                  </FlipCardFront>
                  <FlipCardBack>
                  {  console.log("here ",savedSets[set])}
                    {savedSets[set].map((flashcard, i) => (
                      <QuestionAnswerSet key={i}>
                        <Question>{flashcard.question}</Question>
                        <Answer>{flashcard.answer}</Answer>
                      </QuestionAnswerSet>
                    ))}
                  </FlipCardBack>
                </FlipCardInner>
              </FlashcardSet>
            ))}
          </CardGrid>
        ) : (
          <NoResultsText>No saved sets available</NoResultsText>
        )}
      </Content>
    </Container>
  );
};
export default SavedFlashcards;
