"use client";

import { useParams } from "next/navigation";

import {
  useState,
  useEffect,
} from "react";

import { useDropzone } from "react-dropzone";

import QRCode from "qrcode";

export default function UploadPortalPage() {
  const params = useParams();

  const portalId = params.portalId;

  const [portal, setPortal] =
    useState<any>(null);

  const [portalExists, setPortalExists] =
    useState(true);

  const [loadingPortal, setLoadingPortal] =
    useState(true);

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [referenceId, setReferenceId] =
    useState("");

  const [driveLink, setDriveLink] =
    useState("");

  const [qrCode, setQrCode] =
    useState("");

  const [senderName, setSenderName] =
    useState("");

  const [senderEmail, setSenderEmail] =
    useState("");

  const [senderCompany, setSenderCompany] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [passwordInput, setPasswordInput] =
    useState("");

  const [accessGranted, setAccessGranted] =
    useState(false);

  useEffect(() => {
    fetch("/api/portals/list")
      .then((res) => res.json())
      .then(async (data) => {

        const found = (
          data.portals || []
        ).find(
          (p: any) =>
            p.slug === portalId
        );

        if (!found) {
          setPortalExists(false);
        } else {

          setPortal(found);

          const qr =
            await QRCode.toDataURL(
              window.location.href
            );

          setQrCode(qr);

          if (!found.password) {
            setAccessGranted(true);
          }
        }

        setLoadingPortal(false);
      });
  }, [portalId]);

  const uploadFile = async () => {
    if (!file) {
      setMessage(
        "Please select a file"
      );

      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      formData.append(
        "portalId",
        String(portalId)
      );

      formData.append(
        "senderName",
        senderName
      );

      formData.append(
        "senderEmail",
        senderEmail
      );

      formData.append(
        "senderCompany",
        senderCompany
      );

      formData.append(
        "notes",
        notes
      );

      const res = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(
          data.error ||
            "Upload failed"
        );

        return;
      }

      setMessage(
        "Upload successful"
      );

      setReferenceId(
        data.referenceId
      );

      setDriveLink(
        data.file.webViewLink
      );

    } catch (error) {
      console.error(error);

      setMessage(
        "Unexpected upload error"
      );
    } finally {
      setLoading(false);
    }
  };

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setFile(
          acceptedFiles[0]
        );
      }
    },
  });

  if (loadingPortal) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Loading portal...
      </main>
    );
  }

  if (!portalExists) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">

        <div className="max-w-2xl text-center">

          <div className="text-7xl mb-8">
            📂
          </div>

          <h1 className="text-5xl font-black">
            Portal Not Found
          </h1>

          <a
            href="/create-portal"
            className="inline-block mt-10 bg-white text-black px-8 py-4 rounded-2xl font-bold"
          >
            Create Portal
          </a>

        </div>

      </main>
    );
  }

  if (
    portal.expiryDate &&
    new Date(portal.expiryDate) <
      new Date()
  ) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        This portal has expired.
      </main>
    );
  }

  if (
    portal.password &&
    !accessGranted
  ) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">

        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

          <h1 className="text-4xl font-black">
            Protected Portal
          </h1>

          <p className="text-zinc-500 mt-4">
            Enter portal password
          </p>

          <input
            type="password"
            value={passwordInput}
            onChange={(e) =>
              setPasswordInput(
                e.target.value
              )
            }
            className="w-full mt-8 bg-zinc-950 border border-zinc-800 rounded-2xl p-4"
          />

          <button
            onClick={() => {
              if (
                passwordInput ===
                portal.password
              ) {
                setAccessGranted(
                  true
                );
              }
            }}
            className="w-full mt-6 bg-white text-black py-4 rounded-2xl font-bold"
          >
            Access Portal
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-20">

      <div className="max-w-3xl mx-auto">

        <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-12">

          <div className="text-center">

            <div className="inline-flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-full text-sm mb-8">

              Secure Upload Portal

            </div>

            <h1 className="text-6xl font-black">
              {portal.name}
            </h1>

            <p className="text-zinc-500 text-xl mt-6 leading-relaxed">
              {portal.description}
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">

            <input
              placeholder="Your Name"
              value={senderName}
              onChange={(e) =>
                setSenderName(
                  e.target.value
                )
              }
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4"
            />

            <input
              placeholder="Your Email"
              value={senderEmail}
              onChange={(e) =>
                setSenderEmail(
                  e.target.value
                )
              }
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4"
            />

          </div>

          <input
            placeholder="Company"
            value={senderCompany}
            onChange={(e) =>
              setSenderCompany(
                e.target.value
              )
            }
            className="w-full mt-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-4"
          />

          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
            className="w-full mt-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 min-h-[120px]"
          />

          <div
            {...getRootProps()}
            className="mt-10 border-2 border-dashed border-zinc-700 rounded-3xl p-20 text-center cursor-pointer hover:border-zinc-500 transition-all"
          >

            <input
              {...getInputProps()}
            />

            <div className="text-7xl mb-6">
              ☁️
            </div>

            <h2 className="text-3xl font-black">
              Drag & Drop Files
            </h2>

            <p className="text-zinc-500 mt-4">
              or click to browse files
            </p>

          </div>

          {file && (

            <div className="mt-8 bg-zinc-950 border border-zinc-800 rounded-2xl p-6">

              <div className="flex items-center justify-between">

                <div>

                  <div className="font-bold">
                    {file.name}
                  </div>

                  <div className="text-zinc-500 text-sm mt-2">
                    {(
                      file.size /
                      1024 /
                      1024
                    ).toFixed(2)} MB
                  </div>

                </div>

                <button
                  onClick={uploadFile}
                  disabled={loading}
                  className="bg-white text-black px-6 py-4 rounded-2xl font-bold"
                >
                  {loading
                    ? "Uploading..."
                    : "Upload"}
                </button>

              </div>

            </div>

          )}

          {message && (

            <div className="mt-10 bg-zinc-950 border border-zinc-800 rounded-3xl p-8 text-center">

              <div className="text-5xl mb-6">
                🎉
              </div>

              <h2 className="text-4xl font-black">
                {message}
              </h2>

              <div className="mt-6 text-zinc-500">

                Reference ID:
                {" "}
                {referenceId}

              </div>

              {driveLink && (

                <a
                  href={driveLink}
                  target="_blank"
                  className="inline-block mt-8 bg-white text-black px-8 py-4 rounded-2xl font-bold"
                >
                  Open Uploaded File
                </a>

              )}

            </div>

          )}

          {qrCode && (

            <div className="mt-14 text-center">

              <div className="text-zinc-500 mb-4">
                Share Portal
              </div>

              <img
                src={qrCode}
                alt="QR"
                className="mx-auto w-40 h-40 rounded-2xl"
              />

            </div>

          )}

        </div>

      </div>

    </main>
  );
}
