import {
  AppBar,
  Badge,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  Toolbar,
  Typography,
  useTheme,
  MenuItem,
  Avatar,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NotificationsIcon from "@mui/icons-material/Notifications";

const drawerWidth = 240;

// Animation variants
const drawerVariants = {
  open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  closed: {
    x: "-100%",
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const navItemVariants = {
  hover: { scale: 1.02, backgroundColor: "rgba(0, 0, 0, 0.04)" },
  tap: { scale: 0.98 },
};
// Animation variants
const notificationVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 500 },
  },
  exit: { scale: 0.8, opacity: 0 },
};
export const BaseLayout = ({
  navItems,
  logo,
  title = "Dashboard",
  children,
  notifications = [],
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };
  const drawer = (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          boxShadow: "none",
        }}
      >
        <motion.img
          src={logo}
          alt="Company Logo"
          style={{
            maxWidth: "100%",
            height: "auto",
            maxHeight: "60px",
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
      </Box>
      <List sx={{ flexGrow: 1 }}>
        {navItems.map(({ text, path }) => (
          <motion.div
            key={text}
            variants={navItemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <ListItemButton
              onClick={() => navigate(path)}
              selected={location.pathname === path}
            >
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  component: motion.span,
                  initial: { x: -10 },
                  animate: { x: 0 },
                  transition: { type: "spring", stiffness: 300 },
                }}
              />
            </ListItemButton>
          </motion.div>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "white",
          color: "black",
          boxShadow: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Toolbar
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { sm: "none" }, mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              {title}
            </Typography>
          </Box>
          {/* Notification Bell with Badge */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              color="inherit"
              aria-label="notifications"
              onClick={handleNotificationClick}
            >
              <Badge
                badgeContent={notifications.length}
                color="error"
                overlap="circular"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </motion.div>

          {/* Notification Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleNotificationClose}
            onClick={handleNotificationClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <AnimatePresence>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    variants={notificationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <MenuItem
                      sx={{
                        minWidth: "300px",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Avatar src={notification.avatar} />
                      </ListItemIcon>
                      <Box>
                        <Typography variant="body1">
                          {notification.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.message}
                        </Typography>
                      </Box>
                    </MenuItem>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  variants={notificationVariants}
                  initial="initial"
                  animate="animate"
                >
                  <MenuItem>
                    <Typography>No new notifications</Typography>
                  </MenuItem>
                </motion.div>
              )}
            </AnimatePresence>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer with Animation */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              height: "100vh",
              overflow: "hidden",
            },
          }}
        >
          <motion.div
            initial="closed"
            animate={mobileOpen ? "open" : "closed"}
            variants={drawerVariants}
            style={{ height: "100%" }}
          >
            {drawer}
          </motion.div>
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              height: "100vh",
              position: "relative",
              overflow: "hidden",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "100vh",
          overflow: "auto",
          pt: "64px",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            style={{ height: "100%" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};
