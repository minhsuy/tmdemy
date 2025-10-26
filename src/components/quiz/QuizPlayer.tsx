"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  getQuizById, 
  submitQuizAttempt, 
  getQuizResults 
} from "@/lib/actions/quiz.action";
import { toast } from "react-toastify";
import { CheckCircle, Clock, Trophy, AlertCircle } from "lucide-react";
import { IQuizAttempt } from "@/types/type";

interface QuizPlayerProps {
  quizId: string;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quizId }) => {
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    loadQuiz();
    loadAttempts();
  }, [quizId]);

  useEffect(() => {
    if (quiz && !isSubmitted) {
      setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, isSubmitted]);

  const loadQuiz = async () => {
    const result = await getQuizById(quizId);
    if (result.success) {
      setQuiz(result.data);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  const loadAttempts = async () => {
    const result = await getQuizResults(quizId);
    if (result.success) {
      setAttempts(result.data);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    });
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitted) return;

    const answersArray = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId,
      selectedAnswer,
    }));

    const timeSpent = (quiz.timeLimit * 60) - timeLeft;

    const result = await submitQuizAttempt({
      quizId,
      answers: answersArray,
      timeSpent,
    });

    if (result.success) {
      setResult(result.data);
      setIsSubmitted(true);
      loadAttempts();
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsSubmitted(false);
    setResult(null);
    setTimeLeft(quiz.timeLimit * 60);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Đang tải quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Không tìm thấy quiz hoặc quiz đã bị xóa.
        </AlertDescription>
      </Alert>
    );
  }

  if (isSubmitted && result) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Kết quả Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{result.percentage}%</div>
                <div className="text-sm text-gray-600">Điểm số</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{result.score}</div>
                <div className="text-sm text-gray-600">Điểm thực tế</div>
              </div>
            </div>
            
            <div className="text-center">
              <Badge 
                variant={result.passed ? "default" : "destructive"}
                className="text-lg px-4 py-2"
              >
                {result.passed ? "Đạt" : "Không đạt"}
              </Badge>
              <p className="mt-2 text-sm text-gray-600">
                Yêu cầu: {quiz.passingScore}% | Lần thử: {result.attemptNumber}/{quiz.maxAttempts}
              </p>
            </div>

            {result.attemptNumber < quiz.maxAttempts && (
              <div className="text-center">
                <Button onClick={handleRetakeQuiz} variant="outline">
                  Thử lại
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {attempts.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử làm bài</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attempts.map((attempt, index) => (
                  <div key={attempt._id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Lần {attempt.attemptNumber}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {new Date(attempt.completedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={attempt.passed ? "default" : "destructive"}>
                        {attempt.percentage}%
                      </Badge>
                      {attempt.passed && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Safety check for currentQuestion
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{quiz.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Lần thử: {attempts.length + 1}/{quiz.maxAttempts}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Câu {currentQuestionIndex + 1} / {quiz.questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentQuestion._id]?.toString() || ""}
            onValueChange={(value) => handleAnswerChange(currentQuestion._id, Number(value))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Câu trước
        </Button>
        
        <div className="flex gap-2">
          {quiz && currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
              Nộp bài
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              Câu tiếp
            </Button>
          )}
        </div>
      </div>

      {/* Question Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Điều hướng câu hỏi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {quiz && quiz.questions && quiz.questions.map((question: any, index: number) => (
              <Button
                key={question._id}
                variant={currentQuestionIndex === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className={`h-8 w-8 p-0 ${
                  answers[question._id] !== undefined 
                    ? 'bg-blue-100 border-blue-300' 
                    : ''
                }`}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPlayer;
