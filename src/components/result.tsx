"use client";
import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";

export default function Results({ stats, onNextRound, onBackHome }: any) {
  const {
    wpm,
    accuracy,
    mistakes,
    timeElapsed,
    correctChars,
    totalChars,
  }: any = stats;

  const commonMistakes: [string, number][] = Object.entries(
    mistakes as Record<string, number>
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={onNextRound}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw size={16} />
          Next Round
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
          Race Completed!
        </h1>
        <p className="text-lg text-gray-400">
          Completed in {formatTime(timeElapsed)}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-300 mb-3">
            Words Per Minute
          </h2>
          <div className="text-7xl font-bold text-cyan-400">{wpm}</div>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-300 mb-3">
            Accuracy
          </h2>
          <div className="text-7xl font-bold text-emerald-400">{accuracy}%</div>
          <p className="text-gray-500">
            {correctChars} / {totalChars} characters correct
          </p>
        </div>

        {commonMistakes.length > 0 ? (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertCircle className="text-red-400" size={24} />
              <h2 className="text-2xl font-semibold text-gray-300">
                Common Mistakes
              </h2>
            </div>
            <div className="flex justify-center gap-6 flex-wrap">
              {commonMistakes.map(([char, count], idx) => (
                <div key={idx} className="text-center">
                  <div className="text-5xl font-mono text-red-400 mb-2">
                    {char === " " ? "␣" : char}
                  </div>
                  <div className="text-sm text-gray-400">{count} mistakes</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-3">🎯</div>
            <h2 className="text-2xl font-semibold text-emerald-400 mb-2">
              Perfect Round!
            </h2>
            <p className="text-gray-400">No mistakes detected</p>
          </div>
        )}
      </div>
    </>
  );
}
