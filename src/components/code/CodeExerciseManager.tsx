"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Code2, 
  Clock, 
  Users, 
  Trophy,
  CheckCircle,
  XCircle,
  PlusCircle,
  MinusCircle
} from "lucide-react";
import { toast } from "react-toastify";
import { 
  createCodeExercise, 
  getCodeExercisesByLesson, 
  updateCodeExercise, 
  deleteCodeExercise 
} from "@/lib/actions/code-exercise.action";
import { ECodeExerciseStatus, ECodeExerciseDifficulty, ECodeLanguage } from "@/types/enums";
import { ICreateCodeExerciseParams, IUpdateCodeExerciseParams } from "@/types/type";

interface CodeExerciseManagerProps {
  lessonId: string;
  courseId: string;
}

const CodeExerciseManager: React.FC<CodeExerciseManagerProps> = ({ lessonId, courseId }) => {
  const [codeExercises, setCodeExercises] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [exerciseForm, setExerciseForm] = useState<ICreateCodeExerciseParams>({
    title: "",
    description: "",
    instructions: "",
    starterCode: "",
    solution: "",
    testCases: [
      { input: "", expectedOutput: "", description: "" }
    ],
    language: "javascript",
    difficulty: "EASY",
    timeLimit: 30,
    maxAttempts: 3,
    points: 10,
    course: courseId,
    lesson: lessonId,
    order: 0,
    status: "ACTIVE",
  });

  useEffect(() => {
    loadCodeExercises();
  }, [lessonId]);

  const loadCodeExercises = async () => {
    try {
      const result = await getCodeExercisesByLesson(lessonId);
      if (result.success) {
        setCodeExercises(result.data);
      }
    } catch (error) {
      console.error("Error loading code exercises:", error);
    }
  };

  const openDialog = (exercise?: any) => {
    if (exercise) {
      setEditingExercise(exercise);
      setExerciseForm({
        title: exercise.title,
        description: exercise.description,
        instructions: exercise.instructions,
        starterCode: exercise.starterCode,
        solution: exercise.solution,
        testCases: exercise.testCases,
        language: exercise.language,
        difficulty: exercise.difficulty,
        timeLimit: exercise.timeLimit,
        maxAttempts: exercise.maxAttempts,
        points: exercise.points,
        course: courseId,
        lesson: lessonId,
        order: exercise.order,
        status: exercise.status,
      });
    } else {
      setEditingExercise(null);
      setExerciseForm({
        title: "",
        description: "",
        instructions: "",
        starterCode: "",
        solution: "",
        testCases: [{ input: "", expectedOutput: "", description: "" }],
        language: "javascript",
        difficulty: "EASY",
        timeLimit: 30,
        maxAttempts: 3,
        points: 10,
        course: courseId,
        lesson: lessonId,
        order: 0,
        status: "ACTIVE",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCreateExercise = async () => {
    if (!exerciseForm.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề!");
      return;
    }

    if (!exerciseForm.instructions.trim()) {
      toast.error("Vui lòng nhập hướng dẫn!");
      return;
    }

    if (exerciseForm.testCases.length === 0 || exerciseForm.testCases.some(tc => !tc.input.trim() || !tc.expectedOutput.trim())) {
      toast.error("Vui lòng thêm ít nhất một test case hợp lệ!");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createCodeExercise(exerciseForm);
      if (result.success) {
        toast.success(result.message);
        setIsDialogOpen(false);
        loadCodeExercises();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error creating code exercise:", error);
      toast.error("Có lỗi xảy ra khi tạo bài tập!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateExercise = async () => {
    if (!editingExercise) return;

    setIsLoading(true);
    try {
      const result = await updateCodeExercise({
        id: editingExercise._id,
        ...exerciseForm,
      });
      if (result.success) {
        toast.success(result.message);
        setIsDialogOpen(false);
        loadCodeExercises();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating code exercise:", error);
      toast.error("Có lỗi xảy ra khi cập nhật bài tập!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExercise = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài tập này?")) return;

    try {
      const result = await deleteCodeExercise(id);
      if (result.success) {
        toast.success(result.message);
        loadCodeExercises();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting code exercise:", error);
      toast.error("Có lỗi xảy ra khi xóa bài tập!");
    }
  };

  const addTestCase = () => {
    setExerciseForm({
      ...exerciseForm,
      testCases: [...exerciseForm.testCases, { input: "", expectedOutput: "", description: "" }]
    });
  };

  const removeTestCase = (index: number) => {
    if (exerciseForm.testCases.length > 1) {
      setExerciseForm({
        ...exerciseForm,
        testCases: exerciseForm.testCases.filter((_, i) => i !== index)
      });
    }
  };

  const updateTestCase = (index: number, field: string, value: string) => {
    const newTestCases = [...exerciseForm.testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setExerciseForm({ ...exerciseForm, testCases: newTestCases });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800";
      case "HARD": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Bài tập Code</h3>
        <Button onClick={() => openDialog()} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Tạo bài tập
        </Button>
      </div>

      <div className="grid gap-4">
        {codeExercises.map((exercise) => (
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
                      {exercise.language}
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
                    <Badge variant={exercise.status === "ACTIVE" ? "default" : "secondary"} className={exercise.status === "ACTIVE" ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800" : ""}>
                      {exercise.status === "ACTIVE" ? "Hoạt động" : "Tạm dừng"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog(exercise)}
                    className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteExercise(exercise._id)}
                    className="hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-white border border-gray-200 dark:border-gray-300">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-200">
            <DialogTitle className="text-gray-900 dark:text-gray-900">
              {editingExercise ? "Chỉnh sửa Bài tập Code" : "Tạo Bài tập Code mới"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 bg-white p-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={exerciseForm.title}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, title: e.target.value })}
                  placeholder="Nhập tiêu đề bài tập"
                  className="border-gray-300 focus:border-primary focus:ring-primary bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium text-gray-700">Ngôn ngữ *</Label>
                <Select
                  value={exerciseForm.language}
                  onValueChange={(value) => setExerciseForm({ ...exerciseForm, language: value })}
                >
                  <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ECodeLanguage).map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Mô tả</Label>
              <Textarea
                id="description"
                value={exerciseForm.description}
                onChange={(e) => setExerciseForm({ ...exerciseForm, description: e.target.value })}
                placeholder="Nhập mô tả bài tập"
                className="border-gray-300 focus:border-primary focus:ring-primary min-h-[80px] bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-sm font-medium text-gray-700">Hướng dẫn *</Label>
              <Textarea
                id="instructions"
                value={exerciseForm.instructions}
                onChange={(e) => setExerciseForm({ ...exerciseForm, instructions: e.target.value })}
                placeholder="Nhập hướng dẫn chi tiết cho bài tập"
                className="border-gray-300 focus:border-primary focus:ring-primary min-h-[120px] bg-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-sm font-medium text-gray-700">Độ khó</Label>
                <Select
                  value={exerciseForm.difficulty}
                  onValueChange={(value) => setExerciseForm({ ...exerciseForm, difficulty: value })}
                >
                  <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ECodeExerciseDifficulty).map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeLimit" className="text-sm font-medium text-gray-700">Thời gian (phút)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={exerciseForm.timeLimit}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, timeLimit: Number(e.target.value) })}
                  className="border-gray-300 focus:border-primary focus:ring-primary bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="points" className="text-sm font-medium text-gray-700">Điểm số</Label>
                <Input
                  id="points"
                  type="number"
                  value={exerciseForm.points}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, points: Number(e.target.value) })}
                  className="border-gray-300 focus:border-primary focus:ring-primary bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="starterCode" className="text-sm font-medium text-gray-700">Code mẫu</Label>
              <Textarea
                id="starterCode"
                value={exerciseForm.starterCode}
                onChange={(e) => setExerciseForm({ ...exerciseForm, starterCode: e.target.value })}
                placeholder="Nhập code mẫu cho học viên"
                className="border-gray-300 focus:border-primary focus:ring-primary min-h-[120px] bg-white font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution" className="text-sm font-medium text-gray-700">Lời giải</Label>
              <Textarea
                id="solution"
                value={exerciseForm.solution}
                onChange={(e) => setExerciseForm({ ...exerciseForm, solution: e.target.value })}
                placeholder="Nhập lời giải mẫu"
                className="border-gray-300 focus:border-primary focus:ring-primary min-h-[120px] bg-white font-mono"
              />
            </div>

            {/* Test Cases */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-gray-700">Test Cases *</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addTestCase}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Thêm test case
                </Button>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {exerciseForm.testCases.map((testCase, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">Test Case {index + 1}</span>
                      {exerciseForm.testCases.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeTestCase(index)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600">Input</Label>
                        <Input
                          value={testCase.input}
                          onChange={(e) => updateTestCase(index, "input", e.target.value)}
                          placeholder="Input data"
                          className="border-gray-300 focus:border-primary focus:ring-primary bg-white text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Expected Output</Label>
                        <Input
                          value={testCase.expectedOutput}
                          onChange={(e) => updateTestCase(index, "expectedOutput", e.target.value)}
                          placeholder="Expected output"
                          className="border-gray-300 focus:border-primary focus:ring-primary bg-white text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Description</Label>
                        <Input
                          value={testCase.description}
                          onChange={(e) => updateTestCase(index, "description", e.target.value)}
                          placeholder="Test description"
                          className="border-gray-300 focus:border-primary focus:ring-primary bg-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="border-gray-300 hover:bg-gray-50"
              >
                Hủy
              </Button>
              <Button 
                onClick={editingExercise ? handleUpdateExercise : handleCreateExercise}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isLoading ? "Đang xử lý..." : (editingExercise ? "Cập nhật" : "Tạo")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CodeExerciseManager;
