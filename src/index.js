import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import store from './store'
import { GlobalStateProvider } from './context/context'
import './i18n'

const theme = {
	token: {
		colorPrimary: '#673995',
		colorLink: '#673995',
		colorLinkHover: '#5a3584',
		colorInfo: '#673995',
		colorTextBase: '#1a1320',
		borderRadius: 10,
		fontFamily:
			"'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		controlHeight: 40,
	},
	components: {
		Button: { borderRadiusLG: 999, fontWeight: 600 },
		Dropdown: { borderRadiusLG: 14, controlPaddingHorizontal: 16 },
		Modal: { borderRadiusLG: 18 },
	},
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<Provider store={store}>
		<GlobalStateProvider>
			<ConfigProvider theme={theme}>
				<App />
			</ConfigProvider>
		</GlobalStateProvider>
	</Provider>
)
