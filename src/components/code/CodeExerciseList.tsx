"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Code2, 
  Clock, 
  Trophy, 
  Users, 
  Play, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Star
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { getCodeExercisesByLesson, getCodeExerciseResults } from "@/lib/actions/code-exercise.action";
import { ECodeExerciseDifficulty, ECodeLanguage } from "@/types/enums";

interface CodeExerciseListProps {
  lessonId: string;
  courseSlug: string;
}

const CodeExerciseList: React.FC<CodeExerciseListProps> = ({ lessonId, courseSlug }) => {
  const { user } = useUser();
  const [codeExercises, setCodeExercises] = useState<any[]>([]);
  const [results, setResults] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCodeExercises();
  }, [lessonId]);

  const loadCodeExercises = async () => {
    try {
      const result = await getCodeExercisesByLesson(lessonId);
      if (result.success) {
        setCodeExercises(result.data);
        // Load results for each exercise if user is authenticated
        if (user?.id) {
          for (const exercise of result.data) {
            await loadExerciseResults(exercise._id);
          }
        }
      }
    } catch (error) {
      console.error("Error loading code exercises:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExerciseResults = async (exerciseId: string) => {
    try {
      if (!user?.id) return; // Skip if no user
      
      const result = await getCodeExerciseResults(exerciseId, user.id);
      if (result.success && result.data.length > 0) {
        setResults(prev => ({
          ...prev,
          [exerciseId]: result.data[0] // Get the latest result
        }));
      }
    } catch (error) {
      console.error("Error loading exercise results:", error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY": return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      case "MEDIUM": return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800";
      case "HARD": return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getLanguageIcon = (language: string) => {
    // You can add more language icons here
    return <Code2 className="w-4 h-4" />;
  };

  const getExerciseStatus = (exercise: any) => {
    const result = results[exercise._id];
    if (!result) {
      return {
        status: "not_attempted",
        text: "Chưa làm",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        canAttempt: true
      };
    }

    if (result.score >= 80) {
      return {
        status: "passed",
        text: "Hoàn thành",
        color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
        canAttempt: result.attempts < exercise.maxAttempts
      };
    } else if (result.score >= 50) {
      return {
        status: "partial",
        text: "Cần cải thiện",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
        canAttempt: result.attempts < exercise.maxAttempts
      };
    } else {
      return {
        status: "failed",
        text: "Chưa đạt",
        color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
        canAttempt: result.attempts < exercise.maxAttempts
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Đang tải bài tập...</p>
        </div>
      </div>
    );
  }

  if (codeExercises.length === 0) {
    return (
      <div className="text-center py-8">
        <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Chưa có bài tập code nào trong bài học này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Bài tập Code</h3>
      
      {codeExercises.map((exercise) => {
        const exerciseStatus = getExerciseStatus(exercise);
        const result = results[exercise._id];
        
        return (
          <Card key={exercise._id} className="hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {exercise.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {exercise.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                      <div className="flex items-center gap-1">
                        {getLanguageIcon(exercise.language)}
                        {exercise.language}
                      </div>
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                      {exercise.timeLimit} phút
                    </Badge>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
                      {exercise.points} điểm
                    </Badge>
                    <Badge variant="outline" className={exerciseStatus.color}>
                      {exerciseStatus.text}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Exercise Info */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300 font-medium">{exercise.timeLimit} phút</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-300 font-medium">{exercise.maxAttempts} lần thử</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Trophy className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-orange-700 dark:text-orange-300 font-medium">{exercise.points} điểm</span>
                  </div>
                </div>

                {/* Results Display */}
                {result && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Kết quả gần nhất:</span>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`text-2xl font-bold ${result.score >= 80 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {result.score}%
                          </span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">
                              {result.passedTests}/{result.totalTests} test cases
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-blue-600 dark:text-blue-400">
                        <div className="font-medium">Lần thử: {result.attempts}/{exercise.maxAttempts}</div>
                        <div className="text-xs">
                          {new Date(result.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
                  {exerciseStatus.canAttempt ? (
                    <Link href={`/${courseSlug}/lesson/code-exercise/${exercise._id}`}>
                      <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        <Play className="h-4 w-4" />
                        {result ? "Làm lại" : "Bắt đầu làm"}
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Đã hết số lần thử</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CodeExerciseList;
