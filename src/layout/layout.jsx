import PropTypes from 'prop-types';
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
const Layout = () => {
    return ( 
        <>
        <NavBar />
            <Outlet />
        <Footer /> 
        </>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
