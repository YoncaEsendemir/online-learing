import React from 'react';

function CheckLocalStorageExpiration({ children }) {
  React.useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedData && storedData.expiration < new Date().getTime()) {
      localStorage.removeItem('loggedInUser');
      console.log('LocalStorage süresi dolmuş, silindi.');
    }
  }, []); // useEffect yalnızca bir kez çalışır

  return <>{children}</>; // children ile alt bileşenleri sarmalar
}

export default CheckLocalStorageExpiration;