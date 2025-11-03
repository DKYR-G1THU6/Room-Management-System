import React from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import DrawerLayout from "./Component/Pages/DrawerLayout"
import Home from "./Component/Pages/Home"
import Listing from "./Component/Pages/Listing"
import Logout from "./Component/Pages/Logout"
import Settings from "./Component/Pages/Settings"
import Help from "./Component/Pages/Help"
import Login from "./Component/Pages/Login"
import ProtectedRoute from "./Component/Pages/ProtectedRoute"
import ThemeContextProvider from './Component/Pages/ThemeContext'
import EditUser from "./Component/Pages/EditUser"
import FoodOrdering from "./Component/Pages/FoodOrdering"
import CssBaseline from '@mui/material/CssBaseline'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', 
  cache: new InMemoryCache(),
});

function App() {
  return(
    <ThemeContextProvider>
      <CssBaseline />
      <ApolloProvider client={client}>
        <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
        <DrawerLayout>
          <Home />
        </DrawerLayout>
        </ProtectedRoute>
      } />

      <Route path="/listing" element={
        <ProtectedRoute>
        <DrawerLayout>
          <Listing />
        </DrawerLayout>
        </ProtectedRoute>
      } />

      <Route path="/logout" element={
        <ProtectedRoute>
          <DrawerLayout>
            <Logout />
          </DrawerLayout>
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <DrawerLayout>
            <Settings />
          </DrawerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/help" element={
        <ProtectedRoute>
          <DrawerLayout>
            <Help />
          </DrawerLayout>
        </ProtectedRoute>
      } />

      <Route path="/food-ordering" element={
        <ProtectedRoute>
          <DrawerLayout>
            <FoodOrdering />
          </DrawerLayout>
        </ProtectedRoute>
      } />

      <Route path="/edit-user" element={
        <ProtectedRoute>
          <DrawerLayout>
            <EditUser />
          </DrawerLayout>
        </ProtectedRoute>
      } />

       <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
    </ApolloProvider>
    </ThemeContextProvider>
  )
  
}

export default App
