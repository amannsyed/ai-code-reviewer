import React, { useState, useCallback } from "react";
import { LanguageSelector } from "./components/LanguageSelector";
import { CodeInput } from "./components/CodeInput";
import { FeedbackDisplay } from "./components/FeedbackDisplay";
import { LoadingIcon } from "./components/LoadingIcon";
import { ErrorAlert } from "./components/ErrorAlert";
import { reviewCodeWithGemini } from "./services/geminiService";
import { SUPPORTED_LANGUAGES } from "./constants";
import type { SupportedLanguage } from "./types";

const App: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    SUPPORTED_LANGUAGES[0]
  );
  const [feedback, setFeedback] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleReview = useCallback(async () => {
    if (!code.trim()) {
      setError("Please enter some code to review.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setFeedback("");

    try {
      const reviewResult = await reviewCodeWithGemini(
        code,
        selectedLanguage.label
      );
      setFeedback(reviewResult);
    } catch (err) {
      if (err instanceof Error) {
        setError(
          `Failed to get review: ${err.message}. Ensure your API key is correctly configured.`
        );
      } else {
        setError("An unknown error occurred.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [code, selectedLanguage]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-400">
          Gemini Code Reviewer
        </h1>
        <p className="text-gray-400 mt-2">
          Get AI-powered feedback on your code in seconds.
        </p>
      </header>

      <main className="w-full max-w-4xl bg-gray-800 shadow-2xl rounded-lg p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            languages={SUPPORTED_LANGUAGES}
          />
        </div>

        <CodeInput
          code={code}
          onCodeChange={setCode}
          language={selectedLanguage.value}
        />

        <div className="mt-6 text-center">
          <button
            onClick={handleReview}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto w-full sm:w-auto"
          >
            {isLoading && <LoadingIcon className="mr-2" />}
            {isLoading ? "Reviewing..." : "Review Code"}
          </button>
        </div>

        {error && (
          <ErrorAlert
            message={error}
            onClose={() => setError(null)}
            className="mt-6"
          />
        )}

        {feedback && !isLoading && <FeedbackDisplay feedback={feedback} />}
        {isLoading && !feedback && (
          <div className="mt-8 p-6 bg-gray-700 rounded-lg text-center">
            <LoadingIcon className="mx-auto h-8 w-8 mb-2" />
            <p className="text-gray-300">Generating feedback, please wait...</p>
          </div>
        )}
      </main>
      <footer className="w-full max-w-4xl mt-12 text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} AI Code Reviewer. Developed by{" "}
          <a
            href="https://github.com/amannsyed"
            target="_blank"
            rel="noopener noreferrer"
          >
            amannsyed
          </a>
          .
        </p>
        <p className="mt-1">
          Note: API key must be configured in `process.env.API_KEY`.
        </p>
      </footer>
    </div>
  );
};

export default App;
