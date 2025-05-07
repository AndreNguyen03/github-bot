import React from "react";
import { useLocation } from "react-router-dom";
import CheckBoxLabelInput from "../../components/utils/CheckBoxLabelInput";
const ConfigurationPage = () => {
  const location = useLocation();
  const selectedRepos = location.state;
  console.log("Selected Repositories:", selectedRepos);
  return (
    <div className="mb-4 flex h-full w-full flex-col justify-between">
      <div className="mb-4 flex justify-between">
        <h2 className="inline-block text-2xl font-bold">Configuration</h2>
        <h2 className="inline-block text-2xl font-bold">{}</h2>
      </div>
      <div className="config-cluster ml-[20rem] mr-[20rem] inline-block rounded-[1rem] bg-gray-100 p-5">
        <div className="mb-2 items-center">
          <h2 className="mb-4 text-xl font-bold">Label</h2>
          <div>
            <input type="checkbox" id="idCheckboxIssue" className="mr-2" />
            <label htmlFor="idCheckboxIssue" className="mr-4">
              Issue
            </label>
          </div>
        </div>
        <div className="mb-2 items-center">
          <div>
            <input type="checkbox" id="labelCheckboxPR" className="mr-2" />
            <label htmlFor="labelCheckboxPR" className="mr-4">
              Pull Request
            </label>
          </div>
        </div>
        <h2 className="mb-4 text-xl font-bold">Assign</h2>
        <div className="mb-2 flex items-center">
          <input type="checkbox" id="assignCheckbox1" className="mr-2" />
          <label htmlFor="assignCheckbox1" className="mr-4">
            Leader
          </label>
        </div>
        <div className="mb-2 flex items-center">
          <input type="checkbox" id="assignCheckbox2" className="mr-2" />
          <label htmlFor="assignCheckbox2" className="mr-4">
            The best contributor
          </label>
        </div>
        <div className="mb-2 items-center">
          <h2 className="mb-4 text-xl font-bold">Message Start</h2>
          <CheckBoxLabelInput label="Issue" placeholder="Enter start message" />
        </div>
        <div className="mb-2 items-center">
          <CheckBoxLabelInput
            label="Pull Request"
            placeholder="Enter start message"
          />
        </div>
        <div className="mb-2 flex items-center">
          <h2 className="mb-4 text-xl font-bold">
            Changed Summary In Pullrequest
          </h2>
          <input type="checkbox" className="mr-2" />
        </div>
        <div className="mb-2 flex items-center">
          <h2 className="mb-4 text-xl font-bold">Send message to discord</h2>
          <input type="checkbox" className="mr-2" />
        </div>
        <input type="text" placeholder="Enter label" className="border p-1" />
        <div className="flex items-center justify-center space-x-5">
          <button className="bg-gray-400 p-1 text-gray-700">Cancel</button>
          <button className="bg-green-600 p-1 text-white">Save</button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
