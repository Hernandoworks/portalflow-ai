"use client";

import { useState } from "react";

export default function UploadCard() {
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const uploadFile = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    setLoading(true);

    setMessage("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Upload failed");
        return;
      }

      setMessage("Upload successful");

      if (data?.file?.webViewLink) {
        window.open(
          data.file.webViewLink,
          "_blank"
        );
      }

    } catch (error) {
      console.error(error);

      setMessage("Unexpected upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">
            Upload Files
          </h2>

          <p className="text-zinc-500 mt-2">
            Upload directly into Google Drive.
          </p>
        </div>
      </div>

      <div className="border-2 border-dashed border-zinc-700 rounded-3xl p-16 text-center">

        <div className="text-6xl mb-4">
          ☁️
        </div>

        <h3 className="text-2xl font-bold">
          Select File
        </h3>

        <input
          type="file"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
          className="mt-8"
        />

      </div>

      {file && (
        <div className="mt-8 flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-2xl p-5">

          <div>
            <p className="font-semibold">
              {file.name}
            </p>

            <p className="text-zinc-500 text-sm mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <button
            onClick={uploadFile}
            disabled={loading}
            className="bg-emerald-500 text-black px-6 py-3 rounded-xl font-bold"
          >
            {loading
              ? "Uploading..."
              : "Upload Now"}
          </button>

        </div>
      )}

      {message && (
        <div className="mt-6 text-center text-sm">
          {message}
        </div>
      )}

    </div>
  );
}
