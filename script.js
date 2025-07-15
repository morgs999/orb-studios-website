const site = 'https://orbstudios.ca';

// Initialize EmailJS when the page loads
document.addEventListener('DOMContentLoaded', function () {
    emailjs.init("y5-Zr5PiJXVG3AbTI");

    const sendBookingBtn = document.getElementById('sendBookingBtn');
    if (sendBookingBtn) {
        sendBookingBtn.addEventListener('click', function () {
            sendBookingEmail();
        });
    }

    // Auto-open accordion when security link is clicked
    handleSecurityLinks();
});

function sendBookingEmail() {
    const form = document.getElementById('bookingForm');
    const btn = document.getElementById('sendBookingBtn');
    const alertContainer = document.getElementById('alertContainer');

    if (!validateForm()) {
        return;
    }

    setButtonLoading(btn, true);

    const templateParams = prepareEmailData(form);

    // Send email using EmailJS
    emailjs.send('service_odf7xog', 'template_jav278e', templateParams)
        .then(function (response) {
            // console.log('Email sent successfully!', response.status, response.text);
            showAlert('Booking request sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();

            // Close modal after 2 seconds
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
                if (modal) {
                    modal.hide();
                }
            }, 2000);

        }, function (error) {
            console.log('Email sending failed:', error);
            showAlert('Failed to send booking request. Please try again or contact us directly.', 'danger');
        })
        .finally(function () {
            setButtonLoading(btn, false);
        });
}

function validateForm() {
    const requiredFields = ['clientName', 'clientEmail', 'rentalType', 'sessionType'];
    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            if (field) {
                field.classList.add('is-invalid');
            }
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });

    if (!isValid) {
        showAlert('Please fill in all required fields (marked with *)', 'danger');
    }

    return isValid;
}

function prepareEmailData(form) {
    const formData = new FormData(form);
    const templateParams = {};

    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        templateParams[key] = value || 'Not provided';
    }

    // Handle checkbox for gear storage
    const gearStorageCheckbox = document.getElementById('gearStorage');
    templateParams.gear_storage = gearStorageCheckbox && gearStorageCheckbox.checked ? 'Yes' : 'No';

    // Format date if provided
    if (templateParams.preferred_date) {
        const date = new Date(templateParams.preferred_date);
        templateParams.preferred_date = date.toLocaleDateString('en-CA');
    }

    // Ensure all required fields have fallback values
    templateParams.client_name = templateParams.client_name || 'Not provided';
    templateParams.client_email = templateParams.client_email || 'Not provided';
    templateParams.client_phone = templateParams.client_phone || 'Not provided';
    templateParams.band_name = templateParams.band_name || 'Not provided';
    templateParams.rental_type = templateParams.rental_type || 'Not specified';
    templateParams.session_type = templateParams.session_type || 'Not specified';
    templateParams.preferred_time = templateParams.preferred_time || 'Not specified';
    templateParams.duration = templateParams.duration || 'Not specified';
    templateParams.additional_info = templateParams.additional_info || 'None provided';

    return templateParams;
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertContainer.innerHTML = alertHTML;

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert && bootstrap.Alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

function setButtonLoading(btn, isLoading) {
    if (!btn) return;

    const btnText = btn.querySelector('.btn-text');
    const btnSpinner = btn.querySelector('.btn-spinner');

    btn.disabled = isLoading;

    if (btnText && btnSpinner) {
        if (isLoading) {
            btnText.classList.add('d-none');
            btnSpinner.classList.remove('d-none');
        } else {
            btnText.classList.remove('d-none');
            btnSpinner.classList.add('d-none');
        }
    }
}

// Handle security links to open accordion
function handleSecurityLinks() {
    // Check if URL has #security hash on page load
    if (window.location.hash === '#security') {
        openSecurityAccordion();
    }

    // Handle clicks on security links
    document.querySelectorAll('a[href="#security"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            openSecurityAccordion();

            // Scroll to the element
            const securityElement = document.getElementById('security');
            if (securityElement) {
                securityElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Open the security/gear storage accordion
function openSecurityAccordion() {
    const collapseElement = document.getElementById('collapseTwo');
    if (collapseElement && bootstrap.Collapse) {
        const bsCollapse = new bootstrap.Collapse(collapseElement, {
            show: true
        });
    }
}

// Clear form validation on input
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bookingForm');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function () {
                this.classList.remove('is-invalid');
            });
        });
    }
});

// Handle booking modal
document.addEventListener('DOMContentLoaded', function () {
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal) {
        bookingModal.addEventListener('hidden.bs.modal', function () {
            // Clear any alerts when modal is closed
            const alertContainer = document.getElementById('alertContainer');
            if (alertContainer) {
                alertContainer.innerHTML = '';
            }

            // Clear form validation classes
            const form = document.getElementById('bookingForm');
            if (form) {
                const invalidInputs = form.querySelectorAll('.is-invalid');
                invalidInputs.forEach(input => {
                    input.classList.remove('is-invalid');
                });
            }
        });
    }
});

// Handle image modals
document.addEventListener('DOMContentLoaded', function () {
    const clickableImages = document.querySelectorAll('.clickable-image');
    const modalImage = document.getElementById('modalImage');
    const imageModalLabel = document.getElementById('imageModalLabel');

    clickableImages.forEach(image => {
        image.addEventListener('click', function () {
            modalImage.src = this.src;
            modalImage.alt = this.alt;
            imageModalLabel.textContent = this.alt;
        });
    });

    modalImage.addEventListener('click', function () {
        const modal = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
        modal.hide();
    });
});