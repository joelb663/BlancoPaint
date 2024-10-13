import React from 'react';
import { Box, ImageListItem, Typography, Grid } from '@mui/material';

const PaintingService = ({ category, services }) => (
    <Box className="service-box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontSize: '2rem', color: 'primary.main' }}>{category}</Typography>
        <ul style={{ listStylePosition: 'inside', padding: 0 }}>
            {services.map((service, index) => (
                <li key={index} style={{ margin: 0 }}>
                    <Typography sx={{ fontSize: '1.5rem', display: 'inline' }}>{service}</Typography>
                </li>
            ))}
        </ul>
    </Box>
);

const ImageGallery = () => {
    const images = [
        {
            src: `${process.env.PUBLIC_URL}/images/photo1.jpeg`,
            alt: 'Photo 1',
        },
        {
            src: `${process.env.PUBLIC_URL}/images/photo2.jpeg`,
            alt: 'Photo 2',
        },
        {
            src: `${process.env.PUBLIC_URL}/images/photo3.jpeg`,
            alt: 'Photo 3',
        },
        {
            src: `${process.env.PUBLIC_URL}/images/photo4.jpeg`,
            alt: 'Photo 4',
        },
        {
            src: `${process.env.PUBLIC_URL}/images/photo5.jpeg`,
            alt: 'Photo 5',
        },
        {
            src: `${process.env.PUBLIC_URL}/images/photo6.jpeg`,
            alt: 'Photo 6',
        },
        {
            src: `${process.env.PUBLIC_URL}/images/photo7.jpeg`,
            alt: 'Photo 7',
        },
        {
            src: `${process.env.PUBLIC_URL}/images/photo8.jpeg`,
            alt: 'Photo 8',
        },
    ];

    const paintingServices = [
        {
            category: "Interior Painting",
            services: [
                "Walls, ceilings, and trim",
                "Room makeovers and accent walls",
                "Kitchen and bathroom cabinetry painting",
                "Custom color matching"
            ]
        },
        {
            category: "Exterior Painting",
            services: [
                "Siding, shutters, and doors",
                "Deck and fence painting",
                "Soffit and fascia",
                "Exterior surface preparation (cleaning, sanding)",
                "Weatherproofing and sealing"
            ]
        },
        {
            category: "Commercial Painting",
            services: [
                "Office spaces",
                "Retail environments",
                "Industrial buildings",
            ]
        },
        {
            category: "Specialty Finishes",
            services: [
                "Chalkboard and whiteboard paint applications",
                "Decorative wall stenciling",
                "Metallic finishes"
            ]
        },
        {
            category: "Surface Preparation",
            services: [
                "Power washing",
                "Sanding and scraping",
                "Caulking and priming",
                "Applying moisture barriers"
            ]
        },
        {
            category: "Color Consultation",
            services: [
                "Guidance on color schemes",
                "Sample boards and mock-ups",
                "Advising on trends and timeless styles"
            ]
        },
        {
            category: "Touch-Up and Repair",
            services: [
                "Small repairs and patching",
                "Touch-up work after moving furniture",
                "Matching paint for existing colors",
                "Filling nail holes and minor dents",
                "Cleaning and refreshing high-traffic areas"
            ]
        },
        {
            category: "Staining and Varnishing",
            services: [
                "Wood furniture and cabinetry",
                "Applying protective finishes to wood",
                "Color matching and blending stains",
                "Sealing and weatherproofing outdoor furniture"
            ]
        }
    ];

    return (
        <Grid container spacing={4} sx={{ mt: 2 }}>
            {images.map((image, index) => (
                <React.Fragment key={index}>
                    {index % 2 === 0 ? ( // For even indices, display the image first
                        <>
                            <Grid item xs={12} sm={6} md={6}>
                                <ImageListItem>
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </ImageListItem>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <PaintingService category={paintingServices[index].category} services={paintingServices[index].services} />
                            </Grid>
                        </>
                    ) : ( // For odd indices, display the service text box first
                        <>
                            <Grid item xs={12} sm={6} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <PaintingService category={paintingServices[index].category} services={paintingServices[index].services} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <ImageListItem>
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </ImageListItem>
                            </Grid>
                        </>
                    )}
                </React.Fragment>
            ))}
        </Grid>
    );
};

export default ImageGallery;