const fs = require("fs")
const path = require("path")

const JSZip = require("jszip")

const pkg = require("../package.json")
const webpackConfig = require("../webpack.config")

const zip = new JSZip()

const RELEASE_FOLDER = "release"

function main() {
  try {
    const files = fs.readdirSync(webpackConfig.output.path)

    for (const file of files) {
      zip.file(
        file,
        fs.readFileSync(path.resolve(webpackConfig.output.path, file))
      )
    }

    if (!fs.existsSync(RELEASE_FOLDER)) {
      fs.mkdirSync(RELEASE_FOLDER)
    }

    const zipName = `${RELEASE_FOLDER}/${pkg.version}.zip`

    zip
      .generateNodeStream({ streamFiles: true, type: "nodebuffer" })
      .pipe(fs.createWriteStream(zipName))
      .on("finish", () => {
        console.log(`${zipName} generated successfully`)
      })
  } catch (err) {
    console.error("zip error", err)
  }
}

main()
