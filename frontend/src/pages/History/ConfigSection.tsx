const ConfigSection: React.FC<{
  title: string;
  isEditMode: boolean;
  enabled: boolean;
  handleChange: (path: string[], value: any) => void;
  children: React.ReactNode;
}> = ({ title, isEditMode, enabled, handleChange, children }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    <input
      type="checkbox"
      checked={enabled}
      disabled={!isEditMode}
      onChange={(e) => handleChange([title.toLowerCase().replace(" ", "_"), "enabled"], e.target.checked)}
    />
    <label className="ml-2">Enable</label>
    {enabled && <div className="ml-4 mt-2 space-y-2">{children}</div>}
  </div>
);

export default ConfigSection;