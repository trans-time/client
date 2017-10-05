export default function fixNumber(number) {
  if (number % 1 < 0.01) return Math.floor(number);
  else if (number % 1 > 0.99) return Math.ceil(number);
  else return number.toFixed(2);
}
