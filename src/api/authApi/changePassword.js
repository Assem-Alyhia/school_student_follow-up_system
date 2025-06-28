import { useState } from "react";
import { changePassword } from "../../api/authApi/passwordApi";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    try {
      await changePassword(currentPassword, newPassword, newPasswordConfirm);
      setMessage("تم تغيير كلمة المرور بنجاح.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <input
        type="password"
        placeholder="كلمة المرور الحالية"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="كلمة المرور الجديدة"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="تأكيد كلمة المرور الجديدة"
        value={newPasswordConfirm}
        onChange={(e) => setNewPasswordConfirm(e.target.value)}
      />
      <button onClick={handleSubmit}>تغيير كلمة المرور</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}
