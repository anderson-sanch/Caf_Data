import { useNavigate } from "react-router-dom";
import fondoLogin from "../imagenes/imagen_Login_new.png";
import logoEmpresa from "../imagenes/logo.png";

export default function LoginPage() {
  
  const navigate = useNavigate(); 

  return (
    <div className="login-page">
      <img
        src={fondoLogin}
        alt="Fondo cafetería"
        className="login-bg"
      />

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
            />

            <input
              className="login-input"
              type="password"
              placeholder="Contraseña"
            />

            <label className="login-remember">
              <input type="checkbox" />
              <span>Recuérdame</span>
            </label>

            <button type="button" className="login-forgot">
              ¿Olvidaste tu contraseña?
            </button>

            <button type="button"
              className="login-submit"
              onClick={() => navigate("/dashboard")}
            >
              Entrar
            </button>
          </form>

          <p className="login-footer">
            Empieza tu día con café de especialidad.
          </p>
        </div>
      </div>
    </div>
  );
}