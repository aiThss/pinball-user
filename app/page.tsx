"use client";

import "./globals.css";
import { useState } from "react";
import CustomerInfo from "@/components/CustomerInfo";

type CustomerData = {
  phone: string;
  fullName: string;
  totalCards: number;
  totalBalls: number;
  records: Array<{
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
  }>;
};

export default function HomePage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<CustomerData | null>(null);

  // Only allow digits, max 10
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      setError("Vui lòng nhập đủ số điện thoại (ít nhất 9 số).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/customer?phone=${encodeURIComponent(phone)}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Không tìm thấy thông tin.");
        setData(null);
      } else {
        setData(json);
      }
    } catch {
      setError("Không thể kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (data) {
    return <CustomerInfo data={data} onBack={() => setData(null)} />;
  }

  return (
    <>
      {/* Background orbs */}
      <div className="bg-decoration" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <main className="page-wrapper">
        {/* Brand */}
        <div className="brand animate-in">
          <div className="brand-icon" aria-hidden="true">🎱</div>
          <h1 className="brand-title">Ký Gửi Pinball</h1>
          <p className="brand-sub">Tra cứu thẻ &amp; bi đang gửi của bạn</p>
        </div>

        {/* Form card */}
        <div className="card animate-in animate-in-delay-1">
          <form onSubmit={handleSubmit} noValidate>
            <label className="input-label" htmlFor="phone-input">
              Số điện thoại
            </label>

            <div className="input-group">
              <span className="input-icon" aria-hidden="true">📱</span>
              <input
                id="phone-input"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                className="phone-input"
                placeholder="0XXXXXXXXX"
                value={phone}
                onChange={handlePhoneChange}
                autoComplete="tel"
                autoFocus
                maxLength={10}
                aria-label="Số điện thoại tra cứu"
                aria-describedby={error ? "phone-error" : undefined}
              />
            </div>

            {/* Digit indicator dots */}
            <div className="digit-indicator" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`dot${i < phone.length ? " filled" : ""}`}
                />
              ))}
            </div>

            {error && (
              <div className="error-msg" id="phone-error" role="alert">
                <span aria-hidden="true">⚠️</span>
                {error}
              </div>
            )}

            <button
              id="lookup-btn"
              type="submit"
              className="btn-primary"
              disabled={loading || phone.length < 9}
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Đang tra cứu…
                </>
              ) : (
                <>
                  <span aria-hidden="true">🔍</span>
                  Tra cứu thông tin
                </>
              )}
            </button>
          </form>
        </div>

        <footer className="footer animate-in animate-in-delay-2">
          Chỉ xem, không chỉnh sửa &nbsp;·&nbsp; Baby Ress Games
        </footer>
      </main>
    </>
  );
}
