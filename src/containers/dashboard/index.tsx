import {
  useEffect,
} from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import Layout from './layout';
import {
  ROUTES,
} from './router';

import axios from "axios";

const DashboardPage = () => {
  
  useEffect(() => {
    // const prefix = 'http://localhost:9000/api';
    const prefix = 'http://api.aaa.com:9000/api';

    axios.request({
      url: `${prefix}/hello`,
      method: 'get',
      withCredentials: true,
    }).finally(fetchList);
    
    async function fetchList() {
      axios.request({
        url: `${prefix}/list`,
        method: 'get',
        withCredentials: true,
      })
        .then(function (response) {
          // handle success
          console.log('[success]:', response);
        })
        .catch(function (error) {
          // handle error
          console.log('[error]:', error);
        })
        .finally(function () {
          // always executed
        });
    }

  }, []);
  return (
    <Layout>
      <Routes>
        {ROUTES.map(route => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </Layout>
  );
};

export default DashboardPage;