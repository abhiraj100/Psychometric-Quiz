import { useState } from "react";

const StoryCard = ({ story, onSaveResponses, savedResponses }) => {
  const [responses, setResponses] = useState(savedResponses || {});

  const handleChange = (qId, selectedOption) => {
    const updated = { ...responses, [qId]: selectedOption };
    setResponses(updated);
    onSaveResponses(updated);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 mx-auto w-full max-w-5xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#54B0AF] mb-6">
        {story.title}
      </h2>

      <p className="text-gray-800 whitespace-pre-wrap text-justify leading-relaxed text-base sm:text-lg mb-8">
        {story.description}
      </p>

      <div className="space-y-6">
        {story.questions.map((q) => (
          <div key={q.id}>
            <p className="block text-gray-900 font-medium text-base sm:text-lg md:text-xl mb-4">
              {q.question}
            </p>
            <div className="flex flex-wrap gap-4">
              {q.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="radio"
                    name={`question-${story.id}-${q.id}`}
                    value={option.label}
                    checked={responses[q.id]?.label === option.label}
                    onChange={() => handleChange(q.id, option)}
                    className="w-5 h-5 text-[#54B0AF] focus:ring-[#54B0AF]"
                  />
                  <span className="text-base sm:text-lg">{option.label}</span>
                </label>
              ))}
            </div>
            <hr className="my-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryCard;
