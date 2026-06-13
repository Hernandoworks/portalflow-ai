"use client";

import { useState } from "react";

const templates = [
  {
    name: "Supplier Onboarding",
    description:
      "Collect supplier onboarding documents",
    icon: "📦",
  },

  {
    name: "Job Applications",
    description:
      "Receive resumes and applications",
    icon: "💼",
  },

  {
    name: "Client Intake",
    description:
      "Collect client project files",
    icon: "🤝",
  },

  {
    name: "Compliance Submission",
    description:
      "Collect governance and compliance docs",
    icon: "🛡️",
  },

  {
    name: "General Upload Portal",
    description:
      "Simple public upload workflow",
    icon: "☁️",
  },
];

export default function CreatePortalPage() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<any>(null);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [portal, setPortal] =
    useState<any>(null);

  const createPortal = async () => {
    if (!name) return;

    setLoading(true);

    try {
      const res = await fetch(
        "/api/portals/create",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            description,
            template:
              selectedTemplate?.name,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error || "Failed"
        );

        return;
      }

      setPortal(data.portal);

    } catch (error) {
      console.error(error);

      alert("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-20">

      <div className="max-w-6xl mx-auto">

        {!portal ? (

          <>

            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-sm mb-8">

                🚀 Create Workflow Portal

              </div>

              <h1 className="text-7xl font-black leading-[0.95]">

                What Are You
                <br />

                Collecting?

              </h1>

              <p className="text-zinc-500 text-2xl mt-8 leading-relaxed">

                Create secure workflow-based upload
                portals connected directly to Google Drive.

              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-16">

              {templates.map((template) => (

                <button
                  key={template.name}
                  onClick={() => {
                    setSelectedTemplate(
                      template
                    );

                    setName(
                      template.name
                    );

                    setDescription(
                      template.description
                    );
                  }}
                  className={
                    selectedTemplate?.name ===
                    template.name
                      ? "bg-white text-black rounded-3xl p-8 text-left transition-all scale-[1.02]"
                      : "bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-left hover:border-zinc-600 transition-all"
                  }
                >

                  <div className="text-5xl mb-6">
                    {template.icon}
                  </div>

                  <h3 className="text-2xl font-bold">
                    {template.name}
                  </h3>

                  <p className="mt-4 opacity-70 leading-relaxed">
                    {template.description}
                  </p>

                </button>

              ))}

            </div>

            {selectedTemplate && (

              <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-10 mt-16 max-w-3xl">

                <h2 className="text-4xl font-black">
                  Configure Portal
                </h2>

                <div className="space-y-6 mt-10">

                  <input
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-lg"
                  />

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 min-h-[140px] text-lg"
                  />

                  <button
                    onClick={createPortal}
                    disabled={loading}
                    className="w-full bg-white text-black py-5 rounded-2xl text-lg font-bold"
                  >
                    {loading
                      ? "Creating..."
                      : "Create Upload Portal"}
                  </button>

                </div>

              </div>

            )}

          </>

        ) : (

          <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-[32px] p-12 text-center">

            <div className="text-7xl mb-8">
              🎉
            </div>

            <h1 className="text-6xl font-black">
              Portal Ready
            </h1>

            <p className="text-zinc-500 text-xl mt-8 leading-relaxed">

              Your upload workflow is now live and
              connected to Google Drive.

            </p>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mt-12 text-left break-all">

              <div className="text-zinc-500 text-sm mb-3">
                Public Upload Link
              </div>

              <div className="font-medium">
                {window.location.origin}/upload/{portal.slug}
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">

              <a
                href={`/upload/${portal.slug}`}
                target="_blank"
                className="bg-white text-black py-4 rounded-2xl font-bold"
              >
                Open Portal
              </a>

              <a
                href={portal.folderLink}
                target="_blank"
                className="bg-zinc-800 py-4 rounded-2xl font-bold"
              >
                Open Folder
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/upload/${portal.slug}`
                  );
                }}
                className="bg-zinc-800 py-4 rounded-2xl font-bold"
              >
                Copy Link
              </button>

            </div>

          </div>

        )}

      </div>

    </main>
  );
}
