import { useState } from "react";
import stories from "./data/stories.js";
import StoryCard from "./components/StoryCard.jsx";
import personaDescriptions from "./data/personaDescriptions.js";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allResponses, setAllResponses] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const totalPages = stories.length;

  console.log(allResponses);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleStoryResponse = (storyId, responses) => {
    setAllResponses((prev) => ({ ...prev, [storyId]: responses }));
  };

  const calculatePersonaScores = () => {
    const personaScores = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };

    Object.entries(allResponses).forEach(([storyId, storyResponses]) => {
      const story = stories.find((s) => s.id === parseInt(storyId));
      if (!story) return;

      Object.entries(storyResponses).forEach(([questionId, selectedOption]) => {
        const question = story.questions.find((q) => q.id === questionId);
        if (question && selectedOption) {
          const persona = selectedOption.persona;
          const marks = question.marks;
          personaScores[persona] += marks;
        }
      });
    });

    return personaScores;
  };

  const renderSummary = () => {
    const personaScores = calculatePersonaScores();

    // Find the highest scoring persona
    const topPersona = Object.entries(personaScores).reduce((a, b) =>
      personaScores[a[0]] > personaScores[b[0]] ? a : b
    );

    // Sort all personas by score for display
    const sortedPersonas = Object.entries(personaScores).sort(
      (a, b) => b[1] - a[1]
    );

    return (
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10">
        <h2 className="text-3xl font-bold text-center text-[#54B0AF] mb-8">
          Your Corporate Persona
        </h2>

        <div className="bg-gradient-to-r from-[#54B0AF] to-[#479d9c] text-white p-6 rounded-xl mb-8">
          <h3 className="text-2xl font-bold mb-2">
            {personaDescriptions[topPersona[0]].title}
          </h3>
          <p className="text-lg">
            {personaDescriptions[topPersona[0]].description}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            Persona Breakdown:
          </h4>
          {sortedPersonas.map(([persona, score]) => (
            <div
              key={persona}
              className="flex justify-between items-center p-3 bg-gray-50 rounded"
            >
              <span className="font-medium">
                {personaDescriptions[persona].title}
              </span>
              <span
                className={`font-bold ${
                  score > 0
                    ? "text-green-600"
                    : score < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {score > 0 ? "+" : ""}
                {score} points
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setShowSummary(false);
              setCurrentPage(1);
              setAllResponses({});
            }}
            className="px-6 py-3 bg-[#54B0AF] hover:bg-[#479d9c] text-white rounded-full font-semibold transition-colors"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  };

  const isCurrentStoryComplete = () => {
    const currentStory = stories[currentPage - 1];
    const storyResponses = allResponses[currentStory.id] || {};
    return currentStory.questions.every((q) => storyResponses[q.id]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-10">
      <div className="w-full flex flex-col items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#54B0AF] mb-4">
          Corporate Alignment Psychometric Quiz
        </h1>

        {!showSummary && (
          <span className="text-gray-700 font-medium text-sm sm:text-xl my-4 text-center">
            Story {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {!showSummary ? (
        <>
          <StoryCard
            story={stories[currentPage - 1]}
            onSaveResponses={(responses) =>
              handleStoryResponse(stories[currentPage - 1].id, responses)
            }
            savedResponses={allResponses[stories[currentPage - 1].id] || {}}
          />

          <div className="flex justify-between items-center mt-8 max-w-5xl mx-auto">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 text-white transition-colors ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#54B0AF] hover:bg-[#479d9c]"
              }`}
            >
              ← Previous
            </button>

            <span className="text-lg font-medium">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={!isCurrentStoryComplete()}
              className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors ${
                isCurrentStoryComplete()
                  ? "bg-[#54B0AF] hover:bg-[#479d9c] text-white"
                  : "bg-gray-400 cursor-not-allowed text-white"
              }`}
            >
              {currentPage === totalPages ? "See Results" : "Next"} →
            </button>
          </div>

          {!isCurrentStoryComplete() && (
            <p className="text-center text-gray-600 mt-4">
              Please answer all questions to continue
            </p>
          )}
        </>
      ) : (
        renderSummary()
      )}
    </div>
  );
}
