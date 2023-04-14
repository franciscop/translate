// Relevant ISO: ISO 639-1 & ISO 639-2. Google uses the ISO 639-1.
// Valid ISO 639-1 codes
// https://www.loc.gov/standards/iso639-2/php/code_list.php
// Extract these with this code (after loading https://www.npmjs.com/package/superdom )
// [...dom.table[1].querySelectorAll('tbody tr')].slice(1).filter(row => !/^\s*$/.test(row.querySelector('td:nth-child(2)').textContent)).map((row, i) => `"${row.querySelector('td:nth-child(2)').textContent}", ${i % 12 === 11 ? '\n' : ''}`).join('');

// ISO-639-2 list is THE SAME as the values of ISO-639-1 (sorted)
// so we don't need to include both lists!
import iso from "./iso";
const isoKeys = Object.values(iso).sort();

// Extract these with this code (after loading https://www.npmjs.com/package/superdom ) + a lot of manual clean up
// [...dom.table[1].querySelectorAll('tbody tr')].slice(1).filter(row => !/^\s*$/.test(row.querySelector('td:nth-child(2)').textContent)).map(row =>
//   `  "${row.querySelector('td:nth-child(3)').textContent.toLowerCase()}": "${row.querySelector('td:nth-child(2)').textContent.toLowerCase()}",`
// ).join('\n');
import names from "./names";

// Language parser
//   @name: a string to be parsed
//   @output: the normalized language string
export default (name) => {
  // Validate the name string
  if (typeof name !== "string") {
    throw new Error(`The "language" must be a string, received ${typeof name}`);
  }
  // Possible overflow errors
  if (name.length > 100) {
    throw new Error(`The "language" is too long at ${name.length} characters`);
  }

  // Let's work with lowercase for everything
  name = name.toLowerCase();

  // Pass it through several possible maps to try to find the right one
  name = names[name] || iso[name] || name;

  // Make sure we have the correct name or throw
  if (!isoKeys.includes(name)) {
    throw new Error(`The language "${name}" is not part of the ISO 639-1`);
  }
  return name;
};
