"use client";
import { ListboxItem, Select as NextSelect, SelectItem } from "@nextui-org/react";

interface Option {
    label: string;
    value: string;
}

interface selectProptype {
    placeholder: string;
    classNamesBase?: any;
    options: any;
    label?: string;
    defaultSelectedKeys?: string;
    onChange?: any;
    stakeDays?: any;
    value?: any;
    isRequired?: boolean;
    disabled?: boolean;
    name?: string;
    onClick?: any;
}

export default function Select({
    placeholder,
    classNamesBase,
    options,
    label,
    defaultSelectedKeys,
    onChange,
    stakeDays,
    value,
    isRequired,
    disabled,
    name,
    onClick,
}: selectProptype) {
    return (
        <>
            <NextSelect
                label={label}
                onChange={onChange}
                isRequired={isRequired}
                placeholder={placeholder}
                labelPlacement="outside"
                name={name}
                value={value}
                isDisabled={disabled}
                disableSelectorIconRotation
                classNames={{
                    base: `w-32 ${classNamesBase}`,
                    trigger:
                        "bg-primary border border-borderColor data-[hover=true]:bg-gray-700/30 rounded-lg  min-h-12",
                    value: "!text-white",
                    popoverContent: "bg-primaryLight border border-borderColor",
                }}
                listboxProps={{
                    itemClasses: {
                        base: [
                            "transition-opacity",
                            "data-[hover=true]:bg-primary",
                            "data-[selectable=true]:focus:bg-primary",
                            "data-[pressed=true]:opacity-70",
                        ],
                        title: "text-white",
                        selectedIcon: "text-white"
                    },
                }}
            >
                {options?.map((option: any) => (
                    <SelectItem
                        onClick={() => onClick && onClick(option)}
                        key={option?.key}
                        value={option?.key}
                    >
                        {option?.label}
                    </SelectItem>
                ))}
            </NextSelect>
        </>
    );
}
