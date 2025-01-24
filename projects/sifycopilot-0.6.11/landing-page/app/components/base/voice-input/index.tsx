
import { useCallback, useEffect, useRef, useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import { useParams, usePathname } from 'next/navigation'
import cn from 'classnames'
import Recorder from 'js-audio-recorder'
import { useRafInterval } from 'ahooks'
// import { convertToMp3 } from './utils'
import s from './index.module.css'
import { StopCircle } from '@/app/components/base/icons/src/vender/solid/mediaAndDevices'
// import { Loading02, XClose } from '@/app/components/base/icons/src/vender/line/general'
// import { audioToText } from '@/service/share'
import Toast from '../toast'

type VoiceInputTypes = {
  onConverted: (text: string) => void
  onCancel: () => void
}

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    webkitSpeechRecognition: typeof webkitSpeechRecognition
    SpeechRecognition: typeof SpeechRecognition
  }
}

declare class webkitSpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: (() => void) | null
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  start(): void
  stop(): void
}

declare class SpeechRecognition extends webkitSpeechRecognition { }

type SpeechRecognitionEvent = {
  resultIndex: number
  results: SpeechRecognitionResultList
}

type SpeechRecognitionErrorEvent = Event & {
  error: string
}

type SpeechRecognitionResultList = {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

type SpeechRecognitionResult = {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

type SpeechRecognitionAlternative = {
  transcript: string
}

const VoiceInput = ({
  onCancel,
  onConverted,
}: VoiceInputTypes) => {
  // const { t } = useTranslation()
  const recorder = useRef(new Recorder({
    sampleBits: 16,
    sampleRate: 16000,
    numChannels: 1,
    compiling: false,
  }))
  const recognitionRef = useRef<webkitSpeechRecognition | SpeechRecognition | any>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const drawRecordId = useRef<number | null>(null)
  const [originDuration, setOriginDuration] = useState(0)
  const [startRecord, setStartRecord] = useState(false)
  // const [startConvert, setStartConvert] = useState(false)
  // const pathname = usePathname()
  // const params = useParams()
  const clearInterval = useRafInterval(() => {
    setOriginDuration(originDuration + 1)
  }, 1000)

  const drawRecord = useCallback(() => {
    drawRecordId.current = requestAnimationFrame(drawRecord)
    const canvas = canvasRef.current!
    const ctx = ctxRef.current!
    const dataUnit8Array = recorder.current.getRecordAnalyseData()
    const dataArray = [].slice.call(dataUnit8Array)
    const lineLength = parseInt(`${canvas.width / 3}`)
    const gap = parseInt(`${1024 / lineLength}`)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    let x = 0
    for (let i = 0; i < lineLength; i++) {
      let v = dataArray.slice(i * gap, i * gap + gap).reduce((prev: number, next: number) => {
        return prev + next
      }, 0) / gap

      if (v < 128)
        v = 128
      if (v > 178)
        v = 178
      const y = (v - 128) / 50 * canvas.height

      ctx.moveTo(x, 16)
      if (ctx.roundRect)
        ctx.roundRect(x, 16 - y, 2, y, [1, 1, 0, 0])
      else
        ctx.rect(x, 16 - y, 2, y)
      ctx.fill()
      x += 3
    }
    ctx.closePath()
  }, [])

  const handleStopRecorder = useCallback(async () => {
    clearInterval()
    setStartRecord(false)
    // setStartConvert(true)
    recorder.current.stop()
    drawRecordId.current && cancelAnimationFrame(drawRecordId.current)
    drawRecordId.current = null
    const canvas = canvasRef.current!
    const ctx = ctxRef.current!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    recognitionRef.current.stop()
    onCancel()
    // const mp3Blob = convertToMp3(recorder.current)
    // const mp3File = new File([mp3Blob], 'temp.mp3', { type: 'audio/mp3' })
    // const formData = new FormData()
    // formData.append('file', mp3File)

    // let url = ''
    // let isPublic = false

    // if (params.token) {
    //   url = '/audio-to-text'
    //   isPublic = true
    // }
    // else if (params.appId) {
    //   if (pathname.search('explore/installed') > -1)
    //     url = `/installed-apps/${params.appId}/audio-to-text`
    //   else
    //     url = `/apps/${params.appId}/audio-to-text`
    // }

    // try {
    //   const audioResponse = await audioToText(url, isPublic, formData)
    //   onConverted(audioResponse.text)
    //   onCancel()
    // }
    // catch (e) {
    //   onConverted('')
    //   onCancel()
    // }
  }, [])
  const handleStartRecord = async () => {
    try {
      console.log('start record')
      await recorder.current.start()
      setStartRecord(true)
      // setStartConvert(false)

      console.log('startRecord - ', startRecord)
      // console.log('startConvert - ', startConvert)

      console.log('step 32')

      if (canvasRef.current && ctxRef.current) {
        drawRecord()
        console.log('finally here')
      }
    }
    catch (e) {
      console.log(e)
      // onCancel()
    }
  }

  const handleWebKitStart = useCallback(() => {
    try {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
          Toast.notify({
            type: 'error',
            message: 'Your browser does not support speech recognition.'
          })

          onCancel()
          return
        }

        console.log('Coming in')

        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        console.log('Coming in 1')
        recognitionRef.current.start()
        console.log('Coming in 2')

        recognitionRef.current.onstart = () => {
          console.log('Came in')
          handleStartRecord()
        }

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          console.log('result came')
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('')
          if (event.results[0].isFinal) {
            console.log(transcript)
            // setStartConvert(false)
            onConverted(transcript)
          }
        }

        // recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        //   console.error('Speech recognition error:', event)
        //   if (event.error === 'aborted')
        //     console.log('Speech recognition aborted by user or browser')
        //   else
        //     console.error('Other speech recognition error:', event.error)
        //   onCancel()
        // }

        // recognitionRef.current.onend = () => {
        //   setStartConvert(false)
        //   onCancel()
        // }

      }
    }
    catch (e) {
      console.error('Error starting speech recognition', e)
      onCancel()
    }
  }, [onCancel])

  const initCanvas = () => {
    const dpr = window.devicePixelRatio || 1
    const canvas = document.getElementById('voice-input-record') as HTMLCanvasElement

    if (canvas) {
      const { width: cssWidth, height: cssHeight } = canvas.getBoundingClientRect()

      canvas.width = dpr * cssWidth
      canvas.height = dpr * cssHeight
      canvasRef.current = canvas

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
        ctx.fillStyle = 'rgba(209, 224, 255, 1)'
        ctxRef.current = ctx
      }
    }
  }
  if (originDuration >= 120 && startRecord)
    handleStopRecorder()

  useEffect(() => {
    initCanvas()
    // handleStartRecord()
    handleWebKitStart()
  }, [])

  const minutes = parseInt(`${parseInt(`${originDuration}`) / 60}`)
  const seconds = parseInt(`${originDuration}`) % 60

  return (
    <div className={cn(s.wrapper, 'absolute inset-0 rounded-xl')}>
      <div className='absolute inset-[1.5px] flex items-center pl-[14.5px] pr-[6.5px] py-[14px] bg-primary-25 rounded-[10.5px] overflow-hidden'>
        <canvas id='voice-input-record' className='absolute left-0 bottom-0 w-full h-4' />
        {/* {
          startConvert && <Loading02 className='animate-spin mr-2 w-4 h-4 text-primary-700' />
        } */}
        <div className='grow'>
          {
            startRecord && (
              <div className='text-sm text-gray-500'>
                {'Speak now...'}
              </div>
            )
          }
          {/* {
            startConvert && (
              <div className={cn(s.convert, 'text-sm')}>
                {t('common.voiceInput.converting')}
              </div>
            )
          } */}
        </div>
        {
          startRecord && (
            <div
              className='flex justify-center items-center mr-1 w-8 h-8 hover:bg-primary-100 rounded-lg  cursor-pointer'
              onClick={handleStopRecorder}
            >
              <StopCircle className='w-5 h-5 text-primary-600' />
            </div>
          )
        }
        {/* {
          startConvert && (
            <div
              className='flex justify-center items-center mr-1 w-8 h-8 hover:bg-gray-200 rounded-lg  cursor-pointer'
              onClick={onCancel}
            >
              <XClose className='w-4 h-4 text-gray-500' />
            </div>
          )
        } */}
        <div className={`w-[45px] pl-1 text-xs font-medium ${originDuration > 110 ? 'text-[#F04438]' : 'text-gray-700'}`}>{`0${minutes.toFixed(0)}:${seconds >= 10 ? seconds : `0${seconds}`}`}</div>
      </div>
    </div>
  )
}

export default VoiceInput


// import { useCallback, useEffect, useRef, useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import cn from 'classnames'
// import Recorder from 'js-audio-recorder'
// import { useRafInterval } from 'ahooks'
// import s from './index.module.css'
// import { StopCircle } from '@/app/components/base/icons/src/vender/solid/mediaAndDevices'
// import { Loading02, XClose } from '@/app/components/base/icons/src/vender/line/general'
// import record from '../../workflow/panel/record'
// import { any } from 'zod'
// import result from '../../share/text-generation/result'
// import { error } from 'console'

// type VoiceInputTypes = {
//   onCancel: () => void
//   onConverted: (text: string) => void
// }

// declare global {
//   // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
//   interface Window {
//     webkitSpeechRecognition: typeof webkitSpeechRecognition
//     SpeechRecognition: typeof SpeechRecognition
//   }
// }

// declare class webkitSpeechRecognition extends EventTarget {
//   continuous: boolean
//   interimResults: boolean
//   lang: string
//   onstart: (() => void) | null
//   onresult: ((event: SpeechRecognitionEvent) => void) | null
//   onend: (() => void) | null
//   onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
//   start(): void
//   stop(): void
// }

// declare class SpeechRecognition extends webkitSpeechRecognition { }

// type SpeechRecognitionEvent = {
//   resultIndex: number
//   results: SpeechRecognitionResultList
// }

// type SpeechRecognitionErrorEvent = Event & {
//   error: string
// }

// type SpeechRecognitionResultList = {
//   length: number
//   item(index: number): SpeechRecognitionResult
//   [index: number]: SpeechRecognitionResult
// }

// type SpeechRecognitionResult = {
//   isFinal: boolean
//   length: number
//   item(index: number): SpeechRecognitionAlternative
//   [index: number]: SpeechRecognitionAlternative
// }

// type SpeechRecognitionAlternative = {
//   transcript: string
// }

// const VoiceInput = ({ onCancel, onConverted }: VoiceInputTypes) => {
//   const { t } = useTranslation()
//   const recognitionRef = useRef<webkitSpeechRecognition | SpeechRecognition | any>(null)
//   const recorderRef = useRef(new Recorder({
//     sampleBits: 16,
//     sampleRate: 16000,
//     numChannels: 1,
//     compiling: false,
//   }))
//   const canvasRef = useRef<HTMLCanvasElement | null>(null)
//   const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
//   const drawRecordId = useRef<number | null>(null)
//   const [originDuration, setOriginDuration] = useState<number>(0)
//   const [startRecord, setStartRecord] = useState<boolean>(false)
//   const [startConvert, setStartConvert] = useState<boolean>(false)

//   const clearInterval = useRafInterval(() => {
//     setOriginDuration(prev => prev + 1)
//   }, 1000)

//   const drawVisualizer = useCallback(() => {
//     drawRecordId.current = requestAnimationFrame(drawVisualizer)
//     const canvas = canvasRef.current
//     const ctx = ctxRef.current
//     // const canvas = canvasRef.current!
//     // const ctx = ctxRef.current!
//     if (!canvas || !ctx)
//       return

//     const dataUnit8Array = recorderRef.current.getRecordAnalyseData()
//     if (!dataUnit8Array) return

//     const dataArray = [].slice.call(dataUnit8Array)
//     const lineLength = Math.floor(canvas.width / 3)
//     const gap = Math.floor(1024 / lineLength)
//     // const lineLength = parseInt(`${canvas.width / 3}`)
//     // const gap = parseInt(`${1024 / lineLength}`)

//     ctx.clearRect(0, 0, canvas.width, canvas.height)

//     ctx.beginPath()
//     let x = 0
//     for (let i = 0; i < lineLength; i++) {
//       // let v = dataArray.slice(i * gap, i * gap + gap).reduce((prev: number, next: number) => {
//       //   return prev + next
//       // }, 0) / gap

//       let v = dataArray.slice(i * gap, i * gap + gap).reduce((prev, next) => prev + next, 0) / gap

//       if (v < 128) v = 128
//       if (v > 178) v = 178
//       const y = ((v - 128) / 50) * canvas.height

//       ctx.moveTo(x, 16)
//       if (ctx.roundRect) ctx.roundRect(x, 16 - y, 2, y, [1, 1, 0, 0])
//       else ctx.rect(x, 16 - y, 2, y)
//       ctx.fill()
//       x += 3
//     }
//     ctx.closePath()
//   }, [])

//   const handleStopRecorder = useCallback(() => {
//     clearInterval()
//     setStartRecord(false)
//     setStartConvert(true)
//     recorderRef.current.stop()
//     // if (recognitionRef.current)
//     //   recognitionRef.current.stop()
//     // setStartConvert(true)
//     if (drawRecordId.current) {
//       cancelAnimationFrame(drawRecordId.current)
//       drawRecordId.current = null
//     }
//     const canvas = canvasRef.current
//     const ctx = ctxRef.current
//     // const canvas = canvasRef.current!
//     // const ctx = ctxRef.current!
//     // ctx.clearRect(0, 0, canvas.width, canvas.height)
//     if (ctx) ctx.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0)
//     onCancel()
//   }, [clearInterval, onCancel])

//   const handleStartRecord = useCallback(() => {
//     try {
//       if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
//         if (!SpeechRecognition) {
//           // eslint-disable-next-line no-alert
//           alert('Your browser does not support speech recognition.')
//           onCancel()
//           return
//         }

//         recognitionRef.current = new SpeechRecognition()
//         // recognitionRef.current.continuous = false
//         // recognitionRef.current.interimResults = false
//         recognitionRef.current.continuous = true
//         recognitionRef.current.interimResults = true
//         recognitionRef.current.lang = 'en-US'

//         recognitionRef.current.onstart = () => {
//           setStartRecord(true)
//           setStartConvert(false)
//           recorderRef.current.start().then(() => {
//             if (canvasRef.current && ctxRef.current)
//               drawVisualizer()
//           }).catch((error: any) => console.error('Error starting recorder:', error))
//         }

//         recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
//           // const transcript = event.results[0][0].transcript
//           // onConverted(transcript)
//           // drawVisualizer(transcript)
//           // handleStopRecorder()
//           const transcript = Array.from(event.results)
//             .map((result) => result[0])
//             .map((result) => result.transcript)
//             .join('')
//           if (event.results[0].isFinal) {
//             setStartConvert(false)
//             onConverted(transcript)
//             // handleStopRecorder()
//           }
//         }

//         recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
//           console.error('Speech recognition error:', event)
//           if (event.error === 'aborted')
//             console.log('Speech recognition aborted by user or browser')
//           else
//             console.error('Other speech recognition error:', event.error)
//           onCancel()
//         }
//         recognitionRef.current.onend = () => {
//           setStartConvert(false)
//           onCancel()

//         }

//         recognitionRef.current.start()
//       }
//     }
//     catch (e) {
//       console.error('Error starting speech recognition', e)
//       onCancel()
//     }
//   }, [handleStopRecorder, onCancel, onConverted, drawVisualizer])

//   const initCanvas = useCallback(() => {
//     const dpr = window.devicePixelRatio || 1
//     const canvas = document.getElementById('voice-input-record') as HTMLCanvasElement
//     if (canvas) {
//       const { width: cssWidth, height: cssHeight } = canvas.getBoundingClientRect()
//       canvas.width = dpr * cssWidth
//       canvas.height = dpr * cssHeight
//       canvasRef.current = canvas
//       const ctx = canvas.getContext('2d')
//       if (ctx) {
//         ctx.scale(dpr, dpr)
//         ctx.fillStyle = 'rgba(209, 224, 255, 1)'
//         ctxRef.current = ctx
//       }
//     }
//   }, [])

//   useEffect(() => {
//     initCanvas()
//     handleStartRecord()

//     // if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//     //   // const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
//     //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     //   recognitionRef.current = new SpeechRecognition()
//     //   recognitionRef.current.continuous = true
//     //   recognitionRef.current.interimResults = true
//     //   recognitionRef.current.lang = 'en-US'

//     //   recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
//     //     const transcript = Array.from(event.results)
//     //       .map(result => result[0])
//     //       .map(result => result.transcript)
//     //       .join('')
//     //     if (event.results[0].isFinal) {
//     //       setStartConvert(false)
//     //       onConverted(transcript)
//     //       // handleStopRecorder()
//     //     }
//     //   }

//     //   recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
//     //     if (event.error === 'no-speech') {
//     //       setStartConvert(false)
//     //       onCancel()
//     //       // handleStopRecorder();
//     //     }
//     //   }

//     //   recognitionRef.current.onend = () => {
//     //     if (originDuration >= 120 && startRecord)
//     //       handleStopRecorder()
//     //   }

//     //   recognitionRef.current.start()
//     // }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop()
//         recognitionRef.current.onresult = null
//         recognitionRef.current.onerror = null
//         recognitionRef.current.onend = null

//       }
//       if (drawRecordId.current)
//         cancelAnimationFrame(drawRecordId.current)
//     }
//   }, [handleStopRecorder, initCanvas, onCancel, onConverted, originDuration, startRecord])

//   const minutes = Math.floor(originDuration / 60)
//   const seconds = originDuration % 60

//   return (
//     <div className={cn(s.wrapper, 'absolute inset-0 rounded-xl')}>
//       <div className='absolute inset-[1.5px] flex items-center pl-[14.5px] pr-[6.5px] py-[14px] bg-primary-25 rounded-[10.5px] overflow-hidden'>
//         {/* <canvas id='voice-input-record' className='absolute left-0 bottom-0 w-full h-4' /> */}
//         <canvas ref={canvasRef} id='voice-input-record' className='absolute left-0 bottom-0 w-full h-4' />
//         {startConvert && <Loading02 className='animate-spin mr-2 w-4 h-4 text-primary-700' />}
//         <div className='grow'>
//           {startRecord && <div className='text-sm text-gray-500'>{t('common.voiceInput.speaking')}</div>}
//           {startConvert && <div className={cn(s.convert, 'text-sm')}>{t('common.voiceInput.converting')}</div>}
//         </div>
//         {startRecord && (
//           <div className='flex justify-center items-center mr-1 w-8 h-8 hover:bg-primary-100 rounded-lg cursor-pointer' onClick={handleStopRecorder}>
//             <StopCircle className='w-5 h-5 text-primary-600' />
//             {/* <StopCircle className='w-8 h-8 text-primary-600' /> */}
//           </div>
//         )}
//         {startConvert && (
//           <div className='flex justify-center items-center mr-1 w-8 h-8 hover:bg-gray-200 rounded-lg cursor-pointer' onClick={onCancel}>
//             <XClose className='w-4 h-4 text-gray-500' />
//             {/* <XClose className='w-8 h-8 text-gray-500' /> */}
//           </div>
//         )}
//         <div className={`w-[45px] pl-1 text-xs font-medium ${originDuration > 110 ? 'text-[#F04438]' : 'text-gray-700'}`}>
//           {/* {`${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`} */}
//           {`0${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VoiceInput

