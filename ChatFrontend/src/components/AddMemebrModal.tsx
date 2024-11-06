import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';

import Input from './Input';
import Button from './Button';
import { use, useEffect, useState } from 'react';
import { crateGroup } from '@/app/(pages)/home/actions';
import { TOKEN_KEY } from '@/constants/constants';
import { ModalAlertTypesEnum } from '@/constants/enums';
import { addMember } from '@/app/(pages)/chat/[id]/actions';

export default function AddMemberModal({
  groupId,
  handleAlertModals,
  setToastMessage,
}: {
  groupId: string;
  handleAlertModals: (type: ModalAlertTypesEnum) => void;
  setToastMessage: (message: string) => void;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [name, setName] = useState('');

  useEffect(() => {
    setName('');
  }, [isOpen]);

  const handleAddClick = async () => {
    console.log(name);
    if (name === '') {
      onClose();
      return;
    }
    await addMember(groupId, name, localStorage.getItem(TOKEN_KEY))
      .then(() => {
        console.log('Member Added successfully');
        setToastMessage('Member Added successfully');
        handleAlertModals(ModalAlertTypesEnum.SUCCESS);
      })
      .catch((e) => {
        console.log('Error : ', e);
        setToastMessage(e.message);
        handleAlertModals(ModalAlertTypesEnum.ERROR);
      });

    onClose();
  };
  return (
    <>
      <Button onClick={onOpen} className='my-2'>
        Add Member
      </Button>
      <Modal className='bg-primary' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1 text-white'>Create new Group</ModalHeader>
              <ModalBody>
                <Input label='Username' placeholder='Username' onChange={(e: any) => setName(e.target.value)} />
              </ModalBody>
              <ModalFooter>
                <Button variant='error' onClick={onClose}>
                  Close
                </Button>
                <Button variant='primary' onClick={handleAddClick}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
