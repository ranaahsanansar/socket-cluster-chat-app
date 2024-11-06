import { deleteGroup } from '@/app/(pages)/home/actions';
import { TOKEN_KEY } from '@/constants/constants';
import { ModalAlertTypesEnum } from '@/constants/enums';
import Link from 'next/link';
import React from 'react';

const DashboardCard = ({
  primaryText,
  groupId,
  showSlash,
  className,
  handleAlertModals,
  setToastMessage,
  handleRevalidate,
  isDeleteAble,
}: {
  primaryText: string;
  groupId: string;
  showSlash?: boolean;
  className?: string;
  handleAlertModals: (type: ModalAlertTypesEnum) => void;
  setToastMessage: (message: string) => void;
  handleRevalidate: () => void;
  isDeleteAble?: boolean;
}) => {
  const handleDelete = async (id: string) => {
    console.log('deleted');

    if (window.confirm('Are you sure you want to delete this group?')) {
      console.log('Group deleted successfully');

      await deleteGroup(id, localStorage.getItem(TOKEN_KEY))
        .then(() => {
          handleAlertModals(ModalAlertTypesEnum.SUCCESS);
          setToastMessage('Group deleted successfully');
          handleRevalidate();
        })
        .catch((e) => {
          console.log('Error : ', e);
          handleAlertModals(ModalAlertTypesEnum.ERROR);
          setToastMessage(e.message);
        });
    }
  };

  return (
    <div className={`p-6 bg-primaryLight rounded-2xl ${className}`}>
      <h2 className='text-white font-semibold text-[18px]'>{primaryText ? primaryText : '-'}</h2>
      <p>Group</p>
      <div className='flex gap-2 items-center'>
        <span className='text-secondary font-medium text-[16px]'>
          {' '}
          <Link href={`/chat/${groupId}`}>Open</Link>
        </span>
        {isDeleteAble ? (
          <span
            className='text-errorColor font-medium text-[16px] cursor-pointer '
            onClick={() => handleDelete(groupId)}
          >
            Delete
          </span>
        ) : (
          ''
        )}
      </div>
      <div className='flex gap-2 items-center mt-2'>
        {showSlash && <span className='text-textColor font-medium text-[16px]'>/</span>}
      </div>
    </div>
  );
};

export default DashboardCard;
