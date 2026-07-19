// ==========================
// RAVROYAL QUOTATION SYSTEM
// ==========================

// Auto-save form data
document.addEventListener('DOMContentLoaded', function () {

    // Restore saved data
    document.querySelectorAll('input, textarea').forEach(el => {
        const key = el.name || el.id || el.placeholder;

        if (key && localStorage.getItem(key)) {
            if (el.type === 'checkbox') {
                el.checked = localStorage.getItem(key) === 'true';
            } else {
                el.value = localStorage.getItem(key);
            }
        }

        // Save on change
        el.addEventListener('input', () => {
            if (el.type === 'checkbox') {
                localStorage.setItem(key, el.checked);
            } else {
                localStorage.setItem(key, el.value);
            }
        });
    });

    updateTotal();
});

// ==========================
// UPDATE TOTAL PRICE
// ==========================
function updateTotal() {

    let total = 16000; // Base package

    document.querySelectorAll('.module-checkbox').forEach(cb => {
        if (cb.checked) {
            total += parseInt(cb.dataset.price || 0);
        }
    });

    document.getElementById('selectedTotal').innerText =
        '₹' + total.toLocaleString('en-IN');
}

// Listen checkbox changes
document.addEventListener('change', function (e) {
    if (e.target.classList.contains('module-checkbox')) {
        updateTotal();
    }
});

// ==========================
// GENERATE PDF
// ==========================
async function generatePDF() {

    const { jsPDF } = window.jspdf;
    const element = document.getElementById('quotationContainer');

    // Hide buttons during capture
    document.querySelector('.action-buttons').style.display = 'none';

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
    });

    document.querySelector('.action-buttons').style.display = 'flex';

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = 210;
    const pageHeight = 297;

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    return pdf;
}

// ==========================
// SAVE PDF ONLY
// ==========================
async function savePDFOnly() {

    const business =
        document.getElementById('businessName').value || 'Quotation';

    const pdf = await generatePDF();

    const fileName =
        'RavRoyal_' + business.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';

    pdf.save(fileName);

    alert('PDF downloaded successfully!');
}

// ==========================
// SAVE + WHATSAPP
// ==========================
async function saveAndWhatsApp() {

    const btn = document.getElementById('whatsappBtn');
    btn.innerText = 'Generating PDF...';
    btn.disabled = true;

    try {

        // Get form values
        const business = document.getElementById('businessName').value;
        const owner = document.getElementById('ownerName').value;
        const mobile = document.getElementById('mobileNumber').value;
        const email = document.getElementById('emailAddress').value;
        const domain = document.getElementById('domainName').value;
        const orders = document.getElementById('orderVolume').value;
        const requirements = document.getElementById('requirements').value;

        // Selected modules
        let modules = [];

        document.querySelectorAll('.module-checkbox:checked').forEach(cb => {
            const row = cb.closest('.module-row');
            const name = row.querySelector('.module-name').innerText;
            const price = row.querySelector('.module-price').innerText;
            modules.push('• ' + name + ' (' + price + ')');
        });

        // Generate and download PDF
        const pdf = await generatePDF();

        const fileName =
            'RavRoyal_' + (business || 'Quotation').replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';

        pdf.save(fileName);

        // WhatsApp message
        const message = `
🏢 *NEW E-COMMERCE QUOTATION*

📌 Business: ${business}
👤 Owner: ${owner}
📞 Mobile: ${mobile}
✉ Email: ${email}
🌐 Domain: ${domain}
📦 Expected Orders: ${orders}

🧩 *Selected Modules:*
${modules.length ? modules.join('\\n') : 'Base Package Only'}

📝 *Requirements:*
${requirements || 'No additional requirements'}

💰 *RavRoyal Proposal*
• Initial Setup: ₹16,000
• Monthly Support: ₹3,000
• Delivery: 7 Days
• First Month Small Customization: FREE

📎 PDF has been downloaded automatically.
Please attach the downloaded PDF from your Downloads folder and send it.
        `.trim();

        // Open WhatsApp
        const whatsappNumber = '919685204269';

        const whatsappURL =
            'https://wa.me/' + whatsappNumber + '?text=' +
            encodeURIComponent(message);

        // Delay so download starts first
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
        }, 800);

        // Success popup
        setTimeout(() => {
            alert(
                'PDF downloaded successfully! WhatsApp has been opened with all quotation details.'
            );
        }, 1200);

    } catch (err) {

        console.error(err);
        alert('Failed to generate PDF.');

    } finally {

        btn.innerText = 'Save PDF & Send WhatsApp';
        btn.disabled = false;
    }
}

// ==========================
// CLEAR FORM
// ==========================
function clearForm() {

    if (!confirm('Clear all saved form data?')) return;

    localStorage.clear();

    document.querySelectorAll('input, textarea').forEach(el => {
        if (el.type === 'checkbox') {
            el.checked = false;
        } else {
            el.value = '';
        }
    });

    updateTotal();

    alert('Form cleared successfully.');
}