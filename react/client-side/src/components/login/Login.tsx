

import { Box, Button, TextField, Typography } from "@mui/material";
import { FormEvent, useContext, useState } from "react";
import { UsersContext } from "./UserProvider";
import api from "../../services/Api"; // הנתיב לפי המיקום שלך

const Login = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const context = useContext(UsersContext);

    if (!context) throw new Error("UsersContext must be used within a UsersProvider");

    const { dispatch } = context;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        
        try {
            const res = await api.post("/Auth/login", {
                email,
                password,
            });

            const token = res.data.token;
            localStorage.setItem("token", token);
            
            dispatch({ type: "LOGIN_USER", data: res.data.user });

            onLoginSuccess();
            alert("התחברות בוצעה בהצלחה!");
            setEmail("");
            setPassword("");
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "התחברות נכשלה");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        marginBottom: '32px',
                        textAlign: 'center',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #2196f3, #6366f1, #9c27b0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}
                >
                    כניסה למערכת
                </Typography>
                
                {errorMessage && (
                    <Typography 
                        color="error" 
                        sx={{ 
                            marginBottom: '16px',
                            textAlign: 'center',
                            padding: '12px',
                            backgroundColor: '#ffebee',
                            borderRadius: '8px',
                            border: '1px solid #ffcdd2'
                        }}
                    >
                        {errorMessage}
                    </Typography>
                )}
                
                <TextField
                    label="אימייל"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover fieldset': {
                                borderColor: '#2196f3',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#2196f3',
                            },
                        },
                    }}
                />
                
                <TextField
                    label="סיסמה"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                        marginBottom: '24px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover fieldset': {
                                borderColor: '#2196f3',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#2196f3',
                            },
                        },
                    }}
                />
                
                <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth
                    disabled={isLoading}
                    sx={{
                        padding: '16px',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #2196f3, #6366f1, #9c27b0)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #1976d2, #5e35b1, #7b1fa2)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(33, 150, 243, 0.4)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    {isLoading ? 'מתחבר...' : 'התחבר'}
                </Button>
            </form>
        </Box>
    );
};

export default Login;