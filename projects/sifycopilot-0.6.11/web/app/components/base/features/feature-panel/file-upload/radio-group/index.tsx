// 'use client'
// import type { FC } from 'react'
// import React from 'react'
// import cn from 'classnames'
// import s from './style.module.css'

// type OPTION = {
//   label: string
//   value: any
// }

// type Props = {
//   className?: string
//   options: OPTION[]
//   value: any
//   onChange: (value: any) => void
// }

// const RadioGroup: FC<Props> = ({
//   className = '',
//   options,
//   value,
//   onChange,
// }) => {
//   return (
//     <div className={cn(className, 'flex')}>
//       {options.map(item => (
//         <div
//           key={item.value}
//           // className={cn(s.item, item.value === value && s.checked)}
//           className={cn(
//             "grow flex items-center h-8 px-2.5 rounded-lg bg-gray-25 dark:bg-[#3F3F3F] border border-gray-100 cursor-pointer space-x-2",
//             "hover:bg-white hover:border-[#B2CCFF] dark:border-primary-600 hover:shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),_0px_4px_6px_-2px_rgba(16,24,40,0.03)]",
//             item.value === value && "bg-white border-[#4CAF50] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06),_0px_1px_3px_0px_rgba(16,24,40,0.10)]",
//             item.value === value && "border-[4px] border-[#8AB40A]"
//           )}
//           // className={cn(
//           //   "grow flex items-center h-8 px-2.5 rounded-lg bg-gray-25 dark:bg-[#3F3F3F] border border-gray-100 cursor-pointer space-x-2",
//           //   "hover:bg-white hover:border-primary-600 dark:border-primary-600 hover:shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),_0px_4px_6px_-2px_rgba(16,24,40,0.03)]",
//           //   item.value === value &&
//           //     "bg-white border-primary-600 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06),_0px_1px_3px_0px_rgba(16,24,40,0.10)]",
//           //   item.value === value && "border-[4px] border-primary-600"
//           // )}
          
          
//           onClick={() => onChange(item.value)}
//         >
//           {/* <div className={s.radio}></div> */}
//           <div className="w-4 h-4 border-2 border-gray-200  rounded-full"></div>
//           {/* <div
//             className={cn(
//               "w-4 h-4 border-2 rounded-full",
//               item.value === value ? "border-primary-600" : "border-gray-200"
//             )}
//           ></div> */}

//           {/* <div className='text-[13px] font-medium text-gray-900 '>{item.label}</div> */}
//           <div className='text-[13px] font-medium text-gray-900 dark:text-[#FCFCFC] '>{item.label}</div>
//         </div>
//       ))}
//     </div>
//   )
// }
// export default React.memo(RadioGroup)


'use client';
import type { FC } from 'react';
import React from 'react';
import cn from 'classnames';

type OPTION = {
  label: string;
  value: any;
};

type Props = {
  className?: string;
  options: OPTION[];
  value: any;
  onChange: (value: any) => void;
};

const RadioGroup: FC<Props> = ({
  className = '',
  options,
  value,
  onChange,
}) => {
  return (
    <div className={cn(className, 'flex')}>
      {options.map((item) => (
        <div
          key={item.value}
          className={cn(
            'grow flex items-center h-8 px-2.5 rounded-lg bg-gray-25 dark:bg-[#3F3F3F] border cursor-pointer space-x-2',
            'hover:bg-white hover:border-primary-600 dark:hover:border-primary-600 hover:shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),_0px_4px_6px_-2px_rgba(16,24,40,0.03)]',
            item.value === value
              ? 'bg-white border-primary-600 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06),_0px_1px_3px_0px_rgba(16,24,40,0.10)]'
              : 'border-gray-100 dark:border-[#5f5f5f]'
          )}
          onClick={() => onChange(item.value)}
        >
          <div
            className={cn(
              'w-4 h-4 border-2 rounded-full flex items-center justify-center',
              item.value === value
                ? 'border-primary-600 bg-transparent'
                : 'border-gray-200 dark:border-[#5f5f5f]'
            )}
          >
            {item.value === value && (
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
            )}
          </div>
          <div className="text-[13px] font-medium text-gray-900 dark:text-[#FCFCFC]">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(RadioGroup);
