
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import { UsersContext } from './context/UserProvider';
// const isUserLoggedIn = () => {
//     const context = useContext(UsersContext);
//     if (!context) {
//         console.log("!context");
//         return false
//     }
//     if (context.state.email && context.state.id)
//         return true;
// }
const Navbar = () => {
    return (
        <AppBar
            position="absolute"
            sx={{
                top: 0,
                right: 0,
                zIndex: 2,
                bgcolor: 'whiteblue',
                width: '100%', 
                display: 'flex',
                justifyContent: 'space-between'
            }} >
            <Toolbar variant="regular">
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'right' }}>
                </Typography>
                <div>
                    <Button color="inherit" component={Link} to='/' sx={{ marginLeft: 2 }}>
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to='/summarizes' sx={{ marginLeft: 2 }}>
                        show summarizes
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
};
export default Navbar;
