"use client";

import { formatDate } from "@/lib/utils";

type Record = {
  id: string;
  depositDate: string;
  depositTime: string;
  cardAction: string;
  ballAction: string;
  cards: number;
  balls: number;
  remainingCards: number;
  remainingBalls: number;
  totalText: string;
  status: string;
  createdByName: string;
  createdAt: string;
};

type CustomerData = {
  phone: string;
  fullName: string;
  totalCards: number;
  totalBalls: number;
  records: Record[];
};

function getStatusClass(status: string) {
  if (status === "Đang gửi") return "status-active";
  if (status === "Đã nhận lại") return "status-done";
  if (status === "Đã đổi quà") return "status-exchanged";
  if (status === "Đã hủy") return "status-canceled";
  return "status-done";
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return name.slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function isWithdraw(action: string) {
  return action === "Lấy thẻ" || action === "Lấy bi";
}

export default function CustomerInfo({
  data,
  onBack,
}: {
  data: CustomerData;
  onBack: () => void;
}) {
  const activeRecords = data.records.filter((r) => r.status === "Đang gửi");
  const oldRecords = data.records.filter((r) => r.status !== "Đang gửi");

  return (
    <>
      {/* Background orbs */}
      <div className="bg-decoration" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <main className="page-wrapper">
        <div className="info-page animate-in">
          {/* Back button */}
          <button
            id="back-btn"
            type="button"
            className="back-btn"
            onClick={onBack}
            aria-label="Quay lại trang tra cứu"
          >
            ← Tra cứu số khác
          </button>

          {/* Profile card */}
          <div className="profile-card animate-in animate-in-delay-1">
            <div className="profile-avatar" aria-hidden="true">
              {getInitials(data.fullName)}
            </div>
            <div className="profile-name">{data.fullName}</div>
            <div className="profile-phone">📱 {data.phone}</div>

            {/* Stats */}
            <div className="stats-row" aria-label="Tổng tài sản đang gửi">
              <div className="stat-card" aria-label={`${data.totalCards} thẻ đang giữ`}>
                <div className="stat-icon" aria-hidden="true">🃏</div>
                <div className="stat-value">{data.totalCards}</div>
                <div className="stat-label">Thẻ đang giữ</div>
              </div>
              <div className="stat-card" aria-label={`${data.totalBalls} bi đang giữ`}>
                <div className="stat-icon" aria-hidden="true">🎱</div>
                <div className="stat-value">{data.totalBalls}</div>
                <div className="stat-label">Bi đang giữ</div>
              </div>
            </div>
          </div>

          {/* Active records */}
          <div className="animate-in animate-in-delay-2">
            <div className="section-title">
              <span aria-hidden="true">📋</span>
              Bản ghi đang gửi ({activeRecords.length})
            </div>
            {activeRecords.length === 0 ? (
              <div className="card empty-state">
                <div className="empty-state-icon" aria-hidden="true">📭</div>
                <p className="empty-state-text">Không có bản ghi đang gửi.</p>
              </div>
            ) : (
              <div className="records-list" role="list">
                {activeRecords.map((r) => (
                  <RecordCard key={r.id} record={r} />
                ))}
              </div>
            )}
          </div>

          {/* Old records */}
          {oldRecords.length > 0 && (
            <div className="animate-in animate-in-delay-3" style={{ marginTop: 24 }}>
              <div className="section-title">
                <span aria-hidden="true">🕘</span>
                Lịch sử cũ ({oldRecords.length})
              </div>
              <div className="records-list" role="list">
                {oldRecords.map((r) => (
                  <RecordCard key={r.id} record={r} />
                ))}
              </div>
            </div>
          )}

          <footer className="footer">
            Chỉ xem · Không thể chỉnh sửa · Baby Ress Games
          </footer>
        </div>
      </main>
    </>
  );
}

function RecordCard({ record: r }: { record: Record }) {
  return (
    <article className="record-card" role="listitem">
      <div className="record-header">
        <div>
          <div className="record-date">{formatDate(r.depositDate)} — {r.depositTime}</div>
          <div className="record-time">Nhân viên: {r.createdByName}</div>
        </div>
        <span className={`status-badge ${getStatusClass(r.status)}`}>
          {r.status}
        </span>
      </div>

      <div className="record-body">
        {/* Card action */}
        {r.cards > 0 && (
          <>
            <span className={`record-chip chip-action${isWithdraw(r.cardAction) ? " chip-action" : ""}`}>
              {r.cardAction}
            </span>
            <span className="record-chip chip-card">
              🃏 {r.cards} thẻ
              {r.status === "Đang gửi" && r.remainingCards !== r.cards && (
                <> → còn {r.remainingCards}</>
              )}
            </span>
          </>
        )}

        {/* Ball action */}
        {r.balls > 0 && (
          <>
            <span className={`record-chip chip-action`}>
              {r.ballAction}
            </span>
            <span className="record-chip chip-ball">
              🎱 {r.balls} bi
              {r.status === "Đang gửi" && r.remainingBalls !== r.balls && (
                <> → còn {r.remainingBalls}</>
              )}
            </span>
          </>
        )}
      </div>

      {r.status === "Đang gửi" && (r.remainingCards > 0 || r.remainingBalls > 0) && (
        <div className="record-footer">
          Đang giữ:
          {r.cardAction !== "Lấy thẻ" && r.remainingCards > 0 && (
            <> 🃏 <strong>{r.remainingCards} thẻ</strong></>
          )}
          {r.ballAction !== "Lấy bi" && r.remainingBalls > 0 && (
            <> 🎱 <strong>{r.remainingBalls} bi</strong></>
          )}
        </div>
      )}
    </article>
  );
}
