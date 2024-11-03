import Link from "next/link";

export default function LetsPoll() {
    return (
        <main className=" flex flex-col gap-4 justify-start my-32 w-full m-auto max-w-7xl bg-white min-h-screen px-4">
            <div className=" flex gap-2 items-center">
                <Link href="/" className="hover:underline text-sm ">Engage</Link>/
            </div>
            <h1 className=" flex gap-1 items-center text-3xl">Let's Poll</h1>
            <p className=" text-lg">Unable to take a decision? let’s take a poll!</p>
            <span className=" p-2 bg-neutral-100 rounded-md text-xs w-fit">COMING SOON...</span>
        </main>
    )

}