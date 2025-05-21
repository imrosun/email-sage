export default function StatusBadge({ status }) {
  const color = {
    sent: "bg-green-100 text-green-800",
    delivered: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    time_passed: "bg-gray-200 text-gray-800",
  }[status] || "bg-gray-100 text-gray-800";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
