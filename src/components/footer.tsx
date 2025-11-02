"use client";
import { LuGithub, LuLinkedin } from "react-icons/lu";
import { GiWorld } from "react-icons/gi";
import Link from "next/link";
import { MY_SOCIALS } from "@/utils/constant";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 py-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="hover:text-white transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/contribute"
                  className="hover:text-white transition-colors"
                >
                  Contribute
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">
              Know More About Me
            </h3>
            <div className="flex items-center gap-4">
              <a
                href={MY_SOCIALS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <LuGithub className="w-6 h-6" />
              </a>
              <a
                href={MY_SOCIALS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <LuLinkedin className="w-6 h-6" />
              </a>
              <a
                href={MY_SOCIALS.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <GiWorld className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm">
          <p>This project is for educational purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
