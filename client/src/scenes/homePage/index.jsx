import { Box, Tabs, Tab, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import Calendar from "components/Calander";
import { setSelectedTab } from "state";
import ImageGallery from "components/ImageGallery";

const HomePage = () => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.selectedTab);

  const handleTabChange = (event, newValue) => {
    dispatch(setSelectedTab(newValue));
  };

  return (
    <Box>
      <Navbar />

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Services" />
          <Tab label="Schedule a Quote" />
          <Tab label="Contact Us" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={selectedTab} index={0}>
        <Typography variant="h2" gutterBottom align="center">
          Services
        </Typography>

        {/* Image Gallery */}
        <ImageGallery /> {/* Use the new ImageGallery component */}

      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <Typography variant="h2" gutterBottom align="center">
          Schedule a Quote
        </Typography>
        <Calendar />
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <Typography variant="h2" gutterBottom align="center">
          Contact Us
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="h3">
            If you have any questions or would like to get in touch, please contact us at:
          </Typography>
          <Typography variant="h3" sx={{ mt: 1 }}>
            Email: contact@blancopaint.com
          </Typography>
          <Typography variant="h3" sx={{ mt: 1 }}>
            Phone: (123) 456-7890
          </Typography>
          <Typography variant="h3" sx={{ mt: 1 }}>
            Address: 123 Main St, YourCity, YourState
          </Typography>
        </Box>
      </TabPanel>
    </Box>
  );
};

// TabPanel Component to Render Content Conditionally
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default HomePage;