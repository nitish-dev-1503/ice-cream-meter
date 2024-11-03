"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    teamId: z.string().min(1, { message: "Team Id cannot be empty" }),
})

export function JoinTeam() {
    const router = useRouter();

    const joinTeam = (data) => {
        router.push(`/ice-cream-meter/teams/${data.teamId}`)
    }

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teamId: "",
        },
    })

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(joinTeam)} className="space-y-8 ">
                <FormField
                    control={form.control}
                    name="teamId"
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel>Team Id</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your team id" {...field} className="max-w-sm w-ful" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Join Team</Button>
            </form>
        </Form>
    )
}
