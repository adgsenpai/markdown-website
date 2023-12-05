import React, { useEffect } from 'react';
import { Box, ScrollArea } from '@mantine/core';
import { useEventListener } from '@mantine/hooks';
import { useCtx } from './store';
import useStyles from './Kmd.styles';

const DefaultDocContent = `# Welcome to ADGSTUDIOS Markdown Editor
You may write markdown here and see the result on the right side.
`;

export default function KmdIn() {
  const { classes } = useStyles(undefined, { name: 'Kmd' });
  const { docText, onDocTextChange } = useCtx();
  

  const ref = useEventListener('input', (ev) => {
    // @ts-ignore
    onDocTextChange(ev.currentTarget?.innerText);    
  });

  // eventlistener if input is changed dynamically by file open
  // @ts-ignore
  useEventListener('docTextChange', (ev) => {
    // @ts-ignore
    onDocTextChange(ev.currentTarget?.innerText);    
  });


  const derivedContent = docText || DefaultDocContent;

  useEffect(() => {
    ref.current.innerText = derivedContent;
    onDocTextChange(derivedContent);        
  }, []);

  return (

    <ScrollArea className={classes.scrollIn}>
      <Box
        id="kmd-in"
        className={classes.in}
        ref={ref}
        contentEditable
      >
      </Box>



    </ScrollArea>
  );
}
