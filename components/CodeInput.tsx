
import React from 'react';

interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  language: string;
}

export const CodeInput: React.FC<CodeInputProps> = ({ code, onCodeChange, language }) => {
  return (
    <div>
      <label htmlFor="code-input" className="block text-sm font-medium text-gray-300 mb-1">
        Paste Your Code Here
      </label>
      <textarea
        id="code-input"
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder={`Enter ${language} code...`}
        rows={15}
        className="w-full bg-gray-700 border border-gray-600 text-gray-100 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-y transition duration-150"
      />
    </div>
  );
};
