import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Loader } from "../../loader";
import { Button } from "../auth-components/button/button";
import { Form } from "../auth-components/form/form";
import { RestorePasswordInputs } from "./restore-password-inputs/restore-password-inputs";
import { loadingAuthReducer } from "../../../store/authReducer";
import { getAuthReducer } from "../../../store/authReducer";
import { getErrorAuthReducer } from "../../../store/authReducer";
import { StatusField } from "../status-field";
import { RestoreStatus } from "./restore-status/restore-status";

import "./restore-password.scss";

export const RestorePassword = () => {
  const formSchema = yup.object().shape({
    password: yup
      .string()
      .required("Поле не может быть пустым")
      // .min(8, "Minimum of 8 characters")
      .matches(RegExp(/(?=.{1,})(?=.*\d)/), "цифры")
      .matches(RegExp(/(?=.{1,})((?=.*[A-Z]){1})/), "латинкий алфовит")
      .matches(
        RegExp(/^.*(?=.{8,})(?=.*\d)((?=.*[A-Z]){1}).*$/),
        "не менее 8 символов"
      )
      .matches(
        RegExp(/^.*(?=.{8,})((?=.*[A-Z]){1}).*$/),
        "не менее 8 символов, цифрой"
      ),
    passwordConfirmation: yup
      .string()
      .required("Поле не может быть пустым")
      .oneOf([yup.ref("password")], "Пароли не свопадают"),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "all",
    criteriaMode: "all",
    resolver: yupResolver(formSchema),
  });

  const loading = useSelector((state) => state.auth.loading);
  const userData = useSelector((state) => state.auth.userData);

  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  console.log(location.search.slice(6));

  const onSubmit = (data, e) => {
    e.preventDefault();
    data.code = location.search.slice(6);
    dispatch(loadingAuthReducer());
    axios
      .post("https://strapi.cleverland.by/api/auth/reset-password", data)
      .then((results) => {
        dispatch(getAuthReducer(results));
        setShowModal(true);
        setStatus("");
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
        {(status && (
          <RestoreStatus
            path={null}
            title="Что-то пошло не так. Попробуйте ещё раз"
            head="Данные не сохранились"
            text="повторить"
            onSubmit={onSubmit}
          />
        )) ||
          (userData?.status === 200 && showModal && (
            <StatusField
              path="auth/local"
              title="Зайдите в кабинет, использую свои логин и пароль"
              head="Данные сохранились"
              text="вход"
              onSubmit={onSubmit}
              status={status}
            />
          )) || (
            <React.Fragment>
              <div className="register-steps">
                <h2>Восстановление пароля</h2>
              </div>
              <div className="reg-required-inputs-container">
                <RestorePasswordInputs
                  register={register}
                  errors={errors}
                  watch={watch}
                  isValid={isValid}
                  isDirty={isDirty}
                />
              </div>
              <div className="next-move-container">
                <Button isDirty={isDirty} isValid={isValid} errors={errors}>
                  сохранить изменения
                </Button>
                <div className="next-move-question">
                  <span style={{ color: "#727272" }}>
                    После сохранения войдите в библиотеку, используя новый
                    пароль
                  </span>
                </div>
              </div>
            </React.Fragment>
          )}
      </Form>
    </React.Fragment>
  );
};
