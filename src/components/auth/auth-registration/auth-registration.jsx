import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { RegStepOne } from "./reg-step-one/reg-step-one";
import { RegStepTwo } from "./reg-step-two/reg-step-two";
import { RegStepThree } from "./reg-step-three/reg-step-three";
import { loadingAuthReducer } from "../../../store/authReducer";
import { getAuthReducer } from "../../../store/authReducer";
import { getErrorAuthReducer } from "../../../store/authReducer";
import { Loader } from "../../loader";
import { Form } from "../auth-components/form/form";
import { LinkTo } from "../auth-components/link/link";
import { StatusField } from "../status-field";

import "../common-styles.scss";

export const AuthRegistration = () => {
  const loading = useSelector((state) => state.auth.loading);
  const userData = useSelector((state) => state.auth.userData);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    criteriaMode: "all",
    mode: "all",
    defaultValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const [password] = watch(["password"]);

  const emptyFieldCheck = () => {
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    reset();
    setStatus((prev) => (prev = ""));
    setStep((prev) => prev - 2);
    setShowModal(false);
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    dispatch(loadingAuthReducer());
    axios
      .post("https://strapi.cleverland.by/api/auth/local/dwqdwq", data)
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
        {(userData?.status === 200 && showModal && (
          <StatusField
            title="Регистрация прошла успешно. Зайдите в личный кабинет, используя свои логин и пароль"
            text="вход"
            head="Регистрация успешна"
            path="/auth/local"
            status={status}
          />
        )) ||
          (status === 400 && (
            <StatusField
              title="Такой логин или e-mail уже записан в системе. Попробуйте зарегистрироваться по другому логину или e-mail."
              text="назад к регистрации"
              head="Данные не сохранились"
              path=""
              previousStep={previousStep}
              status={status}
            />
          )) ||
          (status !== 400 && status && (
            <StatusField
              title="Что-то пошло не так и ваша регистрация не завершилась. Попробуйте ещё раз"
              text="повторить"
              head="Данные не сохранились"
              path=""
              status={status}
              onSubmit={onSubmit}
            />
          )) || (
            <React.Fragment>
              <div className="register-steps">
                <h2>Регистрация</h2>
                <div>
                  <span>{step} шаг из 3</span>
                </div>
              </div>
              <div className="reg-required-inputs-container">
                {step === 1 && (
                  <RegStepOne
                    register={register}
                    errors={errors}
                    status={status}
                    password={password}
                  />
                )}
                {step === 2 && (
                  <RegStepTwo
                    register={register}
                    errors={errors}
                    status={status}
                    watch={watch}
                  />
                )}
                {step === 3 && (
                  <RegStepThree
                    register={register}
                    errors={errors}
                    status={status}
                  />
                )}
              </div>
              <div className="next-move-container">
                {step === 1 || step === 2 ? (
                  <button
                    className={
                      errors.password ||
                      errors.username ||
                      errors.firstName ||
                      errors.lastName ||
                      errors.phone ||
                      errors.email
                        ? "reg-next-moveBtn disabled"
                        : "reg-next-moveBtn"
                    }
                    type="button"
                    onClick={emptyFieldCheck}
                  >
                    {step === 1 ? "следующий шаг" : "последний шаг"}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="reg-next-moveBtn"
                    disabled={!isDirty || !isValid}
                  >
                    зарегистрироваться
                  </button>
                )}
                <LinkTo
                  question={"Есть учётная запись?"}
                  link={"Вход"}
                  path={"/auth/local"}
                />
              </div>
            </React.Fragment>
          )}
      </Form>
    </React.Fragment>
  );
};
