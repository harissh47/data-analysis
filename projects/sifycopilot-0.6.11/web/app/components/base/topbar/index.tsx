'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

const Topbar = () => {
  return (
    <>
      <ProgressBar
        height='3px'
        // color="#1C64F2FF"
        color="#8AB40A"
        options={{ showSpinner: false }}
        shallowRouting />
    </>)
}

export default Topbar
