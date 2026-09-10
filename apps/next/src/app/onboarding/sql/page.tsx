"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";


const API_BASE_URL = "http://localhost:3001";


type User = {
  id: number;
  name: string;
  email: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  
  const request = useCallback(async (path: string, init?: RequestInit) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
      ...init,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }, []);


  const reload = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      setUsers(await request("/users"));
    } catch {
      setError("取得に失敗しました。APIとPostgreSQLが起動しているか確認してください");
    } finally {
      setLoading(false);
    }
  }, [request]);

  
  useEffect(() => {
    reload();
  }, [reload]);

  
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      setError("名前とメールアドレスを入力してください");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await request("/users", {
        method: "POST",
        body: JSON.stringify({ name: newName.trim(), email: newEmail.trim() }),
      });
      setNewName("");
      setNewEmail("");
      await reload();
    } catch {
      setError("追加に失敗しました");
      setLoading(false);
    }
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setError("");
  };

  
  const save = async (id: number) => {
    if (!editName.trim() || !editEmail.trim()) {
      setError("名前とメールアドレスを入力してください");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await request(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name: editName.trim(), email: editEmail.trim() }),
      });
      setEditingId(null);
      await reload();
    } catch {
      setError("更新に失敗しました");
      setLoading(false);
    }
  };

  
  const remove = async (user: User) => {
    if (!window.confirm(`「${user.name}」を削除します。よろしいですか？`)) return;

    setError("");
    setLoading(true);
    try {
      await request(`/users/${user.id}`, { method: "DELETE" });
      await reload();
    } catch {
      setError("削除に失敗しました");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        ユーザー管理
      </Typography>

      <Typography sx={{ mb: 3 }}>
        画面の操作がそのまま API 経由で PostgreSQL の users テーブルに反映されます。
      </Typography>

      <Paper sx={{ p: 2, mb: 3, maxWidth: 640 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          新規追加
        </Typography>
        <form onSubmit={create}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <TextField
              label="名前"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              size="small"
            />
            <TextField
              label="メールアドレス"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              size="small"
              sx={{ width: 260 }}
            />
            <Button type="submit" variant="contained" disabled={loading}>
              追加
            </Button>
          </Stack>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2, maxWidth: 640 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle1">一覧（{users.length}件）</Typography>
        <Button onClick={reload} disabled={loading} size="small">
          {loading ? "通信中…" : "再読み込み"}
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ maxWidth: 640 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 60 }}>ID</TableCell>
              <TableCell>名前</TableCell>
              <TableCell>メールアドレス</TableCell>
              <TableCell sx={{ width: 150 }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>

                {editingId === user.id ? (
                  <>
                    <TableCell>
                      <TextField
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        size="small"
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        size="small"
                        variant="standard"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => save(user.id)} disabled={loading}>
                        保存
                      </Button>
                      <Button size="small" onClick={() => setEditingId(null)}>
                        取消
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => startEdit(user)} disabled={loading}>
                        編集
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => remove(user)}
                        disabled={loading}
                      >
                        削除
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  {loading ? "読み込み中…" : "データがありません"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
