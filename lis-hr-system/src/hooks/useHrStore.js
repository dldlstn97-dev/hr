// hooks/useHrStore.js
//
// ⚠️ 중요: window.storage 는 claude.ai 아티팩트 환경에서만 존재하는 API입니다.
// 이 훅을 순수 웹(Vite 빌드 후 독립 배포 등) 환경에서 실행하려면
// window.storage 호출부를 localStorage, 자체 백엔드 API, 또는 Supabase 등으로
// 교체해야 합니다. 지금은 claude.ai 단일 파일 버전과의 1:1 대응을 위해
// 원본 로직을 그대로 옮겨 두었습니다.

import { useState, useEffect, useCallback } from "react";

const EMP_KEY = "hratd:employees";
const REQ_KEY = "hratd:leave_requests";

export function useHrStore() {
  const [employees, setEmployees] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let emp = [];
        let req = [];
        try {
          const e = await window.storage.get(EMP_KEY, true);
          emp = e ? JSON.parse(e.value) : [];
        } catch (_) {
          emp = [];
        }
        try {
          const r = await window.storage.get(REQ_KEY, true);
          req = r ? JSON.parse(r.value) : [];
        } catch (_) {
          req = [];
        }
        setEmployees(emp);
        setRequests(req);
      } catch (err) {
        setError("데이터를 불러오지 못했습니다. 새로고침 해보세요.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveEmployees = useCallback(async (list) => {
    setEmployees(list);
    try {
      await window.storage.set(EMP_KEY, JSON.stringify(list), true);
    } catch (_) {
      alert("저장에 실패했습니다. 네트워크를 확인해주세요.");
    }
  }, []);

  const saveRequests = useCallback(async (list) => {
    setRequests(list);
    try {
      await window.storage.set(REQ_KEY, JSON.stringify(list), true);
    } catch (_) {
      alert("저장에 실패했습니다. 네트워크를 확인해주세요.");
    }
  }, []);

  return { employees, requests, loading, error, saveEmployees, saveRequests };
}
