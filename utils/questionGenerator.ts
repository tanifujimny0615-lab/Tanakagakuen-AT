
import type { Question, Time } from '../types';

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomTime = (options: { force5min?: boolean; is1min?: boolean } = {}): Time => {
  if (options.is1min) {
    // 1分刻みの問題
    return { hour: getRandomInt(0, 23), minute: getRandomInt(0, 59) };
  }
  if (options.force5min) {
    // 5分刻みの問題（10分刻みを除く）
    const minuteBase = [5, 15, 25, 35, 45, 55];
    return { hour: getRandomInt(0, 23), minute: minuteBase[getRandomInt(0, 5)] };
  }
  // 10分刻みの問題
  return { hour: getRandomInt(0, 23), minute: getRandomInt(0, 5) * 10 };
};

// FIX: Export formatTime so it can be used in Quiz.tsx
export const formatTime = (time: Time): Time => {
    let h = time.hour;
    let m = time.minute;

    if (m < 0) {
        const borrowHours = Math.ceil(Math.abs(m) / 60);
        h -= borrowHours;
        m += borrowHours * 60;
    }
    if (m >= 60) {
        h += Math.floor(m / 60);
        m %= 60;
    }
    h = (h + 24) % 24;

    return { hour: h, minute: m };
}


export const generateQuestion = (level: number): Question => {
  const id = new Date().getTime().toString() + Math.random();
  const is5minProblem = Math.random() < 0.4;

  switch (level) {
    case 1: {
      const time = getRandomTime({ force5min: is5minProblem });
      if (time.minute === 0) time.minute = getRandomInt(1, 5) * 10;
      return { id, level: 1, time, answer: time.minute };
    }
    case 2: {
      const time = getRandomTime({ force5min: is5minProblem });
      if (time.minute === 0) time.minute = getRandomInt(1, 5) * 10;
      return { id, level: 2, time, answer: 60 - time.minute };
    }
    case 3: {
      const startTime = getRandomTime({ force5min: is5minProblem });
      const duration = getRandomInt(10, 110);
      const endTime = formatTime({ hour: startTime.hour, minute: startTime.minute + duration });
      return { id, level: 3, startTime, endTime, answer: duration };
    }
    case 4: {
      const startTime = getRandomTime({ force5min: is5minProblem });
      const durationMinutes = getRandomInt(70, 300); // 1h 10m to 5h
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      const endTime = formatTime({ hour: startTime.hour + hours, minute: startTime.minute + minutes });
      return { id, level: 4, startTime, endTime, answer: { hours, minutes } };
    }
    case 5: {
      const time = getRandomTime({ force5min: is5minProblem });
      const minutesBefore = getRandomInt(10, 110);
      const answer = formatTime({ hour: time.hour, minute: time.minute - minutesBefore });
      return { id, level: 5, time, minutesBefore, answer };
    }
    case 6: {
      const time = getRandomTime({ force5min: is5minProblem });
      const hoursBefore = getRandomInt(1, 4);
      const minutesBefore = getRandomInt(0, 11) * 5;
      const durationBefore = { hours: hoursBefore, minutes: minutesBefore };
      const answer = formatTime({ hour: time.hour - hoursBefore, minute: time.minute - minutesBefore });
      return { id, level: 6, time, durationBefore, answer };
    }
    case 7: {
        const subLevel = getRandomInt(3, 6);
        
        let timeOptions: { force5min?: boolean; is1min?: boolean } = {};
        const rand = Math.random();
        if (rand < 0.5) { // 50% chance for 1-min
            timeOptions = { is1min: true };
        } else if (rand < 0.7) { // 20% chance for 5-min
            timeOptions = { force5min: true };
        } // 30% chance for 10-min (default)

        switch(subLevel) {
            case 3: {
                const startTime = getRandomTime(timeOptions);
                const duration = getRandomInt(120, 480); // 2時間〜8時間（午前午後をまたぎやすくする）
                const endTime = formatTime({ hour: startTime.hour, minute: startTime.minute + duration });
                return { id, level: 7, startTime, endTime, answer: duration };
            }
            case 4: {
                const startTime = getRandomTime(timeOptions);
                const durationMinutes = getRandomInt(120, 480);
                const hours = Math.floor(durationMinutes / 60);
                const minutes = durationMinutes % 60;
                const endTime = formatTime({ hour: startTime.hour + hours, minute: startTime.minute + minutes });
                return { id, level: 7, startTime, endTime, answer: { hours, minutes } };
            }
            case 5: {
                const time = getRandomTime(timeOptions);
                const minutesBefore = getRandomInt(120, 480);
                const answer = formatTime({ hour: time.hour, minute: time.minute - minutesBefore });
                return { id, level: 7, time, minutesBefore, answer };
            }
            case 6: {
                const time = getRandomTime(timeOptions);
                const hoursBefore = getRandomInt(2, 8);
                const minutesBefore = getRandomInt(0, 59);
                const durationBefore = { hours: hoursBefore, minutes: minutesBefore };
                const answer = formatTime({ hour: time.hour - hoursBefore, minute: time.minute - minutesBefore });
                return { id, level: 7, time, durationBefore, answer };
            }
        }
    }
    default:
      throw new Error(`Invalid level: ${level}`);
  }
};
