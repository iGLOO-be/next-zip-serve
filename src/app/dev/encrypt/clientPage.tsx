"use client";

import { useEffect, useState } from "react";

export default function ClientPage({
  encryptString,
}: {
  encryptString: (value: string) => Promise<string>;
}) {
  const [data, setData] = useState("");
  const [encrypted, setEncrypted] = useState("");

  useEffect(() => {
    encryptString(data).then(setEncrypted).catch(console.error);
  }, [encryptString, data]);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your data"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <h2>Encrypted secret</h2>
      <pre>{encrypted}</pre>
    </div>
  );
}
