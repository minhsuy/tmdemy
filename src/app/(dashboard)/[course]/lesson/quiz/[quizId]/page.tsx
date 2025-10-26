import React from "react";
import QuizPlayer from "@/components/quiz/QuizPlayer";
import { getQuizById } from "@/lib/actions/quiz.action";
import { notFound } from "next/navigation";
import Heading from "@/components/typography/Heading";

interface QuizPageProps {
  params: {
    course: string;
    quizId: string;
  };
}

const QuizPage: React.FC<QuizPageProps> = async ({ params }) => {
  const { quizId } = params;
  
  const quizResult = await getQuizById(quizId);
  
  if (!quizResult.success) {
    notFound();
  }

  const quiz = quizResult.data;

  return (
    <div className="max-w-4xl mx-auto">
      <Heading className="mb-6">
        Quiz: {quiz.title}
      </Heading>
      <QuizPlayer 
        quizId={quizId}
      />
    </div>
  );
};

export default QuizPage;
