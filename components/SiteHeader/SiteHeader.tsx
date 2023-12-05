import React, { useState } from 'react';
import { createStyles, Header, Menu, Group, Center, Container, ActionIcon, Tooltip, MediaQuery, Drawer, Burger } from '@mantine/core';
import { useBooleanToggle, useMediaQuery } from '@mantine/hooks';
import { ChevronDown, Code, Download, Folder, BrandGithub, File } from 'tabler-icons-react';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Markdoc from '@markdoc/markdoc';


export const DocHeaderHeight = 56;

const useStyles = createStyles((theme) => ({
  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));

interface HeaderSearchProps {
  links: { link: string; label: string; links: { link: string; label: string }[] }[];
}

function saveCode() {
  // Accessing the element by its ID
  const codeElement = document.getElementById('kmd-in') as HTMLElement;

  if (!codeElement) {
    console.error('Element with the specified ID not found.');
    return;
  }

  // Creating a Blob to store the text content
  const codeBlob = new Blob([codeElement.innerText], { type: 'text/plain' });

  // Creating a temporary download link
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(codeBlob);
  downloadLink.download = 'markdown.md';

  // Triggering the download
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Cleaning up: remove the link and release object URL
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadLink.href);
}
const savePDF = () => {
  const divElement = document.getElementById('kmd-out');
  if (!divElement) {
    console.error('Element with ID "kmd-out" not found.');
    return;
  }

  // Function to wait for all images to load
  waitForImagesToLoad(divElement, () => {
    // Define the desired DPI
    const desiredDPI = 500;
    // Calculate the scale factor
    const scaleFactor = desiredDPI / 96;

    // Dimensions of an A4 sheet in pixels at the desired DPI
    const a4Width = 595.28; // A4 width in points (1 pt = 1/72 inch)
    const a4Height = 841.89; // A4 height in points

    // Define margins (in points)
    const margin = 40; // For example, a 40 pt margin
    const contentWidth = a4Width - (margin * 2); // Width after accounting for margins

    html2canvas(divElement, {
      scale: scaleFactor,
      useCORS: true,
      onclone: (clonedDoc) => {
        const clonedImages = clonedDoc.getElementsByTagName('img');
        //@ts-ignore
        for (let img of clonedImages) {
          img.src = img.src;
        }
      }
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      // Scaled dimensions for the image
      const scaledImgHeight = canvas.height * contentWidth / canvas.width;
      let heightLeft = scaledImgHeight;

      let position = 0;

      while (heightLeft >= 0) {
        position = heightLeft - scaledImgHeight;
        pdf.addImage(imgData, 'PNG', margin, position + margin, contentWidth, scaledImgHeight);
        heightLeft -= a4Height;

        if (heightLeft > 0) {
          pdf.addPage();
        }
      }

      pdf.save('output.pdf');
    });
  });
};
// Function to wait until all images in the specified element are fully loaded

function waitForImagesToLoad(element: any, callback: any) {
  const images = element.getElementsByTagName('img');
  let loadedImages = 0;

  if (images.length === 0) {
    callback(); // Execute callback immediately if there are no images
    return;
  }

  for (let img of images) {
    if (img.complete) {
      loadedImages++;
    } else {
      img.onload = () => {
        loadedImages++;
        if (loadedImages === images.length) {
          callback();
        }
      };
      // Handle broken images
      img.onerror = () => {
        loadedImages++;
        if (loadedImages === images.length) {
          callback();
        }
      };
    }
  }

  // Check if all images are already loaded (e.g., from cache)
  if (loadedImages === images.length) {
    callback();
  }
}

const newFile = () => {
  // reload the page
  location.reload();
}

const fileOpen = () => {
  // basically just open the file explorer and then insert text into the editor
  // Accessing the element by its ID
  const codeElement = document.getElementById('kmd-in') as HTMLElement;
  if (!codeElement) {
    console.error('Element with the specified ID not found.');
    return;
  }
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.md';
  input.onchange = (event) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const target = event.target as FileReader;
      const result = target.result as string;
      codeElement.innerText = result;
    };
    reader.readAsText(file);
  };
  input.click();
}



export function SiteHeader({ links }: HeaderSearchProps) {
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles();

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));



    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </a>
    );
  });

  const isMobile = useMediaQuery('(max-width: 768px)');
  const DocHeaderHeight = 60; // Adjust as needed


  return (
    <Header height={DocHeaderHeight}>


      <Group position="apart" noWrap className={classes.inner}>
        <h5 style={{ fontSize: '1.0rem', fontWeight: 'bold' }}>ADGSTUDIOS Markdown Editor</h5>
        <Group noWrap>
          <Tooltip label="New File">
            <ActionIcon
              color="indigo"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.colors.indigo[4] : theme.colors.indigo[6],
              })}
              // eslint-disable-next-line no-restricted-globals
              onClick={() => { newFile(); }}
            >
              <File size={18} />
            </ActionIcon>
          </Tooltip>


          {/* Action icon to open the file explorer */}
          <Tooltip label="Open File">
            <ActionIcon
              color="indigo"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.colors.indigo[4] : theme.colors.indigo[6],
              })}
              // eslint-disable-next-line no-restricted-globals
              onClick={() => { fileOpen(); }}
            >
              <Folder size={18} />
            </ActionIcon>
          </Tooltip>


          <Tooltip label="Open Github Repo">
            <ActionIcon
              color="indigo"

              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.colors.indigo[4] : theme.colors.indigo[6],
              })}
              // eslint-disable-next-line no-restricted-globals
              onClick={() => { location.href = 'https://github.com/adgsenpai/markdown-website'; }}
            >
              <BrandGithub size={18} />
            </ActionIcon>
          </Tooltip>



          {/* Action icon to download the markdown file */}
          <Tooltip label="Download Markdown File">
            <ActionIcon
              color="indigo"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.colors.indigo[4] : theme.colors.indigo[6],
              })}
              // eslint-disable-next-line no-restricted-globals
              onClick={() => { saveCode(); }}
            >
              <Code size={18} />
            </ActionIcon>
          </Tooltip>

          {/* Action icon to download the PDF file */}
          <Tooltip label="Download PDF File">
            <ActionIcon
              color="indigo"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.colors.indigo[4] : theme.colors.indigo[6],
              })}
              // eslint-disable-next-line no-restricted-globals
              onClick={() => { savePDF(); }}
            >
              <Download size={18} />
            </ActionIcon>
          </Tooltip>

          <ColorSchemeToggle />


        </Group>
      </Group>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Menu"
        padding="md"
        size="sm"
      >
        {/* Content for mobile drawer menu */}
        {/* You can place your navigation items here */}
      </Drawer>

    </Header>
  );
}
