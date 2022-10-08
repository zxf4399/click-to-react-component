const { MESSAGE_FROM, MESSAGE_ACTION } = require("../constants")

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const shouldReload =
    request.from === MESSAGE_FROM.BACKGROUND &&
    request.action === MESSAGE_ACTION.RELOAD_CONTENT_SCRIPT

  if (shouldReload) {
    sendResponse({
      action: MESSAGE_ACTION.RELOAD_EXTENSION,
      from: MESSAGE_FROM.CONTENT_SCRIPT,
    })
  }
})
