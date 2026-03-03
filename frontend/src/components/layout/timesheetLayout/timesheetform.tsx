import { useState } from "react";
import { CustomDateTimePicker } from "@/components/ui/datetimepicker";
import { Textarea } from "@/components/ui/textarea";
import { Timepicker } from "@/components/ui/timepicker";
import { CustomDropdown } from "@/components/ui/dropdown"; // Updated import
import dayjs, { Dayjs } from "dayjs";

const projectOptions = [
    { label: "Project A", value: "projectA" },
    { label: "Project B", value: "projectB" },
];
const taskOptions = [
    { label: "Task 1", value: "task1" },
    { label: "Task 2", value: "task2" },
];
const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
];

export function TimesheetForm() {
    const [tasks, setTasks] = useState([
        {
            project: "",
            task: "",
            status: "",
            description: "",
            deliverables: "",
            hours: null as Dayjs | null,
            attachment: null as File | null,
        },
    ]);
    
    const [date] = useState<[Dayjs | null, Dayjs | null]>([dayjs(), dayjs()]);

    const handleTaskChange = (idx: number, field: string, value: any) => {
        setTasks((prev) =>
            prev.map((t, i) =>
                i === idx ? { ...t, [field]: value } : t
            )
        );
    };

    const handleFileChange = (idx: number, file: File | null) => {
        handleTaskChange(idx, "attachment", file);
    };

    const addTask = () => {
        setTasks((prev) => [
            ...prev,
            {
                project: "",
                task: "",
                status: "",
                description: "",
                deliverables: "",
                hours: null as Dayjs | null,
                attachment: null as File | null,
            },
        ]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // handle form submission
        console.log('Submitted tasks:', tasks);
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Date</label>
                    <CustomDateTimePicker value={date} disabled />
                </div>
                {tasks.map((task, idx) => (
                    <div key={idx} className="mb-6 border-b pb-4">
                        <div className="mb-4">
                            <CustomDropdown
                                label="Project"
                                options={projectOptions}
                                value={task.project}
                                onChange={(val) => handleTaskChange(idx, "project", val)}
                                placeholder="Select a project"
                            />
                        </div>
                        <div className="mb-4">
                            <CustomDropdown
                                label="Task"
                                options={taskOptions}
                                value={task.task}
                                onChange={(val) => handleTaskChange(idx, "task", val)}
                                placeholder="Select a task"
                            />
                        </div>
                        <div className="mb-4">
                            <CustomDropdown
                                label="Status"
                                options={statusOptions}
                                value={task.status}
                                onChange={(val) => handleTaskChange(idx, "status", val)}
                                placeholder="Select status"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Task Description</label>
                            <Textarea
                                placeholder="Enter task description"
                                value={task.description}
                                onChange={(e) =>
                                    handleTaskChange(idx, "description", e.target.value)
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Deliverables</label>
                            <Textarea
                                placeholder="Enter deliverables"
                                value={task.deliverables}
                                onChange={(e) =>
                                    handleTaskChange(idx, "deliverables", e.target.value)
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Hours Spent</label>
                            <Timepicker
                                value={task.hours}
                                onChange={(val) => handleTaskChange(idx, "hours", val)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Upload Attachment (optional)</label>
                            <input
                                type="file"
                                onChange={(e) =>
                                    handleFileChange(
                                        idx,
                                        e.target.files ? e.target.files[0] : null
                                    )
                                }
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-4 hover:bg-gray-300 transition-colors"
                    onClick={addTask}
                >
                    Add More Task
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}