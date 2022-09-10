import { Button } from "~/bits";
import { trpc } from "~/utils";

const Admin = () => {
    const fetchList = trpc.useMutation(['anime.fetchList']);
    
    return (
        <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 gap-6">
            <h1 className="text-2xl text-gray-700">
                Admin Panel
            </h1>
            <Button
                buttonAction={() => fetchList.mutate()}
                buttonText="Fetch new list"
            />
        </main>
    )
};

export default Admin;
