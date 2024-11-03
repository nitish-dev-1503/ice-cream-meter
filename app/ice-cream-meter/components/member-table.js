import { db } from "@/app/firebase";
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarCheck, CalendarIcon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function MemberTable({ teamId, setTeamName }) {
    const { toast } = useToast()
    const [date, setDate] = useState(new Date());
    const [attendance, setAttendance] = useState([]);
    const [members, setMembers] = useState([]);


    useEffect(() => {
        const teamRef = doc(db, 'ice-cream-meter', teamId);
        const unsubscribe = onSnapshot(teamRef, (doc) => {
            const team = doc.data()
            if (team) {
                setTeamName(team.teamName)
                setMembers(team.members)
            }
        });
        return () => unsubscribe();
    }, [])

    useEffect(() => {
        const dailyTrackerRef = doc(db, 'ice-cream-meter', teamId, 'daily-tracker', format(date, 'yyyy-MM-dd'));
        const unsubscribe = onSnapshot(dailyTrackerRef, (doc) => {
            const dailyTracker = doc.data()
            if (dailyTracker) {
                setAttendance(dailyTracker.memberAttendance)
            } else {
                setAttendance(members.map(member => ({ ...member, status: 'ON_TIME' })))
            }
        });
        return () => unsubscribe();
    }, [date, members])

    const handleStatusChange = (memberId, newStatus) => {
        setAttendance((prevAttendance) =>
            prevAttendance.map((member) =>
                member.memberId === memberId
                    ? { ...member, status: newStatus }
                    : member
            )
        );
    };

    const saveAttendance = async () => {
        try {
            const attendanceRef = doc(db, 'ice-cream-meter', teamId, 'daily-tracker', format(date, 'yyyy-MM-dd'));
            const updatedMemberAttendance = attendance.map((member) => ({
                memberId: member.memberId,
                name: member.name,
                status: member.status,
            }));

            await setDoc(attendanceRef, { memberAttendance: updatedMemberAttendance });

            toast({
                title: "Success",
                description: (
                    <p>Daily tracker saved successfully.</p>
                ),
            })
        } catch (error) {
            toast({
                title: "Failure",
                description: (
                    <p>Failed to save attendance</p>
                ),
            })
        }
    }

    return (
        <div className=" border border-neutral-200 rounded-md">
            <div className=" flex justify-between items-center bg-neutral-100 p-4 rounded-t-md">
                <h2 className=" font-semibold flex items-center gap-4">
                    <CalendarCheck className=' aspect-square bg-white w-10 h-10 p-2 rounded-md border border-neutral-200 ' />Daily Tracker</h2>
                <div className=" flex items-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={saveAttendance}
                    >
                        <Save />
                        Save
                    </Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}>
                                <CalendarIcon />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(date) => setDate(date)}
                                initialFocus
                                required
                                disabled={(date) => date >= new Date()}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div>
                <Table >
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member Name</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attendance.map((member) => (
                            <TableRow key={member.memberId}>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>
                                    <Select defaultValue={member.status || "ON_TIME"} value={member.status || "ON_TIME"}
                                        onValueChange={(value) => handleStatusChange(member.memberId, value)}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="ON_TIME">On time</SelectItem>
                                                <SelectItem value="LATE_BY_1_MIN">Late by 1 min</SelectItem>
                                                <SelectItem value="LATE_BY_3_MINS">Late by 3 mins</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
