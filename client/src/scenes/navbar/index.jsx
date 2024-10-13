import React from "react";
import {
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import AvailabilityEntry from "components/AvailabilityEntry";

const Navbar = () => {
  // Hooks for dispatch, navigation, and theme
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedInUserId = useSelector((state) => state.userId);
  const isAdmin = useSelector((state) => state.isAdmin);

  // Extract theme and palette
  const theme = useTheme();
  const dark = theme.palette.neutral.dark;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  return (
    <FlexBetween padding="0.75rem 5%" backgroundColor={alt}>
      <FlexBetween gap="1.5rem">
        {/* Logo */}
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          Blanco Paint
        </Typography>
      </FlexBetween>

      {/* Search and icons section */}
      <FlexBetween gap="1.5rem">
        {loggedInUserId ? (
          <>
            {/* Profile management (only show if not admin) */}
            {!isAdmin && (
              <IconButton onClick={() => navigate(`/editProfile/${loggedInUserId}`)}>
                <ManageAccountsIcon fontSize="large" sx={{ color: dark }} />
              </IconButton>
            )}

            {/* Schedule management (only if user isAdmin) */}
            {isAdmin && <AvailabilityEntry />}

            {/* Logout */}
            <IconButton onClick={() => dispatch(setLogout())}>
              <LogoutIcon fontSize="large" sx={{ color: dark }} />
            </IconButton>
          </>
        ) : (
          // If not logged in, show login button
          <IconButton  onClick={() => navigate("/login")}>
            <LoginIcon fontSize="large" sx={{ color: dark }} />
          </IconButton>
        )}
      </FlexBetween>
    </FlexBetween>
  );
};

export default Navbar;