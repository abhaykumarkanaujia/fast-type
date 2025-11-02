import { sentenceDifficulty } from "@/utils/types";

export const fetchNewSentence = async (difficulty: sentenceDifficulty) => {
  try {
    const response = await fetch(
      `/api/sentence?difficulty=${difficulty}&type=mixed`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      sentence: "Failed to load sentence. Please try again.",
      sentenceInfo: null,
    };
  }
};
