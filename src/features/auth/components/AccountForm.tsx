"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Asterisk,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";
import { actions } from "@/lib/store";

export function AccountForm({ mode }: { mode: "login" | "register" }) {
  const registering = mode === "register";
  const searchParams = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState<"mentee" | "mentor">(
    searchParams.get("role") === "mentor" ? "mentor" : "mentee",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const result = registering
        ? await actions.register({ name, email, password, role })
        : await actions.login(email, password);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const next = searchParams.get("next");
      const destination =
        next?.startsWith("/") && !next.startsWith("//") && !next.includes("\\")
          ? next
          : "/mentors";
      router.push(destination);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sb-account sb-container">
      <aside className="sb-account-story">
        <span className="sb-eyebrow">YOUR NEXT CHAPTER</span>
        <h2>
          Bước tiến
          <br />
          tiếp theo,
          <br />
          <em>bắt đầu từ bạn.</em>
        </h2>
        <p>
          Một kết nối có ý nghĩa.
          <br />
          Một góc nhìn để đi xa hơn.
        </p>
        <Asterisk className="sb-account-asterisk" aria-hidden="true" />
        <span className="sb-account-story-bottom">
          SKILLBRIDGE / GROW TOGETHER
        </span>
      </aside>
      <section className="sb-account-form">
        <Link className="sb-text-link sb-back-link" href="/">
          <ArrowLeft size={16} /> Về trang chủ
        </Link>
        <span className="sb-eyebrow">
          {registering ? "MỘT KHỞI ĐẦU MỚI" : "CHÀO MỪNG BẠN TRỞ LẠI"}
        </span>
        <h1>{registering ? "Cùng nhau tiến xa." : "Tiếp tục hành trình."}</h1>
        <p>
          {registering
            ? "Tạo tài khoản để bắt đầu cùng SkillBridge."
            : "Đăng nhập vào tài khoản SkillBridge của bạn."}
        </p>
        <form onSubmit={submit}>
          {registering && (
            <fieldset className="sb-role-picker">
              <legend>Bạn muốn bắt đầu với vai trò nào?</legend>
              {(
                [
                  { value: "mentee", label: "Tôi muốn tìm mentor" },
                  { value: "mentor", label: "Tôi muốn làm mentor" },
                ] as const
              ).map((item) => (
                <label key={item.value}>
                  <input
                    type="radio"
                    name="role"
                    value={item.value}
                    checked={role === item.value}
                    onChange={() => setRole(item.value)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </fieldset>
          )}
          {registering && (
            <label className="sb-field">
              Họ và tên
              <input
                name="name"
                autoComplete="name"
                placeholder="Họ tên của bạn"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
                maxLength={160}
              />
            </label>
          )}
          <label className="sb-field">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="ban@congty.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              maxLength={254}
            />
          </label>
          <label className="sb-field">
            Mật khẩu
            <span className="sb-password-field">
              <input
                type={visible ? "text" : "password"}
                name="password"
                autoComplete={registering ? "new-password" : "current-password"}
                placeholder={
                  registering ? "Ít nhất 8 ký tự" : "Mật khẩu của bạn"
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={registering ? 8 : undefined}
                maxLength={256}
                required
              />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {visible ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </span>
          </label>
          {error && (
            <p className="sb-form-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="sb-button sb-form-submit"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <>
                <LoaderCircle className="sb-spin" size={18} /> Đang xử lý…
              </>
            ) : (
              <>
                {registering ? "Tạo tài khoản" : "Đăng nhập"}
                <ArrowUpRight size={18} />
              </>
            )}
          </button>
        </form>
        <p className="sb-account-switch">
          {registering ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
          <Link href={registering ? "/login" : "/register"}>
            {registering ? "Đăng nhập" : "Tạo tài khoản"}
          </Link>
        </p>
        <p className="sb-account-privacy">
          Không gian của bạn. Hành trình của bạn.
        </p>
      </section>
    </div>
  );
}
