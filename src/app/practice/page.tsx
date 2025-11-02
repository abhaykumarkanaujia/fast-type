"use client";
import PerformanceModal from "@/components/performance-modal";
import PracticeSettings from "@/components/practice-settings";
import Timer from "@/components/timer";
import TypingFeedback from "@/components/typing-feedback";
import { ArrowLeft, Pause, Play, RotateCcw, Square } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

const calculateWords = (str: string) => {
  const wordMatches = str.match(/\S+/g);
  return wordMatches ? wordMatches.length : 0;
};

export default function Practice() {
  const [settings, setSettings] = useState<any>({
    source: "randomWords",
    difficulty: "medium",
    mode: "timed",
    targetWpm: 60,
    customText: "",
  });

  const [text, setText] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null | any>(null);
  const [sessionKey, setSessionKey] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(true);
  const [showPerformanceModal, setShowPerformanceModal] =
    useState<boolean>(false);
  const [finalPerformance, setFinalPerformance] = useState<any>(null);

  const inputRef = useRef<any>(null);
  const [caretIndex, setCaretIndex] = useState(0);

  const fetchPracticeTextWithSettings = async (settingsToUse: any) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (settingsToUse.source === "custom" && settingsToUse.customText) {
        params.append("customText", settingsToUse.customText);
      } else {
        params.append("source", settingsToUse.source);
        if (settingsToUse.source === "randomWords") {
          params.append("difficulty", settingsToUse.difficulty);
        }
      }

      console.log("Fetching text with settings:", settingsToUse);
      console.log("Fetching text with params:", Object.fromEntries(params));

      const response = await fetch(`/api/practice-text?${params}`);
      const data = await response.json();

      console.log("Received text:", data);

      setText(data.text);
      setUserInput("");
      setIsActive(false);
      setStartTime(null);
      setSessionKey((prev) => prev + 1);
      setCaretIndex(0);
    } catch (error) {
      console.error("Failed to fetch practice text:", error);
      setText("Failed to load text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPracticeText = async () => {
    return fetchPracticeTextWithSettings(settings);
  };

  const handleStartPractice = async (customSettings = null) => {
    const settingsToUse = customSettings || settings;

    console.log("Starting practice with settings:", settingsToUse);

    await fetchPracticeTextWithSettings(settingsToUse);
    setShowSettings(false);
    setIsActive(false);
    setStartTime(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handlePauseResume = () => {
    setIsActive(!isActive);
    if (!isActive) {
      inputRef.current?.focus();
    }
  };

  const handleStop = () => {
    setIsActive(false);
    setStartTime(null);
    setUserInput("");
    setShowSettings(true);
  };

  const handleNewText = async () => {
    if (settings.source === "custom" && settings.customText) {
      setText(settings.customText);
      setUserInput("");
      setIsActive(false);
      setStartTime(null);
      setSessionKey((prev) => prev + 1);
      setCaretIndex(0);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } else {
      await fetchPracticeText();
      setShowSettings(false);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;

    if (value.length > text.length) return;

    setUserInput(value);
    if (e.target && typeof e.target.selectionStart === "number") {
      setCaretIndex(e.target.selectionStart);
    }

    if (!startTime && !isActive && value.length === 1) {
      setStartTime(Date.now());
      setIsActive(true);
    }

    if (value.length === text.length && value === text) {
      setIsActive(false);
      setTimeout(() => {
        const correctChars = calculateCorrectChars(value);
        const accuracy = Math.round((correctChars / value.length) * 100);
        const timeElapsed = startTime
          ? Math.round((Date.now() - startTime) / 1000)
          : 0;
        const wpm =
          timeElapsed > 0
            ? Math.round(value.length / 5 / (timeElapsed / 60))
            : 0;
        const errors = value.length - correctChars;
        setFinalPerformance({
          wpm,
          accuracy,
          totalTime: timeElapsed,
          correctChars,
          totalChars: value.length,
          errors,
        });
        setShowPerformanceModal(true);
      }, 100);
    }
  };

  const handleKeyUp = (e: any) => {
    if (!inputRef.current) return;
    const pos = inputRef.current.selectionStart ?? 0;
    setCaretIndex(pos);
  };

  const handleSelect = () => {
    if (!inputRef.current) return;
    setCaretIndex(inputRef.current.selectionStart ?? 0);
  };

  const handleClick = () => {
    if (!inputRef.current) return;
    setCaretIndex(inputRef.current.selectionStart ?? 0);
  };

  const calculateCorrectChars = (input: string) => {
    let correct = 0;
    for (let i = 0; i < input.length && i < text.length; i++) {
      if (input[i] === text[i]) {
        correct++;
      }
    }
    return correct;
  };

  const handleTimerFinish = () => {
    setIsActive(false);
    const correctChars = calculateCorrectChars(userInput);
    const accuracy =
      userInput.length > 0
        ? Math.round((correctChars / userInput.length) * 100)
        : 0;
    const wpm = userInput.length > 0 ? Math.round(userInput.length / 5 / 1) : 0;
    const errors = userInput.length - correctChars;

    setTimeout(() => {
      setFinalPerformance({
        wpm,
        accuracy,
        totalTime: 60,
        correctChars,
        totalChars: userInput.length,
        errors,
      });
      setShowPerformanceModal(true);
    }, 100);
  };

  const completionPercentage =
    text.length > 0 ? (userInput.length / text.length) * 100 : 0;
  const typedWords = calculateWords(userInput);
  const totalWords = calculateWords(text);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 bg-linear-to-r from-gray-800/50 to-gray-700/50 p-6 rounded-xl border border-gray-600">
          <h1 className="text-4xl font-bold bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            🏆 Practice Mode
          </h1>

          <div className="flex items-center gap-3">
            {!showSettings && (
              <>
                <button
                  onClick={handlePauseResume}
                  className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/20 font-medium"
                  disabled={!text || completionPercentage === 100}
                >
                  {isActive ? <Pause size={18} /> : <Play size={18} />}
                  {isActive ? "Pause" : "Resume"}
                </button>

                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/20 font-medium"
                >
                  <Square size={18} />
                  Stop
                </button>
              </>
            )}

            <button
              onClick={handleNewText}
              className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20 font-medium"
              disabled={isLoading}
            >
              Random
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Settings Panel */}
          {showSettings && (
            <PracticeSettings
              settings={settings}
              onSettingsChange={setSettings}
              onStartPractice={handleStartPractice}
            />
          )}

          {/* Practice Session */}
          {!showSettings && (
            <div className="space-y-6">
              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center gap-3 px-6 py-4 bg-linear-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                    <span className="text-cyan-400 font-medium">
                      Loading new text...
                    </span>
                  </div>
                </div>
              )}

              {/* Timer (only for timed mode) */}
              {!isLoading && settings.mode === "timed" && (
                <div className="text-center">
                  <Timer
                    key={sessionKey}
                    duration={60}
                    onFinish={handleTimerFinish}
                    isActive={isActive}
                  />
                </div>
              )}

              {/* Real-time Feedback */}
              {!isLoading && (
                <TypingFeedback
                  text={text}
                  userInput={userInput}
                  startTime={startTime}
                  isActive={isActive}
                  mode={settings.mode}
                  targetWpm={settings.targetWpm}
                />
              )}

              {/* Typing Input */}
              {!isLoading && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                    <span>⌨️</span>
                    Start typing:
                  </h3>
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      value={userInput}
                      onChange={handleInputChange}
                      onKeyUp={handleKeyUp}
                      onSelect={handleSelect}
                      onClick={handleClick}
                      placeholder="Start typing the text above..."
                      disabled={isLoading || !text}
                      className="w-full px-6 py-5 bg-linear-to-br from-gray-800 to-gray-900 border-2 border-gray-600 rounded-xl text-white font-mono text-lg leading-relaxed placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/20 resize-none transition-all duration-300 shadow-lg"
                      rows={5}
                      spellCheck={false}
                    />
                    {isActive && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl border border-gray-600">
                    <div className="text-sm font-medium text-gray-300">
                      <span className="text-cyan-400">Progress:</span>{" "}
                      {userInput.length} / {text.length} characters
                      <span className="ml-3 text-gray-400">
                        (Cursor: {caretIndex} / {text.length})
                      </span>
                      <span className="ml-2 px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg">
                        {Math.round(completionPercentage)}%
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-400">
                      <span>
                        {/* Using the new word calculation function */}
                        <strong>Words:</strong> {typedWords} / {totalWords}
                      </span>
                      {settings.mode === "untimed" && startTime && (
                        <span>
                          <strong>Time:</strong>{" "}
                          {Math.round((Date.now() - startTime) / 1000)}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Practice Tips */}
              {!isLoading && (
                <div className="bg-linear-to-br from-gray-800/70 to-gray-900/70 border border-cyan-500/20 rounded-xl p-6 shadow-lg">
                  <h4 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
                    <span>💡</span>
                    Practice Tips:
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="text-gray-300 space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>
                          Focus on{" "}
                          <strong className="text-white">accuracy first</strong>
                          , speed will come naturally
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>
                          Keep your{" "}
                          <strong className="text-white">
                            eyes on the text
                          </strong>
                          , not your hands
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>
                          Use proper{" "}
                          <strong className="text-white">
                            finger positioning
                          </strong>{" "}
                          on home row keys
                        </span>
                      </li>
                    </ul>
                    <ul className="text-gray-300 space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>
                          Take <strong className="text-white">breaks</strong> to
                          avoid fatigue and maintain performance
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>
                          Practice{" "}
                          <strong className="text-white">regularly</strong> for
                          consistent improvement
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>
                          Use{" "}
                          <strong className="text-white">
                            different text types
                          </strong>{" "}
                          to challenge yourself
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Performance Modal */}
      <PerformanceModal
        isOpen={showPerformanceModal}
        onClose={() => setShowPerformanceModal(false)}
        performance={finalPerformance}
        onTryAgain={() => {
          setShowPerformanceModal(false);
          handleNewText();
        }}
        onBackToPractice={() => {
          setShowPerformanceModal(false);
          setShowSettings(true);
          setUserInput("");
          setIsActive(false);
          setStartTime(null);
        }}
      />
    </div>
  );
}
