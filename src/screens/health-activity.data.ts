// Activity (Move / Exercise / Stand) data, shared by the iOS (SwiftUI Gauge
// rings) and Android (Compose CircularProgressIndicator rings) screens. Plain
// numbers and the canonical Apple Fitness ring colors — each platform applies
// them to its own ring primitive.

// Apple Fitness ring colors.
export const MOVE_COLOR = '#FA114F'; // pink/red
export const EXERCISE_COLOR = '#92E82A'; // green
export const STAND_COLOR = '#1EEAEF'; // cyan

export const MOVE_VALUE = 487;
export const MOVE_GOAL = 600; // kcal
export const EXERCISE_VALUE = 24;
export const EXERCISE_GOAL = 30; // min
export const STAND_VALUE = 10;
export const STAND_GOAL = 12; // hr

// This week's Move totals (kcal), Mon..Sun — last value is "today".
export const MOVE_WEEK = [540, 612, 480, 705, 523, 388, 487];
