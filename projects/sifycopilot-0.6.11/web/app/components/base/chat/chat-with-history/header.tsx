import type { FC } from 'react'
import { memo, useState } from 'react'

type HeaderProps = {
  title: string
  isMobile: boolean

}
const Header: FC<HeaderProps> = ({
  title,
  isMobile,

}) => {


  return (
    <div
      // className={`
      //   sticky top-0 flex items-center px-8 h-16 text-base font-medium 
      //   text-gray-100 bg-[#2C2C2C] z-[100]
      //   ${isMobile && '!h-12' && 'z-[40]'}
      //   `}
      className={`
        sticky top-0 flex items-center px-8 h-16 text-base font-medium 
        text-gray-900 bg-white border-b-[0.5px] border-b-gray-200 z-[100]
        ${isMobile && '!h-12' && 'z-[40]'}
        `}
    >
      {title}
    </div>
  )
}

export default memo(Header)

// import type { FC } from 'react'
// import { memo, useState, useEffect } from 'react'

// type HeaderProps = {
//   title: string
//   isMobile: boolean
// }

// const Header: FC<HeaderProps> = ({ title, isMobile }) => {
//   const [isDropdownOpen, setDropdownOpen] = useState(false)
//   const [isHeaderVisible, setHeaderVisible] = useState(() => {
//     const storedVisibility = localStorage.getItem('headerVisibility')
//     return storedVisibility ? JSON.parse(storedVisibility) : true
//   })


//   useEffect(() => {
//     localStorage.setItem('headerVisibility', JSON.stringify(isHeaderVisible))
//   }, [isHeaderVisible])

//   const handleDropdownToggle = () => setDropdownOpen(!isDropdownOpen)
//   // const handleShowHeader = () => {
//   //   setHeaderVisible(true);
//   //   setDropdownOpen(false);
//   // };
//   // const handleHideHeader = () => {
//   //   setHeaderVisible(false);
//   //   setDropdownOpen(false);
//   // };

//   const toggleHeaderVisibility = () => {
//     setHeaderVisible((prevVisible: boolean) => {
//       const newVisibility = !prevVisible
//       localStorage.setItem('headerVisibility', JSON.stringify(newVisibility))
//       return newVisibility
//     })
//     setDropdownOpen(false)
//   }

//   if (!isHeaderVisible) {
//     return (
//       <div className="fixed top-0 right-0 p-4">
//         <button
//           onClick={handleDropdownToggle}
//           className="flex items-center justify-center p-2"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="20"
//             height="20"
//             viewBox="0 0 512 512"
//             className="w-6 h-6 text-gray-500"
//           >
//             <path d="M424.5,216.5h-15.2c-12.4,0-22.8-10.7-22.8-23.4c0-6.4,2.7-12.2,7.5-16.5l9.8-9.6c9.7-9.6,9.7-25.3,0-34.9l-22.3-22.1c-4.4-4.4-10.9-7-17.5-7c-6.6,0-13,2.6-17.5,7l-9.4,9.4c-4.5,5-10.5,7.7-17,7.7c-12.8,0-23.5-10.4-23.5-22.7V89.1c0-13.5-10.9-25.1-24.5-25.1h-30.4c-13.6,0-24.4,11.5-24.4,25.1v15.2c0,12.3-10.7,22.7-23.5,22.7c-6.4,0-12.3-2.7-16.6-7.4l-9.7-9.6c-4.4-4.5-10.9-7-17.5-7s-13,2.6-17.5,7L110,132c-9.6,9.6-9.6,25.3,0,34.8l9.4,9.4c5,4.5,7.8,10.5,7.8,16.9c0,12.8-10.4,23.4-22.8,23.4H89.2c-13.7,0-25.2,10.7-25.2,24.3V256v15.2c0,13.5,11.5,24.3,25.2,24.3h15.2c12.4,0,22.8,10.7,22.8,23.4c0,6.4-2.8,12.4-7.8,16.9l-9.4,9.3c-9.6,9.6-9.6,25.3,0,34.8l22.3,22.2c4.4,4.5,10.9,7,17.5,7c6.6,0,13-2.6,17.5-7l9.7-9.6c4.2-4.7,10.2-7.4,16.6-7.4c12.8,0,23.5,10.4,23.5,22.7v15.2c0,13.5,10.8,25.1,24.5,25.1h30.4c13.6,0,24.4-11.5,24.4-25.1v-15.2c0-12.3,10.7-22.7,23.5-22.7c6.4,0,12.4,2.8,17,7.7l9.4,9.4c4.5,4.4,10.9,7,17.5,7c6.6,0,13-2.6,17.5-7l22.3-22.2c9.6-9.6,9.6-25.3,0-34.9l-9.8-9.6c-4.8-4.3-7.5-10.2-7.5-16.5c0-12.8,10.4-23.4,22.8-23.4h15.2c13.6,0,23.3-10.7,23.3-24.3V256v-15.2C447.8,227.2,438.1,216.5,424.5,216.5z M336.8,256L336.8,256c0,44.1-35.7,80-80,80c-44.3,0-80-35.9-80-80l0,0l0,0c0-44.1,35.7-80,80-80C301.1,176,336.8,211.9,336.8,256L336.8,256z" />
//           </svg>
//         </button>
//         {isDropdownOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md">
//             <button
//               onClick={toggleHeaderVisibility}
//               className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//             >
//               Show Header
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`
//         sticky top-0 flex items-center px-8 h-16 text-base font-medium 
//         text-gray-900 bg-white border-b-[0.5px] border-b-gray-200 z-[100]
//         ${isMobile && '!h-12' && 'z-[40]'}
//         relative
//       `}
//     >
//       <div className="flex-grow">{title}</div>
//       <div className="relative">
//         <button
//           onClick={handleDropdownToggle}
//           className="flex items-center justify-center p-2"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="20"
//             height="20"
//             viewBox="0 0 512 512"
//             className="w-6 h-6 text-gray-500"
//           >
//             <path d="M424.5,216.5h-15.2c-12.4,0-22.8-10.7-22.8-23.4c0-6.4,2.7-12.2,7.5-16.5l9.8-9.6c9.7-9.6,9.7-25.3,0-34.9l-22.3-22.1c-4.4-4.4-10.9-7-17.5-7c-6.6,0-13,2.6-17.5,7l-9.4,9.4c-4.5,5-10.5,7.7-17,7.7c-12.8,0-23.5-10.4-23.5-22.7V89.1c0-13.5-10.9-25.1-24.5-25.1h-30.4c-13.6,0-24.4,11.5-24.4,25.1v15.2c0,12.3-10.7,22.7-23.5,22.7c-6.4,0-12.3-2.7-16.6-7.4l-9.7-9.6c-4.4-4.5-10.9-7-17.5-7s-13,2.6-17.5,7L110,132c-9.6,9.6-9.6,25.3,0,34.8l9.4,9.4c5,4.5,7.8,10.5,7.8,16.9c0,12.8-10.4,23.4-22.8,23.4H89.2c-13.7,0-25.2,10.7-25.2,24.3V256v15.2c0,13.5,11.5,24.3,25.2,24.3h15.2c12.4,0,22.8,10.7,22.8,23.4c0,6.4-2.8,12.4-7.8,16.9l-9.4,9.3c-9.6,9.6-9.6,25.3,0,34.8l22.3,22.2c4.4,4.5,10.9,7,17.5,7c6.6,0,13-2.6,17.5-7l9.7-9.6c4.2-4.7,10.2-7.4,16.6-7.4c12.8,0,23.5,10.4,23.5,22.7v15.2c0,13.5,10.8,25.1,24.5,25.1h30.4c13.6,0,24.4-11.5,24.4-25.1v-15.2c0-12.3,10.7-22.7,23.5-22.7c6.4,0,12.4,2.8,17,7.7l9.4,9.4c4.5,4.4,10.9,7,17.5,7c6.6,0,13-2.6,17.5-7l22.3-22.2c9.6-9.6,9.6-25.3,0-34.9l-9.8-9.6c-4.8-4.3-7.5-10.2-7.5-16.5c0-12.8,10.4-23.4,22.8-23.4h15.2c13.6,0,23.3-10.7,23.3-24.3V256v-15.2C447.8,227.2,438.1,216.5,424.5,216.5z M336.8,256L336.8,256c0,44.1-35.7,80-80,80c-44.3,0-80-35.9-80-80l0,0l0,0c0-44.1,35.7-80,80-80C301.1,176,336.8,211.9,336.8,256L336.8,256z" />
//           </svg>
//         </button>
//         {isDropdownOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md">
//             <button
//               onClick={toggleHeaderVisibility}
//               className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//             >
//               Hide Header
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default memo(Header);








