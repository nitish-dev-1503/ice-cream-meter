import Link from "next/link"
import Team from "../../components/team"

export default async function TeamPage({ params }) {
    const teamId = (await params).slug

    return (
        <main className=" flex flex-col  gap-4 justify-start my-32 w-full max-w-7xl m-auto  bg-white min-h-screen px-4">
            <div className=" flex gap-4 items-center">
                <img src="/logo.svg" alt="Ice-cream Meter" className="w-16 h-16" />
                <Link href="/" className="hover:underline text-sm ">Home</Link>/
                <Link href="/ice-cream-meter" className="hover:underline text-sm ">Ice-cream Meter</Link>/
            </div>
            <Team teamId={teamId} />
        </main>
    )
}