import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import { juzAmma } from "./juz_amma";
import "./App.css";

const correctSound = new Audio("/sounds/correct.mp3");
const wrongSound = new Audio("/sounds/wrong.mp3");

function SurahQuiz() {
  const { surahName } = useParams();
  const [shuffledVerses, setShuffledVerses] = useState([]);
  const [selected, setSelected] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [errorVerse, setErrorVerse] = useState(null);

  const verses = juzAmma[surahName] || [];

  useEffect(() => {
    const shuffled = [...verses].sort(() => 0.5 - Math.random());
    setShuffledVerses(shuffled);
    setSelected([]);
    setCompleted(false);
    setErrorVerse(null);
  }, [surahName]);

  const handleClick = (verse) => {
    if (completed || selected.includes(verse)) return;
    const next = [...selected, verse];
    const correct = verses.slice(0, next.length).every((v, i) => v === next[i]);

    if (!correct) {
      setErrorVerse(verse);
      wrongSound.play(); // 🔴 صوت خطأ
      setTimeout(() => setErrorVerse(null), 800);
      return;
    }

    setSelected(next);
    if (next.length === verses.length) {
      correctSound.play(); // ✅ صوت نجاح
      setCompleted(true);
      const completed = JSON.parse(localStorage.getItem("completedSurahs") || "[]");
      if (!completed.includes(surahName)) {
        completed.push(surahName);
        localStorage.setItem("completedSurahs", JSON.stringify(completed));
      }
    }
  };

  return (
    <div className="quiz-container">
      <h2>{surahName}</h2>
      <div className="verses-grid">
        {shuffledVerses.map((v, i) => (
          <button
            key={i}
            className={
              "verse-btn" +
              (selected.includes(v) ? " selected" : "") +
              (errorVerse === v ? " error" : "")
            }
            onClick={() => handleClick(v)}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="selected-box">
        {selected.map((v, i) => (
          <div key={i} className="selected-verse">
            {i + 1}. {v}
          </div>
        ))}
      </div>
      {completed && <div className="success-msg">🎉 أحسنت! انتهيت من ترتيب السورة بنجاح.</div>}
      <Link to="/" className="back-btn">⬅️ رجوع</Link>
    </div>
  );
}

function Home() {
  const surahs = Object.keys(juzAmma);
  const completed = JSON.parse(localStorage.getItem("completedSurahs") || "[]");
  const remainingSurahs = surahs.filter((s) => !completed.includes(s));

  return (
    <div className="home">
      <h1>📖 اختر السورة</h1>
      <div className="surah-grid">
        {remainingSurahs.map((name) => (
          <Link to={`/quiz/${name}`} key={name} className="surah-btn">{name}</Link>
        ))}
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    localStorage.removeItem("completedSurahs");
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:surahName" element={<SurahQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
