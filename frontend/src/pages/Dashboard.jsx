import React, { useState } from "react";
import useEmails from "../hooks/useEmail";
import EmailTable from "../components/EmailTable";
import FilterDropdown from "../components/FilterDropdown";

export default function Dashboard() {
  const [status, setStatus] = useState("all");
  const emails = useEmails(status);

  return (
    <div className="mt-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Scheduled Emails</h2>
        <FilterDropdown value={status} onChange={setStatus} />
      </div>
      <EmailTable emails={emails} />
    </div>
  );
}
