"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SignedOut, SignedIn, SignInButton, SignUpButton, useUser, SignOutButton } from "@clerk/nextjs";

export default function Header() {
  const { user } = useUser(); // Get user details

  return (
    <header className="shadow-sm bg-white dark:bg-inherit">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ArisTalkle
        </Link>
        <div className="space-x-4 flex items-center">
          {/* Display when user is not signed in */}
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>

            <SignUpButton>
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          {/* Display when user is signed in */}
          <SignedIn>
            <div className="flex items-center space-x-4">
              <Link href="/debate" className="text-gray-600 dark:text-white hover:text-blue-600">
                Debate
              </Link>
              <Link href="/presentation-skills" className="text-gray-600 dark:text-white hover:text-blue-600">
                Presentation Skills
              </Link>
              <Link href="/dashboard" className="text-gray-600 dark:text-white hover:text-blue-600">
                Dashboard
              </Link>

              {/* Sign Out Button */}
              <SignOutButton>
                <Button variant="outline">Sign Out</Button>
              </SignOutButton>

              {/* Avatar */}
              <Avatar>
                <AvatarImage src={user?.imageUrl || ""} alt="User Avatar" />
                <AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
