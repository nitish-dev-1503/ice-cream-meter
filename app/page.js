import { Button } from "@/components/ui/button"
import { SquareArrowOutUpRight } from "lucide-react"
import Link from "next/link"

const app = {
  title: "Ice-cream Meter",
  description: "Let’s encourage discipline in your team in a fun way.",
  link: {
    label: "Let's get started!",
    url: "/ice-cream-meter"
  }
}

export default function Home() {
  return (
    <main className=" flex flex-col gap-4 justify-center w-full m-auto max-w-7xl bg-white px-4 min-h-screen">
      <div className=" flex gap-24 items-center justify-center grow">
        <img src="/logo.svg" alt="Ice-cream Meter" className="" />
        <div className=" flex flex-col gap-2">
          <h1 className=" flex gap-1 items-center text-4xl text-ice_pink font-semibold">Ice-cream Meter</h1>
          <h1 className=" flex gap-1 items-center text-2xl text-ice_yellow">Let’s encourage discipline in your team in a fun way.</h1>
          <Link href={app.link.url} target="_blank" className=" my-6">
            <Button variant="outline" className=" text-ice_pink hover:text-ice_pink">
              <SquareArrowOutUpRight /><p className="underline">{app.link.label}</p>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
