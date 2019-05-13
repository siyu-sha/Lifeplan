import React from "react";
import { Grid, card } from "@material-ui/core";
import MedialCard from "./MedialCard";
import RightCard from "./RightCard";
import LeftCard from "./LeftCard";

export default props => (
  <div style={{ marginTop: 40, padding: 300 }}>
    <Grid container spacing={40}>
      <Grid item xs>
        <card>
          <LeftCard />
        </card>
      </Grid>

      <Grid item xs>
        <MedialCard />
      </Grid>

      <Grid item xs>
        <RightCard />
      </Grid>
    </Grid>
  </div>
);
