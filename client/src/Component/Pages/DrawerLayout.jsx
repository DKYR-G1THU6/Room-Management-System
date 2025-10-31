import React ,{useState}from 'react'

// MUI Components
import { styled, useTheme , alpha } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { Avatar,Drawer, Typography, Toolbar, Box, CssBaseline } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';


// Icons
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import BedIcon from '@mui/icons-material/Bed';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
  


// List Components
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';




import EditUser from './EditUser';


const DrawerLayout = ({ children }) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const drawerWidth = 330; 
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    const userName = storedUser.name || 'Guest';
    const userEmail = storedUser.email || 'No email';

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setEditUserOpen(true);
    };

    const handleCloseEditUser = () => {
        setEditUserOpen(false);
        setSelectedUser(null);
    };

    const handleSaveUser = (updatedUser) => {
        
        setSelectedUser(updatedUser);
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        handleCloseEditUser();
    }

    const mainMenuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Room Listing', icon: <BedIcon />, path: '/listing' },
        { text: 'Food Ordering', icon: <FastfoodIcon />, path: '/food-ordering' },
        { text: 'Logout', icon: <LogoutIcon />, path: '/logout' },
    ];
    
    const footerMenuItems = [
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
        { text: 'Help & Feedback', icon: <HelpOutlineIcon />, path: '/help' },
    ];

    const Search = styled('div')(({ theme }) => ({
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
      color: 'inherit',
      width: '100%',
      '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
          width: '12ch',
          '&:focus': {
            width: '20ch',
          },
        },
      },
    }));

    
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar, 
        justifyContent: 'flex-end',
    }));

    
    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeInOut,
            duration: 300, 
        }),
        ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeInOut,
                duration: 300, 
            }),
        }),
    }));

    const handleDrawerClose = () => {
        setOpen(false);
    };
    
    const handleDrawerToggle = () => { 
        setOpen(!open);
    };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      
  <AppBar position="fixed" open={open} sx={{flexGrow: 1}}>
        <Toolbar>
            <IconButton 
                color="inherit" 
                aria-label="open drawer" 
                onClick={handleDrawerToggle} 
                edge="start"
                sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" component="div" noWrap sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
              Room Listing System
            </Typography>
        

        <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
    </Toolbar>
      </AppBar>

      
      <Drawer
        variant="persistent"
        anchor='left'
        open={open}
        sx={(theme) => ({
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            zIndex: theme.zIndex.drawer + 1,
            position: 'fixed',
            boxShadow: '4px 0 12px rgba(0,0,0,0.18)',
            transition: theme.transitions.create(['transform'], {
              easing: theme.transitions.easing.easeInOut,
              duration: '300ms',
            }),
          },
        })}
      >

        
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center' ,
          gap:2}}>
            
          <Avatar
            onClick={() => handleEditUser({ name: userName, email: userEmail })}
            sx={{ 
              width: 70, 
              height: 70, 
              mb: 1, 
              bgcolor: theme.palette.primary.main,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              }
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" noWrap>{userName}</Typography>
            <Typography variant="body2" color="text.secondary" noWrap>{userEmail}</Typography>
          </Box>

        </Box>
        <Divider />

        
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <List>
            {mainMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton  to={item.path} onClick={handleDrawerClose}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

       
        <Box sx={{ marginTop: 'auto', pt: 1 }}>
          <Divider />
          <List>
            {footerMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton to={item.path} onClick={handleDrawerClose}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Typography variant="caption" color="text.secondary" sx={{ p: 1, display: 'block', textAlign: 'center' }}>
            v1.0.0
          </Typography>
        </Box>
      </Drawer>


      {open && (
        <Box
          onClick={handleDrawerClose}
          sx={(theme) => ({
            position: 'fixed',
            left: drawerWidth,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
            zIndex: theme.zIndex.drawer,
          })}
        />
      )}

      
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.easeInOut,
            duration: '300ms',
          }),
          marginLeft: open ? `${drawerWidth}px` : 0,
        })}
      >
        
        <DrawerHeader />
        {children}

      </Box>

      <EditUser
        open={editUserOpen}
        initialUser={selectedUser}
        onClose={handleCloseEditUser}
        onSave={handleSaveUser}
      />

    </Box>
  );
}

export default DrawerLayout;