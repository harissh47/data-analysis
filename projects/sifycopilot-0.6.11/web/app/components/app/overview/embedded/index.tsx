// import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import cn from 'classnames';
// import copy from 'copy-to-clipboard';
// import style from './style.module.css';
// import Modal from '@/app/components/base/modal';
// import copyStyle from '@/app/components/app/chat/copy-btn/style.module.css';
// import Tooltip from '@/app/components/base/tooltip';
// import { useAppContext } from '@/context/app-context';
// import { IS_CE_EDITION } from '@/config';

// type Props = {
//   isShow: boolean;
//   onClose: () => void;
//   accessToken: string;
//   appBaseUrl: string;
//   className?: string;
// };

// const OPTION_MAP = {
//   iframe: {
//     getContent: (url: string, token: string) =>
//       `<iframe
//  src="${url}/chatbot/${token}"
//  style="width: 100%; height: 100%; min-height: 700px"
//  frameborder="0"
//  allow="microphone">
// </iframe>`,
//   },
//   scripts: {
//     getContent: (url: string, token: string, isTestEnv?: boolean) =>
//       `<script>
//  window.chatbotConfig = {
//   token: '${token}'${isTestEnv
//   ? `,
//   isDev: true`
//   : ''}${IS_CE_EDITION
//   ? `,
//   baseUrl: '${url}'`
//   : ''}
//  }
// </script>
// <script
//  src="${url}/embed.min.js"
//  id="${token}"
//  defer>
// </script>`,
//   },
// };
// const prefixEmbedded = 'appOverview.overview.appInfo.embedded';

// type Option = keyof typeof OPTION_MAP;

// type OptionStatus = {
//   iframe: boolean;
//   scripts: boolean;
// };

// const Embedded = ({ isShow, onClose, appBaseUrl, accessToken, className }: Props) => {
//   const { t } = useTranslation();
//   const [option, setOption] = useState<Option>('iframe');
//   const [isCopied, setIsCopied] = useState<OptionStatus>({ iframe: false, scripts: false });

//   const { langeniusVersionInfo } = useAppContext();
//   const isTestEnv = langeniusVersionInfo.current_env === 'TESTING' || langeniusVersionInfo.current_env === 'DEVELOPMENT';

//   const onClickCopy = () => {
//     copy(OPTION_MAP[option].getContent(appBaseUrl, accessToken, isTestEnv));
//     setIsCopied({ ...isCopied, [option]: true });
//   };

//   // when toggle option, reset then copy status
//   const resetCopyStatus = () => {
//     const cache = { ...isCopied };
//     Object.keys(cache).forEach((key) => {
//       cache[key as keyof OptionStatus] = false;
//     });
//     setIsCopied(cache);
//   };

//   useEffect(() => {
//     resetCopyStatus();
//   }, [isShow]);

//   return (
//     <Modal
//       title={t(`${prefixEmbedded}.title`)}
//       isShow={isShow}
//       onClose={onClose}
//       className="!max-w-2xl w-[640px]"
//       wrapperClassName={className}
//       closable={true}
//     >
//       <div className="mb-4 mt-8 text-gray-900 text-[14px] font-medium leading-tight">
//         {t(`${prefixEmbedded}.explanation`)}
//       </div>
//       <div className="flex flex-wrap items-center justify-between gap-y-2">
//         {Object.keys(OPTION_MAP).map((v, index) => (
//           <div
//             key={index}
//             className={cn(
//               style.option,
//               style[`${v}Icon`],
//               option === v && style.active,
//               'flex-1 min-w-[150px] max-w-[200px] text-center cursor-pointer'
//             )}
//             onClick={() => {
//               setOption(v as Option);
//               resetCopyStatus();
//             }}
//           >
//             {/* <div className="text-sm font-medium">{t(`${prefixEmbedded}.${v}`)}</div> */}
//           </div>
//         ))}
//       </div>
//       <div className={cn('w-full bg-gray-100 rounded-lg flex-col justify-start items-start inline-flex', 'mt-6')}>
//         <div className="inline-flex items-center self-stretch justify-start gap-2 py-1 pl-3 pr-1 border border-black rounded-tl-lg rounded-tr-lg bg-gray-50 border-opacity-5">
//           <div className="grow shrink basis-0 text-slate-700 text-[13px] font-medium leading-none">
//             {t(`${prefixEmbedded}.${option}`)}
//           </div>
//           <div className="flex items-center justify-center gap-1 p-2 rounded-lg">
//             <Tooltip
//               selector={'code-copy-feedback'}
//               content={(isCopied[option] ? t(`${prefixEmbedded}.copied`) : t(`${prefixEmbedded}.copy`)) || ''}
//             >
//               <div className="w-8 h-8 rounded-lg cursor-pointer hover:bg-gray-100">
//                 <div onClick={onClickCopy} className={`w-full h-full ${copyStyle.copyIcon} ${isCopied[option] ? copyStyle.copied : ''}`}></div>
//               </div>
//             </Tooltip>
//           </div>
//         </div>
//         <div className="flex items-start justify-start w-full gap-2 p-3 overflow-x-auto">
//           <div className="grow shrink basis-0 text-slate-700 text-[13px] leading-tight font-mono">
//             <pre className='select-text'>{OPTION_MAP[option].getContent(appBaseUrl, accessToken, isTestEnv)}</pre>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default Embedded;


import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import copy from 'copy-to-clipboard';
import style from './style.module.css';
import Modal from '@/app/components/base/modal';
import copyStyle from '@/app/components/app/chat/copy-btn/style.module.css';
import Tooltip from '@/app/components/base/tooltip';
import { useAppContext } from '@/context/app-context';
import { IS_CE_EDITION } from '@/config';

type Props = {
  isShow: boolean;
  onClose: () => void;
  accessToken: string;
  appBaseUrl: string;
  className?: string;
};

const OPTION_MAP = {
  iframe: {
    // getContent: (url: string, token: string) =>
    getContent: (url: string, token: string, isTestEnv?: boolean) =>
      //       `<iframe
      //  src="${url}/chatbot/${token}"
      //  style="width: 100%; height: 100%; min-height: 700px"
      //  frameborder="0"
      //  allow="microphone">
      // </iframe>`,
      `<script>
window.chatbotConfig = {
 token: '${token}'${isTestEnv
        ? `,
 isDev: true`
        : ''}${IS_CE_EDITION
          ? `,
 baseUrl: '${url}'`
          : ''}
}
</script>
<script
src="${url}/center-embed.js"
id="${token}"
defer>
</script>`,
  },
  scripts: {
    getContent: (url: string, token: string, isTestEnv?: boolean) =>
      `<script>
 window.chatbotConfig = {
  token: '${token}'${isTestEnv
        ? `,
  isDev: true`
        : ''}${IS_CE_EDITION
          ? `,
  baseUrl: '${url}'`
          : ''}
 }
</script>
<script
 src="${url}/embed.min.js"
 id="${token}"
 defer>
</script>`,
  },
};
const prefixEmbedded = 'appOverview.overview.appInfo.embedded';

type Option = keyof typeof OPTION_MAP;

type OptionStatus = {
  iframe: boolean;
  scripts: boolean;
};

const Embedded = ({ isShow, onClose, appBaseUrl, accessToken, className }: Props) => {
  const { t } = useTranslation();
  const [option, setOption] = useState<Option>('iframe');
  const [isCopied, setIsCopied] = useState<OptionStatus>({ iframe: false, scripts: false });

  const { langeniusVersionInfo } = useAppContext();
  const isTestEnv = langeniusVersionInfo.current_env === 'TESTING' || langeniusVersionInfo.current_env === 'DEVELOPMENT';

  const onClickCopy = () => {
    copy(OPTION_MAP[option].getContent(appBaseUrl, accessToken, isTestEnv));
    setIsCopied({ ...isCopied, [option]: true });
  };

  // when toggle option, reset then copy status
  const resetCopyStatus = () => {
    const cache = { ...isCopied };
    Object.keys(cache).forEach((key) => {
      cache[key as keyof OptionStatus] = false;
    });
    setIsCopied(cache);
  };

  useEffect(() => {
    resetCopyStatus();
  }, [isShow]);

  return (
    <Modal
      title={t(`${prefixEmbedded}.title`)}
      isShow={isShow}
      onClose={onClose}
      className="!max-w-2xl w-[640px]"
      wrapperClassName={className}
      closable={true}
    >
      {/* <div className="mb-4 mt-8 text-gray-900 text-[14px] font-medium leading-tight"> */}
      <div className="mb-4 mt-8 text-gray-900 text-[14px] font-medium leading-tight dark:text-white" >
        {t(`${prefixEmbedded}.explanation`)}
      </div>
      <div className="flex flex-wrap items-center justify-evenly gap-y-2">
        {/* Flex container with even spacing for widgets */}
        {Object.keys(OPTION_MAP).map((v, index) => (
          <div
            key={index}
            className={cn(
              style.option,
              style[`${v}Icon`],
              option === v && style.active,
              'flex-1 min-w-[150px] max-w-[200px] text-center cursor-pointer dark:border-[#5f5f5f]'
            )}
            onClick={() => {
              setOption(v as Option);
              resetCopyStatus();
            }}
          >
            {/* <div className="text-sm font-medium">{t(`${prefixEmbedded}.${v}`)}</div> */}
          </div>
        ))}
      </div>
      <div className={cn('w-full bg-gray-100 rounded-lg flex-col justify-start items-start inline-flex', 'mt-6')}>
        {/* <div className="inline-flex items-center self-stretch justify-start gap-2 py-1 pl-3 pr-1 border border-black rounded-tl-lg rounded-tr-lg bg-gray-50 border-opacity-5"> */}
        <div className="inline-flex items-center self-stretch justify-start gap-2 py-1 pl-3 pr-1 border border-black rounded-tl-lg rounded-tr-lg bg-gray-50 border-opacity-5 dark:bg-[#2c2c2c]">
          {/* <div className="grow shrink basis-0 text-slate-700 text-[13px] font-medium leading-none">
            {t(`${prefixEmbedded}.${option}`)} */}
            <div className="grow shrink basis-0 text-slate-700 text-[13px] font-medium leading-none dark:text-white">
            {t(`${prefixEmbedded}.${option}`)}
          </div>
          <div className="flex items-center justify-center gap-1 p-2 rounded-lg">
            <Tooltip
              selector={'code-copy-feedback'}
              content={(isCopied[option] ? t(`${prefixEmbedded}.copied`) : t(`${prefixEmbedded}.copy`)) || ''}
            >
              {/* <div className="w-8 h-8 rounded-lg cursor-pointer hover:bg-gray-100"> */}
              <div className="w-8 h-8 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800">

                <div onClick={onClickCopy} className={`w-full h-full ${copyStyle.copyIcon} ${isCopied[option] ? copyStyle.copied : ''}`}></div>
              </div>
            </Tooltip>
          </div>
        </div>
        {/* <div className="flex items-start justify-start w-full gap-2 p-3 overflow-x-auto"> */}
        <div className="flex items-start justify-start w-full gap-2 p-3 overflow-x-auto dark:bg-zinc-800">
          <div className="grow shrink basis-0 text-slate-700 text-[13px] leading-tight font-mono">
            {/* <pre className='select-text'>{OPTION_MAP[option].getContent(appBaseUrl, accessToken, isTestEnv)}</pre> */}
            <pre className='select-text dark:text-white'>{OPTION_MAP[option].getContent(appBaseUrl, accessToken, isTestEnv)}</pre>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Embedded;
