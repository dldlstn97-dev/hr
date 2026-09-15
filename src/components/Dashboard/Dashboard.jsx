import { useApp } from '../../context/AppContext';
import { calcAccrued, todayStr, fmtDate } from '../../utils/dateUtils';

export default function Dashboard() {
  const { currentUser, employees, requests, usedLeave, isAdmin } = useApp();

  if (!currentUser) return null;

  const accrued = calcAccrued(currentUser.joinDate);
  const used = usedLeave(currentUser.id);
  const remaining = Math.max(0, accrued - used);

  const today = todayStr();
  const onLeaveToday = requests.filter(
    (r) => r.status === 'approved' && r.startDate <= today && r.endDate >= today
  );
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const recentRequests = requests
    .filter((r) => r.empId === currentUser.id)
    .sort((a, b) => b.requestedAt - a.requestedAt)
    .slice(0, 4);

  return (
    <div>
      <div className="grid grid-4">
        <div className="card">
          <div className="stat-label">내 잔여 연차</div>
          <div className="stat-num">{remaining}일</div>
          <div className="stat-sub">발생 {accrued}일 · 사용 {used}일</div>
        </div>
        <div className="card">
          <div className="stat-label">오늘 휴가자</div>
          <div className="stat-num">{onLeaveToday.length}명</div>
          <div className="stat-sub">
            {onLeaveToday.length ? onLeaveToday.map((r) => r.empId).join(', ') : '전원 출근'}
          </div>
        </div>
        <div className="card">
          <div className="stat-label">전체 직원 수</div>
          <div className="stat-num">{employees.length}명</div>
          <div className="stat-sub">관리자 {employees.filter((e) => e.role === 'admin').length}명</div>
        </div>
        {isAdmin && (
          <div className="card">
            <div className="stat-label">대기 중인 승인</div>
            <div className="stat-num">{pendingCount}건</div>
            <div className="stat-sub">{pendingCount ? '확인이 필요합니다' : '모두 처리됨'}</div>
          </div>
        )}
      </div>

      <div className="section">
        <div className="section-title">내 최근 신청 내역</div>
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr><th>종류</th><th>기간</th><th>일수</th><th>상태</th></tr>
            </thead>
            <tbody>
              {recentRequests.length ? (
                recentRequests.map((r) => (
                  <tr key={r.id}>
                    <td>{r.type}</td>
                    <td>{fmtDate(r.startDate)}{r.startDate !== r.endDate && ` ~ ${fmtDate(r.endDate)}`}</td>
                    <td>{r.days}일</td>
                    <td>
                      <span className={`stamp ${r.status}`}>
                        {r.status === 'approved' ? '승인됨' : r.status === 'rejected' ? '반려됨' : '대기중'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row"><td colSpan="4">아직 신청 내역이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
