import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { FormEvent, useContext, useState } from "react";
import { UsersContext } from "./UserProvider";
import axios from "axios";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '0px 20px',
    boxShadow: 24,
    p: 4,
};
const Login = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error("UsersContext must be used within a UsersProvider");
    }
    const { dispatch } = context;
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
       e.preventDefault()
       handleClose()
       try{
           
           console.log("before");
            const res=await axios.post('http://localhost:5047/api/User/login',{
                
                email:email,
                password:password
            })
            dispatch({
                type:'LOGIN_USER',
                data:res.data.user
            })
            console.log("after");
                if(res.data.message){
                    onLoginSuccess()
                    alert('LOGIN SUCCESSFULL')
                    setEmail('')
                    setPassword('')
                }
        }
        catch(e){
            alert('LOGIN-FAIL')
        }
        }
    return <>
        <Stack direction="row" spacing={2} sx={{ position: 'absolute', top: 0, left: 0, padding: '16px',zIndex:10 }}>
            <Button onClick={handleOpen} variant="contained" size="large">{'Login'}</Button>
        </Stack>
        <Modal
            open={open}
            onClose={handleClose}>
            <Box sx={style}>
                <form onSubmit={handleSubmit}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Login
                    </Typography>
                    <TextField
                        id="email"
                        label="userEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="password"
                        label="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained">Continue</Button>
                </form>
            </Box>
        </Modal>
    </>
}
export default Login