import { useState } from 'react';
import { HistoryConfig } from '../../types';

const ConfigurationHeader: React.FC<{
  name: string;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  configData: HistoryConfig
  handleSave: (configData: HistoryConfig) => Promise<void>;
}> = ({ name, isEditMode, setIsEditMode, handleSave,configData }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveClick = () => {
    setShowModal(true);
  };

  const confirmSave = async () => {
    setIsLoading(true);
    try {
      await handleSave(configData);
      setShowModal(false);
      setIsEditMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4 flex justify-between px-10">
      <h2 className="text-2xl font-bold">{name}</h2>
      <div className="space-x-3">
        <button className="rounded-lg bg-blue-600 px-4 py-1 text-white">
          Reuse
        </button>
        {isEditMode ? (
          <button
            className="rounded-lg bg-green-600 px-4 py-1 text-white "
            onClick={handleSaveClick}
            disabled={isLoading}
          >
            Save
          </button>
        ) : (
          <button
            className="rounded-lg bg-yellow-500 px-4 py-1 text-white " 
            onClick={() => setIsEditMode(true)}
          >
            Update
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[20rem] rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Confirm Save</h3>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to save these changes?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400"
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 flex items-center gap-2"
                onClick={confirmSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationHeader;