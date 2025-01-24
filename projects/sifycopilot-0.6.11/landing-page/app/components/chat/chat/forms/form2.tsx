import { type FC, useState } from 'react'
import { useContext } from 'use-context-selector'
import { ToastContext } from '@/app/components/base/toast'
import Button from '@/app/components/base/button'
import type { OnSend } from '../../types'

type Form2Props = {
  onSend: OnSend
  handleModal: () => void
}

const Form2: FC<Form2Props> = ({ onSend, handleModal }) => {
  //   const [category, setCategory] = useState('')
  const [sentiment, setSentiment] = useState('')
  const { notify } = useContext(ToastContext)

  //   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //     setCategory(e.target.value)
  //   }

  const handleSentimentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSentiment(e.target.value)
  }

  const handleSubmit = () => {
    //   if (!category || !sentiment) {
    if (!sentiment) {
      notify({ type: 'error', message: 'Fill out the fields' })
      return false
    }

    // const message = `Category: ${category}\nSentiment: ${sentiment}`
    const message = `Sentiment: ${sentiment}`
    handleModal()
    onSend(message)
  }

  return (
    <form>
      {/* <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Category
          <select
            value={category}
            onChange={handleCategoryChange}
            required
            className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none'
          >
            <option value=''>Select a category</option>
            <option value='hollywood'>Hollywood</option>
            <option value='literature'>Literature</option>
            <option value='sports'>Sports</option>
            <option value='technology'>Technology</option>
          </select>
        </label>
      </div> */}

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

export default Form2
