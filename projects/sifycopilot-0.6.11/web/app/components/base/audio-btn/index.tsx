'use client'
import { Children, createContext, useContext, useEffect, useRef, useState } from 'react'
import { t } from 'i18next'
// import { useParams, usePathname } from 'next/navigation'
import s from './style.module.css'
import Tooltip from '@/app/components/base/tooltip'
import { randomString } from '@/utils'
import { textToAudio } from '@/service/share'
import Loading from '@/app/components/base/loading'

type AudioBtnProps = {
  value: string
  voice?: string
  className?: string
  isAudition?: boolean
  noCache: boolean
}

type AudioState = 'initial' | 'loading' | 'playing' | 'paused' | 'ended'


const AudioBtn = ({
  value,
  voice,
  className,
  isAudition,
  noCache,
}: AudioBtnProps) => {
  // const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioRef = useRef(window.speechSynthesis)
  const [audioState, setAudioState] = useState<AudioState>('initial')
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])


  const selector = useRef(`play-tooltip-${randomString(4)}`)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      setAvailableVoices(speechSynthesis.getVoices())
    }
    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices
  }, [])


  // const params = useParams()
  // const pathname = usePathname()

  // const removeCodeBlocks = (inputText: any) => {
  const removeCodeBlocks = (inputText: string) => {
    const codeBlockRegex = /```[\s\S]*?```/g
    if (inputText)
      return inputText.replace(codeBlockRegex, '')
    return ''
  }

  // const textToSpeech = (text: string) => {
  //   const speech = new SpeechSynthesisUtterance(text)
  //   speech.lang = 'en-US'
  //   speech.onstart = () => setAudioState('playing')
  //   speech.onend = () => setAudioState('ended')
  //   speech.onerror = () => {
  //     setAudioState('initial')
  //     console.error('Error playing audio')
  //   }
  //   audioRef.current.speak(speech)
  //   utteranceRef.current = speech
  // }
  const textToSpeech = (text: string, audioId: string) => {
    if (utteranceRef.current) {
      audioRef.current.cancel()
      setAudioState('initial')
    }
    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = 'en-US'
    const selectedVoice = availableVoices.find(voice => voice.name.includes('Female'))
    if (selectedVoice) {
      speech.voice = selectedVoice
    }
    speech.onstart = () => {
      setAudioState('playing')
      setCurrentAudioId(audioId)
    }
    speech.onend = () => {
      setAudioState('ended')
      setCurrentAudioId(null)
    }
    speech.onerror = () => {
      setAudioState('initial')
      console.error('Error playing audio')
    }
    utteranceRef.current = speech
    audioRef.current.speak(speech)
  }

  // const loadAudio = async () => {
  // const formData = new FormData()
  // formData.append('text', removeCodeBlocks(value))
  // formData.append('voice', removeCodeBlocks(voice))

  // if (value !== '') {
  //   setAudioState('loading')

  //   let url = ''
  //   let isPublic = false

  //   if (params.token) {
  //     url = '/text-to-audio'
  //     isPublic = true
  //   }
  //   else if (params.appId) {
  //     if (pathname.search('explore/installed') > -1)
  //       url = `/installed-apps/${params.appId}/text-to-audio`
  //     else
  //       url = `/apps/${params.appId}/text-to-audio`
  //   }

  //   try {
  //     const audioResponse = await textToAudio(url, isPublic, formData)
  //     const blob_bytes = Buffer.from(audioResponse.data, 'latin1')
  //     const blob = new Blob([blob_bytes], { type: 'audio/wav' })
  //     const audioUrl = URL.createObjectURL(blob)
  //     audioRef.current!.src = audioUrl
  //   }
  //   catch (error) {
  //     setAudioState('initial')
  //     console.error('Error playing audio:', error)
  //   }
  // }
  const loadAudio = async (audioId: string) => {
    const text = removeCodeBlocks(value)
    if (text !== '') {
      setAudioState('loading')
      textToSpeech(text, audioId)
    }
  }

  const handleToggle = async () => {
    const audioId = randomString(4)
    if (audioState === 'initial' || noCache) {
      // await loadAudio()
      await loadAudio(audioId)
    }
    else if (audioState === 'ended')
      // loadAudio()
      await loadAudio(audioId)
    else if (audioRef.current) {
      // if (audioState === 'playing') {
      if (audioState === 'playing' && currentAudioId === audioId) {
        audioRef.current.pause()
        setAudioState('paused')
      }
      else if (audioState === 'playing' && currentAudioId !== audioId) {
        audioRef.current.cancel()
        await loadAudio(audioId)
      }
      else {
        // audioRef.current.play()
        audioRef.current.resume()
        setAudioState('playing')
        setCurrentAudioId(audioId)
      }
    }
  }

  // useEffect(() => {
  //   const currentAudio = audioRef.current

  //   const handleLoading = () => {
  //     setAudioState('loading')
  //   }

  //   const handlePlay = () => {
  //     currentAudio?.play()
  //     setAudioState('playing')
  //   }

  //   const handleEnded = () => {
  //     setAudioState('ended')
  //   }

  //   currentAudio?.addEventListener('progress', handleLoading)
  //   currentAudio?.addEventListener('canplaythrough', handlePlay)
  //   currentAudio?.addEventListener('ended', handleEnded)

  //   return () => {
  //     currentAudio?.removeEventListener('progress', handleLoading)
  //     currentAudio?.removeEventListener('canplaythrough', handlePlay)
  //     currentAudio?.removeEventListener('ended', handleEnded)
  //     URL.revokeObjectURL(currentAudio?.src || '')
  //     currentAudio?.pause()
  //     currentAudio?.setAttribute('src', '')
  //   }
  // }, [])

  useEffect(() => {
    return () => {
      if (audioState === 'playing' || audioState === 'paused') {
        audioRef.current.cancel()
      }
    }
  }, [audioState])

  const tooltipContent = {
    initial: t('appApi.play'),
    ended: t('appApi.play'),
    paused: t('appApi.pause'),
    playing: t('appApi.playing'),
    loading: t('appApi.loading'),
  }[audioState]

  return (
    <div className={`${audioState === 'loading' || audioState === 'playing' ? 'mr-1' : className}`}>
      <Tooltip
        selector={selector.current}
        content={tooltipContent}
        className='z-10'
      >
        <button
          disabled={audioState === 'loading'}
          className={`box-border p-0.5 flex items-center justify-center cursor-pointer ${isAudition || '!p-0 rounded-md bg-white dark:bg-[#383838]'}`}
          onClick={handleToggle}
        >
          {audioState === 'loading'
            ? (
              <div className='w-6 h-6 rounded-md flex items-center justify-center p-2'>
                <Loading />
              </div>
            )
            : (
              // <div className={`w-6 h-6 rounded-md ${!isAudition ? 'w-4 h-4 hover:bg-gray-50 ' : 'hover:bg-gray-50 '} ${(audioState === 'playing') ? s.pauseIcon : s.playIcon}`}></div>
              <div className={`w-6 h-6 rounded-md ${!isAudition ? 'w-4 h-4 hover:bg-gray-50 dark:hover:bg-zinc-800' : 'hover:bg-gray-50 dark:hover:bg-zinc-800'} ${(audioState === 'playing') ? s.pauseIcon : s.playIcon}`}></div>

            )}
        </button>
      </Tooltip>
      {/* <audio ref={audioRef} src='' className='hidden' /> */}
    </div>
  )
}

export default AudioBtn
