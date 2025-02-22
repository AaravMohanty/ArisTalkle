import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mic, PresentationIcon as PresentationChart } from "lucide-react"

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Master Public Speaking with Aristotle
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Hone your argumentation and presentation skills through interactive, structured debates and AI-powered
          feedback.
        </p>
        <Link href="/debate">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Debate Now <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <FeatureCard
            icon={<Mic className="w-12 h-12 text-blue-600" />}
            title="Interactive Debates"
            description="Engage in structured debates on various topics and difficulty levels to improve your argumentation skills with Aristotle's guidance."
          />
          <FeatureCard
            icon={<PresentationChart className="w-12 h-12 text-purple-600" />}
            title="Presentation Skills"
            description="Learn and practice essential presentation techniques with guided exercises and real-time analysis from Aristotle."
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  )
}

