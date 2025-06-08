// Import necessary components and functions from react-router-dom.

import React from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Details } from "./pages/Detail";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
            <Route path="/" element={<Home />} />
            <Route path="/details/:category/:id" element={<Details />} />
        </Route>
    )
);