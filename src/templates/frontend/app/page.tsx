import { Container, Typography, Box, Button } from "@mui/material";

export default function Home() {
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    my: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "80vh",
                }}
            >
                <Typography variant="h2" component="h1" gutterBottom>
                    Welcome to your Next.js app!
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
                    Created with create-mahdi-app
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, textAlign: "center", maxWidth: 600 }}>
                    This project includes Next.js, React, Material-UI, React Query, Formik, Yup, nuqs, Zustand, and
                    Axios. Start building your amazing app!
                </Typography>
                <Button variant="contained" size="large">
                    Get Started
                </Button>
            </Box>
        </Container>
    );
}
