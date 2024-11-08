'use client';
import PageHeading from '@/components/PageHeading';
import React, { useEffect, useRef, useState } from 'react';
import { getGroupInfo } from './actions';
import { GroupInfo, MessageType } from '@/constants/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ChatMessage from '@/components/ChatMessage';
import { jwtDecode } from 'jwt-decode';
import { TOKEN_KEY } from '@/constants/constants';
import { apiRoutes } from '@/constants/apiRoutes';
import AddMemberModal from '@/components/AddMemebrModal';
import { useDisclosure } from '@nextui-org/react';
import AlertError from '@/components/modal/AlertError';
import AlertSuccess from '@/components/modal/AlertSuccess';
import { ModalAlertTypesEnum } from '@/constants/enums';
import * as socketClusterClient from 'socketcluster-client';
import ReactDOM from 'react-dom';
import { useRouter } from 'next/navigation';
import Notification from '@/components/Notification';

const socket = socketClusterClient.create({
  hostname: 'localhost',
  port: 3000,
  authToken: 'ok',
});

const Chat = ({ params }: { params: { id: string } }) => {
  const [groupInfo, setGroupInfo] = useState<GroupInfo>({} as GroupInfo);
  const [userName, setUserName] = useState('');
  const [ws, setWs] = useState<WebSocket>();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [toastMessage, setToastMessage] = React.useState<string>('');
  const messageContainerRef = useRef<any>(null);
  const router = useRouter();

  const [notification, setNotification] = useState<{ message: string; type: string }>({
    message: '',
    type: '',
  });

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
    const loginToSocket = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      try {
        const response = await socket.invoke('login', { token });
        console.log('Login Response : ', response);
      } catch (error) {
        console.log(error);
      }
    };

    const joinRoom = async () => {
      console.log('Ab Call howa');

      const roomChannel = await socket.subscribe(params.id);

      try {
        for await (const message of roomChannel) {
          console.log('Message data', message);
          appendMessageComponent(message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const joinNotificationRoom = async () => {
      const token = localStorage.getItem(TOKEN_KEY); // Retrieve the token (from localStorage or cookies)
      let userData: any;
      if (token) {
        userData = await jwtDecode(token);

        console.log('Notification: ', `${userData.preferred_username}-notification`);
        const notificationChannel = await socket.subscribe(`${userData.preferred_username}-notification`);
        try {
          for await (const message of notificationChannel) {
            console.log('Notification data', message);

            setNotification({ message: message.message, type: 'success' });
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    const loadGroupInfo = async () => {
      console.log('params : ', params);
      await getGroupInfo(params.id)
        .then((data: GroupInfo) => {
          setGroupInfo(data);
        })
        .catch((e) => console.log(e));
    };

    const loadTokenData = async () => {
      const token = localStorage.getItem(TOKEN_KEY); // Retrieve the token (from localStorage or cookies)

      // Decode the token and extract an item

      if (token) {
        let userData: any;
        userData = jwtDecode(token);
        setUserName(userData.preferred_username);
        console.log('Decode token', userData); // { userId: 1, name: 'John Doe', ... }
        console.log(userName);
      }
    };

    const loginAndJoinRoom = async () => {
      await loadTokenData();
      await loadGroupInfo();
      await loginToSocket();
      joinRoom();
      joinNotificationRoom();
    };

    loginAndJoinRoom();

    return () => {
      socket.unsubscribe(params.id);
    };
  }, []);

  const handleAlertModals = (type: ModalAlertTypesEnum) => {
    if (type === ModalAlertTypesEnum.ERROR) {
      onErrorOpen();
    } else if (type === ModalAlertTypesEnum.SUCCESS) {
      onSuccessOpen();
    }
  };

  const appendMessageComponent = (message: MessageType) => {
    console.log('Appending..............');

    if (message.content === 'user left the chat' || message.content === 'A new user has joined the room') {
      return;
    }
    // Update the state to include the new message
    setMessages((prevMessages) => [...prevMessages, message]);

    // Scroll to the bottom of the message container after the update
    setTimeout(() => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }
    }, 0);
  };

  const sendMessage = async () => {
    if (input.trim()) {
      console.log('Sending Message');
      const sendingData = {
        content: input,
        token: localStorage.getItem(TOKEN_KEY),
        roomId: params.id,
      };
      try {
        await socket.invoke('sendMessage', sendingData);
      } catch (error: any) {
        console.log('Send Message Error ', error.message);
        setToastMessage(error.message);
        handleAlertModals(ModalAlertTypesEnum.ERROR);
        // onErrorClose();
        setTimeout(() => {
          router.push('/home');
        }, 3000);
      }
      setInput('');
    }
  };

  const handleSendMessage = () => {
    sendMessage();
  };
  return (
    <React.Fragment>
      <div className='max-w-[100%] flex flex-col'>
        {notification?.message !== '' ? (
          <Notification
            message={notification?.message}
            type={notification?.type}
            onClose={() => setNotification({ message: '', type: '' })}
          />
        ) : (
          ''
        )}

        {/* Chat Header the name of chat and a button to add member in group */}
        <AlertError isOpen={isErrorOpen} onOpenChange={onErrorOpenChange} message={toastMessage} />
        <AlertSuccess isOpen={isSuccessOpen} onOpenChange={onSuccessOpenChange} message={toastMessage} />

        <div className='flex-shrink-0'>
          <div className='chat-header'>
            <div className='flex justify-between border-b border-borderColor p-4'>
              <div>
                <h1 className='text-2xl font-bold'>{groupInfo.name}</h1>
                <p className='text-textColor'>Creator: {groupInfo.created_by}</p>
              </div>
              <AddMemberModal
                handleAlertModals={handleAlertModals}
                setToastMessage={setToastMessage}
                groupId={params.id}
              />
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={messageContainerRef} className='flex-grow p-4 overflow-y-auto scrollbar-hide h-[calc(100vh-220px)]'>
            {/* Chat messages go here */}
            {/* Example message: */}
            <ChatMessage message={'Hello, how are you?'} userName={userName} isSender={true} />
            <ChatMessage message={'Hello, how are you?'} userName={'John Doe'} isSender={false} />
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg.content}
                userName={msg.username}
                isSender={msg.username === userName}
              />
            ))}
          </div>

          {/* Chat Input */}
          <div className='w-full border-t border-borderColor '>
            <div className='p-4 flex items-center gap-4'>
              <Input
                className='mr-2 flex-1'
                placeholder='Type a message...'
                value={input}
                onChange={(e: any) => setInput(e.target.value)}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button variant={'primary'} onClick={handleSendMessage}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Chat;
