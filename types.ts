
export interface Time {
  hour: number;
  minute: number;
}

export interface Duration {
  hours: number;
  minutes: number;
}

type BaseQuestion = {
  id: string;
};

export type Level1Question = BaseQuestion & {
  level: 1;
  time: Time;
  answer: number; // minutes
};

export type Level2Question = BaseQuestion & {
  level: 2;
  time: Time;
  answer: number; // minutes
};

export type Level3Question = BaseQuestion & {
  level: 3;
  startTime: Time;
  endTime: Time;
  answer: number; // minutes
};

export type Level4Question = BaseQuestion & {
  level: 4;
  startTime: Time;
  endTime: Time;
  answer: Duration;
};

export type Level5Question = BaseQuestion & {
  level: 5;
  time: Time;
  minutesBefore: number;
  answer: Time;
};

export type Level6Question = BaseQuestion & {
  level: 6;
  time: Time;
  durationBefore: Duration;
  answer: Time;
};

// FIX: Define a type for level 7 questions, which are a mix of other question types.
export type Level7Question = BaseQuestion & {
  level: 7;
} & (
  | {
      startTime: Time;
      endTime: Time;
      answer: number; // minutes
    }
  | {
      startTime: Time;
      endTime: Time;
      answer: Duration;
    }
  | {
      time: Time;
      minutesBefore: number;
      answer: Time;
    }
  | {
      time: Time;
      durationBefore: Duration;
      answer: Time;
    }
);

export type Question = 
  | Level1Question
  | Level2Question
  | Level3Question
  | Level4Question
  | Level5Question
  | Level6Question
  // FIX: Add Level7Question to the main Question union type.
  | Level7Question;
