import React from 'react'

const PageHeading = ({ heading, className="" }: {
    heading: string,
    className?: string
}) => {
    return (
        <h1 className={`font-bold text-2xl mt-12 ${className}` }>{heading}</h1>
    )
}

export default PageHeading