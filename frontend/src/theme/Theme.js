import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

export default function Theme() {
  return (
    <div className="App" style={{ background: "#97c7ef" }}>
      <Grid container spacing={24} justify="center" alignItems="center">
        <Grid item xs={11}>
          <Card>
            <CardContent>
              <div>
                <Typography component="h2" variant="h1" gutterBottom>
                  h1. Montserrat font test
                </Typography>
                <Typography variant="h2" gutterBottom>
                  h2. Heading
                </Typography>
                <Typography variant="h3" gutterBottom>
                  h3. Heading
                </Typography>
                <Typography variant="h4" gutterBottom>
                  h4. Heading
                </Typography>
                <Typography variant="h5" gutterBottom>
                  h5. Heading
                </Typography>
                <Typography variant="h6" gutterBottom>
                  h6. Heading
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing
                  elit. Quos blanditiis tenetur
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing
                  elit. Quos blanditiis tenetur
                </Typography>
                <Typography variant="body1" gutterBottom>
                  body1. Lorem ipsum dolor sit amet, consectetur adipisicing
                  elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum
                  inventore consectetur, neque doloribus, cupiditate numquam
                  dignissimos laborum fugiat deleniti? Eum quasi quidem
                  quibusdam.
                </Typography>
                <Typography variant="body2" gutterBottom>
                  body2. Lorem ipsum dolor sit amet, consectetur adipisicing
                  elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum
                  inventore consectetur, neque doloribus, cupiditate numquam
                  dignissimos laborum fugiat deleniti? Eum quasi quidem
                  quibusdam.
                </Typography>
                <Typography variant="button" gutterBottom>
                  button text
                </Typography>
                <Typography variant="caption" gutterBottom>
                  caption text
                </Typography>
                <Typography variant="overline" gutterBottom>
                  overline text
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={11}>
          <Card>
            <CardContent>
              <div>
                <Button variant="contained" color="primary">
                  Primary
                </Button>
                <Button variant="contained" color="secondary">
                  Secondary
                </Button>
              </div>
              <div>
                <Button variant="outlined" color="primary">
                  Primary
                </Button>
                <Button variant="outlined" color="secondary">
                  Secondary
                </Button>
              </div>
              <div>
                <Button color="primary">Primary</Button>
                <Button color="secondary">Secondary</Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
