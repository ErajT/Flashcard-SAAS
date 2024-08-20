
import Head from 'next/head';
import Login from './login/page'; 

export default function Home() {
  return (
    <div>
      <Head>
        <title>Flashcard Generator</title>
        <meta name="description" content="Generate flashcards easily" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
      <main>
        <Login />
      </main>
    </div>
  );
}
