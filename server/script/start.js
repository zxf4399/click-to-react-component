const cors = require("cors")
const express = require("express")
const webpack = require("webpack")

const { AUTO_RELOAD_EXTENSION_URL, PORT } = require("../constants")
const webpackConfig = require("../../webpack.config")

const app = express()
const compiler = webpack(webpackConfig)

app.use(cors())
app.use(
  require("webpack-dev-middleware")(compiler, {
    writeToDisk: true,
  })
)
app.use(require("webpack-hot-middleware")(compiler))
app.use(
  AUTO_RELOAD_EXTENSION_URL,
  require("../middleware/content-script-auto-reload")(compiler)
)

app.listen(PORT, () => console.log("App listening on port 3000!"))
