import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ArisTalkle
        </Link>
        <div className="space-x-4">
          <Link href="/debate" className="text-gray-600 hover:text-blue-600">
            Debate
          </Link>
          <Link href="/presentation-skills" className="text-gray-600 hover:text-blue-600">
            Presentation Skills
          </Link>
          <Button variant="outline">Sign In</Button>
          <Button>Sign Up</Button>
        </div>
      </nav>
    </header>
  )
}

