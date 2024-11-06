import React from 'react';

// ChatMessage component
const ChatMessage = ({ message, userName, isSender }: { message: string; userName: string; isSender: boolean }) => {
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs rounded-lg p-4 ${isSender ? 'bg-primaryLight text-white' : 'bg-gray-200 text-black'}`}>
        {/* User Name and Timestamp */}
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm font-semibold'>{userName}</span>
        </div>
        {/* Message Content */}
        <p className='text-sm'>{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
