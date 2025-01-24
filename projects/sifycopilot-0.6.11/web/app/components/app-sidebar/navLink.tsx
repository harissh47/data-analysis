'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import classNames from 'classnames'
import Link from 'next/link'

export type NavIcon = React.ComponentType<
  React.PropsWithoutRef<React.ComponentProps<'svg'>> & {
    title?: string | undefined
    titleId?: string | undefined
  }
>

export type NavLinkProps = {
  name: string
  href: string
  iconMap: {
    selected: NavIcon
    normal: NavIcon
  }
  mode?: string
}

export default function NavLink({
  name,
  href,
  iconMap,
  mode = 'expand',
}: NavLinkProps) {
  const segment = useSelectedLayoutSegment()
  const formattedSegment = (() => {
    let res = segment?.toLowerCase()
    // logs and annotations use the same nav
    if (res === 'annotations')
      res = 'logs'

    return res
  })()
  const isActive = href.toLowerCase().split('/')?.pop() === formattedSegment
  const NavIcon = isActive ? iconMap.selected : iconMap.normal

  return (
    <Link
      key={name}
      href={href}
      // className={classNames(
      //   isActive ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700',
      //   'group flex items-center h-9 rounded-md py-2 text-sm font-normal',
      //   mode === 'expand' ? 'px-3' : 'px-2.5',
      // )}
      className={classNames(
        // isActive ? ' text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700',
        isActive ? ' text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-700 dark:text-white',
        // 'group flex items-start h-9 px-3 rounded-md py-2 text-sm font-normal',
        'group flex items-center h-9 px-3 rounded-md py-2 text-sm font-normal dark:bg-[#202020] cursor-pointer',
        // mode === 'expand' ? 'px-3' : 'px-2.5',
      )}
      title={mode === 'collapse' ? name : ''}
    >
      <NavIcon
        className={classNames(
          'h-4 w-4 flex-shrink-0 mr-2',
          // isActive ? 'text-primary-600' : 'text-gray-700',
          isActive ? 'text-primary-600' : 'text-gray-700 dark:text-[#556676]',
          // mode === 'expand' ? 'mr-2' : 'mr-0',
        )}
        aria-hidden="true"
      />
      <span
        className={classNames('inline-block', 'leading-none', 'text-base')}>
        {name}
      </span>
      {/* <div>{name}</div> */}
      {/* {mode === 'expand' && name} */}
    </Link>
  )
}
