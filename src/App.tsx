import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import StoreDetail from './components/store/store_detail'
import Mainthing from './components/mainthing'
import StoreFilterPage from './components/storefilterpage'

function App() {
  return (
    <Router>
      {/* ✅ Header는 Routes 바깥에 넣기 (공통 레이아웃 영역) */}
      <Header />

      <Routes>
        <Route path="/" element={<Mainthing />} />
        <Route path="/store/:name" element={<StoreDetail />} />
        <Route path="/storefilterpage" element={<StoreFilterPage/>} />
      </Routes>

      {/* ❓ Footer도 모든 페이지에 나오게 하려면 여기에 둬도 됨 */}
      <Footer />
    </Router>
  )
}

export default App
