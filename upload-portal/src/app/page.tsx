"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowRight,
  Shield,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafaf9] overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_40%)]" />

      <div className="relative z-10">

        <header className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-sm">
              P
            </div>

            <div>

              <div className="font-black text-xl text-zinc-900">
                PortalFlow AI
              </div>

              <div className="text-sm text-zinc-500">
                Workflow Document Collection
              </div>

            </div>

          </div>

          <div className="hidden md:flex items-center gap-4">

            <button className="text-zinc-500 hover:text-zinc-900 transition-all">
              Features
            </button>

            <button className="text-zinc-500 hover:text-zinc-900 transition-all">
              Templates
            </button>

            <button className="text-zinc-500 hover:text-zinc-900 transition-all">
              Pricing
            </button>

            <Link href="/create-portal">

              <Button className="rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-sm h-12 px-6">
                Create Portal
              </Button>

            </Link>

          </div>

        </header>

        <section className="max-w-7xl mx-auto px-8 pt-20 pb-32 grid grid-cols-1 xl:grid-cols-2 gap-24 items-center">

          {/* LEFT */}

          <div className="max-w-2xl">

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
              className="inline-flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-full text-sm text-zinc-600 shadow-sm mb-8"
            >

              <Shield className="w-4 h-4 text-emerald-500" />

              Secure Upload Workflows

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
              className="text-7xl font-black leading-[0.95] tracking-tight text-zinc-900"
            >

              Collect Files
              <br />

              Directly Into
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
              className="text-zinc-500 text-2xl leading-relaxed mt-10"
            >

              Create secure upload workflows for suppliers,
              onboarding, compliance, and client submissions —
              without sharing folders or requiring logins.

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
                  className="rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-lg h-16 px-8 text-lg"
                >

                  Create Upload Portal

                  <ArrowRight className="w-5 h-5 ml-2" />

                </Button>

              </Link>

              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl h-16 px-8 text-lg border-zinc-300 bg-white"
              >
                View Demo
              </Button>

            </motion.div>

            {/* TRUST */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14">

              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">

                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">

                  <Check className="w-4 h-4 text-emerald-500" />

                  No login required

                </div>

              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">

                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">

                  <Check className="w-4 h-4 text-emerald-500" />

                  Upload-only access

                </div>

              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">

                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">

                  <Check className="w-4 h-4 text-emerald-500" />

                  Direct to Google Drive

                </div>

              </div>

            </div>

            {/* USE CASES */}

            <div className="mt-14">

              <div className="text-sm uppercase tracking-wider text-zinc-400 mb-5">

                Used for

              </div>

              <div className="flex flex-wrap gap-3">

                {[
                  "Supplier onboarding",
                  "Client submissions",
                  "HR documents",
                  "Compliance collection",
                  "Job applications",
                ].map((item) => (

                  <div
                    key={item}
                    className="bg-zinc-100 text-zinc-700 px-4 py-3 rounded-full text-sm"
                  >
                    {item}
                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.9,
            }}
            className="relative"
          >

            <div className="absolute -inset-10 bg-emerald-500/10 blur-3xl rounded-full"></div>

            <Card className="relative rounded-[36px] border-zinc-200 shadow-2xl overflow-hidden bg-white">

              {/* HEADER */}

              <div className="border-b border-zinc-100 px-6 py-4 bg-zinc-50 flex items-center gap-2">

                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>

                <div className="ml-4 text-sm text-zinc-400">
                  portalflow.ai/upload/supplier-onboarding
                </div>

              </div>

              {/* BODY */}

              <div className="p-10">

                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm mb-8">

                  <Shield className="w-4 h-4" />

                  Secure Upload Portal

                </div>

                <h2 className="text-4xl font-black text-zinc-900">
                  Supplier Onboarding
                </h2>

                <p className="text-zinc-500 mt-4 text-lg leading-relaxed">

                  Upload contracts, tax forms,
                  compliance files, and supplier documents.

                </p>

                {/* INPUTS */}

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

                {/* DROPZONE */}

                <motion.div
                  whileHover={{
                    scale: 1.01,
                  }}
                  className="mt-8 border-2 border-dashed border-zinc-300 rounded-3xl p-16 text-center bg-zinc-50"
                >

                  <div className="text-6xl mb-4">
                    ☁️
                  </div>

                  <h3 className="text-2xl font-black text-zinc-900">
                    Drag & Drop Files
                  </h3>

                  <p className="text-zinc-500 mt-3">
                    or click to browse files
                  </p>

                </motion.div>

                {/* TRUST */}

                <div className="flex flex-wrap gap-3 mt-8">

                  <div className="bg-zinc-100 px-4 py-2 rounded-full text-sm text-zinc-600">
                    ✓ Secure upload
                  </div>

                  <div className="bg-zinc-100 px-4 py-2 rounded-full text-sm text-zinc-600">
                    ✓ No account required
                  </div>

                  <div className="bg-zinc-100 px-4 py-2 rounded-full text-sm text-zinc-600">
                    ✓ Connected to Drive
                  </div>

                </div>

              </div>

            </Card>

          </motion.div>

        </section>

        {/* HOW IT WORKS */}

        <section className="max-w-6xl mx-auto px-8 pb-32">

          <div className="text-center mb-20">

            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 shadow-sm px-4 py-2 rounded-full text-sm mb-6">

              Simple Workflow

            </div>

            <h2 className="text-6xl font-black text-zinc-900 leading-tight">

              Create Upload Workflows
              <br />

              In Minutes

            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {[
              {
                step: "1",
                title: "Create Portal",
                desc: "Choose a workflow template and generate a secure upload portal.",
              },

              {
                step: "2",
                title: "Share Link",
                desc: "Send upload links to suppliers, clients, applicants, or teams.",
              },

              {
                step: "3",
                title: "Receive Files",
                desc: "Files organize automatically inside Google Drive workflows.",
              },
            ].map((item) => (

              <Card
                key={item.step}
                className="rounded-[32px] border-zinc-200 shadow-lg p-10 bg-white"
              >

                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-black mb-8">

                  {item.step}

                </div>

                <h3 className="text-3xl font-black text-zinc-900">

                  {item.title}

                </h3>

                <p className="text-zinc-500 mt-4 text-lg leading-relaxed">

                  {item.desc}

                </p>

              </Card>

            ))}

          </div>

        </section>

      </div>

    </main>
  );
}
