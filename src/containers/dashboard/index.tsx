
import {
  Routes,
  Route,
} from "react-router-dom";
import Layout from './layout';
import {
  ROUTES,
} from './router';

const DashboardPage = () => {
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