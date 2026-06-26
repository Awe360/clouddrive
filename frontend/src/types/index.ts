export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface FileRecord {
  id: number;
  user_id: number;
  filename: string;
  s3_key: string;
  size_bytes: number;
  mime_type: string;
  uploaded_at: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface FileStats {
  count: number;
  total_bytes: number;
}
