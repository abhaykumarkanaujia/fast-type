"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const AuthContext = createContext({
  user: null,
  loading: false,
  signInWithGoogle: async () => {},
  logout: async () => {},
  updateUserScore: async (score: number, gameTime: number = 0) => {},
  saveTypingStat: async (
    wpm: number,
    accuracy: number,
    timePlayed: number
  ) => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await fetch("/api/user/create-or-update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
          });

          if (response.ok) {
            const userData = await response.json();
            console.log("User data saved to MongoDB:", userData);
          }
        } catch (error) {
          console.error("Error saving user data to MongoDB:", error);
        }
      }
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    if (!auth) {
      throw new Error(
        "Firebase auth is not initialized. Check your environment variables."
      );
    }
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    try {
      await fetch("/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const updateUserScore = async (score: number, gameTime: number = 0) => {
    if (!user) {
      console.error("No user logged in");
      return;
    }

    try {
      const response = await fetch("/api/user/update-score", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score, gameTime }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Score updated successfully:", result);
        return result;
      } else {
        console.error("Failed to update score");
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const saveTypingStat = async (
    wpm: number,
    accuracy: number,
    timePlayed: number
  ) => {
    if (!user) {
      console.error("No user logged in");
      return;
    }

    try {
      const response = await fetch("/api/typing-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wpm, accuracy, timePlayed }),
      });
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        console.error("Failed to save typing stat");
      }
    } catch (err) {
      console.error("Error saving typing stat:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        logout,
        updateUserScore,
        saveTypingStat,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
