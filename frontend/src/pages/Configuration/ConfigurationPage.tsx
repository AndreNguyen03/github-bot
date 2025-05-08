import React, { useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import { defaultUIConfig } from "../../components/utils/DefaultStateConfig";
import { PushYamlParams, TempRepository, UIConfigState } from "../../types";
import { mapUIToBotConfig } from "../../components/utils/MapUIToBotConfig";
import yaml from "js-yaml";
import apiPushYamlToRepo from "../../api";

type UIConfigAction =
  | { type: "SET_BOOLEAN"; key: keyof UIConfigState; value: boolean }
  | { type: "SET_STRING"; key: keyof UIConfigState; value: string }
  | { type: "RESET" };
function uiConfigReducer(
  state: UIConfigState,
  action: UIConfigAction,
): UIConfigState {
  switch (action.type) {
    case "SET_BOOLEAN":
      return { ...state, [action.key]: action.value };
    case "SET_STRING":
      return { ...state, [action.key]: action.value };
    case "RESET":
      return defaultUIConfig;
    default:
      return state;
  }
}

const handlePushYmlFileToARepositoy = async (
  repos: TempRepository,
  yamlResults: string,
  accessToken: string,
) => {
  const params: PushYamlParams = {
    accessToken: accessToken,
    repoOwnerName: repos.owner.login,
    repoName: repos.name,
    branch: "main",
    filePath: ".githubb/bot-config.yml",
    yamlContent: yamlResults,
  };

  await apiPushYamlToRepo(params);
};
const ConfigurationPage = () => {
  const [state, dispatch] = useReducer(uiConfigReducer, defaultUIConfig);
  const location = useLocation();
  const [selectedRepos] = useState(location.state as TempRepository[]);
  //console.log("Selected Repositories:", selectedRepos);
  const handleSave = () => {
    const isStateValid = () => {
      if (
        (state.welcomeCommentIssueEnabled &&
          !state.welcomeCommentIssueMessage) ||
        (state.welcomeCommentPullRequestEnabled &&
          !state.welcomeCommentPullRequestMessage)
      ) {
        alert("Please fill in all required fields.");
        return false;
      }
      return true;
    };

    if (!isStateValid()) {
      return;
    }
    const results = mapUIToBotConfig(state);
    const yamlResults = yaml.dump(results);
    //Gọi hàm bắt file lên github
    if (localStorage.getItem("accessToken")) {
      const accessToken = localStorage.getItem("accessToken")!;
      for (const repo of selectedRepos) {
        handlePushYmlFileToARepositoy(repo, yamlResults, accessToken);
      }
    }
  };
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
            <input
              type="checkbox"
              id="idCheckboxLabelIssue"
              checked={state.autoLabelIssue}
              className="mr-2"
              onChange={(e) =>
                dispatch({
                  type: "SET_BOOLEAN",
                  key: "autoLabelIssue",
                  value: e.target.checked,
                })
              }
            />
            <label htmlFor="idCheckboxLabelIssue" className="mr-4">
              Issue
            </label>
          </div>
        </div>
        <div className="mb-2 items-center">
          <div>
            <input
              type="checkbox"
              id="labelCheckboxPR"
              checked={state.autoLabelPullRequest}
              className="mr-2"
              onChange={(e) =>
                dispatch({
                  type: "SET_BOOLEAN",
                  key: "autoLabelPullRequest",
                  value: e.target.checked,
                })
              }
            />
            <label htmlFor="labelCheckboxPR" className="mr-4">
              Pull Request
            </label>
          </div>
        </div>

        <div className="mb-2 flex items-center">
          <label htmlFor="assignCheckbox" className="mb-4 text-xl font-bold">
            Assign
          </label>
          <input
            type="checkbox"
            id="assignCheckbox"
            className="mr-2"
            checked={state.assign}
            onChange={(e) =>
              dispatch({
                type: "SET_BOOLEAN",
                key: "assign",
                value: e.target.checked,
              })
            }
          />
        </div>
        <div className="mb-2 items-center">
          <h2 className="mb-4 text-xl font-bold">Message Start</h2>
          <div>
            <div>
              <input
                type="checkbox"
                id={"MessageIssueCheckBox"}
                checked={state.welcomeCommentIssueEnabled}
                className="mr-2"
                onChange={(e) =>
                  dispatch({
                    type: "SET_BOOLEAN",
                    key: "welcomeCommentIssueEnabled",
                    value: e.target.checked,
                  })
                }
              />
              <label htmlFor="MessageIssueCheckBox" className="mr-4">
                Issue
              </label>
            </div>
            <input
              type="text"
              placeholder="Enter message start"
              className="w-full border p-3 py-2"
              value={state.welcomeCommentIssueMessage}
              onChange={(e) =>
                dispatch({
                  type: "SET_STRING",
                  key: "welcomeCommentIssueMessage",
                  value: e.target.value,
                })
              }
            />
          </div>
          <div>
            <div>
              <input
                type="checkbox"
                id={"MessagePullRequestCheckBox"}
                checked={state.welcomeCommentPullRequestEnabled}
                className="mr-2"
                onChange={(e) =>
                  dispatch({
                    type: "SET_BOOLEAN",
                    key: "welcomeCommentPullRequestEnabled",
                    value: e.target.checked,
                  })
                }
              />
              <label htmlFor="MessagePullRequestCheckBox" className="mr-4">
                PullRequest
              </label>
            </div>
            <input
              type="text"
              placeholder="Enter message start"
              className="w-full border p-3 py-2"
              value={state.welcomeCommentPullRequestMessage}
              onChange={(e) =>
                dispatch({
                  type: "SET_STRING",
                  key: "welcomeCommentPullRequestMessage",
                  value: e.target.value,
                })
              }
            />
          </div>
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
          <button
            className="bg-green-600 p-1 text-white"
            onClick={() => {
              handleSave();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
