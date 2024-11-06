import React from 'react'
import { Button as NextButton } from "@nextui-org/button";

const Button = ({
    className,
    type,
    onClick,
    isDisabled,
    isLoading,
    children,
    id,
    variant,
    endContent
}: {
    className?: string;
    type?: any;
    onClick?: any;
    isDisabled?: any;
    isLoading?: boolean;
    children?: any;
    id?: string;
    variant?: any
    endContent?: any
}) => {
    const defaultStyles = "px-6 bg-secondary rounded-lg text-primary text-base min-h-12 font-semibold tracking-wide min-w-max disabled:border-borderSecondaryColor disabled:text-borderSecondaryColor"
    const variants: any = {
        primary: defaultStyles,
        secondary: defaultStyles + " " + "bg-transparent text-secondary border-2 border-secondary font-medium hover:bg-secondary hover:text-black",
        ghost: "bg-transparent p-0 min-w-fit",
        error: defaultStyles + " " + "bg-errorColor text-black border-2 border-errorColor font-medium hover:bg-errorColor/80 hover:text-black",
    }
    return (
        <NextButton id={id}
            isDisabled={isDisabled}
            onClick={onClick}
            type={type}
            isLoading={isLoading}
            endContent={endContent}
            className={`${variant ? variants[variant] : variants["primary"]} ${className}`}>{children}</NextButton>
    )
}

export default Button