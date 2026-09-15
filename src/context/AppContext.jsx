import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [requests, setRequests] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [view, setView] = useState('dashboard');

  const currentUser = employees.find((e) => e.id === currentUserId) || null;
  const isAdmin = currentUser?.role === 'admin';

  // 사용 연차 계산
  const usedLeave = (empId) => {
    return requests
      .filter((r) => r.empId === empId && r.status === 'approved' && (r.type === '연차' || r.type === '반차'))
      .reduce((sum, r) => sum + r.days, 0);
  };

  const addRequest = (newReq) => {
    setRequests((prev) => [...prev, newReq]);
  };

  const updateRequestStatus = (id, status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <AppContext.Provider
      value={{
        employees, setEmployees,
        requests, setRequests,
        currentUserId, setCurrentUserId,
        currentUser, isAdmin,
        view, setView,
        usedLeave, addRequest, updateRequestStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
