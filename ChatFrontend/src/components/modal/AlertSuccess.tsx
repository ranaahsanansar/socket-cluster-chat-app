import { Modal as NextModal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import Button from '../Button';
import { CrossIcon } from '../constants/Icons';

const AlertSuccess = ({
  isOpen,
  onOpenChange,
  size,
  message,
}: {
  isOpen: any;
  onOpenChange: any;
  size?: any;
  message?: any;
}) => {
  return (
    <NextModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior={'inside'}
      className={'bg-primary text-white'}
      size={size ? size : 'xl'}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className='mt-4 text-center text-textColor'>
              <svg
                className={'w-full'}
                width='660'
                height='160'
                viewBox='0 0 660 160'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect x='0.5' y='0.5' width='659' height='159' rx='15.5' fill='#9FC131' fill-opacity='0.1' />
                <rect x='0.5' y='0.5' width='659' height='159' rx='15.5' stroke='#9FC131' />
                <path
                  d='M330 120C307.939 120 290 102.056 290 80C290 57.9443 307.944 40 330 40C352.056 40 370 57.9454 370 80C370 102.055 352.057 120 330 120ZM330 43.8162C310.049 43.8162 293.817 60.0479 293.817 79.9989C293.817 99.9499 310.049 116.181 330 116.181C349.951 116.181 366.182 99.9499 366.182 79.9989C366.182 60.0479 349.951 43.8162 330 43.8162ZM354.702 66.5794L348.731 60.6039L321.893 87.4462L311.268 76.8212L305.297 82.7922L321.899 99.3939L354.702 66.5794Z'
                  fill='#9FC131'
                />
              </svg>
              <h4 className={'text-2xl font-bold text-white'}>Success!</h4>
              <p>{message ? message : ''}</p>
            </ModalBody>
            <ModalFooter className='mb-4 justify-center'>
              <Button variant='primary' onClick={onClose}>
                ok
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </NextModal>
  );
};

export default AlertSuccess;
