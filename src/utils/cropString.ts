export const cropString = (str = '', maxLength = 12) => str.length > maxLength
    ? `${str.slice(0, maxLength)}...`
    : str;