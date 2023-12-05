import React from 'react';
import { Group } from '@mantine/core';
import { Ctx } from './store';
import KmdIn from './KmdIn';
import KmdOut from './KmdOut';
import useStyle from './Kmd.styles';
import { Text } from '@mantine/core';

export default function Index() {
  const [content, setContent] = React.useState('');
  const { classes } = useStyle(undefined, { name: 'Kmd' });

  return (
    <Ctx.Provider value={{
      docText: content,
      onDocTextChange: (val: string) => {
        setContent(val);
      },
    }}
    >
      
      {/* left label code and right output code */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text size="xl" weight={700}>Markdown Code</Text>
        <Text size="xl" weight={700}>Output</Text>
      </div>
      <br></br>
      <Group className={classes.wrapper} spacing={0} align="flex-start" position="apart" noWrap>
        {/* Label for Markdown Code */}

        <KmdIn />

        {/* Space between KmdIn and KmdOut */}
        <div style={{ width: '20px' }}></div> {/* Adjust width as needed */}

        <KmdOut />

        {/* Label for Output */}

      </Group>

    </Ctx.Provider>
  );
}
