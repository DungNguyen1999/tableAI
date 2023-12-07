import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DashboardLayout from '../../../layouts/dashboard';
import LevelBetWrapper from './style';

LevelBet.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

interface ConfigLevelBet {
  ID: number;
  Currency: string;
  LevelBet: number;
  MinBet: number;
  MaxBet: number;
  Balance: number;
  Status: number;
  CreatedAt: string;
  UpdatedAt: string;
}

function LevelBet() {
  const [levelBetsData, setLevelBetsData] = useState<ConfigLevelBet[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [editedValues, setEditedValues] = useState<{
    [key: string]: { [key: number]: Partial<ConfigLevelBet> };
  }>({});

  useEffect(() => {
    axios
      .post(
        'http://192.168.5.102:4003/cms/cms_get_level_bets',
        { page: 0, size: 40 },
        {
          headers: {
            Accept: 'application/json, text/plain, */*, application/msn.api.v1+json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        const { data } = response.data;
        setLevelBetsData(data);
        const uniqueCurrencies: string[] = Array.from(
          new Set(data.map((item: ConfigLevelBet) => item.Currency))
        );
        setCurrencies(uniqueCurrencies);
      });
  }, []);

  const handleEdit = (
    currency: string,
    levelBet: number,
    field: string,
    value: string | number
  ) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      [currency]: {
        ...prevValues[currency],
        [levelBet]: {
          ...prevValues[currency]?.[levelBet],
          [field]: value,
        },
      },
    }));
  };

  const renderCurrencyRows = (currency: string) => {
    const currencyData = levelBetsData.filter((item) => item.Currency === currency);

    return (
      <React.Fragment key={`currency-${currency}`}>
        <TableRow key={`currency-${currency}`}>
          <TableCell rowSpan={3}>{currency}</TableCell>
          <TableCell>Min Bet</TableCell>
          {[1, 2, 3, 4, 5].map((level) => (
            <TableCell key={`minBet-${currency}-${level}`}>
              <input
                type="number"
                value={
                  editedValues[currency]?.[level]?.MinBet !== undefined
                    ? editedValues[currency]?.[level]?.MinBet
                    : currencyData.find((item) => `${item.LevelBet}` === `${level}`)?.MinBet || ''
                }
                onChange={(e) => handleEdit(currency, level, 'MinBet', e.target.value)}
              />
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Max Bet</TableCell>
          {[1, 2, 3, 4, 5].map((level) => (
            <TableCell key={`maxBet-${currency}-${level}`}>
              <input
                type="number"
                value={
                  editedValues[currency]?.[level]?.MaxBet !== undefined
                    ? editedValues[currency]?.[level]?.MaxBet
                    : currencyData.find((item) => `${item.LevelBet}` === `${level}`)?.MaxBet || ''
                }
                onChange={(e) => handleEdit(currency, level, 'MaxBet', e.target.value)}
              />
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Balance</TableCell>
          {[1, 2, 3, 4, 5].map((level) => (
            <TableCell key={`balance-${currency}-${level}`}>
              {currencyData.find((item) => `${item.LevelBet}` === `${level}`)?.Balance}
            </TableCell>
          ))}
        </TableRow>
      </React.Fragment>
    );
  };

  const updateBetValues = (id: number, minBet: number, maxBet: number) => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('Access token not found.');
      return;
    }
    const convertedMinBet: number = Number(minBet);
    const convertedMaxBet: number = Number(maxBet);

    axios
      .post(
        'http://192.168.5.102:4003/cms/cms_update_level_bets',
        { id, min_bet: convertedMinBet, max_bet: convertedMaxBet },
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        console.log('Update successful:', response.data);
      })
      .catch((error) => {
        console.error('Update failed:', error);
      });
  };

  const handleUpdate = () => {
    let shouldUpdate = true;

    Object.keys(editedValues).forEach((currency: string) => {
      Object.keys(editedValues[currency]).forEach((levelKey: string) => {
        const level = parseInt(levelKey, 10);
        const minBet = editedValues[currency][level]?.MinBet;
        const maxBet = editedValues[currency][level]?.MaxBet;

        if (typeof minBet !== 'undefined' || typeof maxBet !== 'undefined') {
          const parsedMinBet = typeof minBet === 'string' ? parseFloat(minBet) : minBet;
          const parsedMaxBet = typeof maxBet === 'string' ? parseFloat(maxBet) : maxBet;

          if (parsedMinBet !== undefined && parsedMaxBet !== undefined) {
            if (parsedMinBet >= parsedMaxBet) {
              shouldUpdate = false;
              alert('Min Bet phải nhỏ hơn Max Bet.');
            }
          }
          if (shouldUpdate) {
            updateBetValues(level, parsedMinBet as number, parsedMaxBet as number);
          }
        }
      });
    });
  };

  return (
    <LevelBetWrapper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>Currency</TableCell>
              <TableCell>Level 1</TableCell>
              <TableCell>Level 2</TableCell>
              <TableCell>Level 3</TableCell>
              <TableCell>Level 4</TableCell>
              <TableCell>Level 5</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currencies.map((currency) => (
              <React.Fragment key={`currency-${currency}`}>
                {renderCurrencyRows(currency)}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={handleUpdate}>
        Update
      </Button>
    </LevelBetWrapper>
  );
}

export default LevelBet;
