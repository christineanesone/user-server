import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {"Copyright © "}
      <Link color="inherit" href="https://bellebabysitters.co.nz/">
        Belle Babysitters Ltd.
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function StickyFooter() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          backgroundColor: "#f5f5f5", 
          textAlign: "center"
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 2 }}>
          </Box>
          <Button
            color="primary"
            href="https://bellebabysitters.co.nz/families-terms-conditions/"
            sx={{ mr: 2, mb: 1 }}
          >
            Families Terms & Conditions
          </Button>
          <Button
            color="primary"
            href="https://bellebabysitters.co.nz/babysitters/current-babysitters-info/"
            sx={{ mr: 2, mb: 1 }}
          >
            Current Babysitters
          </Button>
          <Button
            color="primary"
            href="https://bellebabysitters.co.nz/babysitters/new-babysitters-info/"
            sx={{ mb: 1 }}
          >
            New Babysitters
          </Button>

            <Typography component="footer" variant="body2" color="text.secondary">
              PHONE: 0800 235532 &nbsp;&nbsp;&nbsp;&nbsp;TEXT: 0225 235532 &nbsp;&nbsp;&nbsp;&nbsp;
              EMAIL:{" "}
              <Link color="primary" href="mailto:enquiry@bellebaysitters.co.nz">
                enquiry@bellebaysitters.co.nz
              </Link>
            </Typography>
          <Copyright />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
