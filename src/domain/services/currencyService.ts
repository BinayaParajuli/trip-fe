import { currencies } from "@/config/currency";
import { exchangeRateApiRepository } from "@/domain/apiRepository/exchangeRateApiRepository";
import { IExchangeRates } from "@/domain/interfaces/exchangeRateInterface";
import { mapExchangeRates } from "@/domain/mappers/exchangeRateMapper";

export const currencyService = {
  // Rates for the currencies we offer, or null if the rates API is down — prices then stay in USD.
  getUsdRates: async (): Promise<IExchangeRates | null> => {
    try {
      const res = await exchangeRateApiRepository.getUsdRates();
      if (res.data.result !== "success") return null;
      const rates = mapExchangeRates(res.data);
      return {
        ...rates,
        rates: Object.fromEntries(currencies.filter((c) => rates.rates[c]).map((c) => [c, rates.rates[c]])),
      };
    } catch {
      return null;
    }
  },
};
