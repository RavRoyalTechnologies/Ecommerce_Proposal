// ==========================
// RAVROYAL QUOTATION SYSTEM
// ==========================

document.addEventListener('DOMContentLoaded', () => {
    attachEvents();
    updateTotal();
});

document.getElementById('gstOption')
    .addEventListener('change', updateTotal);

// Format INR
function formatINR(amount){
    return '₹' + Number(amount).toLocaleString('en-IN');
}

// Attach all events
function attachEvents(){

    // Checkbox
    document.querySelectorAll('.item-check').forEach(el => {
        el.addEventListener('change', updateTotal);
    });

    // Price input
    document.querySelectorAll('.item-price').forEach(el => {
        el.addEventListener('input', updateTotal);
    });

    // Free buttons
    document.querySelectorAll('.free-btn').forEach(btn => {
        btn.addEventListener('click', function(){

            this.classList.toggle('active');

            if(this.classList.contains('active')){
                this.innerText = 'FREE ✓';
            }else{
                this.innerText = 'FREE';
            }

            updateTotal();
        });
    });

    // Full quotation free
    document.getElementById('fullFree')
        .addEventListener('change', updateTotal);
}

// ==========================
// CALCULATION
// ==========================
function updateTotal(){

    let subtotal = 0;

    document.querySelectorAll('.quotation-row').forEach(row => {

        const check = row.querySelector('.item-check');
        const priceInput = row.querySelector('.item-price');
        const freeBtn = row.querySelector('.free-btn');
        const totalCell = row.querySelector('.item-total');

        let price = parseFloat(priceInput.value) || 0;
        let itemTotal = 0;

        if(check.checked && !freeBtn.classList.contains('active')){
            itemTotal = price;
            subtotal += itemTotal;
        }

        totalCell.innerText = formatINR(itemTotal);
    });

    // GST 18%
    // let gst = subtotal * 0.18;
    let gstOption = document.getElementById('gstOption').value;

    let gst = 0;

    if (gstOption === 'apply') {
        gst = subtotal * 0.18;
    }

    let grandTotal = subtotal + gst;

    // Full quotation FREE
    if(document.getElementById('fullFree').checked){
        subtotal = 0;
        gst = 0;
        grandTotal = 0;
    }

    document.getElementById('subtotal').innerText =
        formatINR(Math.round(subtotal));

    document.getElementById('gstAmount').innerText =
        formatINR(Math.round(gst));

    document.getElementById('grandTotal').innerText =
        formatINR(Math.round(grandTotal));
}

// ==========================
// PRINT / PDF
// ==========================
function printQuotation(){

    // Hide print button while printing
    document.getElementById('printBtn').style.display = 'none';

    window.print();

    // Show button again
    setTimeout(() => {
        document.getElementById('printBtn').style.display = 'inline-block';
    }, 500);
}
