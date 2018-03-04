import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { CardHeader } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import { ListItem } from 'material-ui/List';
import EventTitle from './EventTitle';

const FOMAT_DATE = 'DD.MM.YYYY';
const styles = {
  cardHeader: {
    width: '100%',
  },
};

const formatDate = date => moment(date).format(FOMAT_DATE);

const EventItem = ({ eventItem }) => (
  <div>
    <Divider />
    <Link
      style={{ textDecoration: 'none' }}
      to={`/admin/event/${eventItem.code}`}
    >
      <ListItem dense button >
        <CardHeader
          style={styles.cardHeader}
          title={<EventTitle {...eventItem} />}
          subheader={<div>{formatDate(eventItem.startDate)} - {formatDate(eventItem.endDate)}</div>}
        />
      </ListItem>
    </Link>
  </div>
);

export default EventItem;
