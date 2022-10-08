const path = require("path")

const debounce = require("lodash/debounce")
const SseStream = require("ssestream").default

const { SSE_ACTION, SSE_EVENT } = require("../constants")

function AutoReloadContentScript(compiler) {
  return (req, res, next) => {
    const sse = new SseStream(req)

    sse.pipe(res)

    const autoReloadPlugin = debounce((stats) => {
      const { modules } = stats.toJson({ all: false, modules: true })

      const updatedJsModules = modules?.filter(
        (module) =>
          module.type === "module" && module.moduleType === "javascript/auto"
      )

      const shouldReload =
        !stats.hasErrors() &&
        updatedJsModules?.some((module) =>
          module.nameForCondition?.startsWith(
            path.resolve("src", "content-script")
          )
        )

      if (shouldReload) {
        sse.write({
          data: {
            action: SSE_ACTION.RELOAD_EXTENSION_CONTENT_SCRIPT,
          },
          event: SSE_EVENT.CONTENT_SCRIPT_COMPILED_SUCCESSFULLY,
        })
      }
    }, 1000)

    compiler.hooks.done.tap("auto-reload-extension", autoReloadPlugin)

    next()
  }
}

module.exports = AutoReloadContentScript
