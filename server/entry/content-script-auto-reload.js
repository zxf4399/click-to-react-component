const { MESSAGE_FROM, MESSAGE_ACTION } = require("../constants")
const log = require("logger").default.getLogger(
  "entry/content-script-auto-reload"
)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const shouldReload =
    request.from === MESSAGE_FROM.BACKGROUND &&
    request.action === MESSAGE_ACTION.RELOAD_CONTENT_SCRIPT

  if (shouldReload) {
    sendResponse({
      action: MESSAGE_ACTION.RELOAD_EXTENSION,
      from: MESSAGE_FROM.CONTENT_SCRIPT,
    })

    // wait for the background script to reload the extension
    setTimeout(() => {
      log.info("reload content script")
      window.location.reload()
    }, 100)
  }
})
