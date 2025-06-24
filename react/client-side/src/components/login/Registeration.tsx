// // // import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
// // // import React, { FormEvent, useContext, useState } from "react";
// // // import { UsersContext } from "./UserProvider";
// // // import axios from "axios";

// // // const style = {
// // //     position: 'absolute',
// // //     top: '50%',
// // //     left: '50%',
// // //     transform: 'translate(-50%, -50%)',
// // //     width: 400,
// // //     bgcolor: 'background.paper',
// // //     border: '2px solid #000',
// // //     borderRadius: '0px 20px',
// // //     boxShadow: 24,
// // //     p: 4,
// // // };

// // // const Registration = () => {
// // //     const [open, setOpen] = useState(false);
// // //     const handleOpen = () => setOpen(true);
// // //     const handleClose = () => setOpen(false);
// // //     const [formData, setFormData] = useState({
// // //         name:'',
// // //         email: '',
// // //         password: ''
// // //     });
// // //     const [errorMessage, setErrorMessage] = useState('');
// // //     const context = useContext(UsersContext);

// // //     if (!context) {
// // //         throw new Error("UserContext must be used within a UserProvider");
// // //     }

// // //     const { dispatch } = context;

// // //     const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// // //         setFormData({ ...formData, [event.target.name]: event.target.value });
// // //     };

// // //     const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
// // //         event.preventDefault();
// // //         setErrorMessage('');  // Reset the error messagee
// // //         console.log("Sending data:", formData);  // הוסף לוג כדי לוודא שהנתונים תקינים
// // //         try {
// // //             const res = await axios.post('http://localhost:5047/api/Auth/register', {
// // //                 name:formData.name,
// // //                 email: formData.email,
// // //                 password: formData.password,
// // //             });

// // //             if (res.data.message) {
// // //                 dispatch({
// // //                     type: 'Add_USER',
// // //                     data: res.data.user
// // //                 });
// // //                 alert('Registration successful');
// // //                 setOpen(false);
// // //             }
// // //         } catch (e: any) {
// // //             setErrorMessage(e.response?.data?.message || 'An error occurred during registration');
// // //             alert('Registration failed');
// // //         }
// // //     };

// // //     return (
// // //         <>
// // //             <Stack direction="row" spacing={2} sx={{ position: 'absolute', top: 0, left: 100, padding: '16px', zIndex: 10 }}>
// // //                 <Button onClick={handleOpen} variant="contained" size="large">Register</Button>
// // //             </Stack>

// // //             <Modal
// // //                 open={open}
// // //                 onClose={handleClose}
// // //             >
// // //                 <Box sx={style}>
// // //                     <form onSubmit={handleSubmit}>
// // //                         <Typography id="modal-modal-title" variant="h6" component="h2">
// // //                             Register
// // //                         </Typography>
// // //                         {errorMessage && <Typography color="error" variant="body2">{errorMessage}</Typography>}
// // //                         <TextField
// // //                             name="name"
// // //                             label="Name"
// // //                             type="text"
// // //                             value={formData.name}
// // //                             onChange={handleChange}
// // //                             fullWidth
// // //                             margin="normal"
// // //                         />
// // //                         <TextField
// // //                             name="email"
// // //                             label="Email"
// // //                             type="email"
// // //                             value={formData.email}
// // //                             onChange={handleChange}
// // //                             fullWidth
// // //                             margin="normal"
// // //                             autoComplete="email"

// // //                         />
// // //                         <TextField
// // //                             name="password"
// // //                             label="Password"
// // //                             type="password"
// // //                             value={formData.password}
// // //                             onChange={handleChange}
// // //                             fullWidth
// // //                             margin="normal"
// // //                             autoComplete="current-password"

// // //                         />
// // //                         <Button type="submit" variant="contained">Save</Button>
// // //                     </form>
// // //                 </Box>
// // //             </Modal>
// // //         </>
// // //     );
// // // };

// // // export default Registration;

// // import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
// // import React, { FormEvent, useContext, useState } from "react";
// // import { UsersContext } from "./UserProvider";
// // import axios from "axios";

// // const style = {
// // position: 'absolute',
// // top: '50%',
// // left: '50%',
// // transform: 'translate(-50%, -50%)',
// // width: 400,
// // bgcolor: 'background.paper',
// // border: '2px solid #000',
// // borderRadius: '0px 20px',
// // boxShadow: 24,
// // p: 4,
// // };

// // const Registration = () => {
// // const [open, setOpen] = useState(false);
// // const handleOpen = () => setOpen(true);
// // const handleClose = () => setOpen(false);
// // const [formData, setFormData] = useState({
// // name:'',
// // email: '',
// // password: ''
// // });
// // const [errorMessage, setErrorMessage] = useState('');
// // const context = useContext(UsersContext);


// // if (!context) {
// //     throw new Error("UserContext must be used within a UserProvider");
// // }

// // const { dispatch } = context;

// // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     setFormData({ ...formData, [event.target.name]: event.target.value });
// // };

// // // const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
// // //     event.preventDefault();
// // //     setErrorMessage('');  // Reset the error messagee
// // //     console.log("Sending data:", formData);  // הוסף לוג כדי לוודא שהנתונים תקינים
// // //     try {
// // //         const res = await axios.post('http://localhost:5047/api/User', {
// // //             name:formData.name,
// // //             email: formData.email,
// // //             password: formData.password,
// // //         });

// // //         if (res.data.message) {
// // //             dispatch({
// // //                 type: 'Add_USER',
// // //                 data: res.data.user
// // //             });
// // //             alert('Registration successful');
// // //             setOpen(false);
// // //         }
// // //     } catch (e: any) {
// // //         setErrorMessage(e.response?.data?.message || 'An error occurred during registration');
// // //         alert('Registration failed');
// // //     }
// // // };


// // const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
// //     event.preventDefault();
// //     setErrorMessage('');
// //     console.log("Sending data:", formData);

// //     const localApi = 'http://localhost:5047/api/Auth/register';
// //     const  renderApi='https://your-render-server.onrender.com/api/Auth/register'
// //     try {
// //         // ננסה קודם כל את השרת המקומי
// //         const res = await axios.post(localApi, {
            
// //             name: formData.name,
// //             email: formData.email,
// //             password: formData.password,
// //         });
    
// //         if (res.data.message) {
// //             dispatch({ type: 'Add_USER', data: res.data.user });
// //             alert('Registration successful (local)');
// //             setOpen(false);
// //         }
// //     } catch (errLocal) {
// //         try {
// //             // אם השרת המקומי לא מגיב – ננסה את השרת שברנדר
// //             const res = await axios.post(renderApi, {
// //                 name: formData.name,
// //                 email: formData.email,
// //                 password: formData.password,
// //             });

// //             if (res.data.message) {
// //                 dispatch({ type: 'Add_USER', data: res.data.user });
// //                 alert('Registration successful (remote)');
// //                 setOpen(false);
// //             }
// //         } catch (errRemote:any) {
// //             // אם גם השרת ב-Render לא עובד
// //             setErrorMessage(errRemote.response?.data?.message || 'An error occurred during registration');
// //             alert('Registration failed');
// //         }
// //     }
// // };


// // return (
// //     <>
// //         <Stack direction="row" spacing={2} sx={{ position: 'absolute', top: 0, left: 100, padding: '16px', zIndex: 10 }}>
// //             <Button onClick={handleOpen} variant="contained" size="large">Register</Button>
// //         </Stack>

// //         <Modal
// //             open={open}
// //             onClose={handleClose}
// //         >
// //             <Box sx={style}>
// //                 <form onSubmit={handleSubmit}>
// //                     <Typography id="modal-modal-title" variant="h6" component="h2">
// //                         Register
// //                     </Typography>
// //                     {errorMessage && <Typography color="error" variant="body2">{errorMessage}</Typography>}
// //                     <TextField
// //                         name="name"
// //                         label="Name"
// //                         type="text"
// //                         value={formData.name}
// //                         onChange={handleChange}
// //                         fullWidth
// //                         margin="normal"
// //                     />
// //                     <TextField
// //                         name="email"
// //                         label="Email"
// //                         type="email"
// //                         value={formData.email}
// //                         onChange={handleChange}
// //                         fullWidth
// //                         margin="normal"
// //                         autoComplete="email"

// //                     />
// //                     <TextField
// //                         name="password"
// //                         label="Password"
// //                         type="password"
// //                         value={formData.password}
// //                         onChange={handleChange}
// //                         fullWidth
// //                         margin="normal"
// //                         autoComplete="current-password"

// //                     />
// //                     <Button type="submit" variant="contained">Save</Button>
// //                 </form>
// //             </Box>
// //         </Modal>
// //     </>
// // );


// // };

// // export default Registration;



// import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
// import { FormEvent, useContext, useState } from "react";
// import { UsersContext } from "./UserProvider";
// import axios from "axios";

// const style = {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: 400,
//     bgcolor: "background.paper",
//     border: "2px solid #000",
//     borderRadius: "0px 20px",
//     boxShadow: 24,
//     p: 4,
// };

// const Registration = () => {
//     console.log("reeeeeeeeeeeeeeeeegggggggggggistration");
    
//     const [open, setOpen] = useState(false);
//     const [formData, setFormData] = useState({ name: "", email: "", password: "" });
//     const [errorMessage, setErrorMessage] = useState("");

//     const context = useContext(UsersContext);
//     if (!context) throw new Error("UsersContext must be used within a UsersProvider");

//     const { dispatch } = context;

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         setErrorMessage("");

//         try {
//             const res = await axios.post("http://localhost:5047/api/Auth/register", formData);
//             console.log('res');
            
//             console.log(res);
            
//             if (res.data.message) {
//                 dispatch({ type: "ADD_USER", data: res.data.user });
//                 alert("Registration successful");
//                 setOpen(false);
//             }
//         } catch (err: any) {
//             setErrorMessage(err.response?.data?.message || "Registration failed");
//             alert("Registration failed");
//         }
//     };

//     return (
//         <>
//             <Stack direction="row" spacing={2} sx={{ position: "absolute", top: 0, left: 100, p: 2, zIndex: 10 }}>
//                 <Button onClick={() => setOpen(true)} variant="contained" size="large">
//                     Register
//                 </Button>
//             </Stack>
//             <Modal open={open} onClose={() => setOpen(false)}>
//                 <Box sx={style}>
//                     <form onSubmit={handleSubmit}>
//                         <Typography variant="h6">Register</Typography>
//                         {errorMessage && <Typography color="error">{errorMessage}</Typography>}
//                         <TextField
//                             name="name"
//                             label="Name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                         <TextField
//                             name="email"
//                             label="Email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                         <TextField
//                             name="password"
//                             label="Password"
//                             type="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                         <Button type="submit" variant="contained">
//                             Save
//                         </Button>
//                     </form>
//                 </Box>
//             </Modal>
//         </>
//     );
// };

// export default Registration;






import { Box, Button, TextField, Typography } from "@mui/material";
import { FormEvent, useContext, useState } from "react";
import { UsersContext } from "./UserProvider";
import axios from "axios";

const Registration = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(UsersContext);
    if (!context) throw new Error("UsersContext must be used within a UsersProvider");

    const { dispatch } = context;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        try {
            const res = await axios.post("http://localhost:5047/api/Auth/register", formData);
            
            if (res.data.message) {
                dispatch({ type: "ADD_USER", data: res.data.user });
                alert("הרשמה בוצעה בהצלחה!");
                setFormData({ name: "", email: "", password: "" });
            }
        } catch (err: any) {
            setErrorMessage(err.response?.data?.message || "הרשמה נכשלה");
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
                    הרשמה למערכת
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
                    name="name"
                    label="שם מלא"
                    value={formData.name}
                    onChange={handleChange}
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
                    name="email"
                    label="אימייל"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    label="סיסמה"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
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
                    {isLoading ? 'נרשם...' : 'הירשם'}
                </Button>
            </form>
        </Box>
    );
};

export default Registration;