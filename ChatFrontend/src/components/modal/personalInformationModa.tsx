import React from 'react'
import Modal from '@/components/modal/Modal'
import Input from '@/components/Input'

const PersonalInformationModal = ({
    isOpen,
    onOpenChange
}: {
    isOpen: any
    onOpenChange: any
}) => {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} primaryButtonAction={() => { }} primaryButtonText='Save Changes'>
            <h1 className='font-bold text-2xl mt-4 '>Personal Information</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 pb-8 '>
                <div>
                    <div className='flex flex-col gap-8 mt-8'>
                        <Input label='Project Title' placeholder='Project Title' />
                        <Input label='Project Instagram' placeholder='https://' />
                        <Input label='Project Medium' placeholder='https://' />
                        <Input label='Project Youtube' placeholder='https://' />
                        <Input label='Project Description' placeholder='Description' />
                    </div>
                </div>
                <div>
                    <div className='flex flex-col gap-8 mt-8'>
                        <Input label='Project Facebook' placeholder='https://' />
                        <Input label='Project Discord' placeholder='https://' />
                        <Input label='Project Telegram' placeholder='https://' />
                        <Input label='Project Twitter' placeholder='https://' />
                        <Input label='About Project' placeholder='About' />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default PersonalInformationModal