import React from "react";
import {
    AppBar,
    Box,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";

const drawerWidth = 240;
const menuItems = [
    { text: "Dashboard", path: "/app/dashboard" },
    { text: "Category", path: "/app/category" },
    { text: "Expense", path: "/app/expense" },
    { text: "Budget", path: "/app/budget" },
];

export const ResponsiveDrawer = () => {
    const location = useLocation();

    // Map the current route to a dynamic title
    const routeTitles = {
        "/app/dashboard": "Dashboard",
        "/app/category": "Category",
        "/app/expense": "Expense",
        "/app/budget": "Budget",
        "/app/category-details": "Category Detail",
    };

    // Default title if no match is found
    const currentTitle = routeTitles[location.pathname] || "Page Not Found";

    const handleLogout = () => {
        // Remove authentication data (JWT, user info, etc.)
        localStorage.removeItem('authToken'); // Adjust depending on how your auth data is stored
        // Redirect the user to the login page (or home page)
        window.location.href = '/login'; // or use React Router's history.push('/login')
    };
    return (
        <Box sx={{ display: "flex" }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
                        {currentTitle}
                    </Typography>
                    <Button
                        variant="filled"
                        color="primary"
                        type="submit"
                        sx={{ mt: 2 }}
                        onClick={handleLogout}
                    >
                        Log Out
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            background: "linear-gradient(90deg, rgba(131, 58, 180, 1) 0%, rgba(253, 137, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)",
                        },
                    }}
                    open
                >

                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton>
                                    <Link
                                        to={item.path}
                                        style={{
                                            textDecoration: "none",
                                            width: "100%",
                                            color: "black",
                                        }}
                                    >
                                        <ListItemText primary={item.text} />
                                    </Link>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Outlet /> {/* Render child routes here */}
            </Box>
        </Box>
    );
};
