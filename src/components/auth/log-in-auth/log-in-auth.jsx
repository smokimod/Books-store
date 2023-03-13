import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { LogInInputs } from "./log-in-inputs/log-in-inputs";
import { loadingAuthReducer } from "../../../store/authReducer";
import { getAuthReducer } from "../../../store/authReducer";
import { getErrorAuthReducer } from "../../../store/authReducer";
import { Form } from "../auth-components/form/form";
import { Loader } from "../../loader";
import { Button } from "../auth-components/button/button";
import { LinkTo } from "../auth-components/link/link";
import { StatusField } from "../status-field";

import "../common-styles.scss";

export const LogInAuth = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "onBlur",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const [status, setStatus] = useState("");

  const onSubmit = (data, e) => {
    e.preventDefault();
    dispatch(loadingAuthReducer());
    axios
      .post("https://strapi.cleverland.by/api/auth/", data)
      .then((results) => {
        localStorage.setItem("auth", JSON.stringify(results));
        dispatch(getAuthReducer(results));
        setStatus("");
        navigate("/books/all", { replace: true });
        reset();
      })
      .catch((error) => {
        dispatch(getErrorAuthReducer(error));
        (error && error.response && setStatus(error.response.status)) ||
          setStatus(error.response.status);
      });
  };

  return (
    <React.Fragment>
      {loading ? <Loader /> : null}
      <Form handleSubmit={handleSubmit(onSubmit)}>
        {status !== 400 && status ? (
          <StatusField
            path=""
            title="Что-то пошло не так. Попробуйте ещё раз"
            head="Вход не выполнен"
            text="повторить"
            onSubmit={onSubmit}
            status={status}
          />
        ) : (
          <React.Fragment>
            <div className="register-steps">
              <h2>Вход в личный кабинет</h2>
            </div>
            <div className="reg-required-inputs-container">
              <LogInInputs
                register={register}
                errors={errors}
                status={status}
                isDirty={isDirty}
                isValid={isValid}
              />
            </div>
            <div className="next-move-container">
              <Button isDirty={isDirty} isValid={isValid} status={status}>
                вход
              </Button>
              <LinkTo
                question={"Нет учётной записи?"}
                link={"Регистрация"}
                path={"/auth/register"}
              />
            </div>
          </React.Fragment>
        )}
      </Form>
    </React.Fragment>
  );
};
