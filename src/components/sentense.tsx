export default function Sentence({
  sentence,
  userInput,
  getCharacterStatus,
}: {
  sentence: string;
  userInput: string;
  getCharacterStatus: (index: number) => string;
}) {
  const chars = sentence.split("");
  const extraChars =
    userInput.length > sentence.length ? userInput.slice(sentence.length) : "";
  return (
    <div className="text-lg leading-relaxed font-mono flex flex-wrap">
      {chars.map((char, index) => {
        const status = getCharacterStatus(index);
        let colorClass = "text-white";

        if (status === "correct") {
          colorClass = "text-emerald-400";
        } else if (status === "incorrect") {
          colorClass = "text-red-300 bg-red-500/20 rounded px-0.5";
        }

        const isCurrentChar = index === userInput.length;
        const cursorClass = isCurrentChar ? "border-l-2 border-cyan-400" : "";

        return (
          <span
            key={index}
            className={`${colorClass} ${cursorClass} ${char === " " ? "mx-0.5" : ""}`}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
      {extraChars && (
        <span className="text-red-400 bg-red-400/30 rounded px-1 border-b-2 border-red-500">
          {extraChars.split("").map((char, i) => (
            <span key={`extra-${i}`}>{char === " " ? "\u00A0" : char}</span>
          ))}
        </span>
      )}
    </div>
  );
}
