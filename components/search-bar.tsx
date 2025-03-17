import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SearchBar() {
  return (
    <div className="relative mx-auto max-w-md w-full">
      <form className="flex items-center">
        <Input
          type="text"
          placeholder="Search destinations"
          className="rounded-l-full border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" size="icon" className="rounded-r-full bg-rose-500 hover:bg-rose-600 h-10">
          <Search className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}

