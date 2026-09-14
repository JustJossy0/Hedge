import { AccountMenu } from './components/AccountMenu'
import './App.css'

function App() {
  return (
    <div className="demo-shell">
      <header className="demo-topbar">
        <span className="demo-logo">HEDGE</span>
        <AccountMenu />
      </header>
    </div>
  )
}

export default App
