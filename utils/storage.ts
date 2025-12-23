
export interface ScoreData {
  score: number;
  medal: boolean;
}

const SCORES_KEY = 'tokei_master_scores';

export const getHighScores = (): Record<number, ScoreData> => {
  try {
    const scoresJSON = localStorage.getItem(SCORES_KEY);
    return scoresJSON ? JSON.parse(scoresJSON) : {};
  } catch (error) {
    console.error("Failed to parse high scores from localStorage", error);
    return {};
  }
};

export const saveHighScores = (scores: Record<number, ScoreData>): void => {
  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
  } catch (error) {
    console.error("Failed to save high scores to localStorage", error);
  }
};
