"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getQuizzesByLesson, getQuizResults } from "@/lib/actions/quiz.action";
import { toast } from "react-toastify";
import { Clock, Users, Trophy, Play, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { EQuizStatus } from "@/types/enums";

interface QuizListProps {
  lessonId: string;
  courseSlug: string;
}

const QuizList: React.FC<QuizListProps> = ({ lessonId, courseSlug }) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, [lessonId]);

  const loadQuizzes = async () => {
    try {
      const result = await getQuizzesByLesson(lessonId);
      if (result.success) {
        setQuizzes(result.data);
        
        // Load results for each quiz
        const results: { [key: string]: any } = {};
        for (const quiz of result.data) {
          const resultData = await getQuizResults(quiz._id);
          if (resultData.success && resultData.data.length > 0) {
            results[quiz._id] = resultData.data[0]; // Get latest attempt
          }
        }
        setQuizResults(results);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error loading quizzes:", error);
      toast.error("Không thể tải danh sách quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const getQuizStatus = (quiz: any) => {
    const result = quizResults[quiz._id];
    if (!result) {
      return { status: "not-attempted", text: "Chưa làm", color: "secondary" };
    }
    
    if (result.passed) {
      return { status: "passed", text: "Đã đạt", color: "default" };
    }
    
    if (result.attemptNumber >= quiz.maxAttempts) {
      return { status: "failed", text: "Không đạt", color: "destructive" };
    }
    
    return { status: "attempted", text: "Chưa đạt", color: "outline" };
  };

  const canTakeQuiz = (quiz: any) => {
    const result = quizResults[quiz._id];
    if (!result) return true;
    return result.attemptNumber < quiz.maxAttempts;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có quiz nào
          </h3>
          <p className="text-gray-600">
            Giảng viên chưa tạo quiz cho bài học này.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Quiz trong bài học</h3>
        {quizzes.map((quiz) => {
        const quizStatus = getQuizStatus(quiz);
        const canTake = canTakeQuiz(quiz);
        
        return (
          <Card key={quiz._id} className="hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">{quiz.title}</CardTitle>
                  {quiz.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{quiz.description}</p>
                  )}
                </div>
                <Badge 
                  variant={quizStatus.color as any}
                  className={`${
                    quizStatus.status === 'passed' 
                      ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                      : quizStatus.status === 'failed'
                      ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                      : quizStatus.status === 'attempted'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'
                      : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
                  }`}
                >
                  {quizStatus.text}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Quiz Info */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300 font-medium">{quiz.timeLimit} phút</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-300 font-medium">{quiz.maxAttempts} lần thử</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Trophy className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-orange-700 dark:text-orange-300 font-medium">{quiz.passingScore}% đạt</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="text-purple-700 dark:text-purple-300 font-medium">{quiz.questions.length} câu hỏi</span>
                  </div>
                </div>

                {/* Quiz Results */}
                {quizResults[quiz._id] && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Kết quả gần nhất:</span>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                            {quizResults[quiz._id].percentage}%
                          </span>
                          <Badge 
                            variant={quizResults[quiz._id].passed ? "default" : "destructive"}
                            className={quizResults[quiz._id].passed 
                              ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                              : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                            }
                          >
                            {quizResults[quiz._id].passed ? "Đạt" : "Không đạt"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm text-blue-600 dark:text-blue-400">
                        <div className="font-medium">Lần thử: {quizResults[quiz._id].attemptNumber}/{quiz.maxAttempts}</div>
                        <div className="text-xs">
                          {new Date(quizResults[quiz._id].completedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
                  {canTake ? (
                    <Link href={`/${courseSlug}/lesson/quiz/${quiz._id}`}>
                      <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        <Play className="h-4 w-4" />
                        {quizResults[quiz._id] ? "Làm lại" : "Bắt đầu làm"}
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

export default QuizList;
