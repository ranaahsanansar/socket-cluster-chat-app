import React from 'react'
import Modal from '@/components/modal/Modal'
import Link from 'next/link'
import { Discord, FacebookIcon, Instagram, Medium, Telegram, Twitter, Youtube } from '../constants/SocialIcons'

const SocialModal = ({
    isOpen,
    onOpenChange,
    links
}: {
    isOpen: any
    onOpenChange: any
    links: any
}) => {

    const icons: any = {
        facebook: <FacebookIcon />,
        youtube: <Youtube />,
        instagram: <Instagram />,
        twitter: <Twitter />,
        telegram: <Telegram />,
        medium: <Medium />,
        discord: <Discord />,
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={"3xl"} hidePrimaryButton={false} secondaryButtonText={"Ok"}>
            <h1 className='font-bold text-2xl'>Project Socials</h1>
            <p className='text-textColor mt-4 text-[18px]'>All the socials linked to the project.</p>
            <div className='my-8 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 items-center'>
                {
                    links?.map((link: any, i:number) => {
                        return <Link key={i} href={link?.link} className={"flex flex-col items-center gap-2 group"}>
                            <div className='bg-primaryBase w-[45px] h-[45px] flex justify-center items-center rounded-lg group-hover:fill-secondary fill-textColor'>{icons[link?.name.toLowerCase()]}</div>
                            <span >{link?.name}</span>
                        </Link>
                    })
                }
            </div>
        </Modal>
    )
}

export default SocialModal