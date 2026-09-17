// App.jsx
// 메인 레이아웃 및 상태 통합

import React, { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import RequestForm from "./components/RequestForm";
import LeaveMine from "./components/LeaveMine";
import TeamCalendar from "./components/TeamCalendar";
import StaffAdmin from "./components/StaffAdmin";

import { useHrStore } from "./hooks/useHrStore";
import { todayStr } from "./utils/leave";

const DEPARTMENTS = [
  { key: "개발팀", label: "개발팀" },
  { key: "인사팀", label: "인사팀" },
  { key: "재무팀", label: "재무팀" },
  { key: "영업팀", label: "영업팀" },
  { key: "기획팀", label: "기획팀" },
];

function Onboarding({ saveEmployees, setCurrentUserId }) {

  
  const [name, setName] = useState("");
  const [dept, setDept] = useState(DEPARTMENTS[0].key);
  const [join, setJoin] = useState(todayStr());

  async function submit() {
    if (!name.trim()) return alert("이름을 입력해주세요.");
    const emp = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: name.trim(),
      dept: dept.trim() || "-",
      joinDate: join,
      role: "admin",
    };
    setCurrentUserId(emp.id);
    await saveEmployees([emp]);
  }

  return (
    <div className="onboard-box">
      <div className="card">
        <div className="page-title" style={{ marginBottom: 6 }}>
          근태 대장 시작하기
        </div>
      <br></br>
        <div className="form-row">
          <div className="field">
            <label>이름</label>
            <input placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>부서</label>
            <select value={dept} onChange={(e) => setDept(e.target.value)}>
              {DEPARTMENTS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>입사일</label>
            <input type="date" value={join} onChange={(e) => setJoin(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={submit}>
          관리자로 시작하기
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { employees, requests, loading, saveEmployees, saveRequests } = useHrStore();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [view, setView] = useState("dashboard");

  // 최초 로드 시 첫 번째 직원을 현재 사용자로 지정
  if (!loading && employees.length && !currentUserId) {
    setCurrentUserId(employees[0].id);
  }

  if (loading) return <div className="empty-state">불러오는 중…</div>;
  if (!employees.length) return <Onboarding saveEmployees={saveEmployees} setCurrentUserId={setCurrentUserId} />;

  const user = employees.find((e) => e.id === currentUserId) || employees[0];
  const isAdmin = user?.role === "admin";

  function renderView() {
    switch (view) {
      case "dashboard":
        return <Dashboard employees={employees} requests={requests} currentUserId={user.id} />;
      case "request":
        return (
          <RequestForm
            currentUserId={user.id}
            requests={requests}
            saveRequests={saveRequests}
            onSubmitted={() => setView("mine")}
          />
        );
      case "mine":
        return <LeaveMine requests={requests} currentUserId={user.id} />;
      case "calendar":
        return <TeamCalendar employees={employees} requests={requests} />;
      case "approvals":
      case "staff":
        return isAdmin ? (
          <StaffAdmin
            view={view}
            employees={employees}
            requests={requests}
            saveEmployees={saveEmployees}
            saveRequests={saveRequests}
            currentUserId={user.id}
          />
        ) : (
          <div className="empty-state">관리자만 볼 수 있는 화면입니다.</div>
        );
      default:
        return null;
    }
  }

  return (
    <div id="app">
      <Sidebar view={view} onChangeView={setView} isAdmin={isAdmin} />
      <div className="main">
        <Topbar
          view={view}
          employees={employees}
          currentUserId={user.id}
          onChangeUser={setCurrentUserId}
          isAdmin={isAdmin}
        />
        <div id="view-body">{renderView()}</div>
      </div>
    </div>
  );
}
