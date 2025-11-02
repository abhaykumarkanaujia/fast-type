export default function CompetingInstruction() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <h4 className="text-lg font-medium mb-2 text-cyan-400">Instructions:</h4>
      <ul className="text-gray-300 space-y-1">
        {/* 
        Progress Won't be save and result will be unvalid for leaderboard without login, but you can still see your word per minute and accuracy
        */}
        <li>
          • If You’re not logged in, your progress and leaderboard score won’t
          be saved.
        </li>
        <li>
          • Even without loging in, You can view your WPM and accuracy after
          each test.
        </li>
        <li>• Type the sentence exactly as shown above</li>
        <li>
          • Choose your difficulty level: Easy (common words), Medium
          (intermediate), or Hard (advanced)
        </li>
        <li>
          • Click &quot;New Sentence&quot; to practice with different text
        </li>
        <li>
          • Each difficulty level offers thousands of unique words for endless
          practice
        </li>
        <li>• Focus on accuracy and speed to improve your typing skills</li>
      </ul>
    </div>
  );
}
