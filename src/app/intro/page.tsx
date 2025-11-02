import { ArrowRight, Target, Trophy, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Intro() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <section className="relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center items-center pb-4 w-full h-50">
              <h1 className="text-5xl font-extrabold text-blue-600 tracking-tight">
                fast <span className="text-gray-800">Type</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Challenge yourself in the ultimate typing speed competition. Race
              against time and climb the leaderboard!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/compete"
                className="group px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
              >
                <Zap size={24} />
                <span>Start Competing</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href="/leaderboard"
                className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-lg font-semibold text-lg hover:border-cyan-400 hover:text-cyan-400 transition-all duration-200 flex items-center space-x-2"
              >
                <Trophy size={20} />
                <span>View Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Why Choose Fast Type?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-lg bg-gray-800 border border-gray-700 hover:border-cyan-400/50 transition-colors">
              <div className="w-16 h-16 bg-linear-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={32} className="text-white" />
              </div>
              <Link
                href="/practice"
                className="text-xl font-semibold mb-3 text-cyan-400"
              >
                Practice Mode
              </Link>
              <p className="text-gray-300">
                Improve your typing accuracy with our advanced real-time
                feedback system
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gray-800 border border-gray-700 hover:border-purple-400/50 transition-colors">
              <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-400">
                Speed Boost
              </h3>
              <p className="text-gray-300">
                Track your WPM progress and watch your typing speed soar to new
                heights
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gray-800 border border-gray-700 hover:border-green-400/50 transition-colors">
              <div className="w-16 h-16 bg-linear-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-green-400">
                Global Competition
              </h3>
              <p className="text-gray-300">
                Compete with typists worldwide and earn your place on the global
                leaderboard
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
