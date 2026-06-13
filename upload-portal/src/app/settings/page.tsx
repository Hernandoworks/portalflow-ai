"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [tokenData, setTokenData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (session) {
      fetch("/api/auth/token")
        .then((r) => r.json())
        .then(setTokenData);
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Google Drive Connector Setup</h1>

      {!session ? (
        <div>
          <p className="mb-4">
            Sign in with Google to generate the refresh token needed for the
            PortalFlow Drive connector.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            This will request access to Google Drive, Sheets, Docs, and Apps Script.
          </p>
          <button
            onClick={() => signIn("google", { prompt: "consent" })}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <div>
          <p className="text-green-400 mb-2">
            ✅ Signed in as {session.user?.email}
          </p>

          {tokenData?.refreshToken ? (
            <div className="bg-gray-900 border border-gray-700 p-4 rounded mb-4">
              <p className="text-sm text-gray-400 mb-2">
                Your Google Refresh Token (set as <code>GOOGLE_REFRESH_TOKEN</code> in .env):
              </p>
              <pre className="bg-gray-800 p-3 rounded text-green-300 text-sm break-all whitespace-pre-wrap">
                {tokenData.refreshToken}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(tokenData.refreshToken);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="mt-2 bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded text-sm"
              >
                {copied ? "Copied!" : "Copy to clipboard"}
              </button>
            </div>
          ) : (
            <div className="bg-yellow-900 border border-yellow-700 p-4 rounded mb-4">
              <p className="text-yellow-300">
                No refresh token available. Sign out and sign in again to generate one.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={() => signOut()}
              className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded"
            >
              Sign Out
            </button>
            <a
              href="/api/auth/token"
              target="_blank"
              className="block text-blue-400 hover:underline text-sm"
            >
              Raw token data →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
