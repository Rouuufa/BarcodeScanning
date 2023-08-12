const button=document.getElementById('submit')
button.addEventListener('click',()=>{
    const barcodeData = document.getElementById('barcodeData').value;
    const barcodeType = document.getElementById('barcodeType').value;
    console.log('Barcode Data:', barcodeData);
    console.log('Barcode Type:', barcodeType);
   
})