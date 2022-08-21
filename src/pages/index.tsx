import { signIn, useSession } from "next-auth/react";
import { Button } from "~/bits";

const Home = () => {
    const {data: session} = useSession();
    
    const content = session
        ? <input className="border-2 border-solid border-gray-700 rounded-lg"/>
        : (
            <Button
                buttonAction={() => signIn()}
                buttonText='Sign In to Start'
            />
        );

    return (
        <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 gap-6">
            <h1 className="text-2xl text-gray-700">
                AnimeList is an app which allows you to rank your favorite anime!
            </h1>
            {content}    
        </main>
    )
};

export default Home;
