'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/app/components/base/button'

export type IModalFootProps = {
  onConfirm: () => void
  onCancel: () => void
}

const ModalFoot: FC<IModalFootProps> = ({
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation()
  return (
    <div className='flex justify-end gap-2'>
      {/* <Button onClick={onCancel}>{t('common.operation.cancel')}</Button> */}
      <Button onClick={onCancel} className='mr-2 text-sm font-medium dark:bg-[#3E3E3E] dark:border-[#5F5F5F] dark:hover:bg-zinc-800'>{t('common.operation.cancel')}</Button>
      <Button type='primary' onClick={onConfirm}>{t('common.operation.save')}</Button>
    </div>
  )
}
export default React.memo(ModalFoot)
