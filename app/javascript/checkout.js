// ShriffleMart Checkout JavaScript Functionality

// Function to initialize checkout functionality
function initializeCheckout() {
  console.log('ShriffleMart checkout functionality loaded');
  
  // Remove any existing event listeners to prevent duplicates
  $('.address-option').off('click');
  $('input[name="selected_address"]').off('change');
  $('#new-address-form input').off('input');
  $('#save_address').off('change');
  $('#checkout-form').off('submit');
  $('#new-address-form input[required]').off('blur');
  
  // Initialize checkout functionality
  initializeAddressSelection();
  initializeFormValidation();
}

// Initialize on document ready (for direct page loads)
$(document).ready(function() {
  initializeCheckout();
});

// Initialize on Turbo navigation (for SPA-style navigation)
document.addEventListener('turbo:load', function() {
  initializeCheckout();
});

// Also listen for turbo:render in case of form submissions
document.addEventListener('turbo:render', function() {
  initializeCheckout();
});

function initializeAddressSelection() {
  // Handle address card clicks
  $('.address-option').on('click', function() {
    const addressId = $(this).data('address-id');
    const addressText = $(this).data('address-text');
    
    // Update radio button
    $(`#address_${addressId}`).prop('checked', true);
    
    // Update visual selection
    $('.address-option').removeClass('border-primary selected-address');
    $(this).addClass('border-primary selected-address');
    
    // Update hidden fields
    $('#selected_address_id').val(addressId);
    $('#order_address').val(addressText);
    $('#save_new_address').val('false');
    
    // Show selected address
    updateSelectedAddressDisplay(addressText);
    
    // Hide new address form
    $('#new-address-form').collapse('hide');
  });
  
  // Handle radio button changes
  $('input[name="selected_address"]').on('change', function() {
    const value = $(this).val();
    console.log('Radio button changed to:', value); // Debug log
    
    if (value === 'new') {
      console.log('Showing new address form'); // Debug log
      
      // Show new address form using Bootstrap collapse
      const collapseElement = document.getElementById('new-address-form');
      if (collapseElement) {
        const bsCollapse = new bootstrap.Collapse(collapseElement, {
          show: true
        });
      }
      
      // Clear selected address display
      $('#selected-address-display').hide();
      
      // Remove visual selection from address cards
      $('.address-option').removeClass('border-primary selected-address');
      
      // Clear hidden fields
      $('#selected_address_id').val('new');
      $('#order_address').val('');
    } else {
      console.log('Selecting existing address:', value); // Debug log
      
      // Handle existing address selection
      const addressCard = $(`.address-option[data-address-id="${value}"]`);
      const addressText = addressCard.data('address-text');
      
      // Update visual selection
      $('.address-option').removeClass('border-primary selected-address');
      addressCard.addClass('border-primary selected-address');
      
      // Update hidden fields
      $('#selected_address_id').val(value);
      $('#order_address').val(addressText);
      $('#save_new_address').val('false');
      
      // Show selected address
      updateSelectedAddressDisplay(addressText);
      
      // Hide new address form using Bootstrap collapse
      const collapseElement = document.getElementById('new-address-form');
      if (collapseElement) {
        const bsCollapse = new bootstrap.Collapse(collapseElement, {
          hide: true
        });
      }
    }
  });
  
  // Handle new address form changes
  $('#new-address-form input').on('input', function() {
    updateNewAddressPreview();
  });
  
  // Handle save address checkbox
  $('#save_address').on('change', function() {
    $('#save_new_address').val($(this).is(':checked') ? 'true' : 'false');
  });
  
  // Initialize default selection
  const defaultAddress = $('.address-option.selected-address');
  if (defaultAddress.length > 0) {
    const addressText = defaultAddress.data('address-text');
    const addressId = defaultAddress.data('address-id');
    
    $('#selected_address_id').val(addressId);
    $('#order_address').val(addressText);
    updateSelectedAddressDisplay(addressText);
  }
}

function updateSelectedAddressDisplay(addressText) {
  if (addressText) {
    $('#selected-address-text').text(addressText);
    $('#selected-address-display').show();
  } else {
    $('#selected-address-display').hide();
  }
}

function updateNewAddressPreview() {
  const addressParts = [];
  
  const line1 = $('#new_address_line_1').val();
  const line2 = $('#new_address_line_2').val();
  const city = $('#new_address_city').val();
  const state = $('#new_address_state').val();
  const postalCode = $('#new_address_postal_code').val();
  const country = $('#new_address_country').val();
  
  if (line1) addressParts.push(line1);
  if (line2) addressParts.push(line2);
  if (city || state || postalCode) {
    const cityStateZip = [city, state, postalCode].filter(Boolean).join(', ');
    if (cityStateZip) addressParts.push(cityStateZip);
  }
  if (country) addressParts.push(country);
  
  const fullAddress = addressParts.join(', ');
  
  if (fullAddress.trim()) {
    $('#order_address').val(fullAddress);
    updateSelectedAddressDisplay(fullAddress);
  } else {
    $('#selected-address-display').hide();
  }
}

function initializeFormValidation() {
  // Form submission validation
  $('#checkout-form').on('submit', function(e) {
    const selectedAddress = $('input[name="selected_address"]:checked').val();
    const orderAddress = $('#order_address').val();
    
    // Check if address is selected or filled
    if (!orderAddress || orderAddress.trim() === '') {
      e.preventDefault();
      showAlert('danger', 'Please select a delivery address or fill in the address details.');
      return false;
    }
    
    // If new address is selected, validate required fields
    if (selectedAddress === 'new') {
      const requiredFields = [
        { field: '#new_address_line_1', name: 'Address Line 1' },
        { field: '#new_address_city', name: 'City' },
        { field: '#new_address_state', name: 'State' },
        { field: '#new_address_postal_code', name: 'Postal Code' },
        { field: '#new_address_country', name: 'Country' }
      ];
      
      let missingFields = [];
      
      requiredFields.forEach(function(item) {
        if (!$(item.field).val() || $(item.field).val().trim() === '') {
          missingFields.push(item.name);
          $(item.field).addClass('is-invalid');
        } else {
          $(item.field).removeClass('is-invalid');
        }
      });
      
      if (missingFields.length > 0) {
        e.preventDefault();
        showAlert('danger', `Please fill in the following required fields: ${missingFields.join(', ')}`);
        return false;
      }
      
      // Set the save new address flag
      $('#save_new_address').val($('#save_address').is(':checked') ? 'true' : 'false');
      
      // Set new address data in hidden fields
      $('<input>').attr({
        type: 'hidden',
        name: 'new_address_name',
        value: $('#new_address_name').val()
      }).appendTo('#checkout-form');
      
      $('<input>').attr({
        type: 'hidden',
        name: 'new_address_line_1',
        value: $('#new_address_line_1').val()
      }).appendTo('#checkout-form');
      
      $('<input>').attr({
        type: 'hidden',
        name: 'new_address_line_2',
        value: $('#new_address_line_2').val()
      }).appendTo('#checkout-form');
      
      $('<input>').attr({
        type: 'hidden',
        name: 'new_address_city',
        value: $('#new_address_city').val()
      }).appendTo('#checkout-form');
      
      $('<input>').attr({
        type: 'hidden',
        name: 'new_address_state',
        value: $('#new_address_state').val()
      }).appendTo('#checkout-form');
      
      $('<input>').attr({
        type: 'hidden',
        name: 'new_address_postal_code',
        value: $('#new_address_postal_code').val()
      }).appendTo('#checkout-form');
      
      $('<input>').attr({
        type: 'hidden',
        name: 'new_address_country',
        value: $('#new_address_country').val()
      }).appendTo('#checkout-form');
    }
    
    // Show loading state
    const submitBtn = $('#place-order-btn');
    const originalText = submitBtn.html();
    
    submitBtn.prop('disabled', true)
            .html('<span class="spinner-border spinner-border-sm me-2"></span>Processing...');
    
    // Re-enable button after 10 seconds as fallback
    setTimeout(function() {
      submitBtn.prop('disabled', false).html(originalText);
    }, 10000);
  });
  
  // Real-time validation for new address fields
  $('#new-address-form input[required]').on('blur', function() {
    if ($(this).val().trim() === '') {
      $(this).addClass('is-invalid');
    } else {
      $(this).removeClass('is-invalid');
    }
  });
}

function showAlert(type, message) {
  const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
  const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
  
  const alertHtml = `
    <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
      <i class="fas ${iconClass} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  
  // Remove existing alerts
  $('.alert').remove();
  
  // Add new alert at the top of the page
  $('main.container').prepend(alertHtml);
  
  // Scroll to top to show alert
  $('html, body').animate({ scrollTop: 0 }, 300);
  
  // Auto-dismiss after 5 seconds
  setTimeout(function() {
    $('.alert').fadeOut(300, function() {
      $(this).remove();
    });
  }, 5000);
}

// Initialize tooltips
function initializeTooltips() {
  if (typeof bootstrap !== 'undefined') {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
}