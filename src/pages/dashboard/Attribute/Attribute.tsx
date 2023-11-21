import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import DashboardLayout from '../../../layouts/dashboard';
import { AttributeWrapper } from './style';

// ----------------------------------------------------------------------

Attribute.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function Attribute() {
  const configAttribute = [
    {
      section: 'STT',
    },
    {
      section: 'User name',
    },
    {
      section: 'Email',
    },
    {
      section: 'Currency',
    },
    {
      section: 'Level',
    },
    {
      section: 'Bet type',
    },
    {
      section: 'Start time',
    },
    {
      section: 'End time',
    },
  ];

  return (
    <AttributeWrapper maxWidth="lg">
      <Typography variant="h2">Attribute AI Crash game</Typography>

      <Box className="attribute-content">
        {configAttribute.map((section) => (
          <Table key={section.section} aria-label={section.section}>
            <TableHead>
              <TableRow>
                <TableCell variant="head">{section.section}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody />
          </Table>
        ))}
      </Box>
    </AttributeWrapper>
  );
}
