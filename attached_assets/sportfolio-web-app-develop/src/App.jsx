
import FullscreenLoader from 'common/components/loaders/FullscreenLoader';
import { ORIGIN, PATH_DASHBOARD, PATH_SIGNIN, STORAGE_KEYS } from 'common/constants';
import { useEffect, useState } from 'react';
import { reRoute } from './utils/reRoutes';
import { useLocation } from 'react-router-dom';
import './App.css'
const App = () => {

  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if(localStorage.getItem(STORAGE_KEYS.TOKEN)){
      reRoute(`${ORIGIN}${PATH_DASHBOARD}`);
      setLoading(false);
    }else{
      if(location?.pathname.includes('/auth/')){
        reRoute(`${ORIGIN}${location?.pathname}`);
        setLoading(false);
      }else{
        reRoute(`${ORIGIN}${PATH_SIGNIN}`);
        setLoading(false);
      }
    }
  }, [location?.pathname]);

  return (
    <>{loading &&
      <FullscreenLoader text={'Checking Secure Connection...'} />
    }
    </>
  );
};

export default App;
