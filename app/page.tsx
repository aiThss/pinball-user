"use client";

import "./globals.css";
import "./record-enhancements.css";
import "./light-glass-tuning.css";
import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Smartphone, Search, CircleDot } from "lucide-react";
import CustomerInfo from "@/components/CustomerInfo";
import SiteFooter from "@/components/SiteFooter";

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
    totalCardsAtRecord: number;
    totalBallsAtRecord: number;
    totalText: string;
    status: string;
    createdByName: string;
    createdAt: string;
  }>;
};

type Theme = "light" | "dark";

function applyThemeToDocument(theme: Theme) {
  document.documentElement.dataset.pinballUserTheme = theme;
  document.body.dataset.pinballUserTheme = theme;
}

async function requestCustomerData(phone: string): Promise<CustomerData> {
  const res = await fetch(`/api/customer?phone=${encodeURIComponent(phone)}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? "Không tìm thấy thông tin.");
  }

  return json as CustomerData;
}

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("pinball-user-theme") as Theme;
    let nextTheme: Theme = "dark";
    if (saved === "light" || saved === "dark") {
      nextTheme = saved;
    } else {
      nextTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    applyThemeToDocument(nextTheme);

    const meta = document.querySelectorAll('meta[name="theme-color"]');
    for (let i = 0; i < meta.length; i++) {
      meta[i].setAttribute("content", nextTheme === "dark" ? "#000000" : "#f5f5f7");
    }

    const timer = setTimeout(() => {
      setTheme(nextTheme);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("pinball-user-theme", next);
      applyThemeToDocument(next);

      const meta = document.querySelectorAll('meta[name="theme-color"]');
      for (let i = 0; i < meta.length; i++) {
        meta[i].setAttribute("content", next === "dark" ? "#000000" : "#f5f5f7");
      }
      return next;
    });
  }, []);

  return [theme, toggle];
}

export default function HomePage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [refreshError, setRefreshError] = useState("");
  const [data, setData] = useState<CustomerData | null>(null);
  const [theme, toggleTheme] = useTheme();

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
    setRefreshError("");
    try {
      setData(await requestCustomerData(phone));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể kết nối. Vui lòng thử lại.",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!data || refreshing) return;

    setRefreshing(true);
    setRefreshError("");
    try {
      setData(await requestCustomerData(data.phone));
    } catch (requestError) {
      setRefreshError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể làm mới dữ liệu. Vui lòng thử lại.",
      );
    } finally {
      setRefreshing(false);
    }
  };

  if (data) {
    return (
      <CustomerInfo
        data={data}
        onBack={() => {
          setData(null);
          setRefreshError("");
        }}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        refreshError={refreshError}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <>
      <div className="bg-decoration" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>

      <main className="page-wrapper">
        <button
          className="theme-toggle login-theme-toggle glass-surface"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
          title={theme === "dark" ? "Light Glass" : "Dark Glass"}
        >
          {theme === "dark" ? (
            <Sun className="w-[18px] h-[18px]" aria-hidden="true" style={{ display: "block" }} />
          ) : (
            <Moon className="w-[18px] h-[18px]" aria-hidden="true" style={{ display: "block" }} />
          )}
        </button>

        <div className="brand animate-in">
          <div className="brand-icon glass-surface" aria-hidden="true">
            <CircleDot className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="brand-title">Ký Gửi Pinball</h1>
          <p className="brand-sub">Tra cứu thẻ &amp; bi đang gửi của bạn</p>
        </div>

        <div className="card glass-surface-strong animate-in animate-in-delay-1">
          <form onSubmit={handleSubmit} noValidate>
            <label className="input-label" htmlFor="phone-input">
              Số điện thoại
            </label>

            <div className="input-group">
              <span className="input-icon" aria-hidden="true">
                <Smartphone className="w-5 h-5" />
              </span>
              <input
                id="phone-input"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                className="phone-input glass-surface"
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
                  <Search className="w-4 h-4" aria-hidden="true" />
                  Tra cứu thông tin
                </>
              )}
            </button>
          </form>
        </div>

        <SiteFooter className="animate-in animate-in-delay-2" />
      </main>
    </>
  );
}
