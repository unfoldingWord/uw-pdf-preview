import React, { useEffect } from 'react';
import { Accordion } from '@mui/material';

export default function Section({ children, index, show, dir, verbose, ...props }) {

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
