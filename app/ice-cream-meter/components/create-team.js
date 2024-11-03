'use client'
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import { CirclePlus, X } from "lucide-react";
import { addDoc, collection, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation"

const teamSchema = z.object({
    teamName: z.string()
        .min(2, {
            message: "Team name must be at least 2 characters.",
        })
        .max(50, {
            message: "Team name must not be longer than 50 characters.",
        }),
    members: z.array(
        z.object({
            memberId: z.string(),
            name: z
                .string()
                .min(2, {
                    message: "Member name must be at least 2 characters.",
                })
                .max(30, {
                    message: "Member name must not be longer than 30 characters.",
                })
        }))
})


export default function CreateTeam() {
    const router = useRouter()
    const { toast } = useToast()


    const teamForm = useForm({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            teamName: "",
            members: [{ memberId: uuidv4(), name: "" }],
        },
        mode: "onChange",
    })

    const { fields, append, remove } = useFieldArray({
        name: "members",
        control: teamForm.control,
    })

    const createTeam = async (data) => {
        return await addDoc(collection(db, 'ice-cream-meter'), data);
    }

    const onSubmit = async (data) => {
        console.log('creating team');
        await createTeam(data).then(async (docRef) => {

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                router.push(`/ice-cream-meter/teams/${docSnap.id}`)
            } else {
                alert(`Board ${id} doesn't exist`)
            }
            console.log(docRef.id);


            toast({
                title: "Team creation successfull!",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                    </pre>
                ),
            })
        })
    }

    return <Form {...teamForm}>
        <form onSubmit={teamForm.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={teamForm.control}
                name="teamName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                            <Input className="max-w-sm" placeholder="Enter your team name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div>
                {fields.map((field, index) => (
                    <FormField
                        control={teamForm.control}
                        key={field.id}
                        name={`members.${index}.name`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={cn(index !== 0 && "sr-only")}>
                                    Members
                                </FormLabel>
                                <FormControl>
                                    <div className="flex w-full max-w-sm items-center space-x-2 my-12">
                                        <Input type="text" {...field} placeholder="Enter name" />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="aspect-square "
                                            disabled={fields.length === 1}
                                            onClick={() => remove(index)}
                                        ><X /></Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ memberId: uuidv4(), name: "" })}
                >
                    <CirclePlus />
                    Add Member
                </Button>
            </div>

            <Button type="submit">Create Team</Button>
        </form>
    </Form>

}
