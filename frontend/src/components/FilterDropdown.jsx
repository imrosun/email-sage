import React from 'react';

export default function FilterDropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="all">All</option>
      <option value="pending">Pending</option>
      <option value="sent">Sent</option>
      <option value="failed">Failed</option>
      <option value="time_passed">Time Passed</option>
    </select>
  );
}
