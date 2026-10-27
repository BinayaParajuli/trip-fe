import { IExchangeRates, IExchangeRatesApi } from "@/domain/interfaces/exchangeRateInterface";

export const mapExchangeRates = (api: IExchangeRatesApi): IExchangeRates => ({
  base: api.base_code,
  rates: api.rates,
  updatedAt: new Date(api.time_last_update_unix * 1000).toISOString(),
});
