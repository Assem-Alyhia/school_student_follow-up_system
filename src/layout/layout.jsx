import PropTypes from 'prop-types';
import { Outlet } from "react-router-dom";

const Layout = () => {
    return ( 
        <>
            <Outlet />
        </>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
