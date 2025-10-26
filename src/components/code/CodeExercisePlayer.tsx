"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Play, 
  RotateCcw, 
  Clock, 
  Trophy,
  CheckCircle,
  XCircle,
  Code2,
  Lightbulb,
  Target,
  Timer
} from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import CodeEditor from "./CodeEditor";
import { 
  getCodeExerciseById, 
  submitCodeExercise, 
  getCodeExerciseResults 
} from "@/lib/actions/code-exercise.action";
import { ICodeExerciseResult } from "@/types/type";

interface CodeExercisePlayerProps {
  exerciseId: string;
}

const CodeExercisePlayer: React.FC<CodeExercisePlayerProps> = ({ exerciseId }) => {
  const { user } = useUser();
  const [exercise, setExercise] = useState<any>(null);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [results, setResults] = useState<ICodeExerciseResult[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    loadExercise();
    loadResults();
  }, [exerciseId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const loadExercise = async () => {
    try {
      const result = await getCodeExerciseById(exerciseId);
      if (result.success) {
        setExercise(result.data);
        setCode(result.data.starterCode || "");
        setTimeLeft(result.data.timeLimit * 60); // Convert minutes to seconds
        setIsLoading(false);
      } else {
        toast.error(result.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error loading exercise:", error);
      toast.error("Có lỗi xảy ra khi tải bài tập!");
      setIsLoading(false);
    }
  };

  const loadResults = async () => {
    try {
      if (!user?.id) return; // Skip if no user
      
      const result = await getCodeExerciseResults(exerciseId, user.id);
      if (result.success) {
        setResults(result.data);
        if (result.data.length > 0) {
          setTestResults(result.data[0].testResults || []);
          setIsCompleted(true);
        }
      }
    } catch (error) {
      console.error("Error loading results:", error);
    }
  };

  const handleStart = () => {
    setIsTimerActive(true);
    setIsCompleted(false);
    setTestResults([]);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Vui lòng nhập code!");
      return;
    }

    if (!user?.id) {
      toast.error("Vui lòng đăng nhập để nộp bài!");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitCodeExercise({
        codeExerciseId: exerciseId,
        code,
        language: exercise.language,
        clerkId: user.id,
      });

      if (result.success) {
        setTestResults(result.data.testResults || []);
        setIsCompleted(true);
        setIsTimerActive(false);
        loadResults();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting exercise:", error);
      toast.error("Có lỗi xảy ra khi nộp bài!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCode(exercise?.starterCode || "");
    setTestResults([]);
    setIsCompleted(false);
    setTimeLeft(exercise?.timeLimit * 60 || 0);
    setIsTimerActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY": return "text-green-600";
      case "MEDIUM": return "text-yellow-600";
      case "HARD": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
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

  if (!exercise) {
    return (
      <Alert>
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          Không tìm thấy bài tập code!
        </AlertDescription>
      </Alert>
    );
  }

  const canSubmit = results.length < exercise.maxAttempts;
  const bestResult = results.length > 0 ? results.reduce((best, current) => 
    current.score > best.score ? current : best
  ) : null;

  return (
    <div className="space-y-6">
      {/* Exercise Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl font-semibold">{exercise.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {exercise.language}
                </Badge>
                <Badge variant="outline" className={getDifficultyColor(exercise.difficulty)}>
                  {exercise.difficulty}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {exercise.points} điểm
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  {exercise.maxAttempts} lần thử
                </Badge>
              </div>
            </div>
            <div className="text-right">
              {isTimerActive && (
                <div className="flex items-center gap-2 text-lg font-mono text-red-600">
                  <Timer className="w-5 h-5" />
                  {formatTime(timeLeft)}
                </div>
              )}
              {!isTimerActive && !isCompleted && (
                <div className="text-sm text-gray-500">
                  Thời gian: {formatTime(timeLeft)}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Hướng dẫn
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{exercise.instructions}</p>
              </div>
            </div>

            {bestResult && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  Kết quả tốt nhất
                </h4>
                <div className="flex items-center gap-4 text-sm">
                  <span className={`font-semibold ${getScoreColor(bestResult.score)}`}>
                    {bestResult.score}%
                  </span>
                  <span className="text-gray-600">
                    {bestResult.passedTests}/{bestResult.totalTests} test cases
                  </span>
                  <span className="text-gray-600">
                    Lần thử: {bestResult.attempts}
                  </span>
                </div>
              </div>
            )}

            {!canSubmit && (
              <Alert>
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Bạn đã hết số lần thử cho bài tập này!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Code Editor */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              Code Editor
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-gray-300 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              {!isCompleted && (
                <Button
                  onClick={isTimerActive ? handleSubmit : handleStart}
                  disabled={!canSubmit || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isTimerActive ? "Nộp bài" : "Bắt đầu"}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CodeEditor
            language={exercise.language}
            value={code}
            onChange={setCode}
            onRun={isTimerActive ? handleSubmit : undefined}
            onReset={handleReset}
            readOnly={!canSubmit || isCompleted}
            height="400px"
            testResults={testResults}
            isRunning={isSubmitting}
            executionTime={bestResult?.executionTime || 0}
          />
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Kết quả Test Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {result.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Test Case {result.testCase}</span>
                      <Badge variant={result.passed ? "default" : "destructive"}>
                        {result.passed ? "PASSED" : "FAILED"}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>Input:</strong> {result.input}</div>
                      <div><strong>Expected:</strong> {result.expectedOutput}</div>
                      <div><strong>Actual:</strong> {result.actualOutput}</div>
                      {result.error && (
                        <div className="text-red-600"><strong>Error:</strong> {result.error}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solution */}
      {isCompleted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Lời giải mẫu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => setShowSolution(!showSolution)}
                className="border-gray-300 hover:bg-gray-50"
              >
                {showSolution ? "Ẩn lời giải" : "Xem lời giải"}
              </Button>
              
              {showSolution && (
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  <pre>{exercise.solution}</pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodeExercisePlayer;
