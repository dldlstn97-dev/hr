import { useApp } from './context/AppContext';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import Dashboard from './components/Dashboard/Dashboard';
import RequestForm from './components/Request/RequestForm';
import TeamCalendar from './components/Calendar/TeamCalendar';
import Approvals from './components/Approvals/Approvals';
import StaffManagement from './components/Staff/StaffManagement';

export default function App() {
  const { view, employees } = useApp();

  if (!employees.length) {
    return <div>온보딩 화면 컴포넌트</div>;
  }

  return (
    <div id="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div id="view-body">
          {view === 'dashboard' && <Dashboard />}
          {view === 'request' && <RequestForm />}
          {view === 'calendar' && <TeamCalendar />}
          {view === 'approvals' && <Approvals />}
          {view === 'staff' && <StaffManagement />}
        </div>
      </div>
    </div>
  );
}
