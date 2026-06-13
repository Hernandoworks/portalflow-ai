"use client";

import { useEffect, useState } from "react";

export default function UploadHistoryPage() {
  const [uploads, setUploads] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/uploads/history")
      .then((res) => res.json())
      .then((data) => {
        setUploads(data.uploads || []);
      });
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-12">

          <h1 className="text-5xl font-black">
            Upload History
          </h1>

          <p className="text-zinc-500 mt-4 text-lg">
            Track uploaded files and references.
          </p>

        </div>

        <div className="space-y-4">

          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex items-center justify-between"
            >

              <div>

                <h2 className="text-xl font-bold">
                  {upload.fileName}
                </h2>

                <div className="text-zinc-500 mt-2 text-sm space-y-1">

                  <div>
                    Portal:
                    {" "}
                    {upload.portalId}
                  </div>

                  <div>
                    Ref:
                    {" "}
                    {upload.referenceId}
                  </div>

                  <div>
                    Uploaded:
                    {" "}
                    {new Date(
                      upload.uploadedAt
                    ).toLocaleString()}
                  </div>

                </div>

              </div>

              <a
                href={upload.driveLink}
                target="_blank"
                className="bg-emerald-500 text-black px-5 py-3 rounded-xl font-bold"
              >
                Open File
              </a>

            </div>
          ))}

        </div>

      </div>

    </main>
  );
}
