"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  CircleDot,
  ClipboardList,
  Moon,
  RefreshCw,
  Smartphone,
  Sun,
  Ticket,
} from "lucide-react";
import SiteFooter from "@/components/SiteFooter";

type CustomerRecord = {
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
  records: CustomerRecord[];
};

type RecordView = "active" | "received";
type RecordPages = { active: number; received: number };
type PageItem = number | "ellipsis-left" | "ellipsis-right";

const RECORDS_PER_PAGE = 6;

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

function getPageItems(totalPages: number, currentPage: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);

  if (currentPage <= 4) {
    [2, 3, 4, 5].forEach((page) => pages.add(page));
  }

  if (currentPage >= totalPages - 3) {
    [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1].forEach((page) => pages.add(page));
  }

  const sorted = [...pages].filter((page) => page > 0 && page <= totalPages).sort((a, b) => a - b);
  const items: PageItem[] = [];

  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (index > 0 && page - previous > 1) {
      items.push(index === 1 ? "ellipsis-left" : "ellipsis-right");
    }
    items.push(page);
  });

  return items;
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
  const [recordPages, setRecordPages] = useState<RecordPages>({ active: 1, received: 1 });

  const activeRecords = data.records.filter((record) => record.status === "Đang gửi");
  const receivedRecords = data.records.filter((record) => record.status !== "Đang gửi");
  const selectedRecords = recordView === "active" ? activeRecords : receivedRecords;
  const totalPages = Math.max(1, Math.ceil(selectedRecords.length / RECORDS_PER_PAGE));
  const currentPage = Math.min(recordPages[recordView], totalPages);
  const visibleRecords = selectedRecords.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE,
  );

  useEffect(() => {
    setRecordPages((current) => ({
      active: Math.min(current.active, Math.max(1, Math.ceil(activeRecords.length / RECORDS_PER_PAGE))),
      received: Math.min(current.received, Math.max(1, Math.ceil(receivedRecords.length / RECORDS_PER_PAGE))),
    }));
  }, [activeRecords.length, receivedRecords.length]);

  function changePage(page: number) {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    setRecordPages((current) => ({ ...current, [recordView]: nextPage }));
    window.requestAnimationFrame(() => {
      document.querySelector(".records-browser")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

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
              key={`${recordView}-${currentPage}`}
              className="active-records-frame records-browser-frame"
              role="tabpanel"
              aria-label={recordView === "active" ? "Bản ghi đang gửi" : "Bản ghi đã nhận"}
            >
              {selectedRecords.length === 0 ? (
                <div className="empty-state records-browser-empty">
                  <div className="empty-state-icon" aria-hidden="true">📭</div>
                  <p className="empty-state-text">
                    {recordView === "active" ? "Không có bản ghi đang gửi." : "Không có bản ghi đã nhận."}
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

            {totalPages > 1 && (
              <nav className="record-pagination" aria-label="Phân trang bản ghi">
                <button
                  type="button"
                  className="record-page-button record-page-nav"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Trang trước"
                >
                  <ChevronLeft aria-hidden="true" />
                </button>

                <div className="record-page-numbers">
                  {getPageItems(totalPages, currentPage).map((item) =>
                    typeof item === "number" ? (
                      <button
                        key={item}
                        type="button"
                        className={`record-page-button${item === currentPage ? " is-current" : ""}`}
                        onClick={() => changePage(item)}
                        aria-current={item === currentPage ? "page" : undefined}
                      >
                        {item}
                      </button>
                    ) : (
                      <span className="record-page-ellipsis" key={item} aria-hidden="true">…</span>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  className="record-page-button record-page-nav"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Trang sau"
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </nav>
            )}
          </section>

          <SiteFooter />
        </div>
      </main>
    </>
  );
}

function RecordCard({ record: r }: { record: CustomerRecord }) {
  const cardAction = r.cardAction?.trim();
  const ballAction = r.ballAction?.trim();

  return (
    <article className="record-card glass-surface-soft" role="listitem">
      <div className="record-header">
        <div>
          <div className="record-date">{formatDate(r.depositDate)} — {r.depositTime}</div>
          <div className="record-time">Nhân viên: {r.createdByName}</div>
        </div>
        <span className={`status-badge ${getStatusClass(r.status)}`}>{r.status}</span>
      </div>

      <div className="record-body">
        {r.cards > 0 && (
          <div className="record-action-row">
            {cardAction && (
              <span className={`record-chip chip-action${cardAction.startsWith("Gửi") ? " chip-action-send" : ""}`}>
                {cardAction}
              </span>
            )}
            <span className={`record-chip chip-card${cardAction ? "" : " record-chip-full"}`}>
              <Ticket aria-hidden="true" />
              {r.cards} thẻ
              {r.status === "Đang gửi" && r.remainingCards !== r.cards && <> → còn {r.remainingCards}</>}
            </span>
          </div>
        )}

        {r.balls > 0 && (
          <div className="record-action-row">
            {ballAction && (
              <span className={`record-chip chip-action${ballAction.startsWith("Gửi") ? " chip-action-send" : ""}${ballAction === "Lấy bi" ? " chip-action-withdraw-ball" : ""}`}>
                {ballAction}
              </span>
            )}
            <span className={`record-chip chip-ball${ballAction ? "" : " record-chip-full"}`}>
              <CircleDot aria-hidden="true" />
              {r.balls} bi
              {r.status === "Đang gửi" && r.remainingBalls !== r.balls && <> → còn {r.remainingBalls}</>}
            </span>
          </div>
        )}
      </div>

      {r.status === "Đang gửi" && (
        <div className="record-footer">
          <span className="record-footer-label">Tổng sau bản ghi:</span>
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
