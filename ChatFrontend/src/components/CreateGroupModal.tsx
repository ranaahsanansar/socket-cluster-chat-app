import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';

import Input from './Input';
import Button from './Button';
import { use, useEffect, useState } from 'react';
import { crateGroup } from '@/app/(pages)/home/actions';
import { TOKEN_KEY } from '@/constants/constants';
import { ModalAlertTypesEnum } from '@/constants/enums';

export default function CreateGroupModal({
  handleRevalidate,
  handleAlertModals,
  setToastMessage,
}: {
  handleRevalidate: () => void;
  handleAlertModals: (type: ModalAlertTypesEnum) => void;
  setToastMessage: (message: string) => void;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [name, setName] = useState('');

  useEffect(() => {
    setName('');
  }, [isOpen]);

  const handleCreateClick = async () => {
    console.log(name);
    if (name === '') {
      onClose();
      return;
    }
    await crateGroup({ name }, localStorage.getItem(TOKEN_KEY))
      .then(() => {
        console.log('Group created successfully');
        setToastMessage('Group created successfully');
        handleAlertModals(ModalAlertTypesEnum.SUCCESS);
      })
      .catch((e) => {
        console.log('Error : ', e);
        setToastMessage(e.message);
        handleAlertModals(ModalAlertTypesEnum.ERROR);
      });
    handleRevalidate();
    onClose();
  };
  return (
    <>
      <Button onClick={onOpen} className='my-2'>
        Crate New Group
      </Button>
      <Modal className='bg-primary' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1 text-white'>Create new Group</ModalHeader>
              <ModalBody>
                <Input label='Name' placeholder='Name' onChange={(e: any) => setName(e.target.value)} />
              </ModalBody>
              <ModalFooter>
                <Button variant='error' onClick={onClose}>
                  Close
                </Button>
                <Button variant='primary' onClick={handleCreateClick}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
