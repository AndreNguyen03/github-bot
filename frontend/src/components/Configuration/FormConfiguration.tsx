import { useReducer } from "react";
import yaml from "js-yaml";
import { useNotification } from "../../provider/NotificationProvider";

import { PushYamlParams, TempRepository, UIConfigState } from "../../types";
import apiPushYamlToRepo from "../../api";
import { defaultUIConfig } from "../utils/DefaultStateConfig";
import { mapUIToBotConfig } from "../utils/MapUIToBotConfig";
import { useNavigate } from "react-router-dom";
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
    filePath: `.github/bot-config-${1196922}.yml`,
    yamlContent: yamlResults,
  };

  const boolean = await apiPushYamlToRepo(params);
  return boolean;
};
const FormConfiguration = ({
  selectedRepos,
}: {
  selectedRepos: TempRepository[];
}) => {
  const [state, dispatch] = useReducer(uiConfigReducer, defaultUIConfig);
  const navigate = useNavigate();
  const { notify } = useNotification();
  const handleSave = async () => {
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
        if (await handlePushYmlFileToARepositoy(repo, yamlResults, accessToken))
          notify("Lưu thành công");
      }
    }
  };
  return (
    <div className="config-cluster inline-block w-full rounded-[1rem] bg-gray-100 p-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-md font-bold">Label</h2>
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
      <div className="flex items-center gap-2">
        <label htmlFor="assignCheckbox" className="text-md font-bold">
          Assign
        </label>
        <input
          type="checkbox"
          id="assignCheckbox"
          className="h-3.5 w-3.5"
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
      <div className="mb-2 flex flex-col gap-2">
        <h2 className="text-md font-bold">Message Start</h2>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
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
        <div className="flex flex-col gap-2">
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

      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-md font-bold">Changed Summary In Pullrequest</h2>
        <input type="checkbox" className="h-4 w-4" />
      </div>
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-md font-bold">Send message to discord</h2>
        <input type="checkbox" className="h-4 w-4" />
      </div>
      <div className="flex items-center justify-center space-x-5">
        <button
          className="rounded-[5px] bg-gray-400 p-1 px-4 py-2 font-bold text-white"
          onClick={() => {
            dispatch({ type: "RESET" });
            if (
              !window.confirm(
                `Are you sure you want to navigate to repository page?`,
              )
            ) {
              return;
            }
            navigate("/repositories");
          }}
        >
          Cancel
        </button>
        <button
          className="rounded-[5px] bg-green-600 px-4 py-2 font-bold text-white"
          onClick={() => {
            handleSave();
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default FormConfiguration;
