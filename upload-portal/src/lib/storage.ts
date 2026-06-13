import fs from "fs";
import path from "path";

const portalsPath = path.join(
  process.cwd(),
  "storage",
  "portals.json"
);

const uploadsPath = path.join(
  process.cwd(),
  "storage",
  "uploads.json"
);

export function getPortals() {
  return JSON.parse(
    fs.readFileSync(portalsPath, "utf-8")
  );
}

export function savePortals(data: any) {
  fs.writeFileSync(
    portalsPath,
    JSON.stringify(data, null, 2)
  );
}

export function getUploads() {
  return JSON.parse(
    fs.readFileSync(uploadsPath, "utf-8")
  );
}

export function saveUploads(data: any) {
  fs.writeFileSync(
    uploadsPath,
    JSON.stringify(data, null, 2)
  );
}
