
import React from 'react';

interface FeedbackDisplayProps {
  feedback: string;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-blue-300 mb-4">Review Feedback</h2>
      <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
        <pre className="whitespace-pre-wrap break-words text-gray-200 font-sans text-sm leading-relaxed">
          {feedback}
        </pre>
      </div>
    </div>
  );
};
