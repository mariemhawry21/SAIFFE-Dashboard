
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Box, Button, Typography, Grid } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../store/Slices/authSlice";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    console.log("User from Redux state:", user);
    dispatch(clearError());
    if (isAuthenticated && user) {

     
      const userRole = user.role.toLowerCase(); 
      console.log("User Role (after toLowerCase):", userRole);
      if (userRole === "admin") {
        navigate("/admin", { replace: true });
      } else if (userRole === "doctor") {
        navigate("/doctor", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    dispatch(loginUser(data));
  };

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1fr 1fr",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#18345e",
        }}
      >
        <Box
          component="img"
          src="/Component 8.png"
          alt="Register visual"
          sx={{
            width: "40%",
            height: "38%",
          }}
        />
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ p: 3 }}
      >
        <Box
          maxWidth={500}
          width="100%"
          p={3}
          boxShadow={3}
          borderRadius={2}
          sx={{ mx: 2 }}
        >
          <Typography variant="h5" mb={1} align="center">
            Welcome Back
          </Typography>
          <Typography variant="h6" mb={3} align="center">
            Enter your credentials to login
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Email"
              margin="dense"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message || " "}
            />
            <TextField
              fullWidth
              label="Password"
              margin="dense"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message || " "}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ minHeight: 7, mb: 1 }}>
              {error && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#d32f2f",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {error}
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 0, backgroundColor: "#18345e", color: "white" }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <Box mt={2} textAlign="center">
            <Typography variant="body2" sx={{ mt: 1 }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "gray",
                  fontWeight: "bold",
                }}
              >
                Create an account
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "gray",
                  fontWeight: "bold",
                }}
              >
                Back to Home
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}