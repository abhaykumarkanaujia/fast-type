"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function LeaderboardPage() {
  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/user/leaderboard?limit=50");
      const data = await res.json();
      setRows(data.leaderboard || []);
    } catch (err) {
      console.error("Failed to load leaderboard", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const id = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Global Leaderboard</h1>
        </div>

        <div className="space-y-2">
          {rows.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No leaderboard data yet.
            </div>
          )}

          {rows.map((row: any) => (
            <div
              key={row.userId || row.rank}
              className="flex items-center gap-4 bg-gray-800/40 border border-gray-700 rounded-lg p-3"
            >
              <div className="w-10 text-center text-gray-300 font-mono">
                {row.rank}
              </div>

              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 shrink-0">
                  {row.photoURL ? (
                    <img
                      src={row.photoURL}
                      alt={row.displayName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-lg">🏆</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="font-medium">{row.displayName}</div>
                </div>
              </div>

              <div className="w-28 text-right">
                <div className="text-sm text-gray-400">Best WPM</div>
                <div className="font-bold text-cyan-400 text-lg">
                  {row.lastTestWPM}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/compete"
            className="group px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Zap size={24} />
            <span>Start Competing</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
