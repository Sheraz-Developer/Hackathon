import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Allitems from "../Dashboard/All Items/index"

export default function Dashboard() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="/EditPage" element={Allitems} />
        </Routes>
    )
}
