// open.er-api.com /v6/latest/USD
export interface IExchangeRatesApi {
  result: "success" | "error";
  base_code: string;
  time_last_update_unix: number;
  rates: Record<string, number>;
}

export interface IExchangeRates {
  base: string;
  // Units of each currency per 1 USD, e.g. { NPR: 136.2, EUR: 0.92 }.
  rates: Record<string, number>;
  updatedAt: string;
}
