import { useEffect, useState } from "react";
import { HistoryConfig } from "../../types";
import HistoryItem from "./HistoryItem";

const HistoryList = () => {
  const [histories, setHistories] = useState<HistoryConfig[]>([]);

  useEffect(() => {
    const fetchHistories = async () => {
      const res = await fetch("http://localhost:3001/api/config-history");
      const data = await res.json();
      setHistories(data);
    };
    fetchHistories();
  }, []);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Histories</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {histories.map((history,index) => (
          <HistoryItem key={index} history={history} />
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
