"use client";

import { useState } from "react";

const SUNNY_CODES = [0, 1];
const CLOUDY_CODES = [2, 3, 45, 48];
const RAINY_CODES = [
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
];
const SNOWY_CODES = [71, 73, 75, 77, 85, 86];

function toWeatherText(code: number) {
  if (SUNNY_CODES.includes(code)) return "晴れ ☀️";
  if (RAINY_CODES.includes(code)) return "雨 ☔️";
  if (SNOWY_CODES.includes(code)) return "雪 ⛄️";
  return "曇り ☁️";
}

type GeoLocation = {
  prefecture: string;
  city: string;
  town: string;
  x: string;
  y: string;
};

type GeoResponse = {
  response: { location?: GeoLocation[]; error?: string };
};

type ForecastResponse = {
  current: { temperature_2m: number; weather_code: number };
  current_units: { temperature_2m: string };
};

type SearchResult = {
  address: string;
  weatherText: string;
  temperature: number;
  unit: string;
};

export default function Home() {
  const [zipcode, setZipcode] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{7}$/.test(zipcode)) {
      setError("郵便番号は半角数字7桁（ハイフンなし）で入力してください");
      setResult(null);
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const geoResponse = await fetch(
        `https://geoapi.heartrails.com/api/json?method=searchByPostal&postal=${zipcode}`
      );
      if (!geoResponse.ok) throw new Error(`HTTP ${geoResponse.status}`);

      const geoData: GeoResponse = await geoResponse.json();
      const location = geoData.response.location?.[0];

      if (!location) {
        setError("該当する住所が見つかりませんでした");
        return;
      }

      const forecastResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${location.y}&longitude=${location.x}` +
          `&current=temperature_2m,weather_code&timezone=Asia%2FTokyo`
      );
      if (!forecastResponse.ok) throw new Error(`HTTP ${forecastResponse.status}`);

      const forecast: ForecastResponse = await forecastResponse.json();

      setResult({
        address: location.prefecture + location.city + location.town,
        weatherText: toWeatherText(forecast.current.weather_code),
        temperature: forecast.current.temperature_2m,
        unit: forecast.current_units.temperature_2m,
      });
    } catch {
      setError("通信に失敗しました。時間をおいて試してください");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginLeft: "30px", marginTop: "30px" }}>
      <h1>郵便番号で天気検索</h1>

      <p>郵便番号を入力すると、その場所の住所と現在の天気を検索できます。</p>

      <form onSubmit={search}>
        <label htmlFor="zipcode" style={{ display: "block", marginBottom: "8px" }}>
          郵便番号
        </label>

        <input
          id="zipcode"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          placeholder="郵便番号を半角数字7桁で入力(ハイフンなし)"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={7}
          style={{
            width: "320px",
            height: "50px",
            fontSize: "15px",
            padding: "0 15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "200px",
            height: "50px",
            fontSize: "15px",
            marginLeft: "10px",
            backgroundColor: loading ? "#9bc4f5" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "検索中…" : "天気を調べる"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        aria-live="polite"
        style={{
          marginTop: "30px",
          padding: "20px",
          width: "500px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <p>検索結果</p>

        {result ? (
          <>
            <p style={{ fontSize: "20px" }}>{result.address}</p>
            <p style={{ marginTop: "25px" }}>現在の天気</p>
            <p style={{ fontSize: "20px" }}>
              {result.weatherText}　{result.temperature}
              {result.unit}
            </p>
          </>
        ) : (
          <p style={{ color: "#888" }}>郵便番号を入力してください。</p>
        )}
      </div>
    </div>
  );
}