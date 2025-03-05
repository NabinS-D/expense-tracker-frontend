import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import { useAuth } from "../Hooks/useAuth";

const drawerWidth = 260;

const menuItems = [
  { text: "Dashboard", path: "/app/dashboard", icon: "📊" },
  { text: "Category", path: "/app/category", icon: "📋" },
  { text: "Expense", path: "/app/expense", icon: "💸" },
  { text: "Budget", path: "/app/budget", icon: "💰" },
];

export const ResponsiveDrawer = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const routeTitles = {
    "/app/dashboard": `Greetings ${user}!`,
    "/app/category": "Categories",
    "/app/expense": "Expense Tracking",
    "/app/budget": "Budget Planning",
    "/app/category-details": "Category Insights",
  };

  const currentTitle = routeTitles[location.pathname] || "404 - Page Not Found";

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const listItemVariants = {
    hover: { scale: 1.05, x: 10, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const drawerContent = (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <img
          src="/NaaApp.png"
          alt="FinancePro Logo"
          style={{ height: 40, marginRight: 10 }}
        />
        <Typography
          variant="h6"
          sx={{ color: "white", fontWeight: 700, letterSpacing: 2 }}
        >
          FinancePro
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <motion.div
            key={item.text}
            variants={listItemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <ListItem
              disablePadding
              sx={{
                mx: 2,
                mb: 1,
                borderRadius: 2,
                bgcolor:
                  location.pathname === item.path
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <ListItemButton onClick={handleDrawerToggle}>
                <Link
                  to={item.path}
                  style={{
                    textDecoration: "none",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  <Typography sx={{ mr: 2 }}>{item.icon}</Typography>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      letterSpacing: 0.5,
                    }}
                  />
                </Link>
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "primary.main",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }} // Hamburger menu on mobile
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            sx={{
              fontWeight: 600,
              letterSpacing: 1,
              color: "white",
              fontSize: { xs: "1.25rem", sm: "1.5rem" }, // Smaller on mobile
            }}
          >
            {currentTitle}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{
              borderRadius: 20,
              textTransform: "none",
              px: { xs: 2, sm: 3 },
              py: 1,
              fontWeight: 500,
              fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Adjust font size
              "&:hover": {
                bgcolor: "secondary.dark",
                transform: "translateY(-2px)",
                transition: "all 0.2s",
              },
            }}
          >
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer (Temporary) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better performance on mobile
          sx={{
            display: { xs: "block", sm: "none" }, // Visible only on mobile
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "linear-gradient(135deg, #6B48FF 0%, #FF6B6B 100%)",
              borderRight: "none",
              boxShadow: "2px 0 15px rgba(0,0,0,0.1)",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer (Permanent) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" }, // Visible only on desktop
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "linear-gradient(135deg, #6B48FF 0%, #FF6B6B 100%)",
              borderRight: "none",
              boxShadow: "2px 0 15px rgba(0,0,0,0.1)",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          p: { xs: 2, sm: 4 }, // Reduced padding on mobile
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          background: `linear-gradient(${alpha(
            theme.palette.primary.main,
            0.2
          )}, ${alpha(theme.palette.primary.main, 0.3)}), url('/tracker.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        })}
      >
        <Toolbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </Box>
    </Box>
  );
};
