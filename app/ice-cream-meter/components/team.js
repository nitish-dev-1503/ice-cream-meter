'use client'
import { useState } from "react";
import { MemberTable } from "./member-table";
import AttendanceSummary from "./attendance-summary";
import { Settings, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Team({ teamId }) {
    const { toast } = useToast()
    const [teamName, setTeamName] = useState("");

    const copyLink = async () => {
        const link = `${window.location.origin}/ice-cream-meter/teams/${teamId}`
        await navigator.clipboard.writeText(link)
            .then(
                toast({
                    title: "Team link copied!",
                    description: (
                        <p>{link}</p>
                    ),
                })
            );
    }

    return (
        <div className=" flex flex-col gap-6">
            <div className=" w-full max-w-7xl m-auto flex items-end justify-between">
                <h1 className=" text-3xl ">{teamName}</h1>
                <div className=" flex items-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="mt-2"
                        onClick={copyLink}
                    >
                        <Share2 />
                        Share
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="mt-2"
                        onClick={() => { }}
                    >
                        <Settings />
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl m-auto w-full flex flex-col gap-24 my-16">
                <AttendanceSummary teamId={teamId} />
                <MemberTable teamId={teamId} setTeamName={setTeamName} />
            </div>
        </div>
    )
}