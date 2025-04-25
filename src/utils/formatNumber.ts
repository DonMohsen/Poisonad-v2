// utils/formatNumber.ts

export const formatNumberWithCommas = (input: string): string => {
    // Ensure input is a valid number string and remove any non-numeric characters
    if (input==="0"){
      return "0"
    }
    let number = input.replace(/[^0-9]/g, '');
  
    // Drop the last digit from the number
    number = number.slice(0, -1); // Remove the last character
    
    // Format the number with commas (starting from the right)
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  