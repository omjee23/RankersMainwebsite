/**
 * CSV Generation & Parsing utilities for Excel reports and question bulk imports
 */

function jsonToCsv(data = [], headers = []) {
  if (!data || data.length === 0) {
    return headers.map(h => `"${h}"`).join(',') + '\n';
  }

  const keys = headers.length > 0 ? headers : Object.keys(data[0]);
  const headerRow = keys.map(k => `"${k}"`).join(',');

  const rows = data.map(item => {
    return keys.map(k => {
      const val = item[k] !== undefined && item[k] !== null ? String(item[k]) : '';
      // Escape double quotes
      return `"${val.replace(/"/g, '""')}"`;
    }).join(',');
  });

  return [headerRow, ...rows].join('\n');
}

function csvToJson(csvText = '') {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].trim();
    if (!currentLine) continue;

    // Simple CSV row parser handling quotes
    const values = [];
    let insideQuote = false;
    let entry = '';

    for (let charIndex = 0; charIndex < currentLine.length; charIndex++) {
      const char = currentLine[charIndex];
      if (char === '"' || char === "'") {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        values.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    values.push(entry.trim());

    const obj = {};
    headers.forEach((h, index) => {
      obj[h] = values[index] ? values[index].replace(/^["']|["']$/g, '') : '';
    });
    results.push(obj);
  }

  return results;
}

module.exports = {
  jsonToCsv,
  csvToJson
};
