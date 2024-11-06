import React from 'react';
import Modal from '@/components/modal/Modal';
import Input from '@/components/Input';

const LaunchIdoModal = ({ isOpen, onOpenChange }: { isOpen: any; onOpenChange: any }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} primaryButtonAction={() => {}}>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 pb-8 border-b border-borderColor'>
        <div>
          <h1 className='font-bold text-2xl'>Set Min Cap</h1>
          <div className='flex flex-col gap-8 mt-8'>
            <Input label='Tire One' placeholder='03' type={'number'} />
            <Input label='Tire Two' placeholder='02' type={'number'} />
            <Input label='Tire Three' placeholder='01' type={'number'} />
          </div>
        </div>
        <div>
          <h1 className='font-bold text-2xl'>Set Max Cap</h1>
          <div className='flex flex-col gap-8 mt-8'>
            <Input label='Tire One' placeholder='03' type={'number'} />
            <Input label='Tire Two' placeholder='02' type={'number'} />
            <Input label='Tire Three' placeholder='01' type={'number'} />
          </div>
        </div>
      </div>
      <div className='my-6 flex justify-between items-center'>
        <h3>Total Cap: 6</h3>
        <h3>Remaining supply: -6</h3>
      </div>
    </Modal>
  );
};

export default LaunchIdoModal;
