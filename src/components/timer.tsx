"use client";
import { useEffect, useRef, useState } from "react";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Timer({ duration, onFinish, isActive = true }: any) {
  const [time, setTime] = useState(duration ?? 0);
  const [mounted, setMounted] = useState(false); // 👈 new
  const intervalRef = useRef<any>(null);
  const onFinishRef = useRef<any>(onFinish);

  useEffect(() => {
    setMounted(true); // 👈 ensures rendering only after hydration
  }, []);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    if (!mounted) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!isActive) return;

    intervalRef.current = setInterval(() => {
      setTime((prev: any) => {
        if (duration !== undefined) {
          if (prev > 0) return prev - 1;
          clearInterval(intervalRef.current);
          if (onFinishRef.current) onFinishRef.current();
          return 0;
        } else {
          return prev + 1;
        }
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isActive, duration, mounted]);

  useEffect(() => {
    if (duration !== undefined) {
      setTime(duration);
    }
  }, [duration]);

  if (!mounted) {
    return (
      <div className="w-full flex justify-center mb-4">
        <span className="text-3xl md:text-5xl font-bold text-cyan-400 neon-timer px-4 py-2 rounded-lg">
          --:--
        </span>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center mb-4">
      <span
        className="text-3xl md:text-5xl font-bold text-cyan-400 neon-timer px-4 py-2 rounded-lg"
        style={{
          textShadow:
            "0 0 8px #22d3ee, 0 0 16px #2563eb, 0 0 32px #a78bfa, 0 0 2px #fff",
        }}
      >
        {formatTime(time)}
      </span>
      <style jsx>{`
        .neon-timer {
          background: linear-gradient(
            90deg,
            rgba(34, 211, 238, 0.15) 0%,
            rgba(59, 130, 246, 0.1) 100%
          );
          box-shadow: 0 0 24px 4px #22d3ee44;
        }
      `}</style>
    </div>
  );
}
