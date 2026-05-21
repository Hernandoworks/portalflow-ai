"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowRight,
  Upload,
  Shield,
  FolderOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-white to-zinc-100">

      <div className="max-w-7xl mx-auto px-8">

        <header className="flex items-center justify-between py-8">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-lg">
              P
            </div>

            <div>
              <div className="font-black text-xl">
                PortalFlow AI
              </div>

              <div className="text-sm text-zinc-500">
                Workflow Upload Portals
              </div>
            </div>

          </div>

          <div className="flex items-center gap-4">

            <Button
              variant="ghost"
              className="rounded-2xl"
            >
              Features
            </Button>

            <Button
              variant="ghost"
              className="rounded-2xl"
            >
              Templates
            </Button>

            <Link href="/create-portal">

              <Button className="rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-lg">
                Create Portal
              </Button>

            </Link>

          </div>

        </header>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-20 items-center pt-20 pb-32">

          <div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="inline-flex items-center gap-2 bg-white border border-zinc-200 shadow-sm px-4 py-2 rounded-full text-sm mb-8"
            >

              <Shield className="w-4 h-4 text-emerald-500" />

              Secure Google Drive Collection

            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="text-7xl font-black leading-[0.92] tracking-tight text-zinc-900"
            >

              Collect Files
              <br />

              Securely Into
              <br />

              Google Drive

            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="text-zinc-500 text-2xl mt-10 leading-relaxed max-w-2xl"
            >

              Create workflow-based upload portals
              for suppliers, onboarding,
              compliance, and client submissions.

            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
              }}
              className="flex flex-wrap gap-4 mt-12"
            >

              <Link href="/create-portal">

                <Button
                  size="lg"
                  className="rounded-2xl h-16 px-8 text-lg bg-emerald-500 hover:bg-emerald-600 shadow-xl"
                >

                  Create Upload Portal

                  <ArrowRight className="ml-2 w-5 h-5" />

                </Button>

              </Link>

              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl h-16 px-8 text-lg"
              >
                View Demo
              </Button>

            </motion.div>

            <div className="flex flex-wrap gap-4 mt-12">

              <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl px-5 py-4 text-sm">
                ✓ No login required
              </div>

              <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl px-5 py-4 text-sm">
                ✓ Upload-only access
              </div>

              <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl px-5 py-4 text-sm">
                ✓ Direct to Google Drive
              </div>

            </div>

          </div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative"
          >

            <div className="absolute -inset-10 bg-emerald-500/10 blur-3xl rounded-full"></div>

            <Card className="relative rounded-[36px] border-zinc-200 shadow-2xl overflow-hidden bg-white">

              <div className="border-b border-zinc-100 px-6 py-4 flex items-center gap-2 bg-zinc-50">

                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>

                <div className="ml-4 text-sm text-zinc-400">
                  portalflow.ai/upload/supplier-onboarding
                </div>

              </div>

              <div className="p-10">

                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm mb-8">

                  <Shield className="w-4 h-4" />

                  Secure Upload Portal

                </div>

                <h2 className="text-4xl font-black text-zinc-900">
                  Supplier Onboarding
                </h2>

                <p className="text-zinc-500 mt-4 text-lg leading-relaxed">
                  Upload supplier onboarding documents,
                  tax forms, compliance files,
                  and contracts.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-10">

                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-zinc-400">
                    Full Name
                  </div>

                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-zinc-400">
                    Email Address
                  </div>

                </div>

                <div className="mt-4 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-zinc-400">
                  Company Name
                </div>

                <motion.div
                  whileHover={{
                    scale: 1.01,
                  }}
                  className="mt-8 border-2 border-dashed border-zinc-300 rounded-3xl p-16 text-center bg-zinc-50"
                >

                  <Upload className="w-14 h-14 mx-auto text-emerald-500 mb-5" />

                  <h3 className="text-2xl font-black">
                    Drag & Drop Files
                  </h3>

                  <p className="text-zinc-500 mt-3">
                    or click to browse files
                  </p>

                </motion.div>

                <div className="flex flex-wrap gap-3 mt-8">

                  <div className="bg-zinc-100 px-4 py-2 rounded-full text-sm">
                    ✓ Secure Upload
                  </div>

                  <div className="bg-zinc-100 px-4 py-2 rounded-full text-sm">
                    ✓ No Account Required
                  </div>

                  <div className="bg-zinc-100 px-4 py-2 rounded-full text-sm">
                    ✓ Connected To Drive
                  </div>

                </div>

              </div>

            </Card>

          </motion.div>

        </section>

        <section className="pb-32">

          <div className="text-center mb-20">

            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 shadow-sm px-4 py-2 rounded-full text-sm mb-6">

              Workflow Simplicity

            </div>

            <h2 className="text-6xl font-black leading-tight">

              Create Upload Workflows
              <br />

              In Minutes

            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <Card className="rounded-[32px] border-zinc-200 shadow-lg p-10">

              <FolderOpen className="w-14 h-14 text-emerald-500 mb-8" />

              <h3 className="text-3xl font-black">
                Create Portal
              </h3>

              <p className="text-zinc-500 mt-4 text-lg leading-relaxed">

                Choose a workflow template and generate a secure upload portal.

              </p>

            </Card>

            <Card className="rounded-[32px] border-zinc-200 shadow-lg p-10">

              <Upload className="w-14 h-14 text-emerald-500 mb-8" />

              <h3 className="text-3xl font-black">
                Share Link
              </h3>

              <p className="text-zinc-500 mt-4 text-lg leading-relaxed">

                Send upload links to suppliers, clients, applicants, or teams.

              </p>

            </Card>

            <Card className="rounded-[32px] border-zinc-200 shadow-lg p-10">

              <Shield className="w-14 h-14 text-emerald-500 mb-8" />

              <h3 className="text-3xl font-black">
                Receive Files
              </h3>

              <p className="text-zinc-500 mt-4 text-lg leading-relaxed">

                Files organize automatically inside Google Drive workflows.

              </p>

            </Card>

          </div>

        </section>

      </div>

    </main>
  );
}
