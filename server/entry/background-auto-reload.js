const {
  AUTO_RELOAD_URL,
  SSE_EVENT,
  MESSAGE_FROM,
  MESSAGE_ACTION,
  SSE_ACTION,
} = require("../constants")

const source = new EventSource(AUTO_RELOAD_URL)

source.addEventListener("open", () => {
  console.log("The connection has been established.")
})

source.addEventListener("message", (event) => {
  console.log("received a no event name message, data: ", event.data)
})

source.addEventListener("pause", () => {
  console.log("received pause message from server, ready to close connection!")
  source.close()
})

source.addEventListener(
  SSE_EVENT.CONTENT_SCRIPT_COMPILED_SUCCESSFULLY,
  (event) => {
    const shouldReload =
      JSON.parse(event.data).action ===
      SSE_ACTION.RELOAD_EXTENSION_CONTENT_SCRIPT

    if (shouldReload) {
      console.log("received the signal to reload chrome extension")

      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            let received = false
            chrome.tabs.sendMessage(
              tab.id,
              {
                action: MESSAGE_ACTION.RELOAD_CONTENT_SCRIPT,
                from: MESSAGE_FROM.BACKGROUND,
              },
              (res) => {
                if (chrome.runtime.lastError && !res) return

                const { from, action } = res
                if (
                  !received &&
                  from === MESSAGE_FROM.CONTENT_SCRIPT &&
                  action === MESSAGE_ACTION.RELOAD_EXTENSION
                ) {
                  received = true
                  source.close()
                  console.log("reload extension")
                  chrome.runtime.reload()
                }
              }
            )
          }
        })
      })
    }
  }
)

source.addEventListener("error", (event) => {
  if (event.target.readyState === 0) {
    console.error("You need to open devServer first!")
  } else {
    console.error(event)
  }
})
