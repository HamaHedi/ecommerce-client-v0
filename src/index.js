import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

import { Provider } from 'react-redux'
import store from './store'
import { GlobalStateProvider } from './context/context'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<Provider store={store}>
		    <GlobalStateProvider>

		<App />
		</GlobalStateProvider>

	</Provider>
)
