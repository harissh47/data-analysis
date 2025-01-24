"use client";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import cn from "classnames";
// import { GoldCoin } from '../../base/icons/src/vender/solid/FinanceAndECommerce'
import { GoldCoin } from "../components/base/icons/src/vender/solid/FinanceAndECommerce";
// import { GoldCoin as GoldCoinOutLine } from '../../base/icons/src/vender/line/financeAndECommerce'
import { GoldCoin as GoldCoinOutLine } from "../components/base/icons/src/vender/line/financeAndECommerce";
import AccountPage from "./account-page";
import MembersPage from "./members-page";
import IntegrationsPage from "./Integrations-page";
import LanguagePage from "./language-page";
import ApiBasedExtensionPage from "./api-based-extension-page";
import DataSourcePage from "./data-source-page";
import ModelProviderPage from "./model-provider-page";
import s from "./index.module.css";
import BillingPage from "@/app/components/billing/billing-page";
import CustomPage from "@/app/components/custom/custom-page";
import Modal from "@/app/components/base/modal";
import {
  Database03,
  Webhooks,
} from "@/app/components/base/icons/src/vender/line/development";
import { Database03 as Database03Solid } from "@/app/components/base/icons/src/vender/solid/development";
import {
  User01,
  Users01,
} from "@/app/components/base/icons/src/vender/line/users";
import {
  User01 as User01Solid,
  Users01 as Users01Solid,
} from "@/app/components/base/icons/src/vender/solid/users";
import { Globe01 } from "@/app/components/base/icons/src/vender/line/mapsAndTravel";
import {
  AtSign,
  XClose,
} from "@/app/components/base/icons/src/vender/line/general";
import { CubeOutline } from "@/app/components/base/icons/src/vender/line/shapes";
import { Colors } from "@/app/components/base/icons/src/vender/line/editor";
import { Colors as ColorsSolid } from "@/app/components/base/icons/src/vender/solid/editor";
import useBreakpoints, { MediaType } from "@/hooks/use-breakpoints";
import { useProviderContext } from "@/context/provider-context";
import { useRouter } from "next/navigation";
import WorkspacePage from "./workspace-page";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { BriefcaseIcon as BriefcaseSolid } from "@heroicons/react/20/solid";

const iconClassName = `
  w-4 h-4 ml-3 mr-2
`;

const scrolledClassName = `
  border-b dark:border-b-[#5f5f5f] shadow-xs bg-white/[.98]
`;

type IAccountSettingProps = {
  // onCancel: () => void
  activeTab?: string;
};

type GroupItem = {
  key: string;
  name: string;
  description?: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
};

export default function AccountSetting({
  // onCancel,
  activeTab = "account",
}: IAccountSettingProps) {
  const [activeMenu, setActiveMenu] = useState(activeTab);
  const { t } = useTranslation();
  const { enableBilling, enableReplaceWebAppLogo } = useProviderContext();

  const workplaceGroupItems = (() => {
    return [
      {
        key: "provider",
        name: t("common.settings.provider"),
        icon: <CubeOutline className={iconClassName} />,
        activeIcon: <CubeOutline className={iconClassName} />,
      },
      {
        key: "members",
        name: t("common.settings.members"),
        icon: <Users01 className={iconClassName} />,
        activeIcon: <Users01Solid className={iconClassName} />,
      },
      {
        // Use key false to hide this item
        // key: enableBilling ? 'billing' : true,
        key: enableBilling ? "billing" : false,
        name: t("common.settings.billing"),
        // description: t('billing.plansCommon.receiptInfo'),
        icon: <GoldCoinOutLine className={iconClassName} />,
        activeIcon: <GoldCoin className={iconClassName} />,
      },
      {
        key: "data-source",
        name: t("common.settings.dataSource"),
        icon: <Database03 className={iconClassName} />,
        activeIcon: <Database03Solid className={iconClassName} />,
      },
      {
        key: "api-based-extension",
        name: t("common.settings.apiBasedExtension"),
        icon: <Webhooks className={iconClassName} />,
        activeIcon: <Webhooks className={iconClassName} />,
      },
      // {
      //   key: (enableReplaceWebAppLogo || enableBilling) ? 'custom' : false,
      //   name: t('custom.custom'),
      //   icon: <Colors className={iconClassName} />,
      //   activeIcon: <ColorsSolid className={iconClassName} />,
      // },
      {
        key: "workspace",
        name: "Workspace",
        icon: <BriefcaseIcon className={iconClassName} />,
        activeIcon: <BriefcaseSolid className={iconClassName} />,
      },
    ].filter((item) => !!item.key) as GroupItem[];
  })();

  const media = useBreakpoints();
  const isMobile = media === MediaType.mobile;
  const timezone = "Time Zone";

  const menuItems = [
    {
      key: "workspace-group",
      name: t("common.settings.workplaceGroup"),
      items: workplaceGroupItems,
    },
    {
      key: "account-group",
      name: t("common.settings.accountGroup"),
      items: [
        {
          key: "account",
          name: t("common.settings.account"),
          icon: <User01 className={iconClassName} />,
          activeIcon: <User01Solid className={iconClassName} />,
        },
        // {
        //   key: 'integrations',
        //   name: t('common.settings.integrations'),
        //   icon: <AtSign className={iconClassName} />,
        //   activeIcon: <AtSign className={iconClassName} />,
        // },
        // {
        //   key: 'language',
        //   // name: t('common.settings.language'),
        //   name: timezone,
        //   icon: <Globe01 className={iconClassName} />,
        //   activeIcon: <Globe01 className={iconClassName} />,
        // },
      ],
    },
  ];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    document.title = `${t("common.userProfile.settings")}`;

    const targetElement = scrollRef.current;
    const scrollHandle = (e: Event) => {
      const userScrolled = (e.target as HTMLDivElement).scrollTop > 0;
      setScrolled(userScrolled);
    };
    targetElement?.addEventListener("scroll", scrollHandle);
    return () => {
      targetElement?.removeEventListener("scroll", scrollHandle);
    };
  }, []);

  const router = useRouter();

  const navBackHandle = () => {
    router.replace("/apps");
  };

  const activeItem = [...menuItems[0].items, ...menuItems[1].items].find(
    (item) => item.key === activeMenu
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      // setIsDarkMode(true)
    }
  }, []);

  return (
    // <div className="flex bg-white h-screen">
    <div className="flex bg-white h-screen w-screen overflow-hidden">
      {/* <div className="w-[44px] sm:w-[200px] px-1 py-4 sm:p-4 border border-gray-100 flex flex-col items-center sm:items-start overflow-y-auto"> */}
      <div className="w-[44px] sm:w-[200px] px-1 py-4 sm:p-4 border border-gray-100 dark:border-[#5f5f5f] flex flex-col items-center sm:items-start overflow-y-auto dark:bg-[#202020] ">
        {/* Sidebar header */}
        <div className="flex items-center mb-8 text-sm sm:text-base font-medium leading-6 text-gray-900">
          {/* <div onClick={navBackHandle} className="cursor-pointer" /> */}
          {/* <div onClick={navBackHandle} className={cn(s.navBack, isMobile && '!mr-0')} /> */}
          <div
            onClick={navBackHandle}
            className={cn(
              s.navBack,
              "dark:bg-[#383838]",
              isMobile && "!mr-0 dark:bg-[#383838]"
            )}
          />
          {/* <div className="ml-2">{t('common.userProfile.settings')}</div> */}
          <div className="ml-2 dark:text-white">
            {t("common.userProfile.settings")}
          </div>
        </div>
        {/* Sidebar menu items */}
        <div className="w-full">
          {menuItems.map((menuItem) => (
            <div key={menuItem.key} className="mb-4">
              {/* <div className="px-2 mb-1 text-[10px] sm:text-xs font-medium text-gray-500">{menuItem.name}</div> */}
              <div className="px-2 mb-1 text-[10px] sm:text-xs font-medium text-gray-500 dark:text-white">
                {menuItem.name}
              </div>
              <div>
                {menuItem.items.map((item) => (
                  <div
                    key={item.key}
                    className={`
                        flex items-center h-[37px] mb-1 text-sm cursor-pointer rounded-lg cursor-pointer dark:text-white
                        ${
                          activeMenu === item.key
                            ? "font-semibold text-primary-600 dark:!text-primary-600 bg-primary-50 dark:hover:bg-transparent"
                            : "font-light text-gray-700 dark:hover:bg-zinc-800"
                        }
                      `}
                    title={item.name}
                    onClick={() => setActiveMenu(item.key)}
                  >
                    {activeMenu === item.key ? item.activeIcon : item.icon}
                    {!isMobile && (
                      <div className="ml-2 truncate">{item.name}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <div ref={scrollRef} className="flex-1 overflow-y-auto"> */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto dark:bg-[#202020]">
        {/* <div className={cn('sticky top-0 px-6 py-4 flex items-center h-14 mb-4 bg-white text-base font-medium text-gray-900 z-20', scrolled && scrolledClassName)}> */}
        <div
          className={cn(
            "sticky top-0 px-6 py-4 flex items-center h-14 mb-4 bg-white text-base font-medium text-gray-900 z-20 dark:bg-[#202020] dark:text-white",
            scrolled && scrolledClassName
          )}
        >
          <div className="shrink-0">{activeItem?.name}</div>
          {activeItem?.description && (
            <div className="shrink-0 ml-2 text-xs text-gray-600">
              {activeItem?.description}
            </div>
          )}
          {/* Uncomment this section if needed
    <div className='grow flex justify-end'>
      <div className='flex items-center justify-center -mr-4 w-6 h-6 cursor-pointer' onClick={onCancel}>
        <XClose className='w-4 h-4 text-gray-400' />
      </div>
    </div>
    */}
        </div>
        {/* <div className='px-4 sm:px-8 pt-2 w-1150px'> */}
        <div className="px-4 sm:px-8 pt-2 w-full max-w-[1150px]">
          {activeMenu === "account" && <AccountPage />}
          {activeMenu === "members" && <MembersPage />}
          {activeMenu === "billing" && <BillingPage />}
          {activeMenu === "integrations" && <IntegrationsPage />}
          {activeMenu === "language" && <LanguagePage />}
          {activeMenu === "provider" && <ModelProviderPage />}
          {activeMenu === "data-source" && <DataSourcePage />}
          {activeMenu === "api-based-extension" && <ApiBasedExtensionPage />}
          {activeMenu === "custom" && <CustomPage />}
          {activeMenu === "workspace" && <WorkspacePage />}
          {/* {activeMenu === 'workspace' && <div>Helloi</div>} */}
        </div>
      </div>
    </div>
  );
}
// <Modal
//   isShow
//   onClose={() => { }}
//   className={s.modal}
//   wrapperClassName='!z-20 pt-[60px]'
// >
//   <div className='flex'>
//     <div className='w-[44px] sm:w-[200px] px-[1px] py-4 sm:p-4 border border-gray-100 shrink-0 sm:shrink-1 flex flex-col items-center sm:items-start'>
//       <div className='mb-8 ml-0 sm:ml-2 text-sm sm:text-base font-medium leading-6 text-gray-900'>{t('common.userProfile.settings')}</div>
//       <div className='w-full'>
//         {
//           menuItems.map(menuItem => (
//             <div key={menuItem.key} className='mb-4'>
//               <div className='px-2 mb-[6px] text-[10px] sm:text-xs font-medium text-gray-500'>{menuItem.name}</div>
//               <div>
//                 {
//                   menuItem.items.map(item => (
//                     <div
//                       key={item.key}
//                       className={`
//                         flex items-center h-[37px] mb-[2px] text-sm cursor-pointer rounded-lg
//                         ${activeMenu === item.key ? 'font-semibold text-primary-600 bg-primary-50' : 'font-light text-gray-700'}
//                       `}
//                       title={item.name}
//                       onClick={() => setActiveMenu(item.key)}
//                     >
//                       {activeMenu === item.key ? item.activeIcon : item.icon}
//                       {!isMobile && <div className='truncate'>{item.name}</div>}
//                     </div>
//                   ))
//                 }
//               </div>
//             </div>
//           ))
//         }
//       </div>
//     </div>
//     <div ref={scrollRef} className='relative w-[824px] h-[720px] pb-4 overflow-y-auto'>
//       <div className={cn('sticky top-0 px-6 py-4 flex items-center h-14 mb-4 bg-white text-base font-medium text-gray-900 z-20', scrolled && scrolledClassName)}>
//         <div className='shrink-0'>{activeItem?.name}</div>
//         {
//           activeItem?.description && (
//             <div className='shrink-0 ml-2 text-xs text-gray-600'>{activeItem?.description}</div>
//           )
//         }
//         {/* <div className='grow flex justify-end'>
//           <div className='flex items-center justify-center -mr-4 w-6 h-6 cursor-pointer' onClick={onCancel}>
//             <XClose className='w-4 h-4 text-gray-400' />
//           </div>
//         </div> */}
//       </div>
//       <div className='px-4 sm:px-8 pt-2'>
//         {activeMenu === 'account' && <AccountPage />}
//         {activeMenu === 'members' && <MembersPage />}
//         {activeMenu === 'billing' && <BillingPage />}
//         {activeMenu === 'integrations' && <IntegrationsPage />}
//         {activeMenu === 'language' && <LanguagePage />}
//         {activeMenu === 'provider' && <ModelProviderPage />}
//         {activeMenu === 'data-source' && <DataSourcePage />}
//         {activeMenu === 'api-based-extension' && <ApiBasedExtensionPage />}
//         {activeMenu === 'custom' && <CustomPage />}
//       </div>
//     </div>
//   </div>
// </Modal>
