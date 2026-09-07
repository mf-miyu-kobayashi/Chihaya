'use client';

import { DataGrid, type GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'name', headerName: '名前', width: 150 },
  { field: 'age', headerName: '年齢', width: 100 },
  { field: 'job', headerName: '出身', width: 100 },
];

const rows = [
  { id: 1, name: '大石陽菜', age: 22, job: '静岡県' },
  { id: 2, name: '小林美柚', age: 24, job: '愛知県' },
  { id: 3, name: '田内柊伍', age: 22, job: '埼玉県' },
  { id: 4, name: '徳川朱音', age: 23, job: '東京都' },
  { id: 5, name: '中島遼太郎', age: 24, job: '東京都' },
  { id: 6, name: '中出陽愛', age: 22, job: '岐阜県' },
];

export default function DataGridPage() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}