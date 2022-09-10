import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    condition: () => boolean;
}>;

export const If = (props: Props) => {
    return props.condition() ? <>{props.children}</> : null;
}