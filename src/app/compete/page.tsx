"use client";
import { useAuth } from "@/context/authContext";
import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import Results from "@/components/result";
import Timer from "@/components/timer";
import CompetingInstruction from "@/components/competing-instruction";
import Sentence from "@/components/sentense";
import { sentenceDifficulty } from "@/utils/types";
import { fetchNewSentence } from "@/services/sentence";

export default function Compete() {
  const { saveTypingStat } = useAuth();
  const [sentence, setSentence] = useState("");
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [timerKey, setTimerKey] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [raceStatus, setRaceStatus] = useState("in-progress");
  const [stats, setStats] = useState<any>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [difficulty, setDifficulty] = useState<sentenceDifficulty>("medium");
  const [sentenceInfo, setSentenceInfo] = useState<any>(null);

  useEffect(() => {
    handleNewSentence();
  }, [difficulty]);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, raceStatus]);

  const handleNewSentence = async () => {
    setLoading(true);
    const { sentence, sentenceInfo } = await fetchNewSentence(difficulty);
    setSentence(sentence);
    setSentenceInfo(sentenceInfo);
    setLoading(false);
  };

  const endRace = async () => {
    setTimerActive(false);

    const endTime = Date.now();
    const timeElapsed = startTime ? (endTime - startTime) / 1000 : 0;

    let correctChars = 0;
    let mistakes: any = {};
    for (let i = 0; i < userInput.length; i++) {
      if (i < sentence.length) {
        if (userInput[i] === sentence[i]) {
          correctChars++;
        } else {
          const char = sentence[i];
          mistakes[char] = (mistakes[char] || 0) + 1;
        }
      }
    }

    const wpm =
      timeElapsed > 0 ? Math.round(correctChars / 5 / (timeElapsed / 60)) : 0;
    const accuracy =
      sentence.length > 0
        ? Math.round((correctChars / userInput.length) * 100)
        : 0;

    saveTypingStat(wpm, accuracy, timeElapsed)
      .then((typingStat: any) => {
        if (typingStat) {
          console.log("User stats saved:", typingStat);
        }
      })
      .catch((error) => {
        console.error("Error creating or updating user stats:", error);
      });

    setStats({
      wpm,
      accuracy,
      mistakes,
      timeElapsed,
      correctChars,
      totalChars: sentence.length,
    });
    setRaceStatus("completed");
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    if (!timerActive && value.length > 0) {
      setTimerActive(true);
      setStartTime(Date.now());
    }
    setUserInput(value);
    if (value.length >= sentence.length) {
      endRace();
    }
  };

  const handleNextRound = () => {
    setRaceStatus("in-progress");
    setUserInput("");
    setTimerActive(false);
    setStats(null);
    setStartTime(null);
    setTimerKey((prev) => prev + 1);
    handleNewSentence();
  };

  const setSentenceDifficulty = (difficulty: string) => {
    if (difficulty === "easy") {
      setDifficulty("easy");
    } else if (difficulty === "hard") {
      setDifficulty("hard");
    } else {
      setDifficulty("medium");
    }
  };

  const getCharacterStatus = (index: number) => {
    if (index >= userInput.length) return "untyped";
    if (userInput[index] === sentence[index]) return "correct";
    return "incorrect";
  };

  if (raceStatus === "completed" && stats) {
    return (
      <div className="min-h-screen bg-gray-900 text-white relative py-8 px-4">
        <Results stats={stats} onNextRound={handleNextRound} />
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-gray-900 text-white relative">
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Difficulty:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setSentenceDifficulty(e.target.value)}
                  className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-cyan-400"
                  disabled={loading}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleNextRound}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer"
                disabled={loading}
              >
                <RotateCcw size={16} />
                New Sentence
              </button>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Start typing to Compete!
            </h1>
            {sentenceInfo && (
              <div className="mb-4 text-sm text-gray-400">
                <span className="capitalize bg-gray-800 px-3 py-1 rounded-full border border-gray-600">
                  Difficulty : <span className="capitalize">{difficulty}</span>
                </span>
              </div>
            )}

            <Timer
              key={timerKey}
              duration={60}
              onFinish={endRace}
              isActive={timerActive}
            />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-300">
                Type the following sentence:
              </h2>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 min-h-[120px] flex items-center">
                {loading ? (
                  <div className="flex items-center justify-center w-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                    <span className="ml-3 text-gray-400">
                      Loading sentence...
                    </span>
                  </div>
                ) : (
                  <Sentence
                    sentence={sentence}
                    userInput={userInput}
                    getCharacterStatus={getCharacterStatus}
                  />
                )}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3 text-gray-300">
                Start typing here:
              </h3>
              <div className="relative group">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onPaste={(e) => e.preventDefault()}
                  onKeyDown={(e) => {
                    if (
                      (e.ctrlKey || e.metaKey) &&
                      e.key.toLowerCase() === "v"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Start typing the sentence above..."
                  disabled={loading}
                  className="w-full px-0 py-3 bg-transparent text-lg font-mono text-white placeholder-gray-500 border-0 border-b-2 border-gray-600 focus:border-transparent focus:outline-none transition-all duration-300 disabled:opacity-50"
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r from-cyan-400 to-blue-500 transform scale-x-0 origin-left transition-transform duration-300 group-focus-within:scale-x-100"></div>
              </div>

              <div className="mt-4 flex justify-between text-sm text-gray-400">
                <span>
                  Progress: {userInput.length} / {sentence.length} characters
                </span>
                <span>
                  Words:{" "}
                  {
                    userInput.split(" ").filter((word) => word.length > 0)
                      .length
                  }{" "}
                  / {sentence.split(" ").length}
                </span>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <CompetingInstruction />
          </div>
        </div>
      </div>
    );
  }
}
