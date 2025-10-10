// 1. Import the createroot method form the react-dom/client
// 2. StrictMode helps identify potential broblems in our react application
// - activiates additional check
// - doesnt render any visible UI.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// 2. Then I create the root by calling the createRoot method
// 3. I need to pass a DOM node, where all our markup will be stuffed in.
// 4. To access the DOM node, use the normal JavaScript DOM manipulation syntax document.getElementById("root") or 
// -- a query selector and select the HTML markup.
// 5. Now React will be incharge of all in the Div markup / element.
// 6. Then I call the render method on the root
// 7. pass in what to render:
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// 8. In this case I render the strictMode chacker and the App root component
// 9. App.jsx is top-level component where your main layout and routing logic will be.
