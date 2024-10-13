import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Form from "./Form";

const LoginPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const primaryLight = theme.palette.primary.light;
  
    return (
        <Box>
          {/* Header */}
          <Box
            width="100%"
            backgroundColor={theme.palette.background.alt}
            p="1rem 6%"
            textAlign="center"
          >
            <Typography
              fontWeight="bold"
              fontSize="32px"
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
          </Box>
    
          {/* Main content area */}
          <Box
            width="50%"
            p="2rem"
            m="2rem auto"
            borderRadius="1.5rem"
            backgroundColor={theme.palette.background.alt}
          >
            <Form />
          </Box>
        </Box>
      );
};

export default LoginPage;