export const registrationLimits = {
  name: 200,
  email: 256,
  phoneNumber: 30,
  password: 256, // Existing BFF request limit; Identity defines the minimum.
};

export type RegistrationField =
  | "name"
  | "email"
  | "phoneNumber"
  | "password"
  | "confirmPassword"
  | "role";

export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

export const passwordRequirements = [
  { label: "Ít nhất 8 ký tự", test: (value: string) => value.length >= 8 },
  { label: "Chữ hoa (A–Z)", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Chữ thường (a–z)", test: (value: string) => /[a-z]/.test(value) },
  { label: "Chữ số (0–9)", test: (value: string) => /[0-9]/.test(value) },
  {
    label: "Ký tự đặc biệt",
    test: (value: string) => /[!?*@#$%^&+=._\-]/.test(value),
  },
];

// Mirrors Identity's RegisterUserCommandValidator and the phone column limit.
export function validateRegistration(input: {
  name?: unknown;
  email?: unknown;
  phoneNumber?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
  role?: unknown;
}): RegistrationErrors {
  const errors: RegistrationErrors = {};
  if (typeof input.name !== "string" || !input.name.trim())
    errors.name = "Vui lòng nhập họ và tên.";
  else if (input.name.trim().length > registrationLimits.name)
    errors.name = "Họ và tên không được vượt quá 200 ký tự.";

  if (typeof input.email !== "string" || !input.email.trim())
    errors.email = "Vui lòng nhập email.";
  else if (input.email.trim().length > registrationLimits.email)
    errors.email = "Email không được vượt quá 256 ký tự.";
  else if (!/^[^\s@]+@[^\s@]+$/.test(input.email.trim()))
    errors.email = "Email chưa đúng định dạng.";

  if (
    input.phoneNumber !== undefined &&
    input.phoneNumber !== null &&
    typeof input.phoneNumber !== "string"
  )
    errors.phoneNumber = "Số điện thoại chưa hợp lệ.";
  else if (
    typeof input.phoneNumber === "string" &&
    input.phoneNumber.trim().length > registrationLimits.phoneNumber
  )
    errors.phoneNumber = "Số điện thoại không được vượt quá 30 ký tự.";

  const password = input.password;
  if (typeof password !== "string" || !password)
    errors.password = "Vui lòng tạo mật khẩu.";
  else if (password.length > registrationLimits.password)
    errors.password = "Mật khẩu không được vượt quá 256 ký tự.";
  else if (!passwordRequirements.every((rule) => rule.test(password)))
    errors.password = "Mật khẩu cần đáp ứng đủ 5 điều kiện bên dưới.";

  if (input.confirmPassword !== undefined) {
    if (typeof input.confirmPassword !== "string" || !input.confirmPassword)
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    else if (input.confirmPassword !== password)
      errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
  }

  if (input.role !== "mentee" && input.role !== "mentor")
    errors.role = "Vui lòng chọn vai trò Mentee hoặc Mentor.";
  return errors;
}
