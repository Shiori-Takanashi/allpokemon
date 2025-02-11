// src/config/apiEndpoints.ts

const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// APIエンドポイントの型定義
interface ApiEndpoints {
  getRequestsGen0: string;
  getRequestsGen8: string;
  getRequestsGen9: string;
}

// APIエンドポイントのオブジェクトを作成
const apiEndpoints: ApiEndpoints = {
  getRequestsGen0: `${API_BASE_URL}/national-pokemon`,
  getRequestsGen8: `${API_BASE_URL}/galar-pokemon`,
  getRequestsGen9: `${API_BASE_URL}/paldea-pokemon`,
};

export default apiEndpoints;
