import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import StoreDetail from './components/store/store_detail';
import Mainthing from './components/mainthing';
import StoreFilterPage from './components/storefilterpage';
function App() {
    return (_jsxs(Router, { children: [_jsx(Header, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Mainthing, {}) }), _jsx(Route, { path: "/store/:name", element: _jsx(StoreDetail, {}) }), _jsx(Route, { path: "/storefilterpage", element: _jsx(StoreFilterPage, {}) })] }), _jsx(Footer, {})] }));
}
export default App;
