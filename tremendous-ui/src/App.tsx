// @ts-ignore
import React, {FC, useState} from 'react';
import {HashRouter, NavLink, Route, Routes} from "react-router-dom";
import Settings from "./pages/Settings";


import './styles/navbar.css';
import {useLocalState} from "./zustand/localState";
import {toastrError} from "./ToastHelper";
import {axiosClient} from "./components/axios";
import {BarLoader} from "react-spinners";
import AppHeader from "./components/General/AppHeader";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {TremendousList} from "./pages/TremendousList";
import './main.css';

const App: FC = (props) => {
    const [loading, setLoading] = React.useState<boolean>(true);

    const {setLocalState} = useLocalState();

    const getLocalData = () => {
        axiosClient.get('?action=wp_relay_tremendous', {
            params: {
                method: 'get_local_data',
            }
        }).then((response) => {
            setLocalState(response.data.data);
            setLoading(false);
        }).catch(response => {
            toastrError('Error Occurred')
        })
    }

    React.useEffect(() => {
        getLocalData();
    }, [])

    return (
        <div>
            {loading ? <BarLoader
                    color={"#121212"}
                    loading={loading}
                    width="100%"
                    aria-label="Loading Spinner"
                    data-testid="loader"
                /> :
                <HashRouter>
                    <ToastContainer/>
                    <div>
                        <AppHeader/>
                        <nav
                            className="relay-wp-nav-bar wrt-flex xl:wrt-justify-start lg:wrt-justify-start lg:wrt-gap-5 md:wrt-gap-5 ">
                            <NavLink
                                className=" wrt-items-stretch wrt-flex wrt-rounded-lg lg:!wrt-h-11.5 relay-wp-nav-link  xl:wrt-px-4 xl:wrt-py-3 lg:wrt-px-3 lg:wrt-py-3 md:wrt-px-1 md:wrt-py-2 md:wrt-h-10 wrt-px-1 wrt-py-2 wrt-h-10 "
                                to="/">
                                <i className='wpr wpr-settings  lg:wrt-text-xl  md:wrt-text-4.5 wrt-text-4.5'></i>
                                <span
                                    className='wrt-ml-2 xl:wrt-text-4 lg:wrt-text-3.5 wrt-text-xs wrt-flex wrt-items-center'>Settings</span>
                            </NavLink>
                            <NavLink
                                className=" wrt-items-stretch wrt-flex wrt-rounded-lg lg:!wrt-h-11.5 relay-wp-nav-link  xl:wrt-px-4 xl:wrt-py-3 lg:wrt-px-3 lg:wrt-py-3 md:wrt-px-1 md:wrt-py-2 md:wrt-h-10 wrt-px-1 wrt-py-2 wrt-h-10 "
                                to="/tremendous-list">
                                <i className='wpr wpr-settings  lg:wrt-text-xl  md:wrt-text-4.5 wrt-text-4.5'></i>
                                <span
                                    className='wrt-ml-2 xl:wrt-text-4 lg:wrt-text-3.5 wrt-text-xs wrt-flex wrt-items-center'>Tremendous List</span>
                            </NavLink>
                        </nav>
                    </div>
                    <Routes>
                        <Route path="/" element={<Settings/>}></Route>
                        <Route path="/tremendous-list" element={<TremendousList/>}></Route>
                    </Routes>
                </HashRouter>
            }
        </div>)
}


export default App;

