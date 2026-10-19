"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  Compass,
  Eye,
  EyeOff,
  GraduationCap,
  LoaderCircle,
  MessagesSquare,
  Sparkles,
  Target,
} from "lucide-react";
import { actions, type RegisterInput } from "@/lib/store";
import {
  passwordRequirements,
  registrationLimits,
  validateRegistration,
  type RegistrationErrors,
  type RegistrationField,
} from "@/lib/registration";

const roles = [
  {
    value: "mentee",
    label: "Tôi muốn học hỏi",
    name: "Mentee",
    description: "Tìm mentor, mở góc nhìn mới.",
    icon: Compass,
  },
  {
    value: "mentor",
    label: "Tôi muốn chia sẻ",
    name: "Mentor",
    description: "Mang kinh nghiệm đến người cần.",
    icon: GraduationCap,
  },
] as const;

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Required<RegisterInput>>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: searchParams.get("role") === "mentor" ? "mentor" : "mentee",
  });
  const [touched, setTouched] = useState<
    Partial<Record<RegistrationField, boolean>>
  >({});
  const [serverErrors, setServerErrors] = useState<RegistrationErrors>({});
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const clientErrors = validateRegistration(values);
  const completedRules = passwordRequirements.filter((rule) =>
    rule.test(values.password),
  ).length;

  function setField<K extends keyof typeof values>(
    field: K,
    value: (typeof values)[K],
  ) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setServerErrors((previous) => ({ ...previous, [field]: undefined }));
    setError("");
  }
  function fieldError(field: RegistrationField) {
    return (
      serverErrors[field] || (touched[field] ? clientErrors[field] : undefined)
    );
  }
  const fieldOrder: RegistrationField[] = [
    "role",
    "name",
    "phoneNumber",
    "email",
    "password",
    "confirmPassword",
  ];

  function focusFirst(errors: RegistrationErrors) {
    const firstField = fieldOrder.find((field) => errors[field]);
    if (!firstField) return;
    const target = formRef.current?.querySelector<HTMLInputElement>(
      `[name="${firstField}"]`,
    );
    if (target) {
      target.focus({ preventScroll: false });
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  function touch(field: RegistrationField) {
    setTouched((previous) => ({ ...previous, [field]: true }));
  }
  function errorElement(field: RegistrationField) {
    const message = fieldError(field);
    return message ? (
      <span className="sb-register-field-error" id={`register-${field}-error`}>
        {message}
      </span>
    ) : null;
  }
  function inputState(field: RegistrationField) {
    return {
      "aria-invalid": !!fieldError(field),
      "aria-describedby": fieldError(field)
        ? `register-${field}-error`
        : undefined,
      onBlur: () => touch(field),
    };
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError("");
    setServerErrors({});
    if (Object.keys(clientErrors).length) {
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
        phoneNumber: true,
        role: true,
      });
      focusFirst(clientErrors);
      return;
    }
    setLoading(true);
    try {
      const result = await actions.register({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
      });
      if (!result.ok) {
        if (result.fieldErrors && Object.keys(result.fieldErrors).length) {
          const errors = result.fieldErrors;
          setServerErrors(errors);
          // The disabled fieldset is re-enabled after this request completes.
          requestAnimationFrame(() => focusFirst(errors));
        } else setError(result.error);
        return;
      }
      const next = searchParams.get("next");
      router.push(
        next?.startsWith("/") && !next.startsWith("//") && !next.includes("\\")
          ? next
          : "/mentors",
      );
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sb-register sb-container">
      <aside
        className="sb-register-story"
        aria-label="Một khởi đầu cùng SkillBridge"
      >
        <Link className="sb-register-back" href="/">
          <ArrowLeft size={16} /> Về trang chủ
        </Link>
        <div className="sb-register-story-heading">
          <span className="sb-eyebrow">
            KẾT NỐI KINH NGHIỆM. MỞ LỐI TIẾN XA.
          </span>
          <h2>
            Một khởi đầu.
            <br />
            <em>Nhiều khả năng.</em>
          </h2>
          <p>
            Cho điều bạn muốn học.
            <br />
            Và những điều bạn sẵn sàng chia sẻ.
          </p>
        </div>
        <div className="sb-register-visual" aria-hidden="true">
          <div className="sb-register-orbit" />
          <div className="sb-register-orbit sb-register-orbit-inner" />
          <span className="sb-register-orbit-icon sb-register-orbit-one">
            <Target size={25} />
          </span>
          <span className="sb-register-orbit-icon sb-register-orbit-two">
            <MessagesSquare size={24} />
          </span>
          <span className="sb-register-orbit-icon sb-register-orbit-three">
            <Compass size={24} />
          </span>
          <div className="sb-register-connection">
            <Sparkles size={28} />
            <span>
              Một kết nối.
              <br />
              <strong>Mở lối tiến xa.</strong>
            </span>
            <ArrowUpRight size={20} />
          </div>
        </div>
        <div className="sb-register-story-note">
          <span className="sb-eyebrow">HÀNH TRÌNH BẮT ĐẦU TỪ BẠN</span>
          <p>
            Bạn không cần biết mọi câu trả lời.
            <br />
            Đôi khi, chỉ cần gặp <strong>đúng người.</strong>
          </p>
        </div>
        <span className="sb-register-story-footer">
          SKILLBRIDGE / YOUR NEXT CHAPTER
        </span>
      </aside>

      <section className="sb-register-form" aria-labelledby="register-heading">
        <Link className="sb-register-mobile-back sb-register-back" href="/">
          <ArrowLeft size={16} /> Về trang chủ
        </Link>
        <header className="sb-register-intro">
          <span className="sb-eyebrow">CHƯƠNG TIẾP THEO LÀ CỦA BẠN</span>
          <h1 id="register-heading">
            Cùng nhau <em>tiến xa.</em>
          </h1>
          <p>Tạo tài khoản và bắt đầu với điều bạn quan tâm.</p>
        </header>
        <form ref={formRef} onSubmit={submit} noValidate aria-busy={loading}>
          <fieldset className="sb-register-fields" disabled={loading}>
            <legend className="sr-only">Thông tin đăng ký</legend>
            <fieldset
              className="sb-register-roles"
              aria-invalid={!!fieldError("role")}
              aria-describedby={
                fieldError("role") ? "register-role-error" : undefined
              }
            >
              <legend>Bạn muốn bắt đầu như thế nào?</legend>
              <div className="sb-register-role-grid">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <label className="sb-register-role" key={role.value}>
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={values.role === role.value}
                        onChange={() => setField("role", role.value)}
                        onBlur={() => touch("role")}
                        aria-describedby={
                          fieldError("role") ? "register-role-error" : undefined
                        }
                      />
                      <span className="sb-register-role-body">
                        <span className="sb-register-role-top">
                          <Icon size={22} />
                          <span className="sb-register-role-check">
                            <Check size={12} />
                          </span>
                        </span>
                        <strong>{role.label}</strong>
                        <span className="sb-register-role-name">
                          {role.name}
                        </span>
                        <span className="sb-register-role-description">
                          {role.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {errorElement("role")}
            </fieldset>

            <div className="sb-register-details">
              <div className="sb-field">
                <label htmlFor="register-name">Họ và tên</label>
                <input
                  id="register-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Họ tên của bạn"
                  value={values.name}
                  onChange={(event) => setField("name", event.target.value)}
                  maxLength={registrationLimits.name}
                  required
                  {...inputState("name")}
                />
                {errorElement("name")}
              </div>
              <div className="sb-field">
                <label htmlFor="register-phone">
                  Số điện thoại{" "}
                  <span className="sb-register-optional">Tùy chọn</span>
                </label>
                <input
                  id="register-phone"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Số điện thoại của bạn"
                  value={values.phoneNumber}
                  onChange={(event) =>
                    setField("phoneNumber", event.target.value)
                  }
                  maxLength={registrationLimits.phoneNumber}
                  {...inputState("phoneNumber")}
                />
                {errorElement("phoneNumber")}
              </div>
            </div>
            <div className="sb-field">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="ban@congty.com"
                value={values.email}
                onChange={(event) => setField("email", event.target.value)}
                maxLength={registrationLimits.email}
                required
                {...inputState("email")}
              />
              {errorElement("email")}
            </div>
            <div className="sb-register-password">
              <div className="sb-field">
                <label htmlFor="register-password">Mật khẩu</label>
                <span className="sb-password-field">
                  <input
                    id="register-password"
                    name="password"
                    type={visible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Tạo mật khẩu của bạn"
                    value={values.password}
                    onChange={(event) =>
                      setField("password", event.target.value)
                    }
                    maxLength={registrationLimits.password}
                    required
                    {...inputState("password")}
                    aria-describedby={`register-password-requirements${fieldError("password") ? " register-password-error" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    aria-pressed={visible}
                  >
                    {visible ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </span>
                {errorElement("password")}
              </div>
              <div
                className="sb-register-password-guide"
                id="register-password-requirements"
              >
                <div className="sb-register-password-heading">
                  <span>Mật khẩu cần có</span>
                  <span aria-live="polite">{completedRules}/5 điều kiện</span>
                </div>
                <ul>
                  {passwordRequirements.map((rule) => {
                    const met = rule.test(values.password);
                    return (
                      <li key={rule.label} data-met={met}>
                        <span
                          className="sb-register-rule-icon"
                          aria-hidden="true"
                        >
                          {met && <Check size={11} strokeWidth={3} />}
                        </span>
                        <span>
                          <span className="sr-only">
                            {met ? "Đã đạt: " : "Chưa đạt: "}
                          </span>
                          {rule.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p>
                  Ký tự đặc biệt được chấp nhận: <code>!?*@#$%^&amp;+=._-</code>
                </p>
              </div>
            </div>
            <div className="sb-field">
              <label htmlFor="register-confirm-password">
                Xác nhận mật khẩu
              </label>
              <span className="sb-password-field">
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={confirmVisible ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu của bạn"
                  value={values.confirmPassword}
                  onChange={(event) =>
                    setField("confirmPassword", event.target.value)
                  }
                  maxLength={registrationLimits.password}
                  required
                  {...inputState("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setConfirmVisible(!confirmVisible)}
                  aria-label={
                    confirmVisible
                      ? "Ẩn xác nhận mật khẩu"
                      : "Hiện xác nhận mật khẩu"
                  }
                  aria-pressed={confirmVisible}
                >
                  {confirmVisible ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </span>
              {errorElement("confirmPassword")}
            </div>
            {error && (
              <div className="sb-register-error" role="alert">
                <CircleAlert size={19} />
                <p>{error}</p>
              </div>
            )}
            <button
              className="sb-button sb-register-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="sb-spin" /> Đang tạo tài
                  khoản…
                </>
              ) : (
                <>
                  Tạo tài khoản <ArrowRight size={18} />
                </>
              )}
            </button>
          </fieldset>
        </form>
        <p className="sb-register-login">
          Đã có tài khoản?{" "}
          <Link href="/login">
            Đăng nhập <ArrowUpRight size={14} />
          </Link>
        </p>
      </section>
    </div>
  );
}
