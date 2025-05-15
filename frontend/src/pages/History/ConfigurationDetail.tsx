import AutoResizeTextarea from "../../components/utils/AutoResizeTextarea";
import { HistoryConfig } from "../../types";
import ConfigSection from "./ConfigSection";
import LabelList from "./LabelList";

// ConfigurationDetail Component
const ConfigurationDetail: React.FC<{
  isEditMode: boolean;
  configData: HistoryConfig;
  handleChange: (path: string[], value: any) => void;
  newIssueLabel: string;
  setNewIssueLabel: (value: string) => void;
  newPRLabel: string;
  setNewPRLabel: (value: string) => void;
  newEvent: string;
  setNewEvent: (value: string) => void;
  handleIssueLabelAdd: () => void;
  handlePRLabelAdd: () => void;
  handleEventAdd: () => void;
  handleIssueLabelDelete: (label: string) => void;
  handlePRLabelDelete: (label: string) => void;
  handleEventDelete: (event: string) => void;
}> = ({
  isEditMode,
  configData,
  handleChange,
  newIssueLabel,
  setNewIssueLabel,
  newPRLabel,
  setNewPRLabel,
  newEvent,
  setNewEvent,
  handleIssueLabelAdd,
  handlePRLabelAdd,
  handleEventAdd,
  handleIssueLabelDelete,
  handlePRLabelDelete,
  handleEventDelete,
}) => (
  <div className="relative flex-1 rounded-[1rem] bg-gray-100 p-5">
    {!isEditMode && (
      <div className="pointer-events-auto absolute inset-0 z-10 rounded-[1rem] bg-black/10" />
    )}
    <div className={`${!isEditMode ? "opacity-60" : ""}`}>
      <h2 className="mb-4 text-xl font-bold">Configuration Detail</h2>

      {/* Welcome Comment */}
      <ConfigSection
        title="Welcome Comment"
        isEditMode={isEditMode}
        enabled={configData.config.welcome_comment.enabled}
        handleChange={handleChange}
      >
        <div>
          <strong>Issue:</strong>{" "}
          {isEditMode ? (
            <AutoResizeTextarea
              value={configData.config.welcome_comment.issue.message}
              onChange={(val) =>
                handleChange(["welcome_comment", "issue", "message"], val)
              }
            />
          ) : (
            configData.config.welcome_comment.issue.message
          )}
        </div>
        <div>
          <strong>PR:</strong>{" "}
          {isEditMode ? (
            <AutoResizeTextarea
              value={configData.config.welcome_comment.pull_request.message}
              onChange={(val) =>
                handleChange(
                  ["welcome_comment", "pull_request", "message"],
                  val,
                )
              }
            />
          ) : (
            configData.config.welcome_comment.pull_request.message
          )}
        </div>
      </ConfigSection>

      {/* Auto Label */}
      <ConfigSection
        title="Auto Label"
        isEditMode={isEditMode}
        enabled={configData.config.auto_label.enabled}
        handleChange={handleChange}
      >
        <p className="mb-2">
          <strong>Issue Labels: </strong>
        </p>
        <LabelList
          labels={configData.config.auto_label.issue.labels}
          isEditMode={isEditMode}
          newLabel={newIssueLabel}
          setNewLabel={setNewIssueLabel}
          handleAdd={handleIssueLabelAdd}
          handleDelete={handleIssueLabelDelete}
        />
        <p className="my-2">
          <strong>Pull Request Labels: </strong>
        </p>
        <LabelList
          labels={configData.config.auto_label.pull_request.labels}
          isEditMode={isEditMode}
          newLabel={newPRLabel}
          setNewLabel={setNewPRLabel}
          handleAdd={handlePRLabelAdd}
          handleDelete={handlePRLabelDelete}
        />
      </ConfigSection>

      {/* Auto Assign */}
      <ConfigSection
        title="Auto Assign"
        isEditMode={isEditMode}
        enabled={configData.config.auto_assign.enabled}
        handleChange={handleChange}
        children={null}
      />

      {/* Discord Notifications */}
      <ConfigSection
        title="Discord Notifications"
        isEditMode={isEditMode}
        enabled={configData.config.discord_notifications.enabled}
        handleChange={handleChange}
      >
        <p>
          <strong>Webhook URL:</strong>{" "}
        </p>

        {isEditMode ? (
          <AutoResizeTextarea
            value={configData.config.discord_notifications.webhook_url}
            onChange={(val) =>
              handleChange(["discord_notifications", "webhook_url"], val)
            }
          />
        ) : (
          configData.config.discord_notifications.webhook_url
        )}
        <p className="my-2">
          <strong>Events: </strong>
        </p>

        <LabelList
          labels={configData.config.discord_notifications.events}
          isEditMode={isEditMode}
          newLabel={newEvent}
          setNewLabel={setNewEvent}
          handleAdd={handleEventAdd}
          handleDelete={handleEventDelete}
        />
      </ConfigSection>

      {/* PR Summary */}
      <ConfigSection
        title="PR Summary"
        isEditMode={isEditMode}
        enabled={configData.config.pr_summary.enabled}
        handleChange={handleChange}
      >
        <p>
          <strong>Max Length:</strong>{" "}
        </p>

        {isEditMode ? (
          <AutoResizeTextarea
            value={configData.config.pr_summary.max_length.toString()}
            onChange={(val) =>
              handleChange(["pr_summary", "max_length"], Number(val))
            }
          />
        ) : (
          configData.config.pr_summary.max_length
        )}
      </ConfigSection>

      {/* Scan */}
      <ConfigSection
        title="Scan"
        isEditMode={isEditMode}
        enabled={configData.config.scan.enabled}
        handleChange={handleChange}
      >
        <div>
          <strong>Issue Prompt:</strong>{" "}
          {isEditMode ? (
            <AutoResizeTextarea
              value={configData.config.scan.issue.prompt}
              onChange={(val) => handleChange(["scan", "issue", "prompt"], val)}
            />
          ) : (
            configData.config.scan.issue.prompt
          )}
        </div>
        <div>
          <strong>PR Prompt:</strong>{" "}
          {isEditMode ? (
            <AutoResizeTextarea
              value={configData.config.scan.pull_request.prompt}
              onChange={(val) =>
                handleChange(["scan", "pull_request", "prompt"], val)
              }
            />
          ) : (
            configData.config.scan.pull_request.prompt
          )}
        </div>
      </ConfigSection>
    </div>
  </div>
);
export default ConfigurationDetail;
