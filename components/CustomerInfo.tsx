"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  Sun,
  Moon,
  Smartphone,
  Ticket,
  CircleDot,
  ClipboardList,
  RefreshCw,
} from "lucide-react";
import SiteFooter from "@/components/SiteFooter";

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
  totalCardsAtRecord: number;
  totalBallsAtRecord: number;
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

type RecordView = "active" | "received";

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
  onRefresh,
  refreshing,
  refreshError,
  theme,
  onToggleTheme,
}: {
  data: CustomerData;
  onBack: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  refreshError: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  const [recordView, setRecordView] = useState<RecordView>("active");

  const activeRecords = data.records.filter((record) => record.status === "Đang gửi");
  const receivedRecords = data.records.filter((record) => record.status !== "Đang gửi");
  const visibleRecords = recordView === "active" ? activeRecords : receivedRecords;
  const hasScrollableRecords = visibleRecords.length > 2;

  return (
    <>
      <div className="bg-decoration" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>

      <main className="page-wrapper">
        <div className="info-page animate-in">
          <div className="top-controls glass-surface">
            <button
              id="back-btn"
              type="button"
              className="back-btn glass-surface"
              onClick={onBack}
              aria-label="Quay lại trang tra cứu"
            >
              ← Tra cứu số khác
            </button>

            <button
              type="button"
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

          <div className="profile-card glass-surface-strong animate-in animate-in-delay-1">
            <div className="profile-avatar glass-surface" aria-hidden="true">
              {getInitials(data.fullName)}
            </div>
            <div className="profile-name">{data.fullName}</div>
            <div className="profile-phone">
              <Smartphone className="w-4 h-4 inline-block mr-1 text-slate-400" aria-hidden="true" />
              {data.phone}
            </div>

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

          <section className="records-browser animate-in animate-in-delay-2">
            <div className="records-browser-heading">
              <div className="section-title records-browser-title">
                <ClipboardList className="records-browser-icon" aria-hidden="true" />
                <span>BẢN GHI</span>
              </div>

              <div className="record-tabs-inline glass-surface" role="tablist" aria-label="Loại bản ghi">
                <button
                  type="button"
                  role="tab"
                  aria-selected={recordView === "active"}
                  className={`record-tab record-tab-active${recordView === "active" ? " is-selected" : ""}`}
                  onClick={() => setRecordView("active")}
                >
                  <span>Đang gửi</span>
                  <span className="record-tab-count">{activeRecords.length}</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={recordView === "received"}
                  className={`record-tab record-tab-received${recordView === "received" ? " is-selected" : ""}`}
                  onClick={() => setRecordView("received")}
                >
                  <span>Đã nhận</span>
                  <span className="record-tab-count">{receivedRecords.length}</span>
                </button>
              </div>

              <button
                type="button"
                className={`section-refresh-btn${refreshing ? " is-refreshing" : ""}`}
                onClick={onRefresh}
                disabled={refreshing}
                aria-label={refreshing ? "Đang làm mới bản ghi" : "Làm mới bản ghi"}
                aria-busy={refreshing}
                title="Làm mới bản ghi"
              >
                <RefreshCw aria-hidden="true" />
              </button>
            </div>

            {refreshError && (
              <div className="refresh-error records-browser-error" role="alert">
                {refreshError}
              </div>
            )}

            <div
              key={recordView}
              className={`active-records-frame records-browser-frame${hasScrollableRecords ? " is-scrollable" : ""}`}
              tabIndex={hasScrollableRecords ? 0 : undefined}
              role="tabpanel"
              aria-label={recordView === "active" ? "Bản ghi đang gửi" : "Bản ghi đã nhận"}
            >
              {visibleRecords.length === 0 ? (
                <div className="empty-state records-browser-empty">
                  <div className="empty-state-icon" aria-hidden="true">📭</div>
                  <p className="empty-state-text">
                    {recordView === "active"
                      ? "Không có bản ghi đang gửi."
                      : "Không có bản ghi đã nhận."}
                  </p>
                </div>
              ) : (
                <div className="records-list" role="list">
                  {visibleRecords.map((record) => (
                    <RecordCard key={record.id} record={record} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <SiteFooter />
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
        {r.cards > 0 && (
          <div className="record-action-row">
            {cardAction && (
              <span
                className={`record-chip chip-action${cardAction.startsWith("Gửi") ? " chip-action-send" : ""}`}
              >
                {cardAction}
              </span>
            )}
            <span className={`record-chip chip-card${cardAction ? "" : " record-chip-full"}`}>
              <Ticket aria-hidden="true" />
              {r.cards} thẻ
              {r.status === "Đang gửi" && r.remainingCards !== r.cards && (
                <> → còn {r.remainingCards}</>
              )}
            </span>
          </div>
        )}

        {r.balls > 0 && (
          <div className="record-action-row">
            {ballAction && (
              <span
                className={`record-chip chip-action${ballAction.startsWith("Gửi") ? " chip-action-send" : ""}${ballAction === "Lấy bi" ? " chip-action-withdraw-ball" : ""}`}
              >
                {ballAction}
              </span>
            )}
            <span className={`record-chip chip-ball${ballAction ? "" : " record-chip-full"}`}>
              <CircleDot aria-hidden="true" />
              {r.balls} bi
              {r.status === "Đang gửi" && r.remainingBalls !== r.balls && (
                <> → còn {r.remainingBalls}</>
              )}
            </span>
          </div>
        )}
      </div>

      {r.status === "Đang gửi" && (
        <div className="record-footer">
          <span className="record-footer-label">
            Tổng sau bản ghi:
          </span>
          <div className="record-footer-values">
            <span className="holding-item holding-item-card">
              <Ticket aria-hidden="true" />
              <strong>{r.totalCardsAtRecord} thẻ</strong>
            </span>
            <span className="holding-item holding-item-ball">
              <CircleDot aria-hidden="true" />
              <strong>{r.totalBallsAtRecord} bi</strong>
            </span>
          </div>
        </div>
      )}
    </article>
  );
}
