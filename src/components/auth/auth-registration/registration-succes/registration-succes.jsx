import { Link } from "react-router-dom";

import "./registration-succes.scss";

export const RegistrationSucces = () => {
  return (
    <div className="reg-succes">
      <h3>Регистрация успешна</h3>
      <p>
        Регистрация прошла успешно. Зайдите в личный кабинет, используя свои
        логин и пароль
      </p>
      <Link to="/api/auth/local">
        <button className="succes-btn">вход</button>
      </Link>
    </div>
  );
};
