import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/dashboard';
import ConfigTimeWrapper from './style';

ConfigTimeTable.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

interface ConfigTime {
  ID: number;
  StartTime: string;
  EndTime: string;
  LevelBet: number;
  MinBotRun: number;
  MaxBotRun: number;
  Status: number;
  CreatedAt: string;
  UpdatedAt: string;
  IsActive: boolean;
}

function ConfigTimeTable() {
  const [configTime, setConfigTime] = useState<ConfigTime[]>([]);
  const [editedValues, setEditedValues] = useState<
    Partial<Record<string, { min: string; max: string }>>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'http://192.168.5.102:4003/cms/cms_get_config_times',
          {
            page: 0,
            size: 5,
          },
          {
            headers: {
              Accept: 'application/json, text/plain, */*, application/msn.api.v1+json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
        setConfigTime(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (level: string, type: 'min' | 'max', value: string) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      [level]: {
        ...prevValues[level]!,
        [type]: value,
      },
    }));
  };

  const updateConfigTime = async () => {
    try {
      const keys = Object.keys(editedValues);
      let shouldUpdate = true;

      keys.forEach((level) => {
        const { min, max } = editedValues[level] || { min: '', max: '' };

        if (min !== '' && max !== '' && parseInt(min, 10) >= parseInt(max, 10)) {
          shouldUpdate = false;
          alert('Min phải nhỏ hơn Max.');
        }
      });

      if (shouldUpdate) {
        const updateRequests = keys.map(async (level) => {
          const { min, max } = editedValues[level] || { min: '', max: '' };

          if (min !== '' || max !== '') {
            await axios.post(
              'http://192.168.5.102:4003/cms/cms_update_config_times',
              {
                id: parseInt(level, 10),
                min_bot_run: min !== '' ? parseInt(min, 10) : undefined,
                max_bot_run: max !== '' ? parseInt(max, 10) : undefined,
              },
              {
                headers: {
                  Accept: 'application/json, text/plain, */*, application/msn.api.v1+json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
              }
            );
          }
        });

        await Promise.all(updateRequests);
        alert('Cập nhật thành công');
      }
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const renderLevels = () =>
    configTime.map((levelData) => (
      <TableRow key={`Level-${levelData.LevelBet}`}>
        <TableCell>Level {levelData.LevelBet}</TableCell>
        <TableCell>
          <input
            type="number"
            value={
              editedValues[levelData.LevelBet]?.min !== undefined
                ? editedValues[levelData.LevelBet]?.min
                : levelData.MinBotRun || ''
            }
            onChange={(e) => handleInputChange(`${levelData.LevelBet}`, 'min', e.target.value)}
          />
        </TableCell>
        <TableCell>
          <input
            type="number"
            value={
              editedValues[levelData.LevelBet]?.max !== undefined
                ? editedValues[levelData.LevelBet]?.max
                : levelData.MaxBotRun || ''
            }
            onChange={(e) => handleInputChange(`${levelData.LevelBet}`, 'max', e.target.value)}
          />
        </TableCell>
      </TableRow>
    ));

  return (
    <ConfigTimeWrapper>
      <TableContainer component={Paper} style={{ width: 'fit-content', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Level</TableCell>
              <TableCell>Min</TableCell>
              <TableCell>Max</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderLevels()}</TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={updateConfigTime}>
        Update
      </Button>
    </ConfigTimeWrapper>
  );
}

export default ConfigTimeTable;
