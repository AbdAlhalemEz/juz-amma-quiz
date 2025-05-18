// src/loadJuzAmma.js
export async function loadJuzAmma() {
  const response = await fetch("/juz_amma.txt");
  const text = await response.text();

  const surahs = {};
  let currentSurah = "";
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (/^سورة/.test(line)) {
      currentSurah = line.replace(/^سورة\s*/, "");
      surahs[currentSurah] = [];
    } else if (currentSurah && !line.includes("بِسْمِ")) {
      surahs[currentSurah].push(line);
    }
  }

  return surahs;
}