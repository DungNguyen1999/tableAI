import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/dashboard';
import ListBotWrapper from './style';

ListBot.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

interface Bot {
  ID: number;
  UserName: string;
  Email: string;
  Currency: string;
  LevelBet: string;
  RiskManagerId: number;
  IsActive: number;
  IsHidden: number;
  UserPlatformId: string;
  initialLevelBet: number;
  initialIsActive: number;
  initialIsHidden: number;
}

function ListBot() {
  const [botData, setBotData] = useState<Bot[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(10);

  const handlePageSizeChange = (event: SelectChangeEvent<string | number>) => {
    const newSize =
      typeof event.target.value === 'string'
        ? parseInt(event.target.value, 10)
        : event.target.value;
    setPageSize(newSize);
    fetchData(0, newSize);
  };

  const fetchData = async (page: number, size: number) => {
    try {
      const response = await axios.post(
        'http://192.168.5.102:4003/cms/cms_get_list_bots',
        { page, size },
        {
          headers: {
            Accept: 'application/json, text/plain, */*, application/msn.api.v1+json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (response && response.data && response.data.data) {
        const botsData = response.data.data.map((bot: Bot) => ({
          ...bot,
          initialLevelBet: bot.LevelBet,
          initialIsActive: bot.IsActive,
          initialIsHidden: bot.IsHidden,
        }));
        setBotData(botsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(0, pageSize);
  }, [pageSize]);

  // CURRENCY

  const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
    setSelectedCurrency(event.target.value);
  };

  // SEARCH

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputSearchTerm = event.target.value.toLowerCase();

    setSearchTerm(inputSearchTerm);
  };

  const filteredBotData = botData.filter(
    (bot) =>
      bot.UserName.toLowerCase().includes(searchTerm) ||
      bot.UserPlatformId.toLowerCase().includes(searchTerm)
  );

  const filteredAndSelectedBotData = selectedCurrency
    ? filteredBotData.filter((bot) => bot.Currency === selectedCurrency)
    : filteredBotData;

  // LEVEL BET

  const handleLevelBetChange = (event: SelectChangeEvent<string>, botId: number) => {
    const selectedLevelBet = event.target.value;

    setBotData((prevBotData) =>
      prevBotData.map((bot) => (bot.ID === botId ? { ...bot, LevelBet: selectedLevelBet } : bot))
    );
  };

  // ACTIVE

  const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>, botId: number) => {
    const updatedBotData = botData.map((bot) =>
      bot.ID === botId ? { ...bot, IsActive: event.target.checked ? 1 : 0 } : bot
    );
    setBotData(updatedBotData);
  };

  // HIDDEN

  const handleHiddenChange = (event: React.ChangeEvent<HTMLInputElement>, botId: number) => {
    const updatedBotData = botData.map((bot) =>
      bot.ID === botId ? { ...bot, IsHidden: event.target.checked ? 1 : 0 } : bot
    );
    setBotData(updatedBotData);
  };

  // UPDATE

  const handleUpdateClick = (botId: number, levelBet: string, isActive: number, isHidden: number) =>
    new Promise((resolve, reject) => {
      const updatedBot = botData.find((bot) => bot.ID === botId);
      if (!updatedBot) {
        reject(new Error('Bot not found'));
        return;
      }

      const dataToUpdate = {
        id: updatedBot.ID,
        level_bet: levelBet,
        is_active: isActive.toString(),
        is_hidden: isHidden.toString(),
      };

      axios
        .post('http://192.168.5.102:4003/cms/cms_update_bots', dataToUpdate, {
          headers: {
            Accept: 'application/json, text/plain, */*, application/msn.api.v1+json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });

  const handleUpdateClickAllBots = () => {
    const updatedBotsPromises = filteredAndSelectedBotData.reduce((promises, bot) => {
      if (
        bot.IsActive !== bot.initialIsActive ||
        bot.IsHidden !== bot.initialIsHidden ||
        String(bot.LevelBet) !== String(bot.initialLevelBet)
      ) {
        const updatePromise = handleUpdateClick(bot.ID, bot.LevelBet, bot.IsActive, bot.IsHidden);
        promises.push(updatePromise);
      }
      return promises;
    }, [] as Promise<any>[]);

    Promise.all(updatedBotsPromises)
      .then((responses) => {
        const success = responses.every((res) => res && res?.status === 200);
        if (success) {
          alert('Cập nhật thành công');
        } else {
          alert('Cập nhật thất bại');
        }
      })
      .catch((error) => {
        console.error('Error updating bots:', error);
        alert('Cập nhật thất bại');
      });
  };

  return (
    <ListBotWrapper>
      <Box className="navbar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <Select
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Select Currency' }}
        >
          <MenuItem value="">
            <em>All Currency</em>
          </MenuItem>
          <MenuItem value="FUN">FUN</MenuItem>
          <MenuItem value="COD">COD</MenuItem>
          <MenuItem value="BTC">BTC</MenuItem>
          <MenuItem value="ETH">ETH</MenuItem>
          <MenuItem value="USDT">USDT</MenuItem>
          <MenuItem value="BNB">BNB</MenuItem>
          <MenuItem value="DOGE">DOGE</MenuItem>
          <MenuItem value="SHIB">SHIB</MenuItem>
        </Select>

        <Box className="nav-size">
          <Typography>Số lượng bot:</Typography>

          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Select Page Size' }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={200}>200</MenuItem>
            <MenuItem value={300}>300</MenuItem>
            <MenuItem value={400}>400</MenuItem>
            <MenuItem value={498}>498</MenuItem>
          </Select>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>UserName</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>UserPlatformId</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>LevelBet</TableCell>
              <TableCell>RiskManagerId</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Hidden</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAndSelectedBotData.map((bot) => (
              <TableRow key={bot.ID}>
                <TableCell>{bot.UserName}</TableCell>
                <TableCell>{bot.Email}</TableCell>
                <TableCell>{bot.UserPlatformId}</TableCell>
                <TableCell>{bot.Currency}</TableCell>
                <TableCell>
                  <Select
                    value={bot.LevelBet}
                    onChange={(event) => handleLevelBetChange(event, bot.ID)}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                    <MenuItem value="5">5</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{bot.RiskManagerId}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={bot.IsActive === 1}
                    onChange={(event) => handleActiveChange(event, bot.ID)}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={bot.IsHidden === 1}
                    onChange={(event) => handleHiddenChange(event, bot.ID)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" onClick={handleUpdateClickAllBots}>
        Update
      </Button>
    </ListBotWrapper>
  );
}

export default ListBot;
