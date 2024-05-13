function waterBill(litres) {
    let bill = 0;
    
    if (litres <= 100) {
        bill = litres * 15; 
    } else if (litres <= 200) {
        bill = 100 * 15 + (litres - 100) * 14; 
    } else {
        bill = 100 * 15 + 100 * 14 + (litres - 200) * 12; 
    }
    
    return bill;
}
const litres = 250;
const totalBill = waterBill(litres);
