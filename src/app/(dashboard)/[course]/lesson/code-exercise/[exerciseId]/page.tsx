import React from "react";
import CodeExercisePlayer from "@/components/code/CodeExercisePlayer";
import { getCodeExerciseById } from "@/lib/actions/code-exercise.action";
import { notFound } from "next/navigation";
import Heading from "@/components/typography/Heading";

interface CodeExercisePageProps {
  params: {
    course: string;
    exerciseId: string;
  };
}

const CodeExercisePage: React.FC<CodeExercisePageProps> = async ({ params }) => {
  const { exerciseId } = params;
  
  const exerciseResult = await getCodeExerciseById(exerciseId);
  
  if (!exerciseResult.success) {
    notFound();
  }

  const exercise = exerciseResult.data;

  return (
    <div className="max-w-6xl mx-auto">
      <Heading className="mb-6">
        Bài tập Code: {exercise.title}
      </Heading>
      <CodeExercisePlayer 
        exerciseId={exerciseId}
      />
    </div>
  );
};

export default CodeExercisePage;
