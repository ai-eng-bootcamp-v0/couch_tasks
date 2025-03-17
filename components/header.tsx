import { Globe, Menu, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="text-rose-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  className="h-8 w-8"
                  aria-hidden="true"
                  role="presentation"
                  fill="currentColor"
                >
                  <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.695.96 3.691.054 1.068-.143 1.991-.557 2.773-.383.73-.915 1.329-1.584 1.777-.57.383-1.263.654-2.084.801-.608.114-1.328.129-2.274.084-.347-.017-.689-.04-1.028-.069-1.229-.108-2.44-.273-3.6-.493l-.313-.06c-2.543-.508-4.795-1.312-6.664-2.339-1.498-.836-2.64-1.709-3.204-2.565L8 24c-.553-.815-.542-1.734.003-2.65l.137-.207.129-.202c.089-.143.204-.336.349-.585l.126-.222c.12-.215.274-.498.47-.862l.17-.322c.665-1.262 1.778-3.424 3.23-6.316l.237-.476c.237-.472.43-.86.582-1.167l.129-.257c.946-1.898 1.753-2.573 3.558-2.573zm0 2c-1.239 0-1.613.413-2.335 1.868l-.126.254-.428.854c-.439.873-.925 1.838-1.452 2.894l-.171.34-.218.438c-1.33 2.677-2.469 4.89-3.162 6.21l-.128.24c-.189.35-.345.637-.49.902l-.116.203c-.204.357-.38.656-.53.91l-.084.139c-.33.55-.296.947-.008 1.35.347.517 1.243 1.224 2.485 1.913 1.637.915 3.665 1.634 5.962 2.095l.3.058c1.086.206 2.214.36 3.364.46l.344.03c.65.047 1.185.051 1.58.002.568-.07 1.016-.235 1.34-.48.334-.248.563-.55.709-.894.195-.379.296-.878.257-1.539-.036-.635-.203-1.43-.765-2.778l-.156-.374c-.969-2.263-5.093-10.884-7.013-14.642l-.541-1.04C18.11 3.696 17.294 3 16 3z"></path>
                </svg>
                <span className="ml-2 text-xl font-semibold hidden sm:block">airbnb</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="hidden md:block">
            <div className="flex space-x-4">
              <Button variant="ghost" className="font-medium">
                Stays
              </Button>
              <Button variant="ghost" className="text-gray-500">
                Experiences
              </Button>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="rounded-full hidden sm:flex">
              Airbnb your home
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Globe className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="rounded-full flex items-center gap-2 border-gray-300">
              <Menu className="h-4 w-4" />
              <User className="h-6 w-6 text-gray-500 bg-gray-100 rounded-full p-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

