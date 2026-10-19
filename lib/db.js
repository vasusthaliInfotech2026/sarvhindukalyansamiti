import fs from "fs";
import path from "path";
import { CAMPAIGNS } from "./data";

const FILE = path.join(process.cwd(), "data", "db.json");

export function readDonations() {
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")).donations || []; } catch { return []; }
}
export function writeDonations(donations) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify({ donations }, null, 2));
}
// Sirf verified (Success) donations se campaign ki raashi aur supporters nikalte hain
export function getCampaigns() {
  const ok = readDonations().filter((d) => d.status === "Success");
  return CAMPAIGNS.map((c) => {
    const mine = ok.filter((d) => d.campaign === c.id);
    return { ...c, raised: c.raised + mine.reduce((a, d) => a + d.amount, 0), supporters: c.supporters + mine.length };
  });
}