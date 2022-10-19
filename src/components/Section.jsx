import React from 'react';
import { Accordion } from '@mui/material';

export default function Section({ children, index, show, dir, ...props }) {

  return (
    <Accordion
      TransitionProps={{ unmountOnExit: true }}
      expanded={show}
      className={"section " + dir}
      dir={dir}
      {...props}
    >
      {children}
    </Accordion>
  );
};
