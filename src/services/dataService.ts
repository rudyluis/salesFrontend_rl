
import { SalesData } from "@/types/salesData";

export const fetchSalesData = async (): Promise<SalesData[]> => {
  const response = await fetch('https://raw.githubusercontent.com/rudyluis/DashboardJS/refs/heads/main/superstore_data.csv');
  
  if (!response.ok) {
    throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`);
  }
  
  const text = await response.text();
  return parseCSV(text);
};

const parseCSV = (csvText: string): SalesData[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const record: any = {};
    
    headers.forEach((header, index) => {
      // Fix header names to match our interface
      let key = header.trim();
      if (key === "Postal Code") key = "PostalCode";
      if (key === "Sub-Category") key = "SubCategory";
      
      // Parse numeric values
      if (["No", "RowID", "Sales", "Quantity", "Discount", "Profit"].includes(key)) {
        record[key] = parseFloat(values[index]);
      } else {
        record[key] = values[index];
      }
    });
    
    return record as SalesData;
  });
};

// Helper to properly parse CSV lines with quoted values
const parseCSVLine = (line: string): string[] => {
  const result = [];
  let currentValue = "";
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(currentValue);
      currentValue = "";
    } else {
      currentValue += char;
    }
  }
  
  result.push(currentValue);
  return result;
};
