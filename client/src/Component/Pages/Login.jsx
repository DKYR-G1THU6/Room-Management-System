import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Alert } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "root") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/"); 
      
    } else {
      setError("Invalid username or password");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box sx={{ 
    position: "fixed", 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    display: "flex", 
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    }}>
      <Paper sx={{ p: 4, width: 300, textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>Login</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField 
          fullWidth 
          label="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ mb: 2 }} 
        />

        <TextField 
          fullWidth 
          label="Password" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ mb: 2 }} 
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography variant="caption" sx={{ mt: 2, display: "block", color: "text.secondary" }}>
          Demo: admin / root
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;