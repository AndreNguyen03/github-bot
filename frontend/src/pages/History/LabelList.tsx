const LabelList: React.FC<{
  labels: string[];
  isEditMode: boolean;
  newLabel: string;
  setNewLabel: (value: string) => void;
  handleAdd: () => void;
  handleDelete: (label: string) => void;
}> = ({ labels, isEditMode, newLabel, setNewLabel, handleAdd, handleDelete }) => (
  <div>
    {isEditMode ? (
      <div className="flex items-center">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Enter label"
          className="my-1 w-full resize-none overflow-hidden break-words rounded border border-gray-300 px-2 py-1 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="ml-2 rounded-r-md bg-green-500 p-2 text-white transition duration-200 hover:bg-green-700"
        >
          Add
        </button>
      </div>
    ) : (
      labels.join(", ")
    )}
    {isEditMode && (
      <ul className="mt-4 list-disc pl-6">
        {labels.map((label, index) => (
          <li key={index} className="flex items-center justify-between">
            <span className="my-1 rounded border-2 p-2">{label}</span>
            <button
              onClick={() => handleDelete(label)}
              className="ml-2 rounded bg-red-500 px-2 py-1 transition duration-200 hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);
export default LabelList;