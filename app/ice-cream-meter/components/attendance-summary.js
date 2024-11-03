import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, IceCreamCone, Info, RefreshCcw } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns"
import { Chart } from './chart';

export default function AttendanceSummary({ teamId }) {
    const [dateRange, setDateRange] = useState({
        from: subDays(new Date(), 7),
        to: new Date()
    })
    const [attendanceData, setAttendanceData] = useState([]);
    const penaltyScores = { ON_TIME: 0, LATE_BY_1_MIN: 1, LATE_BY_3_MINS: 3 };

    const fetchAttendance = async () => {
        try {
            const attendanceRef = collection(db, 'ice-cream-meter', teamId, 'daily-tracker');

            const q = query(
                attendanceRef,
                where('__name__', '>=', format(dateRange.from, 'yyyy-MM-dd')),
                where('__name__', '<=', format(dateRange.to, 'yyyy-MM-dd'))
            );

            const snapshot = await getDocs(q);
            const attendanceMap = {};

            snapshot.forEach(doc => {
                const { memberAttendance } = doc.data();

                memberAttendance.forEach(({ memberId, name, status }) => {
                    if (!attendanceMap[memberId]) {
                        attendanceMap[memberId] = { memberId, name, ON_TIME: 0, LATE_BY_1_MIN: 0, LATE_BY_3_MINS: 0, penalty: 0 };
                    }
                    attendanceMap[memberId][status]++;
                    attendanceMap[memberId].penalty += penaltyScores[status];
                });
            });
            const formattedData = Object.values(attendanceMap).sort((a, b) => b.penalty - a.penalty);

            setAttendanceData(formattedData);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        }
    };

    const updateDateRange = (newDateRange) => {
        if (!newDateRange) {
            setDateRange({ from: new Date(), to: new Date() })
        } else if (!newDateRange.from && newDateRange.to) {
            setDateRange({ from: newDateRange.to, to: newDateRange.to })
        } else if (newDateRange.from && !newDateRange.to) {
            setDateRange({ from: newDateRange.from, to: newDateRange.from })
        } else {
            setDateRange(newDateRange)
        }
    }

    const topThreeData = (data) => {
        const topThree = [...data.slice(0, 3)];
        if (topThree.length > 1) {
            // Swap the first and second elements
            [topThree[0], topThree[1]] = [topThree[1], topThree[0]];
        }
        return topThree;
    };

    useEffect(() => {
        fetchAttendance();
    }, [teamId, dateRange]);


    return (
        <div className=" border border-neutral-200 rounded-md">
            <div className=" flex justify-between items-center bg-neutral-100 p-4 rounded-t-md">
                <h2 className=" font-semibold flex items-center gap-4">
                    <IceCreamCone className=' aspect-square bg-white w-10 h-10 p-2 rounded-md border border-neutral-200 ' />Ice-cream Meter</h2>
                <div className=" flex items-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={fetchAttendance}
                    >
                        <RefreshCcw />
                        Refresh
                    </Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-[300px] justify-start text-left font-normal",
                                    !dateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} -{" "}
                                            {format(dateRange.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                required
                                max={14}
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={updateDateRange}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {attendanceData.length > 0
                ? <Chart chartData={topThreeData(attendanceData)} />
                : <div className='w-full flex flex-col gap-4 items-center justify-center my-12 min-h-40'>
                    <Info size={48} color="hsl(var(--chart-1))" />
                    <p>No Record Found</p>
                </div>
            }

            {attendanceData.length > 0 && <div className="">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member Name</TableHead>
                            <TableHead>On Time</TableHead>
                            <TableHead>Late by 1 Min</TableHead>
                            <TableHead>Late by 3 Mins</TableHead>
                            <TableHead>Penalty Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attendanceData.map((member) => (
                            <TableRow key={member.memberId}>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.ON_TIME}</TableCell>
                                <TableCell>{member.LATE_BY_1_MIN}</TableCell>
                                <TableCell>{member.LATE_BY_3_MINS}</TableCell>
                                <TableCell>{member.penalty}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            }
        </div>
    );
};

