import { Injectable } from '@nestjs/common';
import { pool } from './database';

@Injectable()
export class UsersService {
  async findAll() {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    return result.rows;
  }

  async create(name: string, email: string) {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email],
    );
    return result.rows[0];
  }

  async update(id: number, name: string, email: string) {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id],
    );
    return result.rows[0];
  }

  async remove(id: number) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id],
    );
    return result.rows[0];
  }
}
