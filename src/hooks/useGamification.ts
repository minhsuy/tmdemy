"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  getUserGamification, 
  awardPoints, 
  updateStudyStreak,
  trackLessonCompletion,
  trackCourseCompletion,
  trackQuizCompletion,
  trackCodeExerciseCompletion
} from "@/lib/actions/gamification.action";

interface GamificationData {
  totalPoints: number;
  currentLevel: number;
  experiencePoints: number;
  streak: number;
  longestStreak: number;
  badges: any[];
  achievements: any[];
  coursesCompleted: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  codeExercisesCompleted: number;
  certificatesEarned: number;
  totalStudyTime: number;
}

interface UseGamificationReturn {
  data: GamificationData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  awardPoints: (points: number, reason: string) => Promise<boolean>;
  trackLessonCompletion: (courseId: string, lessonId: string) => Promise<boolean>;
  trackCourseCompletion: (courseId: string) => Promise<boolean>;
  trackQuizCompletion: (quizId: string, score: number, passed: boolean) => Promise<boolean>;
  trackCodeExerciseCompletion: (exerciseId: string, score: number) => Promise<boolean>;
  updateStreak: () => Promise<boolean>;
}

export const useGamification = (): UseGamificationReturn => {
  const { user } = useUser();
  const [data, setData] = useState<GamificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGamificationData = useCallback(async () => {
    if (!user?.id) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getUserGamification(user.id);
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to load gamification data");
      }
    } catch (err) {
      setError("An error occurred while loading gamification data");
      console.error("Error loading gamification data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const refresh = useCallback(async () => {
    await loadGamificationData();
  }, [loadGamificationData]);

  const handleAwardPoints = useCallback(async (points: number, reason: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const result = await awardPoints(user.id, points, reason);
      if (result.success) {
        await refresh(); // Refresh data after awarding points
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error awarding points:", error);
      return false;
    }
  }, [user?.id, refresh]);

  const handleTrackLessonCompletion = useCallback(async (courseId: string, lessonId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const result = await trackLessonCompletion(user.id, courseId, lessonId);
      if (result.success) {
        await refresh();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error tracking lesson completion:", error);
      return false;
    }
  }, [user?.id, refresh]);

  const handleTrackCourseCompletion = useCallback(async (courseId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const result = await trackCourseCompletion(user.id, courseId);
      if (result.success) {
        await refresh();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error tracking course completion:", error);
      return false;
    }
  }, [user?.id, refresh]);

  const handleTrackQuizCompletion = useCallback(async (quizId: string, score: number, passed: boolean): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const result = await trackQuizCompletion(user.id, quizId, score, passed);
      if (result.success) {
        await refresh();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error tracking quiz completion:", error);
      return false;
    }
  }, [user?.id, refresh]);

  const handleTrackCodeExerciseCompletion = useCallback(async (exerciseId: string, score: number): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const result = await trackCodeExerciseCompletion(user.id, exerciseId, score);
      if (result.success) {
        await refresh();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error tracking code exercise completion:", error);
      return false;
    }
  }, [user?.id, refresh]);

  const handleUpdateStreak = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const result = await updateStudyStreak(user.id);
      if (result.success) {
        await refresh();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating streak:", error);
      return false;
    }
  }, [user?.id, refresh]);

  useEffect(() => {
    loadGamificationData();
  }, [loadGamificationData]);

  return {
    data,
    isLoading,
    error,
    refresh,
    awardPoints: handleAwardPoints,
    trackLessonCompletion: handleTrackLessonCompletion,
    trackCourseCompletion: handleTrackCourseCompletion,
    trackQuizCompletion: handleTrackQuizCompletion,
    trackCodeExerciseCompletion: handleTrackCodeExerciseCompletion,
    updateStreak: handleUpdateStreak
  };
};
