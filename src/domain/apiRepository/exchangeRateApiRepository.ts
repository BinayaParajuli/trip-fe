import axios from "axios";
import { IExchangeRatesApi } from "@/domain/interfaces/exchangeRateInterface";

// Free, keyless rates updated daily. Their terms ask for a visible "Rates by Exchange Rate API" link (see Footer).
const RATES_URL = "https://open.er-api.com/v6/latest/USD";

export const exchangeRateApiRepository = {
  getUsdRates: async () => {
    try {
      return await axios.get<IExchangeRatesApi>(RATES_URL, { timeout: 5000 });
    } catch (e) {
      throw e;
    }
  },
};
