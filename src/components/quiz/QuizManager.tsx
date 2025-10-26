"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  createQuiz, 
  getQuizzesByLesson, 
  updateQuiz, 
  deleteQuiz 
} from "@/lib/actions/quiz.action";
import { 
  createQuestion, 
  getQuestionsByQuiz, 
  updateQuestion, 
  deleteQuestion 
} from "@/lib/actions/question.action";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import IconAdd from "@/components/icons/IconAdd";
import IconEdit from "@/components/icons/IconEdit";
import IconTrash from "@/components/icons/IconTrash";
import IconClose from "@/components/icons/IconClose";
import { EQuizStatus, EQuestionType } from "@/types/enums";
import { ICreateQuizParams, ICreateQuestionParams } from "@/types/type";

interface QuizManagerProps {
  lessonId: string;
  courseId: string;
}

const QuizManager: React.FC<QuizManagerProps> = ({ lessonId, courseId }) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  // Quiz form state
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    timeLimit: 30,
    maxAttempts: 3,
    passingScore: 70,
    status: EQuizStatus.ACTIVE,
  });

  // Question form state
  const [questionForm, setQuestionForm] = useState({
    question: "",
    type: EQuestionType.MULTIPLE_CHOICE,
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    points: 1,
  });

  useEffect(() => {
    loadQuizzes();
  }, [lessonId]);

  useEffect(() => {
    if (selectedQuiz) {
      loadQuestions(selectedQuiz);
    }
  }, [selectedQuiz]);

  const loadQuizzes = async () => {
    const result = await getQuizzesByLesson(lessonId);
    if (result.success) {
      setQuizzes(result.data);
    }
  };

  const loadQuestions = async (quizId: string) => {
    const result = await getQuestionsByQuiz(quizId);
    if (result.success) {
      setQuestions(result.data);
    }
  };

  const handleCreateQuiz = async () => {
    if (!quizForm.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề quiz!");
      return;
    }

    const result = await createQuiz({
      ...quizForm,
      course: courseId,
      lesson: lessonId,
    });

    if (result.success) {
      toast.success(result.message);
      setIsQuizDialogOpen(false);
      setQuizForm({
        title: "",
        description: "",
        timeLimit: 30,
        maxAttempts: 3,
        passingScore: 70,
        status: EQuizStatus.ACTIVE,
      });
      loadQuizzes();
    } else {
      toast.error(result.message);
    }
  };

  const handleUpdateQuiz = async () => {
    if (!editingQuiz) return;

    const result = await updateQuiz({
      _id: editingQuiz._id,
      updatedData: quizForm,
    });

    if (result.success) {
      toast.success(result.message);
      setIsQuizDialogOpen(false);
      setEditingQuiz(null);
      loadQuizzes();
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    Swal.fire({
      title: "Xóa Quiz",
      text: "Bạn có chắc chắn muốn xóa quiz này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deleteResult = await deleteQuiz(quizId, "");
        if (deleteResult.success) {
          toast.success(deleteResult.message);
          loadQuizzes();
          if (selectedQuiz === quizId) {
            setSelectedQuiz(null);
            setQuestions([]);
          }
        } else {
          toast.error(deleteResult.message);
        }
      }
    });
  };

  const handleCreateQuestion = async () => {
    if (!selectedQuiz) {
      toast.error("Vui lòng chọn quiz trước!");
      return;
    }

    if (!questionForm.question.trim()) {
      toast.error("Vui lòng nhập câu hỏi!");
      return;
    }

    const validOptions = questionForm.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast.error("Vui lòng nhập ít nhất 2 lựa chọn!");
      return;
    }

    // Validate correct answer index
    if (questionForm.correctAnswer >= validOptions.length) {
      toast.error("Đáp án đúng không hợp lệ!");
      return;
    }

    try {
      const result = await createQuestion({
        question: questionForm.question.trim(),
        type: questionForm.type,
        options: validOptions,
        correctAnswer: questionForm.correctAnswer,
        explanation: questionForm.explanation.trim(),
        points: questionForm.points,
        quiz: selectedQuiz,
      });

      if (result.success) {
        toast.success(result.message);
        setIsQuestionDialogOpen(false);
        setQuestionForm({
          question: "",
          type: EQuestionType.MULTIPLE_CHOICE,
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
          points: 1,
        });
        loadQuestions(selectedQuiz);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error creating question:", error);
      toast.error("Có lỗi xảy ra khi tạo câu hỏi!");
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;

    const result = await updateQuestion({
      _id: editingQuestion._id,
      updatedData: questionForm,
    });

    if (result.success) {
      toast.success(result.message);
      setIsQuestionDialogOpen(false);
      setEditingQuestion(null);
      loadQuestions(selectedQuiz!);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    Swal.fire({
      title: "Xóa Câu Hỏi",
      text: "Bạn có chắc chắn muốn xóa câu hỏi này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deleteResult = await deleteQuestion(questionId, "");
        if (deleteResult.success) {
          toast.success(deleteResult.message);
          loadQuestions(selectedQuiz!);
        } else {
          toast.error(deleteResult.message);
        }
      }
    });
  };

  const openQuizDialog = (quiz?: any) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setQuizForm({
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        maxAttempts: quiz.maxAttempts,
        passingScore: quiz.passingScore,
        status: quiz.status,
      });
    } else {
      setEditingQuiz(null);
      setQuizForm({
        title: "",
        description: "",
        timeLimit: 30,
        maxAttempts: 3,
        passingScore: 70,
        status: EQuizStatus.ACTIVE,
      });
    }
    setIsQuizDialogOpen(true);
  };

  const openQuestionDialog = (question?: any) => {
    if (question) {
      setEditingQuestion(question);
      setQuestionForm({
        question: question.question,
        type: question.type,
        options: [...question.options, ...Array(4 - question.options.length).fill("")],
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        points: question.points,
      });
    } else {
      setEditingQuestion(null);
      setQuestionForm({
        question: "",
        type: EQuestionType.MULTIPLE_CHOICE,
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        points: 1,
      });
    }
    setIsQuestionDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Quiz Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Quản lý Quiz</h3>
          <Button onClick={() => openQuizDialog()}>
            <IconAdd className="w-4 h-4 mr-2" />
            Tạo Quiz
          </Button>
        </div>

        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz._id} className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-primary/20">
              <CardHeader 
                className="pb-3"
                onClick={() => setSelectedQuiz(selectedQuiz === quiz._id ? null : quiz._id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">{quiz.title}</CardTitle>
                    {quiz.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{quiz.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                        {quiz.timeLimit} phút
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                        {quiz.maxAttempts} lần thử
                      </Badge>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
                        {quiz.passingScore}% đạt
                      </Badge>
                      <Badge variant={quiz.status === EQuizStatus.ACTIVE ? "default" : "secondary"} className={quiz.status === EQuizStatus.ACTIVE ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800" : ""}>
                        {quiz.status === EQuizStatus.ACTIVE ? "Hoạt động" : "Tạm dừng"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        openQuizDialog(quiz);
                      }}
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <IconEdit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuiz(quiz._id);
                      }}
                      className="hover:bg-red-600"
                    >
                      <IconTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {selectedQuiz === quiz._id && (
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Câu hỏi ({questions.length})</h4>
                      <Button size="sm" onClick={() => openQuestionDialog()}>
                        <IconAdd className="w-4 h-4 mr-2" />
                        Thêm câu hỏi
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {questions.map((question, index) => (
                        <div key={question._id} className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                                  {index + 1}
                                </span>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                    {question.question}
                                  </p>
                                  <div className="space-y-2">
                                    {question.options.map((option: string, optIndex: number) => (
                                      <div key={optIndex} className="flex items-center gap-3 p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                                        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                                          optIndex === question.correctAnswer 
                                            ? 'border-green-500 bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 dark:border-green-600' 
                                            : 'border-gray-300 dark:border-gray-600'
                                        }`}>
                                          {String.fromCharCode(65 + optIndex)}
                                        </span>
                                        <span className={`flex-1 ${optIndex === question.correctAnswer ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                                          {option}
                                        </span>
                                        {optIndex === question.correctAnswer && (
                                          <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                                            ✓ Đúng
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  {question.explanation && (
                                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                                      <p className="text-sm text-blue-700 dark:text-blue-300">
                                        <strong>Giải thích:</strong> {question.explanation}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openQuestionDialog(question)}
                                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <IconEdit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteQuestion(question._id)}
                                className="hover:bg-red-600"
                              >
                                <IconTrash className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Quiz Dialog */}
      <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-white border border-gray-200 dark:border-gray-300">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-900">
              {editingQuiz ? "Chỉnh sửa Quiz" : "Tạo Quiz mới"}
            </DialogTitle>
          </DialogHeader>
            <div className="space-y-6 bg-white">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="Nhập tiêu đề quiz"
                  className="border-gray-300 focus:border-primary focus:ring-primary bg-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Mô tả</Label>
                <Textarea
                  id="description"
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  placeholder="Nhập mô tả quiz"
                  className="border-gray-300 focus:border-primary focus:ring-primary min-h-[80px] bg-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeLimit" className="text-sm font-medium text-gray-700">Thời gian (phút)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={quizForm.timeLimit}
                    onChange={(e) => setQuizForm({ ...quizForm, timeLimit: Number(e.target.value) })}
                    className="border-gray-300 focus:border-primary focus:ring-primary bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAttempts" className="text-sm font-medium text-gray-700">Số lần thử tối đa</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    value={quizForm.maxAttempts}
                    onChange={(e) => setQuizForm({ ...quizForm, maxAttempts: Number(e.target.value) })}
                    className="border-gray-300 focus:border-primary focus:ring-primary bg-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passingScore" className="text-sm font-medium text-gray-700">Điểm đạt (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={quizForm.passingScore}
                  onChange={(e) => setQuizForm({ ...quizForm, passingScore: Number(e.target.value) })}
                  className="border-gray-300 focus:border-primary focus:ring-primary bg-white"
                />
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Switch
                  id="status"
                  checked={quizForm.status === EQuizStatus.ACTIVE}
                  onCheckedChange={(checked) => 
                    setQuizForm({ 
                      ...quizForm, 
                      status: checked ? EQuizStatus.ACTIVE : EQuizStatus.INACTIVE 
                    })
                  }
                />
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">Trạng thái hoạt động</Label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => setIsQuizDialogOpen(false)}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Hủy
                </Button>
                <Button 
                  onClick={editingQuiz ? handleUpdateQuiz : handleCreateQuiz}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {editingQuiz ? "Cập nhật" : "Tạo"}
                </Button>
              </div>
            </div>
        </DialogContent>
      </Dialog>

      {/* Question Dialog */}
      <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-white border border-gray-200 dark:border-gray-300 mx-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-200">
            <DialogTitle className="text-gray-900 dark:text-gray-900">
              {editingQuestion ? "Chỉnh sửa Câu hỏi" : "Tạo Câu hỏi mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 bg-white p-1">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-medium text-gray-700">Câu hỏi *</Label>
              <Textarea
                id="question"
                value={questionForm.question}
                onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                placeholder="Nhập câu hỏi"
                className="border-gray-300 focus:border-primary focus:ring-primary min-h-[100px] bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-gray-700">Loại câu hỏi</Label>
              <Select
                value={questionForm.type}
                onValueChange={(value) => setQuestionForm({ ...questionForm, type: value as EQuestionType })}
              >
                <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EQuestionType.MULTIPLE_CHOICE}>Trắc nghiệm</SelectItem>
                  <SelectItem value={EQuestionType.TRUE_FALSE}>Đúng/Sai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Các lựa chọn *</Label>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {questionForm.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 min-w-0">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...questionForm.options];
                        newOptions[index] = e.target.value;
                        setQuestionForm({ ...questionForm, options: newOptions });
                      }}
                      placeholder={`Lựa chọn ${String.fromCharCode(65 + index)}`}
                      className="flex-1 border-gray-300 focus:border-primary focus:ring-primary bg-white min-w-0"
                    />
                    {index >= 2 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newOptions = questionForm.options.filter((_, i) => i !== index);
                          setQuestionForm({ ...questionForm, options: newOptions });
                        }}
                        className="border-red-300 text-red-600 hover:bg-red-50 flex-shrink-0"
                      >
                        <IconClose className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {questionForm.options.length < 6 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setQuestionForm({
                        ...questionForm,
                        options: [...questionForm.options, ""],
                      });
                    }}
                    className="border-primary text-primary hover:bg-primary/10 w-full"
                  >
                    <IconAdd className="w-4 h-4 mr-2" />
                    Thêm lựa chọn
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="correctAnswer" className="text-sm font-medium text-gray-700">Đáp án đúng</Label>
              <Select
                value={questionForm.correctAnswer.toString()}
                onValueChange={(value) => setQuestionForm({ ...questionForm, correctAnswer: Number(value) })}
              >
                <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionForm.options.map((option, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {String.fromCharCode(65 + index)}. {option || `Lựa chọn ${String.fromCharCode(65 + index)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="explanation" className="text-sm font-medium text-gray-700">Giải thích</Label>
              <Textarea
                id="explanation"
                value={questionForm.explanation}
                onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                placeholder="Nhập giải thích cho đáp án"
                className="border-gray-300 focus:border-primary focus:ring-primary min-h-[80px] bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="points" className="text-sm font-medium text-gray-700">Điểm số</Label>
              <Input
                id="points"
                type="number"
                value={questionForm.points}
                onChange={(e) => setQuestionForm({ ...questionForm, points: Number(e.target.value) })}
                className="border-gray-300 focus:border-primary focus:ring-primary bg-white"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
              <Button 
                variant="outline" 
                onClick={() => setIsQuestionDialogOpen(false)}
                className="border-gray-300 hover:bg-gray-50"
              >
                Hủy
              </Button>
              <Button 
                onClick={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {editingQuestion ? "Cập nhật" : "Tạo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizManager;
