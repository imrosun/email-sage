import { useState, useEffect } from "react";
import { fetchEmails } from "../api/emailApi";

export default function useEmails(status) {
  const [emails, setEmails] = useState([]);
  useEffect(() => {
    fetchEmails(status).then(setEmails);
    const interval = setInterval(() => fetchEmails(status).then(setEmails), 5000);
    return () => clearInterval(interval);
  }, [status]);
  return emails;
}
