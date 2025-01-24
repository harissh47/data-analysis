import React from 'react'
import './container.css'

type OpeningContainerProps = {
    onQuestionClick: (question: string) => void
    // containerQues: CarouselImage[]
    containerQues?: string[]

}

const PlaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" id="airplane-mode" >
        <path fill="#61A0B5" d="M22,13.5c0,0.5-0.5,1-1,1h-6.1l-4.7,5.2C10,19.9,9.8,20,9.5,20h-2c-0.3,0-0.7-0.2-0.8-0.5c-0.2-0.3-0.2-0.6-0.1-0.9l1.7-4.1H6.5C4,14.5,2,12.5,2,10V5.5c0-0.4,0.3-0.8,0.7-0.9c0.4-0.1,0.8,0,1.1,0.3l2.6,3c0.4,0.4,0.9,0.7,1.5,0.7h7.1C18.3,8.5,22,8.9,22,13.5z" />
        <path fill="#96C0CE" d="M14.9,8.5H8.3L6.6,4.4C6.5,4.1,6.5,3.7,6.7,3.5C6.8,3.2,7.2,3,7.5,3h2c0.3,0,0.5,0.1,0.7,0.3L14.9,8.5z" />
    </svg>

)

const WebIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" id="web">
        <g color="#000">
            <path fill="#f05542" d="M237 1579.362c-4.413 0-8 3.588-8 8 0 4.413 3.588 8.002 8 8.002s8-3.59 8-8.002c0-4.412-3.588-8-8-8zm-.5 1.102v2.648h-4.924c1.18-1.504 2.9-2.498 4.924-2.648zm1 0c2.024.15 3.745 1.144 4.924 2.648H237.5v-2.648zm-6.598 3.648h5.598v2.75h-6.398c.074-.999.352-1.912.8-2.75zm6.598 0h5.598c.448.838.726 1.751.8 2.75H237.5v-2.75zm-7.4 3.75h6.4v2.752h-5.598a6.844 6.844 0 0 1-.802-2.752zm7.4 0h6.4a6.843 6.843 0 0 1-.802 2.752H237.5v-2.752zm-5.924 3.752h4.924v2.649c-2.024-.15-3.745-1.145-4.924-2.649zm5.924 0h4.924c-1.18 1.504-2.9 2.498-4.924 2.649v-2.649z" transform="translate(-221 -1569.362)" />
            <path fill="#f05542" fillRule="evenodd" d="M233.957 1580.192c-1.938 4.773-2.26 9.333-.146 14.287l.92-.392c-2.014-4.722-1.72-8.91.152-13.518l-.926-.377zm6.03 0-.926.377c1.87 4.608 2.166 8.796.152 13.518l.92.392c2.113-4.954 1.792-9.514-.147-14.287z" transform="translate(-221 -1569.362)" />
            <path fill="#2b4255" d="M223.5 1571.362a.5.5 0 0 0-.5.5v27a.5.5 0 0 0 .5.5h27a.5.5 0 0 0 .5-.5v-14.615a.5.5 0 1 0-1 0v14.115h-26v-26h26v7.305a.5.5 0 1 0 1 0v-7.805a.5.5 0 0 0-.5-.5h-27zm26.992 9.598a.5.5 0 0 0-.492.508v.888a.5.5 0 1 0 1 0v-.888a.5.5 0 0 0-.508-.508z" transform="translate(-221 -1569.362)" />
            <path fill="#2b4255" fillRule="evenodd" d="M223.5 1575.362v1h27v-1h-27z" transform="translate(-221 -1569.362)" />
            <path fill="#f05542" d="M226 1573.863a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5zm2 0a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5zm2 0a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5z" transform="translate(-221 -1569.362)" />
        </g>
    </svg>
)

const OutfitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" id="dart-arrow">
        <path fill="#40596b" d="M15.739 5.471l.87.73-1.579 1.883-.87-.731z"></path>
        <path fill="#40596b" d="M15.64 4.141l2.073 1.742-.69.822-2.073-1.742zM3.957 7.17l-.87.731-1.579-1.883.87-.73z"></path>
        <path fill="#40596b" d="M3.944 5.045.87 7.31.179 6.094l2.073-1.742zM8.395 2.745h1.355v1.825H8.395z"></path>
        <path fill="#40596b" d="M7.353 1.831h3.258v1.199H7.353z"></path>
        <circle cx="9.065" cy="13.105" r="9.065" fill="#40596b" transform="rotate(-79.146 9.065 13.105)"></circle>
        <circle cx="9.065" cy="13.105" r="7.633" fill="#fdfdfd" transform="rotate(-79.141 9.065 13.105)"></circle>
        <circle cx="9.065" cy="13.105" r="5.755" fill="#ff7058" transform="rotate(-58.46 9.065 13.105)"></circle>
        <path fill="#fdfdfd" d="M13.286 13.105c0 2.32-1.88 4.21-4.21 4.21s-4.21-1.88-4.21-4.21 1.88-4.21 4.21-4.21 4.21 1.88 4.21 4.21z"></path>
        <path fill="#ff7058" d="M10.943 13.105a1.876 1.876 0 1 1-1.876-1.876c1.037 0 1.876.84 1.876 1.876z"></path>
        <g fill="#40596b">
            <path d="M9.013 5.794h.272v.907h-.272zM5.345 6.898l.234-.135.448.777-.234.135zM2.687 9.69l.135-.234.777.448-.135.234zM1.765 13.615v-.272h.907v.272zM2.83 17.485l-.135-.234.777-.448.135.234zM5.593 20.268l-.234-.135.448-.777.234.135zM9.262 21.147h-.272v-.907h.272zM12.928 20.043l-.234.135-.448-.777.234-.135zM15.585 17.28l-.135.234-.777-.448.135-.234zM16.472 13.355v.272h-.907v-.272zM15.356 9.486l.135.234-.777.448-.135-.234zM12.593 6.722l.234.135-.448.777-.234-.135z"></path>
        </g>
        <path fill="#ffd15c" d="M20.23 14.52l-.088-.103-.874-.867H9.869a.469.469 0 0 1-.469-.469c0-.259.21-.469.469-.469h9.493c.314-.27.615-.576.897-.912l.026-.031h4.469l-1.73 1.56h-3.354v.179h3.354l1.73 1.618H20.23z"></path>
    </svg>


)

const StudyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" enableBackground="new 0 0 64 64" viewBox="0 0 64 64" width="24" height="24">
        <linearGradient id="a" x1="32" x2="32" y1="27.445" y2="60.311" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffb9a4" />
            <stop offset="1" stopColor="#ef7337" />
        </linearGradient>
        <path fill="url(#a)" d="M5.9,23.9c-0.3,0-0.5,0-0.7,0.1c-1.8,0.4-3.2,2-3.2,4v28.4c0,2.2,1.8,4.1,4,4.1h10h42c2.2,0,4-1.8,4-4.1V27.9
      c0-1.7-1.1-3.2-2.6-3.8c-0.4-0.2-0.8-0.2-1.3-0.2L5.9,23.9z" />
        <linearGradient id="b" x1="50.717" x2="21.913" y1="35.904" y2="51.991" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffb9a4" />
            <stop offset="1" stopColor="#ef7337" />
        </linearGradient>
        <path fill="url(#b)" d="M32,41.2v19.2c0,0,9.2-4.7,24-5.1c1.1,0,2-1,2-2.1V20.8c0-1.2-1-2.2-2.2-2.1C41.1,19.1,32,23.7,32,23.7V37" />
        <linearGradient id="c" x1="33.176" x2="4.372" y1="35.904" y2="51.991" gradientTransform="matrix(-1 0 0 1 46.5 0)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffb9a4" />
            <stop offset="1" stopColor="#ef7337" />
        </linearGradient>
        <path fill="url(#c)" d="M8.1,18.6C22.9,19.1,32,23.7,32,23.7v36.7c0,0-9.2-4.7-24-5.1c-1.1,0-2-1-2-2.1V20.8
      C6,19.6,6.9,18.6,8.1,18.6z" />
        <path fill="#fff" d="M55.9 18.6C41.1 19.1 32 23.7 32 23.7v2.6c0 0 9.1-4.6 23.9-5.1 1.2 0 2.2.9 2.2 2.1v-2.6C58.1 19.6 57.1 18.6 55.9 18.6zM8.1 18.6c-1.2 0-2.2.9-2.2 2.1v2.6c0-1.2 1-2.2 2.2-2.1C22.9 21.7 32 26.3 32 26.3v-2.6C32 23.7 22.9 19.1 8.1 18.6z" opacity=".8" />
        <g>
            <linearGradient id="d" x1="21.5" x2="42.5" y1="23.75" y2="23.75" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#fff383" />
                <stop offset="1" stopColor="#fcee21" />
            </linearGradient>
            <path fill="url(#d)" d="M42.5,21.3c0-6.2-5.4-11.2-11.7-10.5c-4.7,0.5-8.5,4.3-9.2,8.9c-0.6,4,1.1,7.7,4,9.9c1.4,1.1,2.4,2.8,2.4,4.6
        v0c0,1.3,1.1,2.4,2.4,2.4h3.2c1.3,0,2.4-1.1,2.4-2.4v0c0-1.8,0.9-3.5,2.3-4.6C40.9,27.8,42.5,24.7,42.5,21.3z" />
            <path fill="#f4b33b" d="M42,22.8c0,0-2,5-10,5s-10-5-10-5l0.4,2.8c0.7,1.7,1.8,3.1,3.2,4.2c1.4,1.1,2.4,2.8,2.4,4.6v0
        c0,1.3,1.1,2.4,2.4,2.4h3.2c1.3,0,2.4-1.1,2.4-2.4v0c0-1.8,0.9-3.5,2.3-4.6c1.4-1.1,2.5-2.6,3.3-4.2L42,22.8z" opacity=".4" />
            <ellipse cx="32" cy="15.3" fill="#fff5b0" rx="5" ry="2.5" />
        </g>
    </svg>
)

const RelaxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" id="yoga-pose">
        <g>
            <path fill="#db5669" d="M19.25,14.08l-2.52,0.84L16,13V18.5H8V13l-0.72,1.93L4.75,14.08l0.7-2.3a3,3,0,0,1,2.36-2.08c3.25-0.55,1.94-0.46,5.67-0.46l2.69,0.45a3,3,0,0,1,2.38,2.09C19.31,14.31,19.18,13.88,19.25,14.08Z"></path>
            <path fill="#f26674" d="M19.25,14.08l-2.52,0.84L16,13v5.5h-6a1,1,0,0,1-1-1v-3.88a0.69,0.69,0,0,0-.5-0.35c-0.46,1.24-0.37,1-0.5,1.3a2.09,2.09,0,0,1-1.21-2.54,3.45,3.45,0,0,1,1-1.85l0.5-0.22c3.26-0.55,1.95-0.46,5.67-0.46l2.69,0.45a3,3,0,0,1,2.38,2.09C19.31,14.31,19.18,13.88,19.25,14.08Z"></path>
            <path fill="#f6ccaf" d="M13.5,8.1c0,0.83,0.09,1.36-0.38,1.89a1.5,1.5,0,0,1-2.26-1.5v-0.91Z"></path>
            <path fill="#ffdec7" d="M13.5,8.1c0,0.83,0.09,1.36-0.38,1.89A1.5,1.5,0,0,1,11.5,8.5v-0.4Z"></path>
            <path fill="#f6ccaf" d="M15,3.5c0,1.82,0.26,3.29-1.18,4.39a3,3,0,0,1-4.82-2.78V3.5A3,3,0,0,1,15,3.5Z"></path>
            <path fill="#ffdec7" d="M15,3.5c0,1.82,0.26,3.29-1.18,4.39A3,3,0,0,1,10,5c0-1.82-0.26-3.29,1.18-4.39A3,3,0,0,1,15,3.5Z"></path>
            <path fill="#a87e6b" d="M15,3.5V4c-1.18,0-2.36,0.14-3.5-1-0.56,1.13-1.64,1-2.5,1V3.5A3,3,0,0,1,15,3.5Z"></path>
            <path fill="#be927c" d="M15,3.5V4c-1.18,0-2.36,0.14-3.5-1a1.78,1.78,0,0,1-1.5,1V3.5a3,3,0,0,1,2.5-2.95A3,3,0,0,1,15,3.5Z"></path>
            <path fill="#f6ccaf" d="M16,20.5v3H8.56a1.06,1.06,0,0,1-.13-2.11C11.16,21,3.33,22,16,20.5Z"></path>
            <path fill="#ffdec7" d="M16,20.5v2H9.56A1.06,1.06,0,0,1,8.5,21.38Z"></path>
            <path fill="#6fabe6" d="M18.85,23.5H16v-3c2.76-0.31,2.87-0.39,3.41-0.21h0a1.65,1.65,0,0,1-.56,3.21ZM8.56,23.5c-3.5,0-3.94,0.15-4.58-0.5a1.65,1.65,0,0,1,1.21-2.21c0.5-0.18,0.15-0.16,7.4,0.68L8.56,21a1.06,1.06,0,0,0-.13,2.11Z"></path>
            <path fill="#82bcf4" d="M12,21l-3.56,0.41a1.07,1.07,0,0,0-0.31,0.54c0,0.08,0.16,0.06-1.35,0.06a1.65,1.65,0,0,1-1.55-2.2C5.14,20.11,4.9,20.16,12,21ZM19.5,20.85a1.65,1.65,0,0,1-1.65,1.65H16v-3c2.76-0.31,2.87-0.39,3.41-0.21A1.77,1.77,0,0,1,19.5,20.85Z"></path>
            <path fill="#6fabe6" d="M19,20.21c-0.21-0.03,0.22-0.06-7,0.77c-0.05,0,0.07,0-6.66-0.77-0.4-0.03-1,.39,2.66-1.71H16Z"></path>
            <path fill="#82bcf4" d="M18.37,19.86C12.86,20.5,13,20.5,13,20.5L8.5,19.9a0.5,0.5,0,0,1-.19-0.93l0.94-0.93H16Z"></path>
            <path fill="#f6ccaf" d="M7.28,14.93c-0.74,2-0.8,2.31-1.24,2.82C3.5,20.83,3.6,20.75,3.25,20.89a1.25,1.25,0,0,1-1.41-2C5.23,16.73,4.12,17.2,5.41,14.93C5.9,14.46,5.33,14.28,7.28,14.93Z"></path>
            <path fill="#ffdec7" d="M7.28,14.93c-0.74,2-0.8,2.31-1.24,2.82C3.5,20.83,3.6,20.75,3.25,20.89a1.28,1.28,0,0,1-.41-2C5.25,16.79,4.15,17.29,5.33,13.5Z"></path>
            <path fill="#f6ccaf" d="M21.25,21a1.26,1.26,0,0,1-.91-0.5C18,18.83,18.9,19.17,17.95,14.93l2.52-0.84c0.79,2.59,0.17,1.5,2.91,4.8A1.27,1.27,0,0,1,21.25,21Z"></path>
            <path fill="#ffdec7" d="M21.75,20.89a1.13,1.13,0,0,1-.46-0.34C18.18,16.83,18.9,19.17,17.55,14.65l1.7-0.56c0.79,2.59,0.17,1.5,2.91,4.8A1.28,1.28,0,0,1,21.75,20.89Z"></path>
        </g>
    </svg>
)


const OpeningContainer: React.FC<OpeningContainerProps> = ({ onQuestionClick, containerQues }) => {

    const icons = [
        <PlaneIcon />,
        <WebIcon />,
        <OutfitIcon />,
        <StudyIcon />,
        <RelaxIcon />
    ]
    return (
        <div className="opening-container">
            <div className='questions-list flex flex-wrap justify-center'>
                {containerQues && containerQues.length > 0 ? (
                    containerQues.map((question, index) => (
                        <div key={index} className='min-h-28 w-40 p-3.5 m-2 border border-[#ccc] rounded-2xl cursor-pointer' onClick={() => onQuestionClick(question)}>
                            <div>{icons[index]}</div>
                            <div className='text-sm pt-2'>{question}</div>
                        </div>
                    ))
                ) : (
                    <div>No Questions available</div>
                )}
            </div>
            {/* <div className="questions-grid">
                {containerQues && containerQues.length > 0 ? (
                    containerQues.map((question, index) => (
                        <div key={index} className="question-item" onClick={() => onQuestionClick(question.question)}>
                            <div className="icon">{icons[index]}</div>
                            <div className="text">{question.question}</div>
                        </div>
                    ))
                ) : (
                    <div>No questions available</div>
                )}
            </div> */}

        </div>
    )
}

export default OpeningContainer 
