import React from "react";
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

function TitleDivider({children}){
  return <>
    <Divider component="li" />
    <li>
      <Typography
        color="textSecondary"
        display="block"
        variant="caption"
      >
        {children}
      </Typography>
    </li> 
  </>
}

export default TitleDivider