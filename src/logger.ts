import log from "loglevel"
import prefix from "loglevel-plugin-prefix"

log.setLevel("DEBUG")

prefix.reg(log)
prefix.apply(log, {
  template: "[%t] %l %n:",
})

export default log
