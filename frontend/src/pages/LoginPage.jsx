import { useNavigate } from "react-router-dom";
import { useState } from "react";
import fondoLogin from "../imagenes/imagen_Login_new.png";
import logoEmpresa from "../imagenes/Logo.png";
import { login } from "../services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(null);

    try {
      const data = await login({ email, password });
      localStorage.setItem("token", data.access_token || data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="login-page">
      <img src={fondoLogin} alt="Fondo cafetería" className="login-bg" />

      <div className="login-overlay"></div>

      <div className="login-wrapper">
        <div className="login-card-glass">
          <div className="login-logo">
            <img src={logoEmpresa} alt="logo" />
          </div>

          <h1 className="login-title">Iniciar sesión</h1>

          <p className="login-subtitle">
            Accede a tu cuenta y continúa tu experiencia.
          </p>

          <form className="login-form">
            <input
              className="login-input"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="login-input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="login-remember">
              <input type="checkbox" />
              <span>Recuérdame</span>
            </label>

            <button type="button" className="login-forgot">
              ¿Olvidaste tu contraseña?
            </button>

            <button
              type="button"
              className="login-submit"
              onClick={handleLogin}
            >
              Entrar
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>

          <p className="login-footer">
            Empieza tu día con café de especialidad.
          </p>
        </div>
      </div>
    </div>
  );
}
