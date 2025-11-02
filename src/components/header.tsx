"use client";
import { useAuth } from "@/context/authContext";
import { STOCK_USER_PHOTO } from "@/utils/constant";
import { LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signInWithGoogle, logout, loading }: any = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href={"/intro"}
            className="text-xl font-extrabold text-blue-600 tracking-tight"
          >
            fast <span className="text-gray-800">Type</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/leaderboard"
              className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
            >
              Leaderboard
            </Link>
            <Link
              href="/compete"
              className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
            >
              Compete
            </Link>
            <Link
              href="/practice"
              className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
            >
              Practice
            </Link>
            {!loading && !user && (
              <>
                <button
                  onClick={signInWithGoogle}
                  className="bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg shadow-cyan-500/20"
                >
                  Sign In
                </button>
              </>
            )}
            {!loading && user && (
              <div className="flex items-center gap-2 ml-1">
                <Image
                  src={user.photoURL ?? STOCK_USER_PHOTO}
                  alt={user.displayName || "User"}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-cyan-500 object-cover"
                  referrerPolicy="no-referrer"
                  unoptimized={true}
                />
                <button
                  onClick={logout}
                  className="bg-transparent text-white/90 rounded-md font-medium transition-all duration-300 hover:text-red-400 hover:cursor-pointer"
                >
                  <LogOut className="w-4 h-4 inline-block sm:ml-0 sm:pl-0" />
                </button>
              </div>
            )}
          </nav>

          <button
            className="md:hidden text-gray-300 hover:text-white transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <MobileMenu
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            loading={loading}
            user={user}
            signInWithGoogle={signInWithGoogle}
            logout={logout}
          />
        )}
      </div>
    </header>
  );
}

function MobileMenu({
  setIsMenuOpen,
  loading,
  user,
  signInWithGoogle,
  logout,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  user: any;
  signInWithGoogle: any;
  logout: any;
}) {
  return (
    <div className="md:hidden border-t border-gray-800 py-4">
      <div className="flex flex-col gap-4">
        <Link
          href="/leaderboard"
          className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          Leaderboard
        </Link>
        <Link
          href="/compete"
          className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          Compete
        </Link>
        <Link
          href="/practice"
          className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          Practice
        </Link>
        {!loading && !user && (
          <>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                signInWithGoogle();
              }}
              className="bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg shadow-cyan-500/20"
            >
              Sign In
            </button>
          </>
        )}
        {!loading && user && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <Image
                src={user.photoURL ?? STOCK_USER_PHOTO}
                alt={user.displayName ?? "User"}
                width={40}
                height={40}
                className="rounded-full border-2 border-cyan-500 object-cover"
                referrerPolicy="no-referrer"
                unoptimized={true}
              />
              <span className="font-medium text-white">
                {user?.displayName}
              </span>
            </div>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
              className="bg-transparent border border-white/10 text-white/90 px-4 py-2 rounded-md font-medium transition-all duration-300 hover:bg-red-600/10 hover:text-red-400"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
