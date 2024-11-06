import { Modal as NextModal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import Button from '../Button';
import { CrossIcon } from '../constants/Icons';

const AlertError = ({
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
                <rect x='0.5' y='0.5' width='659' height='159' rx='15.5' fill='#E33B54' fill-opacity='0.1' />
                <rect x='0.5' y='0.5' width='659' height='159' rx='15.5' stroke='#E33B54' />
                <path
                  d='M330 120C307.939 120 290 102.055 290 80C290 57.9454 307.939 40 330 40C352.061 40 370 57.9443 370 80C370 102.056 352.057 120 330 120ZM330 43.8162C310.049 43.8162 293.818 60.0468 293.818 79.9978C293.818 99.9487 310.049 116.181 330 116.181C349.951 116.181 366.182 99.9487 366.182 79.9978C366.182 60.0468 349.951 43.8162 330 43.8162ZM348.948 67.0206L342.977 61.0496L330 74.0267L317.023 61.0496L311.052 67.0206L324.029 79.9978L311.052 92.9749L317.023 98.946L330 85.9688L342.977 98.946L348.948 92.9749L335.971 79.9978L348.948 67.0206Z'
                  fill='#E33B54'
                />
              </svg>

              <h4 className={'text-2xl font-bold text-white'}>Oops!</h4>
              <p>{message ? message : ''}</p>
            </ModalBody>
            <ModalFooter className='mb-4 justify-center'>
              <Button variant='error' onClick={onClose}>
                Try Again
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </NextModal>
  );
};

export default AlertError;
