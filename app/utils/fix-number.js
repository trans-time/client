export default function fixNumber(number) {
  if (number % 1 < 0.01) return Math.floor(number);
  else if (number % 1 > 0.99) return Math.ceil(number);
  else {
    const string = number.toFixed(2);

    return string.charAt(string.length - 1) === '0' ? string.substr(0, string.length - 1) : string;
  }
}
