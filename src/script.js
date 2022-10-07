import ReactDOM from "react-dom/client"

import { ClickToComponent } from "./content-script/click-to-component/ClickToComponent"

const node = document.createElement("div")
const id = "click-to-react-component"

node.id = id

document.body.appendChild(node)

const root = ReactDOM.createRoot(document.getElementById(id))

root.render(<ClickToComponent />)
