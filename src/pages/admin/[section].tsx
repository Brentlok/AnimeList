import { useRouter } from "next/router";
import { GoBack } from "~/bits";
import { upperFirst } from "~/utils";

const Section = () => {
    const router = useRouter();
    const section = router.query.section as string;

    return (
        <>
            <h1 className="text-3xl">{upperFirst(section)}</h1>
            <GoBack />
        </>
    );
}

export default Section;