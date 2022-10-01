import { useRouter } from "next/router"

export const GoBack = () => {
    const router = useRouter();

    return (
        <div onClick={router.back} className='fixed bottom-10 left-10 cursor-pointer'>
            <svg className="fill-gray-700 hover:fill-red-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" width="50" height="50" viewBox="0 0 256 256"><path d="M0 128c0 70.689 57.31 128 128 128 70.689 0 128-57.311 128-128C256 57.31 198.689 0 128 0 57.31 0 0 57.31 0 128Zm130.862-56.222a9.836 9.836 0 0 1 2.912 6.952 9.853 9.853 0 0 1-2.857 6.975L98.72 118.154h82.203a9.843 9.843 0 0 1 9.846 9.846 9.843 9.843 0 0 1-9.846 9.846H98.72l32.197 32.449a9.862 9.862 0 0 1 2.855 6.979 9.864 9.864 0 0 1-2.917 6.954 9.86 9.86 0 0 1-6.979 2.854 9.844 9.844 0 0 1-6.953-2.916l-48.855-49.231a9.845 9.845 0 0 1 0-13.87l48.855-49.231a9.845 9.845 0 0 1 13.939-.056Z" /></svg>
        </div>
    )
}