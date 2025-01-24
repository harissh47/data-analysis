'use client'
import classNames from 'classnames'

type IChildrenProps = {
  children: React.ReactNode
  id?: string
  tag?: any
  label?: any
  anchor: boolean
}

type IHeaderingProps = {
  url: string
  method: 'PUT' | 'DELETE' | 'GET' | 'POST'
  title: string
  name: string
}

export const Heading = function H2({
  url,
  method,
  title,
  name,
}: IHeaderingProps) {
  let style = ''
  switch (method) {
    case 'PUT':
     style = 'text-primary-600 bg-primary-50 dark:ring-primary-50/30 dark:bg-primary-50/10 dark:text-primary-600'
      break
    case 'DELETE':
      style = 'text-primary-600 bg-primary-50 dark:ring-primary-50/30 dark:bg-primary-50/10 dark:text-primary-600'
      break
    case 'POST':
     style = 'text-primary-600 bg-primary-50 dark:ring-primary-50/30 dark:bg-primary-50/10 dark:text-primary-600'
      break
    default:
      style = 'text-primary-600 bg-primary-50 dark:ring-primary-50/30 dark:bg-primary-50/10 dark:text-primary-600'
      break
  }
  return (
    <>
      <div className="flex items-center gap-x-3" >
        <span className={`font-mono text-[0.625rem] font-semibold leading-6 rounded-lg px-1.5 ring-1 ring-inset ${style}`}>{method}</span>
        {/* <span className="h-0.5 w-0.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></span> */}
        <span className="font-mono text-xs text-zinc-400">{url}</span>
      </div>
      {/* <h2 className='mt-2 scroll-mt-32'> */}
      <h2 className='mt-2 scroll-mt-32 dark:text-white'>
        <a href={name} className='no-underline group text-inherit hover:text-inherit'>{title}</a>
      </h2>
    </>

  )
}

export function Row({ children }: IChildrenProps) {
  return (
    <div className="grid items-start grid-cols-1 gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2 ">
      {children}
    </div>
  )
}

type IColProps = IChildrenProps & {
  sticky: boolean
}
export function Col({ children, sticky = false }: IColProps) {
  return (
    <div
      className={classNames(
        '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
        sticky && 'xl:sticky xl:top-24',
      )}
    >
      {children}
    </div>
  )
}

export function Properties({ children }: IChildrenProps) {
  return (
    <div className="my-6 ">
      <ul
        role="list"
        className="m-0 max-w-[calc(theme(maxWidth.lg)-theme(spacing.8))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5 "
      >
        {children}
      </ul>
    </div>
  )
}

type IProperty = IChildrenProps & {
  name: string
  type: string
}
export function Property({ name, type, children }: IProperty) {
  return (
    // <li className="px-0 py-4 m-0 first:pt-0 last:pb-0">
    <li className="px-0 py-4 m-0 first:pt-0 last:pb-0 dark:text-[#FCFCFC]">
      <dl className="flex flex-wrap items-center m-0 gap-x-3 gap-y-2">
        <dt className="sr-only">Name</dt>
        <dd>
          <code>{name}</code>
        </dd>
        <dt className="sr-only">Type</dt>
        <dd className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
          {type}
        </dd>
        <dt className="sr-only">Description</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </dd>
      </dl>
    </li>
  )
}

type ISubProperty = IChildrenProps & {
  name: string
  type: string
}
export function SubProperty({ name, type, children }: ISubProperty) {
  return (
    <li className="px-0 py-1 m-0 last:pb-0">
      <dl className="flex flex-wrap items-center m-0 gap-x-3">
        <dt className="sr-only">Name</dt>
        <dd>
          <code>{name}</code>
        </dd>
        <dt className="sr-only">Type</dt>
        <dd className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
          {type}
        </dd>
        <dt className="sr-only">Description</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </dd>
      </dl>
    </li>
  )
}
