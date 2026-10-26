// Business details shown across the site.
// TODO: replace the placeholder contact details before launch.
export const siteConfig = {
  name: "Royal Himalaya Experiences",
  tagline: "Mountain treks, living culture and wild places in Nepal",
  email: "hello@himalayasvows.com",
  whatsappNumber: "9779800000000", // international format, digits only
  phoneDisplay: "+977 980-0000000",
  address: "Thamel, Kathmandu, Nepal",
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
