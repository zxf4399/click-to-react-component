import { ClickToComponent } from "ClickToComponent"
import ReactDOM from "react-dom/client"

const node = document.createElement("div")
const id = "click-to-react-component"

node.id = id

document.body.appendChild(node)

const root = ReactDOM.createRoot(document.getElementById(id))

root.render(<ClickToComponent />)
