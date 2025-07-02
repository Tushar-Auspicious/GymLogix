import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { CustomText } from "./CustomText";

// Props for the Timer component
interface SimpleTimerProps {
  initialMinutes: number; // Time in minutes to start the countdown
}

const TimerText: React.FC<SimpleTimerProps> = ({ initialMinutes }) => {
  // Convert initial minutes to seconds
  const initialSeconds = initialMinutes * 60;
  const [timeInSeconds, setTimeInSeconds] = useState<number>(initialSeconds);

  // Effect to handle the countdown
  useEffect(() => {
    if (timeInSeconds <= 0) return; // Stop when timer reaches 0

    const interval = setInterval(() => {
      setTimeInSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // Clear interval when timer reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [timeInSeconds]);

  // Format time in seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return <CustomText>{formatTime(timeInSeconds)}</CustomText>;
};

export default TimerText;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C2526",
    padding: 20,
  },
});
