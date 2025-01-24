import type { FC } from 'react'

type LogoEmbededChatAvatarProps = {
  className?: string
}
const LogoEmbededChatAvatar: FC<LogoEmbededChatAvatarProps> = ({
  className,
}) => {
  return (
    // <div className='flex justify-center items-center relative overflow-hidden w-full h-full rounded-full bg-[#C8E441] text-xl'>
    <div className='bg-[#c3dd3b] w-10 h-10 flex items-center justify-center rounded-full'>
      <img
        src='/logo/logo-embeded-chat-avatar.png'
        // className={`block w-10 h-10 ${className}`}
        className={`block w-10/12 h-6/12 rounded-full ${className}`}
        alt='logo'
      />
    </div>
  )
}

export default LogoEmbededChatAvatar
