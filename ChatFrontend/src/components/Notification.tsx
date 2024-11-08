// components/Notification.js
import { useEffect, useState } from 'react';

const Notification = ({
  message,
  type,
  onClose,
}: {
  message: string | undefined;
  type: string | undefined;
  onClose: () => void;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000); // Notification will disappear after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '10px 20px',
        backgroundColor: type === 'success' ? '#4caf50' : '#f44336',
        color: 'white',
        borderRadius: '5px',
        zIndex: 1000,
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      {message}
    </div>
  );
};

export default Notification;
