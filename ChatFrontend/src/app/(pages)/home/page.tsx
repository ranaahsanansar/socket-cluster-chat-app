'use client';
import DashboardCard from '@/components/Card';
import PageHeading from '@/components/PageHeading';
import { GroupCardResponse } from '@/constants/types';
import React, { useEffect } from 'react';
import { getAllGroupsCards, searchGroups } from './actions';
import { TOKEN_KEY } from '@/constants/constants';
import Input from '@/components/Input';
import { useDebounce } from '@/utils/hooks';
import Button from '@/components/Button';
import CreateGroupModal from '@/components/CreateGroupModal';
import { useDisclosure } from '@nextui-org/react';
import AlertError from '@/components/modal/AlertError';
import AlertSuccess from '@/components/modal/AlertSuccess';
import { ModalAlertTypesEnum } from '@/constants/enums';
// import { DashboardCards } from '@/constants/types';
// import { getDashboardCards } from './actions';

const Home = () => {
  // const data: GroupCardResponse = await getAllGroupsCards();
  const [searchKey, setSearchKey] = React.useState('');
  const [revalidate, setRevalidate] = React.useState(false);

  const debouncedSearchKey = useDebounce(searchKey, 500);
  const [data, setData] = React.useState<Array<GroupCardResponse>>([]);
  const [toastMessage, setToastMessage] = React.useState<string>('');

  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
    onOpenChange: onErrorOpenChange,
  } = useDisclosure();

  const {
    isOpen: isSuccessOpen,
    onOpen: onSuccessOpen,
    onClose: onSuccessClose,
    onOpenChange: onSuccessOpenChange,
  } = useDisclosure();

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await getAllGroupsCards(token);
      console.log('Response : ', response);
      setData(Array.isArray(response) ? response : []);
    };

    const loadSearchData = async () => {
      const response = await searchGroups(searchKey).catch((e) => console.log(e));
      console.log('Response : ', response);
      setData(Array.isArray(response) ? response : []);
    };

    if (searchKey === '') {
      console.log('Load data');
      loadData();
    } else if (searchKey !== '') {
      loadSearchData();
      console.log('Search data');
    }
    console.log('data : ', data);
  }, [debouncedSearchKey, revalidate]);

  const handleSearchChange = (key: string) => {
    console.log('first : ', key);
    setSearchKey(key);
  };

  const triggerRevalidate = () => {
    console.log('Revalidate');
    setRevalidate(!revalidate);
  };

  const handleAlertModals = (type: ModalAlertTypesEnum) => {
    if (type === ModalAlertTypesEnum.ERROR) {
      onErrorOpen();
    } else if (type === ModalAlertTypesEnum.SUCCESS) {
      onSuccessOpen();
    }
  };
  return (
    <div className='max-w-[100%] 2xl:max-w-[90%]'>
      <PageHeading heading='Home Go Chat' className='mb-4' />
      <p>You can only enter to those groups which you have joined.</p>
      <CreateGroupModal
        handleRevalidate={triggerRevalidate}
        handleAlertModals={handleAlertModals}
        setToastMessage={setToastMessage}
      />
      <AlertError isOpen={isErrorOpen} onOpenChange={onErrorOpenChange} message={toastMessage} />
      <AlertSuccess isOpen={isSuccessOpen} onOpenChange={onSuccessOpenChange} message={toastMessage} />

      <div className='w-full mt-4'>
        <Input
          name='email'
          placeholder='Explore new Groups'
          type='text'
          onChange={(e: any) => {
            handleSearchChange(e.target.value);
          }}
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6'>
        {data.map((item) => (
          <DashboardCard
            handleRevalidate={triggerRevalidate}
            handleAlertModals={handleAlertModals}
            setToastMessage={setToastMessage}
            groupId={String(item.group_id)}
            key={item.group_id}
            primaryText={item.name}
            isDeleteAble={item.is_delete_able}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
