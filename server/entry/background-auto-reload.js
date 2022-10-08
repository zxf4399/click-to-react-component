const {
  AUTO_RELOAD_URL,
  SSE_EVENT,
  MESSAGE_FROM,
  MESSAGE_ACTION,
  SSE_ACTION,
} = require("../constants")
const log = require("logger").default.getLogger("entry/background-auto-reload")

const source = new EventSource(AUTO_RELOAD_URL)

source.addEventListener("open", () => {
  log.info("The connection has been established.")
})

source.addEventListener(
  SSE_EVENT.CONTENT_SCRIPT_COMPILED_SUCCESSFULLY,
  (event) => {
    const shouldReload =
      JSON.parse(event.data).action ===
      SSE_ACTION.RELOAD_EXTENSION_CONTENT_SCRIPT

    if (shouldReload) {
      log.info("received the signal to reload chrome extension")

      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
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
                  from === MESSAGE_FROM.CONTENT_SCRIPT &&
                  action === MESSAGE_ACTION.RELOAD_EXTENSION
                ) {
                  log.info("reload extension")
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
