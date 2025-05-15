import { useLocation } from "react-router-dom";
import { useState } from "react";
import { HistoryConfig } from "../../types";
import UsedRepositories from "./UsedRepositories";
import ConfigurationDetail from "./ConfigurationDetail";
import ConfigurationHeader from "./ConfigurationHeader";

const ConfigurationHistoryPage = () => {
  const location = useLocation();
  const configHistoryData = location.state as HistoryConfig;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [configData, setConfigData] =
    useState<HistoryConfig>(configHistoryData);
  const [newIssueLabel, setNewIssueLabel] = useState<string>("");
  const [newPRLabel, setNewPRLabel] = useState<string>("");
  const [newEvent, setNewEvent] = useState<string>("");

  const handleChange = (path: string[], value: any) => {
    setConfigData((prev) => {
      const newData = { ...prev };
      let obj: any = newData.config;
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return newData;
    });
  };

  const handleSave = async (configData: HistoryConfig) => {
  try {
    const response = await fetch(`http://localhost:3001/api/config-history/${configData._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(configData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update config: ${response.statusText}`);
    }

    const updatedConfig = await response.json();
    console.log(`Successfully saved config with ID: ${configData._id}`, updatedConfig);

    return updatedConfig;
  } catch (error :any) {
    console.error(`Error saving config with ID: ${configData._id}`, error.message);
    throw error;
  }
};

  const handleEventAdd = () => {
    console.log(configData.config.discord_notifications.events);
    if (newEvent.trim() === "") return;
    setConfigData((prev) => {
      const eventExists =
        prev.config.discord_notifications.events.includes(newEvent);
      if (eventExists) return prev;
      const updatedEvents = [
        ...prev.config.discord_notifications.events,
        newEvent,
      ];
      return {
        ...prev,
        config: {
          ...prev.config,
          discord_notifications: {
            ...prev.config.discord_notifications,
            events: updatedEvents,
          },
        },
      };
    });
    setNewIssueLabel("");
  };

  const handleEventDelete = (eventToDelete: string) => {
    setConfigData((prev) => {
      const updatedEvents = prev.config.discord_notifications.events.filter(
        (event) => event !== eventToDelete,
      );
      return {
        ...prev,
        config: {
          ...prev.config,
          discord_notifications: {
            ...prev.config.discord_notifications,
            events: updatedEvents,
          },
        },
      };
    });
  };

  const handleIssueLabelAdd = () => {
    if (newIssueLabel.trim() === "") return;
    setConfigData((prev) => {
      const labelExists =
        prev.config.auto_label.issue.labels.includes(newIssueLabel);
      if (labelExists) return prev;
      const updatedLabels = [
        ...prev.config.auto_label.issue.labels,
        newIssueLabel,
      ];
      return {
        ...prev,
        config: {
          ...prev.config,
          auto_label: {
            ...prev.config.auto_label,
            issue: {
              ...prev.config.auto_label.issue,
              labels: updatedLabels,
            },
          },
        },
      };
    });
    setNewIssueLabel("");
  };

  const handlePRLabelAdd = () => {
    if (newPRLabel.trim() === "") return;
    setConfigData((prev) => {
      const labelExists =
        prev.config.auto_label.pull_request.labels.includes(newPRLabel);
      if (labelExists) return prev;
      const updatedLabels = [
        ...prev.config.auto_label.pull_request.labels,
        newPRLabel,
      ];
      return {
        ...prev,
        config: {
          ...prev.config,
          auto_label: {
            ...prev.config.auto_label,
            pull_request: {
              ...prev.config.auto_label.pull_request,
              labels: updatedLabels,
            },
          },
        },
      };
    });
    setNewPRLabel("");
  };

  const handleIssueLabelDelete = (labelToDelete: string) => {
    setConfigData((prev) => {
      const updatedLabels = prev.config.auto_label.issue.labels.filter(
        (label) => label !== labelToDelete,
      );
      return {
        ...prev,
        config: {
          ...prev.config,
          auto_label: {
            ...prev.config.auto_label,
            issue: {
              ...prev.config.auto_label.issue,
              labels: updatedLabels,
            },
          },
        },
      };
    });
  };

  const handlePRLabelDelete = (labelToDelete: string) => {
    setConfigData((prev) => {
      const updatedLabels = prev.config.auto_label.pull_request.labels.filter(
        (label) => label !== labelToDelete,
      );
      return {
        ...prev,
        config: {
          ...prev.config,
          auto_label: {
            ...prev.config.auto_label,
            pull_request: {
              ...prev.config.auto_label.pull_request,
              labels: updatedLabels,
            },
          },
        },
      };
    });
  };

  function handleDeleteRepo(id: string): void {
    const updatedRepos = configData.usedRepos.filter((repo) => repo.id !== id);
    setConfigData((prev) => ({
      ...prev,
      usedRepos: updatedRepos,
    }));
  }

  return (
    <div className="mb-4 flex h-full w-full flex-col justify-between">
      <ConfigurationHeader
        name={configData.name}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        handleSave={handleSave}
        configData={configData}
      />
      <div className="flex gap-10 px-10">
        <ConfigurationDetail
          isEditMode={isEditMode}
          configData={configData}
          handleChange={handleChange}
          newIssueLabel={newIssueLabel}
          setNewIssueLabel={setNewIssueLabel}
          newPRLabel={newPRLabel}
          setNewPRLabel={setNewPRLabel}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleIssueLabelAdd={handleIssueLabelAdd}
          handlePRLabelAdd={handlePRLabelAdd}
          handleEventAdd={handleEventAdd}
          handleIssueLabelDelete={handleIssueLabelDelete}
          handlePRLabelDelete={handlePRLabelDelete}
          handleEventDelete={handleEventDelete}
        />
        <UsedRepositories
          repos={configData.usedRepos}
          handleDeleteRepo={handleDeleteRepo}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
};

export default ConfigurationHistoryPage;
