import { Input } from "@nextui-org/react";
import { SearchIcon } from "@/components/constants/Icons";

export default function Search({
    onChange,
    width,
    onClear
}: {
    onChange?: any
    onClear?: any
    width?: string
}) {
    return (
        <>
            <Input
                onChange={onChange}
                onClear={onClear}
                type="text"
                label={false}
                placeholder={"Search"}
                startContent={
                    <SearchIcon />
                }
                classNames={{
                    base: width ? width : "w-96",
                    inputWrapper: "bg-primary border border-borderColor data-[hover=true]:bg-primaryLighter group-data-[focus]:bg-primaryLighter rounded-small min-h-12",
                    innerWrapper: "bg-transparent",
                    input: "!text-white bg-transparent",
                }}
            />
        </>
    );
}
