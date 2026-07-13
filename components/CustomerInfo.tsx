"use client";

import { formatDate } from "@/lib/utils";
import { Sun, Moon, Smartphone, Ticket, CircleDot, ClipboardList } from "lucide-react";

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



export default function CustomerInfo({
  data,
  onBack,
  theme,
  onToggleTheme,
}: {
  data: CustomerData;
  onBack: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  const activeRecords = data.records.filter((r) => r.status === "Đang gửi");
  const oldRecords = data.records.filter((r) => r.status !== "Đang gửi");

  return (
    <>
      {/* Background orbs */}
      <div className="bg-decoration" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>

      <main className="page-wrapper">
        <div className="info-page animate-in">
          {/* Top Controls Container */}
          <div className="top-controls glass-surface">
            {/* Back button */}
            <button
              id="back-btn"
              type="button"
              className="back-btn glass-surface"
              onClick={onBack}
              aria-label="Quay lại trang tra cứu"
            >
              ← Tra cứu số khác
            </button>

            {/* Theme toggle */}
            <button
              className="theme-toggle glass-surface"
              onClick={onToggleTheme}
              aria-label={theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
              title={theme === "dark" ? "Light Glass" : "Dark Glass"}
            >
              {theme === "dark" ? (
                <Sun className="w-[18px] h-[18px]" aria-hidden="true" style={{ display: "block" }} />
              ) : (
                <Moon className="w-[18px] h-[18px]" aria-hidden="true" style={{ display: "block" }} />
              )}
            </button>
          </div>

          {/* Profile card */}
          <div className="profile-card glass-surface-strong animate-in animate-in-delay-1">
            <div className="profile-avatar glass-surface" aria-hidden="true">
              {getInitials(data.fullName)}
            </div>
            <div className="profile-name">{data.fullName}</div>
            <div className="profile-phone">
              <Smartphone className="w-4 h-4 inline-block mr-1 text-slate-400" aria-hidden="true" />
              {data.phone}
            </div>

            {/* Stats */}
            <div className="stats-row" aria-label="Tổng tài sản đang gửi">
              <div className="stat-card glass-surface-soft" aria-label={`${data.totalCards} thẻ đang giữ`}>
                <div className="stat-icon" aria-hidden="true">
                  <Ticket className="w-6 h-6 mx-auto text-blue-500" />
                </div>
                <div className="stat-value">{data.totalCards}</div>
                <div className="stat-label">THẺ ĐANG GIỮ</div>
              </div>
              <div className="stat-card glass-surface-soft" aria-label={`${data.totalBalls} bi đang giữ`}>
                <div className="stat-icon" aria-hidden="true">
                  <CircleDot className="w-6 h-6 mx-auto text-cyan-500" />
                </div>
                <div className="stat-value">{data.totalBalls}</div>
                <div className="stat-label">BI ĐANG GIỮ</div>
              </div>
            </div>
          </div>

          {/* Active records */}
          <div className="animate-in animate-in-delay-2">
            <div className="section-title">
              <ClipboardList className="w-4 h-4 inline-block mr-1" aria-hidden="true" />
              BẢN GHI ĐANG GỬI ({activeRecords.length})
            </div>
            {activeRecords.length === 0 ? (
              <div className="card empty-state glass-surface-soft">
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
                <ClipboardList className="w-4 h-4 inline-block mr-1" aria-hidden="true" />
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
  const cardAction = r.cardAction?.trim();
  const ballAction = r.ballAction?.trim();

  return (
    <article className="record-card glass-surface-soft" role="listitem">
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
            {cardAction && (
              <span className="record-chip chip-action">
                {cardAction}
              </span>
            )}
            <span className="record-chip chip-card">
              <Ticket className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              {r.cards} thẻ
              {r.status === "Đang gửi" && r.remainingCards !== r.cards && (
                <> → còn {r.remainingCards}</>
              )}
            </span>
          </>
        )}

        {/* Ball action */}
        {r.balls > 0 && (
          <>
            {ballAction && (
              <span className="record-chip chip-action">
                {ballAction}
              </span>
            )}
            <span className="record-chip chip-ball">
              <CircleDot className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              {r.balls} bi
              {r.status === "Đang gửi" && r.remainingBalls !== r.balls && (
                <> → còn {r.remainingBalls}</>
              )}
            </span>
          </>
        )}
      </div>

      {r.status === "Đang gửi" && (r.remainingCards > 0 || r.remainingBalls > 0) && (
        <div className="record-footer">
          <span className="record-footer-label">
            Đang giữ:
          </span>
          <div className="record-footer-values">
            {r.cardAction !== "Lấy thẻ" && r.remainingCards > 0 && (
              <span className="holding-item holding-item-card">
                <Ticket aria-hidden="true" />
                <strong>{r.remainingCards} thẻ</strong>
              </span>
            )}
            {r.ballAction !== "Lấy bi" && r.remainingBalls > 0 && (
              <span className="holding-item holding-item-ball">
                <CircleDot aria-hidden="true" />
                <strong>{r.remainingBalls} bi</strong>
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
