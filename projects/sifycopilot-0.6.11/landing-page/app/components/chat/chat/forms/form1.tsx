import { type FC, useState } from 'react'
import { useContext } from 'use-context-selector'
import Select, { type MultiValue } from 'react-select'
import { ToastContext } from '@/app/components/base/toast'
import Button from '@/app/components/base/button'
import type { OnSend } from '../../types'

type Form1Props = {
  onSend: OnSend
  handleModal: () => void
}

const Form1: FC<Form1Props> = ({ onSend, handleModal }) => {
  const [category, setCategory] = useState<MultiValue<{ value: string; label: string }>>([])
  const [sentiment, setSentiment] = useState('')
  const { notify } = useContext(ToastContext)

  const handleCategoryChange = (selectedOptions: MultiValue<{ value: string; label: string }>) => {
    setCategory(selectedOptions)
  }

  const handleSentimentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSentiment(e.target.value)
  }

  const handleSubmit = () => {
    if (category.length === 0 || !sentiment) {
      notify({ type: 'error', message: 'Fill out the fields' })
      return false
    }

    const categoryLabels = category.map(option => option.label).join(', ')
    const message = `Category: ${categoryLabels}\nSentiment: ${sentiment}`
    handleModal()
    onSend(message)
  }

  const categoryOptions = [
    { value: 'hollywood', label: 'Hollywood' },
    { value: 'literature', label: 'Literature' },
    { value: 'sports', label: 'Sports' },
    { value: 'technology', label: 'Technology' },
  ]

  return (
    <form>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Category
          <Select
            isMulti
            value={category}
            onChange={handleCategoryChange}
            options={categoryOptions}
            className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none'
          />
        </label>
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Sentiment
          <select
            value={sentiment}
            onChange={handleSentimentChange}
            required
            className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none'
          >
            <option value=''>Select sentiment</option>
            <option value='positive'>Positive</option>
            <option value='negative'>Negative</option>
            <option value='neutral'>Neutral</option>
          </select>
        </label>
      </div>

      <div className='flex justify-end'>
        <Button type='primary' className='mt-2' onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </form>
  )
}

export default Form1
