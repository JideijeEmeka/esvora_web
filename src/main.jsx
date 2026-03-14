// Env is determined by Vite mode: `vite` loads .env.development (dev), `vite build` loads .env.production (prod).
// See src/lib/constants.jsx for Env, baseUrl, kDebugMode.
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
)
