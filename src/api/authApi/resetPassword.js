import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/authApi/passwordApi";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email"); // إذا مررت الإيميل كرابط أيضاً

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    try {
      await resetPassword(token, email, password, passwordConfirmation);
      setMessage("تم تغيير كلمة المرور بنجاح.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <input
        type="password"
        placeholder="كلمة المرور الجديدة"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="تأكيد كلمة المرور"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
      />
      <button onClick={handleSubmit}>تغيير كلمة المرور</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}
