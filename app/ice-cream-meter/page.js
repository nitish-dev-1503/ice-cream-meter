import CreateTeam from "./components/create-team"
import { JoinTeam } from "./components/join-team"
import Link from "next/link"

export default function IceCreamMeter() {
    return (
        <main className=" flex flex-col gap-4 justify-start my-32 w-full m-auto max-w-7xl bg-white min-h-screen px-4">
            <div className=" flex gap-4 items-center">
                <img src="/logo.svg" alt="Ice-cream Meter" className="w-16 h-16" />
                <Link href="/" className="hover:underline text-sm ">Home</Link>/
            </div>
            <h1 className=" flex gap-1 items-center text-3xl text-ice_pink">Ice-cream Meter</h1>
            <p className=" text-lg text-ice_yellow">Let’s encourage discipline in your team in a fun way.</p>


            <div className="max-w-xl flex flex-col gap-12 my-12">
                <JoinTeam />

                <div className="flex items-center gap-2 max-w-xl">
                    <hr className="w-full " />
                    <p className=" text-sm text-neutral-400">OR</p>
                    <hr className="w-full" />
                </div>

                <div className="">
                    <p className="mb-2">Don’t have a team? Create one</p>
                    <CreateTeam />
                </div>
            </div>
        </main>
    )
}