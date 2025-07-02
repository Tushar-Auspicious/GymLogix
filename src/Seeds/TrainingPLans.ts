import exerciseCatalog, { Exercise } from "./ExerciseCatalog";

export interface WeeklyStructure {
  day: string;
  type: string;
  focus: string[];
  color: string;
  exercises: Exercise[];
  warmUp?: string;
  coolDown?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  goal: string;
  duration: string;
  frequency: string;
  targetAudience: string;
  tags: string[];
  coverImage: string;
  weeklyStructure: WeeklyStructure[];
}

export type TrainingPlans = TrainingPlan[];
const TrainingPlans: TrainingPlan[] = [
  {
    id: "prog_001",
    name: "Strength Builder 101",
    goal: "Build muscle mass and strength",
    duration: "8 weeks",
    frequency: "4 days per week",
    targetAudience: "Intermediate lifters",
    tags: ["Dumbbells", "Barbell", "Bench"],
    coverImage:
      "https://images.unsplash.com/photo-1723117418036-7d3566ea9381?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3ltfGVufDB8fDB8fHww",
    weeklyStructure: [
      {
        day: "Day 1",
        type: "Push",
        focus: ["Chest", "Shoulders", "Triceps"],
        color: "#FF7F50",
        exercises: [
          exerciseCatalog.categories[0].exercises[0],
          exerciseCatalog.categories[3].exercises[0],
          exerciseCatalog.categories[7].exercises[1],
        ],
        warmUp: "5 mins: Light cardio + dynamic stretches",
        coolDown: "5 mins: Static stretches for chest and triceps",
      },
      {
        day: "Day 2",
        type: "Pull",
        focus: ["Back", "Biceps"],
        color: "#6495ED",
        exercises: [
          exerciseCatalog.categories[1].exercises[0],
          exerciseCatalog.categories[8].exercises[0],
          exerciseCatalog.categories[8].exercises[1],
        ],
      },
      {
        day: "Day 3",
        type: "Legs",
        focus: ["Quads", "Hamstrings", "Glutes"],
        color: "#3CB371",
        exercises: [
          exerciseCatalog.categories[2].exercises[0],
          exerciseCatalog.categories[2].exercises[1],
          exerciseCatalog.categories[2].exercises[2],
        ],
      },
      {
        day: "Day 4",
        type: "Full Body",
        focus: ["Whole body"],
        color: "#FFD700",
        exercises: [
          exerciseCatalog.categories[0].exercises[0],
          exerciseCatalog.categories[1].exercises[0],
          exerciseCatalog.categories[2].exercises[0],
          exerciseCatalog.categories[3].exercises[0],
          exerciseCatalog.categories[4].exercises[0],
          exerciseCatalog.categories[5].exercises[0],
        ],
      },
    ],
  },
  {
    id: "prog_002",
    name: "Fat Burner Blitz",
    goal: "Burn fat and improve endurance",
    duration: "6 weeks",
    frequency: "5 days per week",
    targetAudience: "Beginners to intermediate",
    tags: ["Kettlebell", "Jump rope"],
    coverImage:
      "https://images.unsplash.com/photo-1716367840407-f9414a84b325?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z3ltfGVufDB8fDB8fHww",
    weeklyStructure: [
      {
        day: "Day 1",
        type: "HIIT",
        focus: ["Full body"],
        color: "#37FF00",
        exercises: [
          exerciseCatalog.categories[6].exercises[0],
          exerciseCatalog.categories[6].exercises[1],
          exerciseCatalog.categories[6].exercises[2],
        ],
        warmUp: "5 mins: Jumping jacks + dynamic stretches",
        coolDown: "5 mins: Light stretching",
      },
      {
        day: "Day 2",
        type: "Cardio",
        focus: ["Endurance"],
        color: "#FF0004",
        exercises: [
          exerciseCatalog.categories[6].exercises[2],
          exerciseCatalog.categories[6].exercises[1],
        ],
      },
      {
        day: "Day 3",
        type: "Core",
        focus: ["Abs", "Obliques"],
        color: "#00B7FF",
        exercises: [
          exerciseCatalog.categories[7].exercises[0],
          exerciseCatalog.categories[7].exercises[1],
        ],
      },
    ],
  },
  {
    id: "prog_003",
    name: "Powerlifting Prep",
    goal: "Increase strength for powerlifting",
    duration: "12 weeks",
    frequency: "4 days per week",
    targetAudience: "Advanced lifters",
    tags: ["Barbell", "Squat rack", "Bench"],
    coverImage:
      "https://images.unsplash.com/photo-1618355281782-b9475e02a65c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGd5bXxlbnwwfHwwfHx8MA%3D%3D",
    weeklyStructure: [
      {
        day: "Day 1",
        type: "Squat Focus",
        focus: ["Quads", "Glutes"],
        color: "#8A2BE2",
        exercises: [
          exerciseCatalog.categories[2].exercises[0],
          exerciseCatalog.categories[2].exercises[1],
        ],
        warmUp: "5 mins: Light squats + mobility drills",
        coolDown: "5 mins: Hamstring and quad stretches",
      },
      {
        day: "Day 2",
        type: "Bench Focus",
        focus: ["Chest", "Triceps"],
        color: "#FF6347",
        exercises: [
          exerciseCatalog.categories[0].exercises[0],
          exerciseCatalog.categories[7].exercises[1],
        ],
      },
      {
        day: "Day 3",
        type: "Deadlift Focus",
        focus: ["Back", "Hamstrings"],
        color: "#20B2AA",
        exercises: [
          exerciseCatalog.categories[1].exercises[0],
          exerciseCatalog.categories[1].exercises[1],
        ],
      },
      {
        day: "Day 4",
        type: "Accessory",
        focus: ["Weak points"],
        color: "#D2691E",
        exercises: [
          exerciseCatalog.categories[3].exercises[0],
          exerciseCatalog.categories[8].exercises[0],
        ],
      },
    ],
  },
  {
    id: "prog_004",
    name: "Bodyweight Mastery",
    goal: "Build strength and mobility using bodyweight",
    duration: "6 weeks",
    frequency: "3 days per week",
    targetAudience: "Beginners",
    tags: ["Pull-up bar", "Mat"],
    coverImage:
      "https://images.unsplash.com/photo-1692369608021-1665f88d3089?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGd5bXxlbnwwfHwwfHx8MA%3D%3D",
    weeklyStructure: [
      {
        day: "Day 1",
        type: "Upper Body",
        focus: ["Chest", "Back", "Arms"],
        color: "#FF69B4",
        exercises: [
          exerciseCatalog.categories[0].exercises[0],
          exerciseCatalog.categories[1].exercises[0],
          exerciseCatalog.categories[8].exercises[0],
        ],
        warmUp: "5 mins: Arm circles + light cardio",
        coolDown: "5 mins: Upper body stretches",
      },
      {
        day: "Day 2",
        type: "Lower Body",
        focus: ["Quads", "Glutes"],
        color: "#6A5ACD",
        exercises: [
          exerciseCatalog.categories[2].exercises[0],
          exerciseCatalog.categories[2].exercises[1],
        ],
      },
      {
        day: "Day 3",
        type: "Core",
        focus: ["Abs", "Obliques"],
        color: "#00CED1",
        exercises: [
          exerciseCatalog.categories[7].exercises[0],
          exerciseCatalog.categories[7].exercises[1],
        ],
      },
    ],
  },
];

export default TrainingPlans;

// Define the type for a single set's details
export interface SetDetail {
  weight: string;
  reps: string;
  time: string;
  count: number;
  difficulty?: "Warmup" | "Easy" | "Medium" | "Hard"; // Optional difficulty level
  distance?: string; // Optional distance field for cardio exercises
  dropSets?: SetDetail[]; // Optional drop sets
}

// Define the type for an exercise
export interface ExerciseHistory {
  name: string;
  sets: string;
  details: SetDetail[];
}

// Define the type for a workout day
export interface WorkoutDay {
  date: string;
  exercises: ExerciseHistory[];
}

export const workoutHistory: WorkoutDay[] = [
  // Workout 1 - Most recent workout (Workout ID: A)
  {
    date: "Tue Aug 22 2024",
    exercises: [
      {
        name: "Bench Press",
        sets: "4x8",
        details: [
          { weight: "80kg", reps: "8", time: "00:45", count: 1 },
          { weight: "85kg", reps: "6", time: "00:40", count: 1 },
          { weight: "90kg", reps: "5", time: "00:35", count: 1 },
          { weight: "75kg", reps: "10", time: "00:50", count: 1 },
        ],
      },
      {
        name: "Squats",
        sets: "4x10",
        details: [
          { weight: "100kg", reps: "10", time: "01:00", count: 1 },
          { weight: "110kg", reps: "8", time: "00:55", count: 1 },
          { weight: "120kg", reps: "6", time: "00:50", count: 1 },
          { weight: "90kg", reps: "12", time: "01:10", count: 1 },
        ],
      },
      {
        name: "Conventional Deadlift",
        sets: "3x5",
        details: [
          { weight: "120kg", reps: "5", time: "00:30", count: 1 },
          { weight: "130kg", reps: "4", time: "00:25", count: 1 },
          { weight: "140kg", reps: "3", time: "00:20", count: 1 },
        ],
      },
      {
        name: "Pull-Ups (or Inverted Rows)",
        sets: "3x8",
        details: [
          { weight: "Bodyweight", reps: "8", time: "00:40", count: 1 },
          { weight: "Bodyweight+5kg", reps: "6", time: "00:35", count: 1 },
          { weight: "Bodyweight+10kg", reps: "4", time: "00:30", count: 1 },
        ],
      },
    ],
  },

  // Workout 2 - Previous workout (Workout ID: A)
  {
    date: "Tue Aug 15 2024",
    exercises: [
      {
        name: "Bench Press",
        sets: "4x8",
        details: [
          { weight: "75kg", reps: "8", time: "00:45", count: 1 },
          { weight: "80kg", reps: "6", time: "00:40", count: 1 },
          { weight: "85kg", reps: "5", time: "00:35", count: 1 },
          { weight: "70kg", reps: "10", time: "00:50", count: 1 },
        ],
      },
      {
        name: "Squat",
        sets: "4x10",
        details: [
          { weight: "95kg", reps: "10", time: "01:00", count: 1 },
          { weight: "105kg", reps: "8", time: "00:55", count: 1 },
          { weight: "115kg", reps: "6", time: "00:50", count: 1 },
          { weight: "85kg", reps: "12", time: "01:10", count: 1 },
        ],
      },
      {
        name: "Deadlift",
        sets: "3x5",
        details: [
          { weight: "115kg", reps: "5", time: "00:30", count: 1 },
          { weight: "125kg", reps: "4", time: "00:25", count: 1 },
          { weight: "135kg", reps: "3", time: "00:20", count: 1 },
        ],
      },
      {
        name: "Pull-Ups",
        sets: "3x8",
        details: [
          { weight: "Bodyweight", reps: "8", time: "00:40", count: 1 },
          { weight: "Bodyweight+5kg", reps: "6", time: "00:35", count: 1 },
          { weight: "Bodyweight+5kg", reps: "5", time: "00:30", count: 1 },
        ],
      },
    ],
  },

  // Workout 3 - Different workout (Workout ID: B)
  {
    date: "Tue Aug 10 2024",
    exercises: [
      {
        name: "Overhead Shoulder Press",
        sets: "4x8",
        details: [
          { weight: "50kg", reps: "8", time: "00:40", count: 1 },
          { weight: "55kg", reps: "6", time: "00:35", count: 1 },
          { weight: "60kg", reps: "4", time: "00:30", count: 1 },
          { weight: "45kg", reps: "10", time: "00:45", count: 1 },
          { weight: "48kg", reps: "8", time: "00:45", count: 1 },
          { weight: "50kg", reps: "8", time: "00:40", count: 1 },
        ],
      },
      {
        name: "Barbell Row",
        sets: "4x10",
        details: [
          // { weight: "70kg", reps: "10", time: "00:50", count: 1 },
          // { weight: "75kg", reps: "8", time: "00:45", count: 1 },
          // { weight: "80kg", reps: "6", time: "00:40", count: 1 },
          // { weight: "65kg", reps: "12", time: "00:55", count: 1 },
        ],
      },
      {
        name: "Bench Press",
        sets: "3x12",
        details: [
          { weight: "65kg", reps: "12", time: "01:00", count: 1 },
          { weight: "70kg", reps: "10", time: "00:55", count: 1 },
          { weight: "75kg", reps: "8", time: "00:50", count: 1 },
        ],
      },
    ],
  },

  // Workout 4 - Cardio focused workout (Workout ID: C)
  {
    date: "Tue Aug 5 2024",
    exercises: [
      {
        name: "Running",
        sets: "1x30",
        details: [{ weight: "N/A", reps: "5000m", time: "30:00", count: 1 }],
      },
      {
        name: "Cycling",
        sets: "1x45",
        details: [{ weight: "N/A", reps: "15000m", time: "45:00", count: 1 }],
      },
      {
        name: "Jump Rope",
        sets: "3x5",
        details: [
          { weight: "N/A", reps: "150 jumps", time: "05:00", count: 1 },
          { weight: "N/A", reps: "150 jumps", time: "05:00", count: 1 },
          { weight: "N/A", reps: "150 jumps", time: "05:00", count: 1 },
        ],
      },
    ],
  },

  // Workout 5 - Max weight workout (Workout ID: D)
  {
    date: "Tue Aug 1 2024",
    exercises: [
      {
        name: "Bench Press",
        sets: "5x5",
        details: [
          { weight: "90kg", reps: "5", time: "00:30", count: 1 },
          { weight: "95kg", reps: "5", time: "00:30", count: 1 },
          { weight: "100kg", reps: "3", time: "00:25", count: 1 },
          { weight: "105kg", reps: "2", time: "00:20", count: 1 },
          { weight: "110kg", reps: "1", time: "00:15", count: 1 },
        ],
      },
      {
        name: "Squats",
        sets: "5x5",
        details: [
          { weight: "120kg", reps: "5", time: "00:40", count: 1 },
          { weight: "130kg", reps: "5", time: "00:40", count: 1 },
          { weight: "140kg", reps: "3", time: "00:35", count: 1 },
          { weight: "150kg", reps: "2", time: "00:30", count: 1 },
          { weight: "160kg", reps: "1", time: "00:25", count: 1 },
        ],
      },
      {
        name: "Conventional Deadlift",
        sets: "5x3",
        details: [
          { weight: "140kg", reps: "3", time: "00:25", count: 1 },
          { weight: "150kg", reps: "3", time: "00:25", count: 1 },
          { weight: "160kg", reps: "3", time: "00:25", count: 1 },
          { weight: "170kg", reps: "2", time: "00:20", count: 1 },
          { weight: "180kg", reps: "1", time: "00:15", count: 1 },
        ],
      },
      {
        name: "Smith Machine Shrug",
        sets: "3x8",
        details: [
          { weight: "60kg", reps: "8", time: "00:30", count: 1 },
          { weight: "70kg", reps: "6", time: "00:25", count: 1 },
          { weight: "80kg", reps: "4", time: "00:20", count: 1 },
        ],
      },
      {
        name: "Incline Dumbbell Press",
        sets: "3x10",
        details: [
          { weight: "25kg", reps: "10", time: "00:45", count: 1 },
          { weight: "30kg", reps: "8", time: "00:40", count: 1 },
          { weight: "35kg", reps: "6", time: "00:35", count: 1 },
        ],
      },
    ],
  },

  // Workout 6 - Endurance workout (Workout ID: E)
  {
    date: "Tue Jul 25 2024",
    exercises: [
      {
        name: "Push-Ups",
        sets: "4x25",
        details: [
          { weight: "40kg", reps: "25", time: "01:15", count: 1 },
          { weight: "40kg", reps: "25", time: "01:20", count: 1 },
          { weight: "40kg", reps: "20", time: "01:10", count: 1 },
          { weight: "40kg", reps: "18", time: "01:00", count: 1 },
        ],
      },
      {
        name: "Pull-Ups",
        sets: "4x15",
        details: [
          { weight: "40kg", reps: "15", time: "01:00", count: 1 },
          { weight: "40kg", reps: "12", time: "00:50", count: 1 },
          { weight: "40kg", reps: "10", time: "00:45", count: 1 },
          { weight: "40kg", reps: "8", time: "00:40", count: 1 },
        ],
      },
      {
        name: "Bodyweight Squats",
        sets: "4x30",
        details: [
          { weight: "30kg", reps: "30", time: "01:30", count: 1 },
          { weight: "30kg", reps: "30", time: "01:35", count: 1 },
          { weight: "30kg", reps: "25", time: "01:20", count: 1 },
          { weight: "30kg", reps: "20", time: "01:10", count: 1 },
        ],
      },
      {
        name: "Plank",
        sets: "3x60",
        details: [
          { weight: "30kg", reps: "60s", time: "01:00", count: 1 },
          { weight: "30kg", reps: "60s", time: "01:00", count: 1 },
          { weight: "30kg", reps: "60s", time: "01:00", count: 1 },
        ],
      },
      {
        name: "Lunges",
        sets: "3x12",
        details: [
          { weight: "30kg", reps: "12", time: "01:00", count: 1 },
          { weight: "30kg", reps: "12", time: "01:00", count: 1 },
          { weight: "30kg", reps: "12", time: "01:00", count: 1 },
        ],
      },
    ],
  },
];
