import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { AppLayout } from "@/components/app-layout"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Kerala Health Records - Digital Health Management for Migrant Workers",
  description: "Secure digital health record management system for migrant workers in Kerala with multilingual support and government approval workflow.",
  generator: "v0.app",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <AppLayout>{children}</AppLayout>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}