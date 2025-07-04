class Helper {
    
  static formatUID(number) {
    const paddedNumber = String(number).padStart(6, '0');
    return `UID${paddedNumber}`;
  }

  static formatMID(number) {
    const paddedNumber = String(number).padStart(6, '0');
    return `MID${paddedNumber}`;
  }
  static discount(totalAmount,discount){
    return  (totalAmount * discount / 100).toFixed(2)
  }
  static point(totalAmount){
    return Math.ceil(totalAmount/20)
  }
  static calculateTotalSalesDiscounted(totalAmount, discount) {
    const discountedAmount = this.calculateDiscount(totalAmount, discount);
    return totalAmount - discountedAmount;
  }
}
  
export default Helper;