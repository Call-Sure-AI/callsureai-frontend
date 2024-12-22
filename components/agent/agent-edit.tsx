import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import { Input } from "../ui/input";

export const AgentEdit = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-white flex justify-center items-center bg-[#0A1E4E] hover:bg-[#0A1E4E] text-sm font-medium rounded-md px-2 py-1.5 text-center">
                    <PlusCircleIcon className="w-4 h-4 mr-2" />
                    Edit
                </button>
            </DialogTrigger>
            <DialogContent className="p-6">
                <DialogHeader>
                    <DialogTitle>Edit Agent</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Agent Name
                            </label>
                            <Input
                                placeholder="Enter your agent's name"
                                className="w-full border-gray-200 focus:border-blue-500 h-12 text-lg"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button className="bg-[#0A1E4E] text-white px-8 py-2 h-auto text-lg font-medium rounded-xl">
                            Save
                        </button>
                    </div>
                </div>
            </DialogContent>

        </Dialog>
    )
};