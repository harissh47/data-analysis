"use client";
import React, { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import useSWR from "swr";
import Link from "next/link";
import Toast from "../components/base/toast";
import style from "./page.module.css";
import { IS_CE_EDITION, SUPPORT_MAIL_LOGIN, apiPrefix } from "@/config";
import Button from "@/app/components/base/button";
import { login, oauth } from "@/service/common";
import { getPurifyHref } from "@/utils";
const validEmailReg = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,}$/;
const validPasswordReg = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

type IState = {
  formValid: boolean;
  github: boolean;
  google: boolean;
};

type IAction = {
  type:
    | "login"
    | "login_failed"
    | "github_login"
    | "github_login_failed"
    | "google_login"
    | "google_login_failed";
};
export const Eyeopen = () => (
  // <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //   <path fillRule="evenodd" clipRule="evenodd" d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="#1C274C" />
  <svg
    width="1rem"
    height="1rem"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z"
      fill="#6b7280"
    />
    {/* <path fillRule="evenodd" clipRule="evenodd" d="M12 3.25C7.48587 3.25 4.44529 5.9542 2.68057 8.24686L2.64874 8.2882C2.24964 8.80653 1.88206 9.28392 1.63269 9.8484C1.36564 10.4529 1.25 11.1117 1.25 12C1.25 12.8883 1.36564 13.5471 1.63269 14.1516C1.88206 14.7161 2.24964 15.1935 2.64875 15.7118L2.68057 15.7531C4.44529 18.0458 7.48587 20.75 12 20.75C16.5141 20.75 19.5547 18.0458 21.3194 15.7531L21.3512 15.7118C21.7504 15.1935 22.1179 14.7161 22.3673 14.1516C22.6344 13.5471 22.75 12.8883 22.75 12C22.75 11.1117 22.6344 10.4529 22.3673 9.8484C22.1179 9.28391 21.7504 8.80652 21.3512 8.28818L21.3194 8.24686C19.5547 5.9542 16.5141 3.25 12 3.25ZM3.86922 9.1618C5.49864 7.04492 8.15036 4.75 12 4.75C15.8496 4.75 18.5014 7.04492 20.1308 9.1618C20.5694 9.73159 20.8263 10.0721 20.9952 10.4545C21.1532 10.812 21.25 11.2489 21.25 12C21.25 12.7511 21.1532 13.188 20.9952 13.5455C20.8263 13.9279 20.5694 14.2684 20.1308 14.8382C18.5014 16.9551 15.8496 19.25 12 19.25C8.15036 19.25 5.49864 16.9551 3.86922 14.8382C3.43064 14.2684 3.17374 13.9279 3.00476 13.5455C2.84684 13.188 2.75 12.7511 2.75 12C2.75 11.2489 2.84684 10.812 3.00476 10.4545C3.17374 10.0721 3.43063 9.73159 3.86922 9.1618Z" fill="#1C274C" /> */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3.25C7.48587 3.25 4.44529 5.9542 2.68057 8.24686L2.64874 8.2882C2.24964 8.80653 1.88206 9.28392 1.63269 9.8484C1.36564 10.4529 1.25 11.1117 1.25 12C1.25 12.8883 1.36564 13.5471 1.63269 14.1516C1.88206 14.7161 2.24964 15.1935 2.64875 15.7118L2.68057 15.7531C4.44529 18.0458 7.48587 20.75 12 20.75C16.5141 20.75 19.5547 18.0458 21.3194 15.7531L21.3512 15.7118C21.7504 15.1935 22.1179 14.7161 22.3673 14.1516C22.6344 13.5471 22.75 12.8883 22.75 12C22.75 11.1117 22.6344 10.4529 22.3673 9.8484C22.1179 9.28391 21.7504 8.80652 21.3512 8.28818L21.3194 8.24686C19.5547 5.9542 16.5141 3.25 12 3.25ZM3.86922 9.1618C5.49864 7.04492 8.15036 4.75 12 4.75C15.8496 4.75 18.5014 7.04492 20.1308 9.1618C20.5694 9.73159 20.8263 10.0721 20.9952 10.4545C21.1532 10.812 21.25 11.2489 21.25 12C21.25 12.7511 21.1532 13.188 20.9952 13.5455C20.8263 13.9279 20.5694 14.2684 20.1308 14.8382C18.5014 16.9551 15.8496 19.25 12 19.25C8.15036 19.25 5.49864 16.9551 3.86922 14.8382C3.43064 14.2684 3.17374 13.9279 3.00476 13.5455C2.84684 13.188 2.75 12.7511 2.75 12C2.75 11.2489 2.84684 10.812 3.00476 10.4545C3.17374 10.0721 3.43063 9.73159 3.86922 9.1618Z"
      fill="#6b7280"
    />
  </svg>
);
export const Eyeslashopen = () => (
  // <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //   <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  // </svg>
  <svg
    width="1rem"
    height="1rem"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function reducer(state: IState, action: IAction) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        formValid: true,
      };
    case "login_failed":
      return {
        ...state,
        formValid: true,
      };
    case "github_login":
      return {
        ...state,
        github: true,
      };
    case "github_login_failed":
      return {
        ...state,
        github: false,
      };
    case "google_login":
      return {
        ...state,
        google: true,
      };
    case "google_login_failed":
      return {
        ...state,
        google: false,
      };
    default:
      throw new Error("Unknown action.");
  }
}

const NormalForm = () => {
  const { t } = useTranslation();
  const useEmailLogin = IS_CE_EDITION || SUPPORT_MAIL_LOGIN;

  const router = useRouter();

  const [state, dispatch] = useReducer(reducer, {
    formValid: false,
    github: false,
    google: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const handleEmailPasswordLogin = async () => {
    if (!password) {
      Toast.notify({
        type: "error",
        message: t("login.error.passwordInvalid"),
      });
      return;
    }
    if (!validEmailReg.test(email)) {
      Toast.notify({
        type: "error",
        message: t("login.error.emailInValid"),
      });
      return;
    }
    if (password.length < 8) {
      Toast.notify({
        type: "error",
        message: t("login.error.passwordLengthInValid"),
      });
    }
    if (!validPasswordReg.test(password)) {
      Toast.notify({
        type: "error",
        message: t("login.error.passwordNotValid"),
      });
    }
    try {
      setIsLoading(true);
      const res = await login({
        url: "/login",
        body: {
          email,
          password,
          remember_me: true,
        },
      });
      if (res.result === "success") {
        localStorage.setItem("console_token", res.data);
        router.replace("/apps");
      } else {
        Toast.notify({
          type: "error",
          // message: res.data,
          message: t("login.error.passwordNotValid"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const { data: github, error: github_error } = useSWR(
    state.github
      ? {
          url: "/oauth/login/github",
          // params: {
          //   provider: 'github',
          // },
        }
      : null,
    oauth
  );

  const { data: google, error: google_error } = useSWR(
    state.google
      ? {
          url: "/oauth/login/google",
          // params: {
          //   provider: 'google',
          // },
        }
      : null,
    oauth
  );

  useEffect(() => {
    if (github_error !== undefined) dispatch({ type: "github_login_failed" });
    if (github) window.location.href = github.redirect_url;
  }, [github, github_error]);

  useEffect(() => {
    if (google_error !== undefined) dispatch({ type: "google_login_failed" });
    if (google) window.location.href = google.redirect_url;
  }, [google, google_error]);
  // const Eyeopen = () => (
  //   <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //     <path fillRule="evenodd" clipRule="evenodd" d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="#1C274C" />
  //     <path fillRule="evenodd" clipRule="evenodd" d="M12 3.25C7.48587 3.25 4.44529 5.9542 2.68057 8.24686L2.64874 8.2882C2.24964 8.80653 1.88206 9.28392 1.63269 9.8484C1.36564 10.4529 1.25 11.1117 1.25 12C1.25 12.8883 1.36564 13.5471 1.63269 14.1516C1.88206 14.7161 2.24964 15.1935 2.64875 15.7118L2.68057 15.7531C4.44529 18.0458 7.48587 20.75 12 20.75C16.5141 20.75 19.5547 18.0458 21.3194 15.7531L21.3512 15.7118C21.7504 15.1935 22.1179 14.7161 22.3673 14.1516C22.6344 13.5471 22.75 12.8883 22.75 12C22.75 11.1117 22.6344 10.4529 22.3673 9.8484C22.1179 9.28391 21.7504 8.80652 21.3512 8.28818L21.3194 8.24686C19.5547 5.9542 16.5141 3.25 12 3.25ZM3.86922 9.1618C5.49864 7.04492 8.15036 4.75 12 4.75C15.8496 4.75 18.5014 7.04492 20.1308 9.1618C20.5694 9.73159 20.8263 10.0721 20.9952 10.4545C21.1532 10.812 21.25 11.2489 21.25 12C21.25 12.7511 21.1532 13.188 20.9952 13.5455C20.8263 13.9279 20.5694 14.2684 20.1308 14.8382C18.5014 16.9551 15.8496 19.25 12 19.25C8.15036 19.25 5.49864 16.9551 3.86922 14.8382C3.43064 14.2684 3.17374 13.9279 3.00476 13.5455C2.84684 13.188 2.75 12.7511 2.75 12C2.75 11.2489 2.84684 10.812 3.00476 10.4545C3.17374 10.0721 3.43063 9.73159 3.86922 9.1618Z" fill="#1C274C" />
  //   </svg>
  // )
  // const Eyeslashopen = () => (
  //   <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //     <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  //   </svg>
  // )
  return (
    <>
      {/* <div className="w-full mx-auto">
        <h2 className="text-[32px] font-bold text-gray-900">{t('login.pageTitle')}</h2>
        <p className='mt-1 text-sm text-gray-600'>{t('login.welcome')}</p>
      </div> */}
      {/* same code above is added and welcome sentence is changed */}
      <div className="w-full mx-auto">
        {/* <h2 className="text-[32px] font-bold text-gray-900">Hi, Let's begin!</h2> */}
        <h2 className="text-[32px] font-bold text-gray-900 dark:text-white">
          Hi, Let's begin!
        </h2>
        {/* <p className='mt-1 text-sm text-gray-600'>Please sign in to proceed.</p> */}
        <p className="mt-1 text-sm text-gray-600 dark:text-[#A1A2B6]">
          Please sign in to proceed.
        </p>
      </div>
      <div className="w-full mx-auto mt-8">
        {/* <div className="bg-white "> */}
        <div className="bg-white dark:bg-[#333333]">
          {!useEmailLogin && (
            <div className="flex flex-col gap-3 mt-6">
              <div className="w-full">
                <a href={getPurifyHref(`${apiPrefix}/oauth/login/github`)}>
                  <Button
                    type="default"
                    disabled={isLoading}
                    className="w-full hover:!bg-gray-50 !text-sm !font-medium"
                  >
                    <>
                      <span
                        className={classNames(style.githubIcon, "w-5 h-5 mr-2")}
                      />
                      <span className="truncate text-gray-800">
                        {t("login.withGitHub")}
                      </span>
                    </>
                  </Button>
                </a>
              </div>
              <div className="w-full">
                <a href={getPurifyHref(`${apiPrefix}/oauth/login/google`)}>
                  <Button
                    type="default"
                    disabled={isLoading}
                    className="w-full hover:!bg-gray-50 !text-sm !font-medium"
                  >
                    <>
                      <span
                        className={classNames(style.googleIcon, "w-5 h-5 mr-2")}
                      />
                      <span className="truncate text-gray-800">
                        {t("login.withGoogle")}
                      </span>
                    </>
                  </Button>
                </a>
              </div>
            </div>
          )}

          {useEmailLogin && (
            <>
              {/* <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-300 bg-white">OR</span>
                </div>
              </div> */}

              <form onSubmit={() => {}}>
                <div className="mb-5 dark:bg-[#333333] ">
                  {/* <label htmlFor="email" className="my-2 block text-sm font-medium dark:bg-[#333333] text-gray-900"> */}
                  <label
                    htmlFor="email"
                    className="my-2 block text-sm font-medium dark:bg-[#333333] text-gray-900 dark:text-white"
                  >
                    {t("login.email")}
                  </label>
                  <div className="mt-1">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder={t("login.emailPlaceholder") || ""}
                      // className={'appearance-none block w-full rounded-lg pl-[14px] px-3 py-2 border border-gray-200  hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500  placeholder-gray-400 caret-primary-600 sm:text-sm'}
                      className={
                        "appearance-none block w-full rounded-lg pl-[14px] px-3 py-2 border border-gray-200 dark:border-[#6b7280] hover:border-gray-300 dark:hover:border-[#5f5f5f] hover:shadow-sm focus:outline-none focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500 dark:focus:!bg-[#3f3f3f] placeholder-gray-400 caret-primary-600 sm:text-sm dark:!bg-[#3f3f3f] dark:text-white"
                      }
                    />
                  </div>
                </div>

                <div className="mb-4 dark:bg-[#333333]">
                  {/* <label htmlFor="password" className="my-2 flex items-center justify-between text-sm font-medium text-gray-900"> */}
                  <label
                    htmlFor="password"
                    className="my-2 flex items-center justify-between text-sm font-medium text-gray-900 dark:text-white"
                  >
                    <span>{t("login.password")}</span>
                    {/* <Tooltip
                      selector='forget-password'
                      htmlContent={
                        <div>
                          <div className='font-medium'>{t('login.forget')}</div>
                          <div className='font-medium text-gray-500'>
                            <code>
                              sudo rm -rf /
                            </code>
                          </div>
                        </div>
                      }
                    >
                      <span className='cursor-pointer text-primary-600'>{t('login.forget')}</span>
                    </Tooltip> */}
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEmailPasswordLogin();
                      }}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder={t("login.passwordPlaceholder") || ""}
                      className={
                        "appearance-none block w-full rounded-lg pl-[14px] px-3 py-2 border border-gray-200 dark:border-[#6b7280] hover:border-gray-300 dark:hover:border-[#5f5f5f] hover:shadow-sm focus:outline-none focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500 dark:bg-[#3f3f3f] placeholder-gray-400 caret-primary-600 sm:text-sm dark:text-white pr-10"
                      }
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                      >
                        {showPassword ? <Eyeopen /> : <Eyeslashopen />}
                        {/* {showPassword ? '🧐' : '🤐'} */}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <Button
                    tabIndex={0}
                    type="primary"
                    onClick={handleEmailPasswordLogin}
                    disabled={isLoading}
                    className="w-full !fone-medium !text-sm"
                  >
                    {t("login.signBtn")}
                  </Button>
                </div>
              </form>
            </>
          )}
          {/*  agree to our Terms and Privacy Policy. */}
          {/* <div className="w-hull text-center block mt-2 text-xs text-gray-600">
            {t('login.tosDesc')}
            &nbsp;
            <Link
              className='text-primary-600'
              target='_blank' rel='noopener noreferrer'
              href='https://dify.ai/terms'
            >{t('login.tos')}</Link>
            &nbsp;&&nbsp;
            <Link
              className='text-primary-600'
              target='_blank' rel='noopener noreferrer'
              href='https://dify.ai/privacy'
            >{t('login.pp')}</Link>
          </div> */}

          {/* {IS_CE_EDITION && <div className="w-hull text-center block mt-2 text-xs text-gray-600">
            {t('login.goToInit')}
            &nbsp;
            <Link
              className='text-primary-600'
              href='/install'
            >{t('login.setAdminAccount')}</Link>
          </div>} */}
        </div>
      </div>
    </>
  );
};

export default NormalForm;
