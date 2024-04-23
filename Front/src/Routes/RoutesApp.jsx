import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "../pages/Home";
import Lista from "../pages/Lista"
import Login from "../pages/Login"
import Registro from "../pages/Registro"
import Nevera from "../pages/Nevera"
import Productos from "../pages/Productos"

function RoutesApp() {
    return (

        <Router>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Lista" element={<Lista />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Registro" element={<Registro />} />
                <Route path="/Nevera" element={<Nevera />} />
                <Route path="/Productos" element={<Productos />} />
            </Routes>

        </Router>
    )
}
export default RoutesApp