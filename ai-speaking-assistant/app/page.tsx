import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, PresentationIcon, Users, Shield } from "lucide-react";

export default function Home() {
  return (
    // Main container: Dark background, light text
    <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-200 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-28 md:py-40 text-center overflow-hidden">
        {/* Subtle background effect - replace with a more futuristic pattern if desired */}
        <div className="absolute inset-0 opacity-10 mix-blend-soft-light">
          {/* Example subtle pattern (optional - could use a SVG or CSS gradient) */}
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(55, 65, 81, 0.5)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/80 z-0"></div>

        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-300 font-medium text-xs mb-6 tracking-wide uppercase">
            Break Free From Echo Chambers
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 leading-tight pb-2">
            Sharpen Your Debate Skills with Aristotle AI
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Develop powerful communication skills using AI-driven analysis based on rhetorical principles. Navigate diverse
            perspectives beyond online echo chambers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/debate">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-blue-500/30 w-full sm:w-auto">
                Start Debating <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/learn">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-300 font-medium py-3 px-8 rounded-full shadow-sm transition duration-300 ease-in-out hover:bg-gray-800/50 w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-100">How It Works</h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Leveraging AI and Aristotelian rhetoric to refine your communication prowess.
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
          <HowItWorksStep
            number="1"
            title="Choose a Topic"
            description="Select from curated, challenging topics designed to broaden your perspective."
            colorClass="text-cyan-400"
          />
          <HowItWorksStep
            number="2"
            title="Engage & Refine"
            description="Practice structured argumentation with real-time AI guidance and feedback."
            colorClass="text-purple-400"
          />
          <HowItWorksStep
            number="3"
            title="Analyze & Improve"
            description="Receive personalized insights on logical structure, rhetoric, and delivery."
            colorClass="text-blue-400"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-100">Core Capabilities</h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Intelligent tools engineered for effective communication across ideological divides.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Mic className="w-10 h-10 text-blue-400" />}
            title="Structured Debate Framework"
            description="Engage in formalized debates with clear rules and AI moderation, focusing on logical consistency and evidence."
          />
          <FeatureCard
            icon={<PresentationIcon className="w-10 h-10 text-purple-400" />}
            title="AI Rhetorical Analysis"
            description="Receive real-time feedback identifying logical fallacies, argument strength (Ethos, Pathos, Logos), and areas for improvement."
          />
          <FeatureCard
            icon={<Shield className="w-10 h-10 text-cyan-400" />}
            title="Perspective Shifting Engine"
            description="Challenge your assumptions by interacting with AI trained on diverse viewpoints within a controlled, constructive environment."
          />
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-gray-700">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-lg italic text-gray-300 mb-4">
                "Aristotle AI has fundamentally changed how I approach difficult conversations. The feedback is insightful,
                helping me articulate my points clearly and understand opposing arguments better, without the usual online
                hostility."
              </p>
              <p className="font-semibold text-cyan-400">— Alex R., Software Engineer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 md:py-32 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-100">Ready to Transcend Your Filter Bubble?</h2>
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
          Join a growing community dedicated to mastering communication and fostering understanding in a polarized world. Start
          your AI-powered debate journey today.
        </p>
        <Link href="/debate">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-cyan-500/30">
            Initiate First Debate <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}

// Helper component for "How It Works" steps
function HowItWorksStep({
  number,
  title,
  description,
  colorClass,
}: {
  number: string;
  title: string;
  description: string;
  colorClass: string;
}) {
  return (
    <div className="flex-1 text-center p-4">
      <div
        className={`w-12 h-12 border-2 ${colorClass.replace(
          "text-",
          "border-"
        )} rounded-full flex items-center justify-center mx-auto mb-5`}>
        <span className={`font-bold text-xl ${colorClass}`}>{number}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-100">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

// Helper component for Feature Cards
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-900/40 p-6 md:p-8 rounded-xl border border-gray-700/50 transition duration-300 ease-in-out transform hover:border-blue-500/50 hover:bg-gray-800/60 hover:-translate-y-1 backdrop-blur-sm">
      <div className="flex justify-center mb-5">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-center text-gray-100">{title}</h3>
      <p className="text-gray-400 text-center text-sm leading-relaxed">{description}</p>
    </div>
  );
}
