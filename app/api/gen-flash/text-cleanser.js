
import nlp from "compromise"

export function processText(text) {
    // Step 1: Text Cleaning
    const cleanedText = cleanText(text);
  
    // Step 2: Tokenization
    const { sentences, words } = tokenizeText(cleanedText);
  
    // Step 3: Stop Words Removal
    const filteredWords = removeStopwords(words);
  
    // console.log(filteredWords,"FIltered")

    return { sentences, filteredWords };
  }
  
  function cleanText(text) {
    const lowercasedText = text.toLowerCase();
    const punctuationless = lowercasedText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    const specialCharLess = punctuationless.replace(/[^\w\s]/gi, '');
    const numberless = specialCharLess.replace(/[0-9]/g, '');
    return numberless;
  }
  
  function tokenizeText(cleanedText) {
    const doc = nlp(cleanedText);
    const sentences = doc.sentences().out('array');

    const words = cleanedText.split(/\s+/);
    // console.log(words,"Words")
    return { sentences, words };
  }
  
  const stopwords = ['a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'of', 'on', 'in', 'with', 'as', 'by', 'for', 'to', 'at'];
  
  function removeStopwords(words) {
    return words.filter(word => !stopwords.includes(word));
  }

