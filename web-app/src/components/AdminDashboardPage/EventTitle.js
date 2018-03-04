import React from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

const styles = {
  itemTitle: {
    fontWeight: 'bold',
  },
};


const EventTitle = ({ name, code }) => (
  <Grid container>
    <Grid item>
      <Typography style={styles.itemTitle}>{name}</Typography>
    </Grid>
    <Grid item>
      <Typography>#{code}</Typography>
    </Grid>
  </Grid>
);

export default EventTitle;
