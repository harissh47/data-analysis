// attention: This JavaScript script must be placed after the <body> element. Otherwise, the script will not work.

document.body.onload = embedChatbot;

async function embedChatbot() {
  const chatbotConfig = window.chatbotConfig;
  if (!chatbotConfig || !chatbotConfig.token) {
    console.error('chatbotConfig is empty or token is not provided')
    return;
  }

  let inputValues = ''
  let count = 0

  for (const i in chatbotConfig) {
    if (i !== 'isDev' && i !== 'baseUrl' && i !== 'token') {
      if (count === 0) {
        inputValues += '?'
      }
      else {
        inputValues += '&'
      }
      count++
      inputValues += `${i}=${chatbotConfig[i]}`
    }
  }

  const isDev = !!chatbotConfig.isDev
  const baseUrl = chatbotConfig.baseUrl || ''
  const openIcon = `<img 
            src=${baseUrl}/assets/copilot-logo.png
            alt="Copilot"
            height="27px"
            width="auto"
            object-fit="fill"
          />`
  const closeIcon = `<svg
          id="closeIcon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 18L6 6M6 18L18 6"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>`

  // create iframe
  function createIframe() {
    const iframe = document.createElement('iframe');
    iframe.allow = "fullscreen;microphone"
    iframe.title = "chatbot bubble window"
    iframe.id = 'chatbot-bubble-window'
    iframe.src = `${baseUrl}/chatbot/${chatbotConfig.token}${inputValues}`
    iframe.style.cssText = 'border: none; position: fixed; flex-direction: column; justify-content: space-between; box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, rgba(150, 150, 150, 0.2) 0px 0px 0px 1px; bottom: 5rem; right: 1rem; width: 24rem; max-width: calc(100vw - 2rem); height: 40rem; max-height: calc(100vh - 6rem);border-radius: 0.75rem; display: flex; z-index: 2147483647; overflow: hidden; left: unset; background-color: #F3F4F6;'
    document.body.appendChild(iframe);
  }

  const targetButton = document.getElementById('chatbot-bubble-button')
  if (!targetButton) {
    const containerDiv = document.createElement("div");
    containerDiv.id = 'chatbot-bubble-button'
    containerDiv.style.cssText = `position: fixed; bottom: 1rem; right: 1rem; width: 60px; height: 60px; border-radius: 34px 8px 34px 34px; background-color: #fff; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px; cursor: pointer; z-index: 2147483647; transition: all 0.2s ease-in-out 0s; left: unset; transform: scale(1); :hover {transform: scale(1.1);}`;
    const displayDiv = document.createElement('div');
    displayDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; z-index: 2147483647;';
    displayDiv.innerHTML = openIcon
    containerDiv.appendChild(displayDiv);
    document.body.appendChild(containerDiv);
    containerDiv.addEventListener('click', function () {
      const targetIframe = document.getElementById('chatbot-bubble-window')
      if (!targetIframe) {
        createIframe()
        displayDiv.innerHTML = closeIcon
        return;
      }
      if (targetIframe.style.display === 'none') {
        targetIframe.style.display = 'block';
        displayDiv.innerHTML = closeIcon
      } else {
        targetIframe.style.display = 'none';
        displayDiv.innerHTML = openIcon
      }
    });
  }
}
