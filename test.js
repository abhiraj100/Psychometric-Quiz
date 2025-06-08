import { useState } from "react";
import StoryCard from "./components/StoryCard";
import { stories } from "./data/stories";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allResponses, setAllResponses] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const totalPages = stories.length;

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

  const renderSummary = () => {
    const scores = {};

    // Tally scores for each character
    Object.entries(allResponses).forEach(([storyId, response]) => {
      Object.values(response).forEach((selectedCharacter) => {
        const character = selectedCharacter.trim();
        scores[character] = (scores[character] || 0) + 1;
      });
    });

    // Sort characters by score
    const sortedCharacters = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    return (
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10">
        <h2 className="text-3xl font-bold text-center text-[#54B0AF] mb-6">
          Your Reflection Summary
        </h2>
        <ul className="text-xl space-y-2 mb-4">
          {sortedCharacters.map(([character, score]) => (
            <li key={character}>
              <strong>{character}:</strong> {score} point{score > 1 ? "s" : ""}
            </li>
          ))}
        </ul>
        <p className="text-lg text-gray-700 text-center mt-6">
          Top match:{" "}
          <span className="font-semibold text-[#54B0AF]">
            {sortedCharacters[0][0]}
          </span>{" "}
          — based on your story instincts.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-10">
      <div className="w-full flex flex-col items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#54B0AF] mb-4">
          Corporate Alignment Psychometric Quiz
        </h1>

        <span className="text-gray-700 font-medium text-sm sm:text-2xl my-4 text-center">
          Story {currentPage} of {totalPages}
        </span>
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

          {/* Pagination Buttons */}
          <div className="flex justify-between items-center mt-8 max-w-5xl mx-auto">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 text-white ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#54B0AF] hover:bg-[#479d9c]"
              }`}
            >
              <FaArrowLeftLong /> Previous
            </button>

            <span className="text-lg font-medium">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-full font-semibold flex items-center gap-2 bg-[#54B0AF] hover:bg-[#479d9c] text-white"
            >
              {currentPage === totalPages ? "Finish" : "Next"}{" "}
              <FaArrowRightLong />
            </button>
          </div>
        </>
      ) : (
        renderSummary()
      )}
    </div>
  );
}



import { useState } from "react";

export default function StoryCard({ story, onSaveResponses, savedResponses }) {
  const [responses, setResponses] = useState(savedResponses || {});

  const handleChange = (qId, value) => {
    const updated = { ...responses, [qId]: value };
    setResponses(updated);
    onSaveResponses(updated);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 mx-auto w-full max-w-5xl">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#54B0AF] mb-6">
        {story.title}
      </h2>

      {/* Description */}
      <p className="text-gray-800 whitespace-pre-wrap text-justify leading-relaxed text-base sm:text-2xl mb-8">
        {story.description}
      </p>

      {/* Questions */}
      <div className="space-y-6">
        {story.questions.map((q) => (
          <div key={q.id}>
            <p className="block text-gray-900 font-medium text-base sm:text-lg md:text-2xl mb-2">
              {q.question}
            </p>
            <div className="flex flex-wrap gap-4">
              {q.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question-${story.id}-${q.id}`}
                    value={option}
                    checked={responses[q.id] === option}
                    onChange={() => handleChange(q.id, option)}
                    className="w-5 h-5 text-[#54B0AF] focus:ring-[#54B0AF]"
                  />
                  <span className="text-base sm:text-lg md:text-xl">
                    {option}
                  </span>
                </label>
              ))}
            </div>
            <hr className="my-4" />
          </div>
        ))}
      </div>
    </div>
  );
}


export const stories = [
  {
    id: 1,
    title: "The Townhall Clap",
    description: `The applause echoed in the atrium. The director was calling out teams that had “moved the needle.”

A few rows from the front, Nikhil stood, buttoned his jacket, and walked to the front when his name was called. He shook hands, glanced once at the crowd, and walked back, straightening the crease in his sleeve before sitting down.

Three rows behind, Tanya clapped too — once, then slower. She didn’t look up. The printout of Slide 16 was still folded in her bag from last night’s review. When the last name was announced, she reached for her bag.

On the mezzanine, Jeevan watched from behind the glass with a samosa in one hand and a Coke in the other. His laptop was open to a paused YouTube video. He smirked, took a bite, and tapped something into his phone. He stayed until the muffins ran out.`,
    questions: [
      {
        id: 1,
        question: "Who felt most familiar to you?",
        options: ["Nikhil", "Tanya", "Jeevan"],
      },
      {
        id: 2,
        question: "Who do you secretly admire?",
        options: ["Nikhil", "Tanya", "Jeevan"],
      },
      {
        id: 3,
        question: "Who made you uncomfortable?",
        options: ["Nikhil", "Tanya", "Jeevan"],
      },
    ],
  },
  {
    id: 2,
    title: "The Layoff Memo",
    description: `The email subject line said: “Company Update: Strategic Realignment.” Everyone knew what that meant.

The floor was quieter than usual. Even the ones who never wore headphones now had them in — music not playing, just buffering silence.

Vikram walked in with his usual coffee and a printed agenda for the stand-up. “Until we
hear otherwise, we stay focused,” he said, placing the agenda neatly next to the whiteboard.

Two seats down, Kabir was refreshing Slack threads like they were air. His browser had
three tabs open: LinkedIn, Naukri, and the HR policy handbook. When asked if he was okay, he nodded — but didn’t look up.

In the far corner, Sana was drafting a long message to her skip-level manager. Not to ask
about her own job — but to question how decisions were being made. She re-read it twice. Then deleted the second half.`,
    questions: [
      {
        id: 1,
        question: "Who felt most like you?",
        options: ["Vikram", "Kabir", "Sana"],
      },
      {
        id: 2,
        question: "Who did you admire?",
        options: ["Vikram", "Kabir", "Sana"],
      },
      {
        id: 3,
        question: "Who made you uneasy?",
        options: ["Vikram", "Kabir", "Sana"],
      },
    ],
  },
  {
    id: 3,
    title: "The Cross-Team Conflict",
    description: `The design team and the product team were fighting again. Or as the director liked to call it — “collaborative misalignment.”

There had been three conflicting Slack threads, two rescheduled meetings, and one mysteriously deleted comment on a shared doc.

Priya was on both threads, using different tones. In design chat, she added a “totally get it ” to a rant about unrealistic deadlines. In product chat, she replied with “makes sense — will align with the team.” Neither message mentioned her actual opinion. She muted both channels after posting.

Anuj hadn’t said much, but forwarded a screenshot of the doc argument to a director with the note: “Might want to get ahead of this.” Later, he swung by the design bay with a box of brownies and said, “Can we reset vibes before it spirals?”

Naveen, the actual project lead, quietly created a new Jira ticket titled “Team Sync: Clarify Alignment.” He tagged a few team members, added a checklist with items like “review dependencies” and “capture blockers,” marked it as high priority, and assigned it to 
“Team – All.” Then he turned to working on his slides for next week’s leadership update.
`,
    questions: [
      {
        id: 1,
        question: "Who felt most like you?",
        options: ["Priya", "Anuj", "Naveen"],
      },
      {
        id: 2,
        question: "Who do you quietly admire?",
        options: ["Priya", "Anuj", "Naveen"],
      },
      {
        id: 3,
        question: "Who made you uncomfortable?",
        options: ["Priya", "Anuj", "Naveen"],
      },
    ],
  },
  {
    id: 4,
    title: "The Appraisal Puzzle",
    description: `The meeting room had one window and no signal. Appraisal season.

Rajat came in with a binder — printed KPIs, last quarter’s OKRs, a tabbed section for “growth highlights.” When his manager suggested a mid-year target tweak, Rajat nodded instantly. “Absolutely. Whatever you think makes sense,” he said, already adjusting his sheet.

Meera brought her appraisal sheet, unmarked. When asked about her goals, she said, “They’re fine.” About the team: “It’s okay.” She paused before each answer — like she was trying to remember who wrote them six months ago. Before leaving: “Do I need to sign anything?” Then softer, almost automatic: “Thanks for the time.”

Fatima had her own notes. Metrics. Peer quotes. When the manager said, “There’s a perception that you’re not always aligned,” she paused. Then asked, “Do you mean aligned with the org… or with you?” She didn’t wait for the full answer before thanking him and walking out.
`,
    questions: [
      {
        id: 1,
        question: "Who felt most like you in that room?",
        options: ["Rajat", "Meera", "Fatima"],
      },
      {
        id: 2,
        question: "Who surprised you?",
        options: ["Rajat", "Meera", "Fatima"],
      },
      {
        id: 3,
        question: "Who made you nervous?",
        options: ["Rajat", "Meera", "Fatima"],
      },
    ],
  },
  {
    id: 5,
    title: "The New Joiner Dilemma",
    description: `Arjun had joined just two months ago. The welcome cake had barely gone stale.

On Friday, his manager pinged: “Need a quick pitch deck by EOD.” Arjun said yes, of course — then scrambled to collect content from three teams, stayed late polishing slides, and ended up adding Dev and Chhavi’s names on the title page for “visibility.”

Chhavi noticed it first. “We didn’t really contribute though…” she whispered. But when Dev shrugged and said, “Just smile and wave — he’s overcompensating,” she didn’t argue.

By 9pm, Arjun was still at his desk, adjusting fonts, fixing image ratios, and checking how the title slide looked in presentation mode. He sent the final deck at 10:42pm. No one replied.
`,
    questions: [
      {
        id: 1,
        question: "Who felt most like you when you were new?",
        options: ["Arjun", "Chhavi", "Dev"],
      },
      {
        id: 2,
        question: "Who did you relate to — even if you wouldn’t act like them?",
        options: ["Arjun", "Chhavi", "Dev"],
      },
      {
        id: 3,
        question: "Who left you thinking, “I’ve done that too”?",
        options: ["Arjun", "Chhavi", "Dev"],
      },
    ],
  },
  {
    id: 6,
    title: "The Ethics Debate",
    description: `The client wanted numbers changed. Not by much — just enough to make the report “directionally more positive.”

Everyone understood what that meant. But no one said it out loud.

Rhea stared at the Excel cell for a while before saying, “This isn’t what we agreed on.” Silence. Then: “Do you want me to do it, or will someone else?”
No one responded. She clicked 'Save' and walked out for coffee.

Sahil said nothing. He added a comment in the doc — “Need clarity on this input source” — and then muted the thread. Later that night, he removed his name from the author list.

Nitin smoothed his shirt, nodded, and said, “Let’s be pragmatic.” He copied the older baseline, adjusted a few figures, and added a footnote that said “Based on revised inputs.” Then asked the group chat if someone could take over slide design.
`,
    questions: [
      {
        id: 1,
        question:
          "Who felt closest to how you’ve reacted in a sticky situation?",
        options: ["Rhea", "Sahil", "Nitin"],
      },
      {
        id: 2,
        question: "Who made you pause?",
        options: ["Rhea", "Sahil", "Nitin"],
      },
      {
        id: 3,
        question: "Who left you with questions about yourself?",
        options: ["Rhea", "Sahil", "Nitin"],
      },
    ],
  },
  {
    id: 7,
    title: "The Project Switch",
    description: `The lead changed a week before the client call. Just like that. No explanation — just a Slack message: “Varun will now present this one. Please align with him.”

Varun reacted with a and a “Cool, will review by EOD.” By 6pm, he’d renamed the deck Final_Varun_Edits.pptx, cut three “low-impact” slides, added his own intro, and forwarded it to the director with a “Just streamlined a bit. Let me know if this works.”

Lata didn’t blink. She updated the handover doc with bullet points, links, screenshots, even jokes in the comments. Then she deleted the line that said “original framework by Lata (April).” At 9:14pm, she messaged: “Let me know if you need anything else :)” The smiley had been retyped three times.

Om had built half the backend. He left one comment: “Check logic on slide 14.” Didn’t join
the prep call. Logged off at 7:23pm. Next morning, he filled out the internal transfer form
and added “reasons not urgent.”
`,
    questions: [
      {
        id: 1,
        question: "Who did you instantly recognize yourself in?",
        options: ["Varun", "Lata", "Om"],
      },
      {
        id: 2,
        question: "Who made you laugh… and then think?",
        options: ["Varun", "Lata", "Om"],
      },
      {
        id: 3,
        question: "Who did something you’ve done — but never admitted?",
        options: ["Varun", "Lata", "Om"],
      },
    ],
  },
  {
    id: 8,
    title: "The Territory Line",
    description: `Niyati had been shaping the client solution for weeks. She led the brainstorm, named the folder, wrote the first draft. At lunch she said, “Honestly, this project feels like my baby.” The word hung in the air. No one disagreed.

Then the client changed scope. The manager pinged: “Let’s bring in Zubin to add fresh eyes.” Zubin was polite. He commented sparingly, then added a slide with “Possible alternate flow” in bold. When Niyati saw it, she replied: “Let’s keep things focused. We’re already aligned on structure.”

Sana had been quiet for most of the week. Not uninvolved — just everywhere in the
background. She was the one answering client follow-ups. Cleaning up the formatting. Creating backups of each deck version — “just in case.”

When Zubin’s slide appeared and Niyati pushed back, Sana didn’t pick a side. She DM’d them both: “Want me to stitch together a hybrid version? Totally okay either way.” No one replied.

At 10:36 PM, she started merging the slides anyway. Changed colors to match. Removed names from the title. At 12:07 AM, she uploaded it as “Final_v5_Sync.” No comments. Just a emoji from the manager the next morning.
`,
    questions: [
      {
        id: 1,
        question:
          "Who felt most familiar when something you built was touched?",
        options: ["Niyati", "Zubin", "Sana"],
      },
      {
        id: 2,
        question: "Who played it smart — even if it felt political?",
        options: ["Niyati", "Zubin", "Sana"],
      },
      {
        id: 3,
        question: "Who’s playing the middle — and what did it cost?",
        options: ["Niyati", "Zubin", "Sana"],
      },
    ],
  },
];
