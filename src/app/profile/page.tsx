"use client";

import StreakBanner from "@/components/streak-banner";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user }: any = useAuth();
  const [userStats, setUserStats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      console.log("Fetching user stats...", user);
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const resp = await fetch(`/api/typing-stats/${user.uid}`);
        const data = await resp.json();
        console.log("User stats fetched:", data);
        setUserStats(data.stats);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-10">
        Please log in to view your profile.
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="text-center mt-10">
        No stats found. Complete a typing test to get started!
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
        {user?.displayName ?? "Your"}&apos;s Profile
      </h1>

      <StreakBanner currentStreak={userStats.length} />
    </div>
  );
}
