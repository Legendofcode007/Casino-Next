//import Container from "@mui/material/Container";
//import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
//import ImageListItem from "@mui/material/ImageListItem";
//import ListItemButton from "@mui/material/ListItemButton";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import * as React from 'react';
import { AppBar } from 'react-admin';
import { Box, useMediaQuery, Theme, Stack, CircularProgress } from '@mui/material';
import { Link } from "react-router-dom";

//import Logo from './Logo';

const CustomAppBar = () => {

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const router = useRouter();

  const handleSignout = (e) => {
    e.preventDefault();
    signOut({
      callbackUrl: `${window.location.origin}`
    })
  };

  const isLargeEnough = useMediaQuery<Theme>(theme =>
    theme.breakpoints.up('sm')
  );

  return (
    <Stack direction={"column"}>
      <AppBar color="secondary" elevation={1} alwaysOn={true}>
          <Typography
          flex="1"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
          variant="h6"
          color="inherit"
        >
        관리자
        </Typography>
          

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, marginRight:"10px" }}>
              <Avatar sx={{ width:"27px",height:"27px" }} src={`${process.env.IMAGES_PATH}admin.jpg`} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
              
            <MenuItem onClick={handleCloseUserMenu}>
              <Link href="/"><Typography textAlign="center">Home</Typography></Link>
            </MenuItem>
              
            <MenuItem onClick={handleCloseUserMenu}>
              <a href="#"> <Typography onClick={handleSignout} textAlign="center">Logout</Typography></a>
            </MenuItem>
              
          </Menu>
        </Box>
     </AppBar>

     
    </Stack>
    
  );
};

export default CustomAppBar;
