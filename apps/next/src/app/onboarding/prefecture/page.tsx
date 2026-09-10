"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

// NestJS 側（apps/api）が待ち受けているアドレス
const API_BASE_URL = "http://localhost:3001";

// controller が返す JSON の形。service の Prefecture 型と揃えておく
type Prefecture = {
  id: number;
  name: string;
  capital: string;
};

export default function PrefecturesPage() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPrefectures = async () => {
    setError("");
    setLoading(true);

    try {
      // GET /prefectures = controller の @Get() が受け取る
      const response = await fetch(`${API_BASE_URL}/prefectures`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data: Prefecture[] = await response.json();
      setPrefectures(data);
    } catch {
      setError("データを取得できませんでした。APIが起動しているか確認してください");
      setPrefectures([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        都道府県一覧
      </Typography>

      <Typography sx={{ mb: 2 }}>
        ボタンを押すと、API から都道府県のデータを取得して表示します。
      </Typography>

      <Button variant="contained" onClick={fetchPrefectures} disabled={loading}>
        {loading ? "取得中…" : "データを取得"}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2, maxWidth: 480 }}>
          {error}
        </Alert>
      )}

      {prefectures.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3, maxWidth: 480 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>都道府県</TableCell>
                <TableCell>県庁所在地</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prefectures.map((prefecture) => (
                <TableRow key={prefecture.id}>
                  <TableCell>{prefecture.id}</TableCell>
                  <TableCell>{prefecture.name}</TableCell>
                  <TableCell>{prefecture.capital}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
