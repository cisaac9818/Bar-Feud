import React, { useState } from 'react';

interface TeamNameEditorProps {
  team1Name: string;
  team2Name: string;
  onUpdate: (team1: string, team2: string) => void;
}

export const TeamNameEditor: React.FC<TeamNameEditorProps> = ({ team1Name, team2Name, onUpdate }) => {
  const [name1, setName1] = useState(team1Name);
  const [name2, setName2] = useState(team2Name);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(name1, name2);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border-4 border-orange-600 space-y-4">
      <h3 className="text-2xl font-black text-orange-400 uppercase text-center">Team Names</h3>
      
      {!isEditing ? (
        <div className="space-y-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-400">Team 1</div>
            <div className="text-xl font-bold text-white">{team1Name}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-400">Team 2</div>
            <div className="text-xl font-bold text-white">{team2Name}</div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            Edit Names
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            placeholder="Team 1 Name"
            className="w-full p-3 rounded bg-gray-700 text-white font-bold"
            required
          />
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            placeholder="Team 2 Name"
            className="w-full p-3 rounded bg-gray-700 text-white font-bold"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
