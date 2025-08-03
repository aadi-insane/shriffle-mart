// Cart Preview Dropdown Functionality

$(document).ready(function() {
  console.log('Cart preview functionality loaded');
  
  // Create cart preview dropdown
  function createCartPreview() {
    const cartPreviewHtml = `
      <div class="dropdown cart-preview-dropdown">
        <a class="nav-link dropdown-toggle position-relative" href="#" id="cartDropdown" role="button" 
           data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fas fa-shopping-cart me-1"></i>Cart
          <span id="cart-badge" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none">
            0
            <span class="visually-hidden">items in cart</span>
          </span>
        </a>
        <div class="dropdown-menu dropdown-menu-end cart-preview-menu" aria-labelledby="cartDropdown">
          <div class="cart-preview-header px-3 py-2 border-bottom">
            <h6 class="mb-0">
              <i class="fas fa-shopping-cart me-2"></i>Shopping Cart
              <span id="cart-items-count" class="badge bg-primary ms-2">0</span>
            </h6>
          </div>
          <div id="cart-preview-items" class="cart-preview-items">
            <!-- Cart items will be loaded here -->
          </div>
          <div class="cart-preview-footer p-3 border-top">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <strong>Total: <span id="cart-preview-total">$0.00</span></strong>
            </div>
            <div class="d-grid gap-2">
              <a href="/cart" class="btn btn-primary btn-sm">
                <i class="fas fa-eye me-1"></i>View Cart
              </a>
              <a href="/orders/new" class="btn btn-success btn-sm">
                <i class="fas fa-credit-card me-1"></i>Checkout
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Replace existing cart link with dropdown
    const existingCartLink = $('.navbar-nav a[href*="cart"]').parent();
    if (existingCartLink.length > 0) {
      existingCartLink.replaceWith(cartPreviewHtml);
    }
  }
  
  // Load cart preview data
  function loadCartPreview() {
    $.ajax({
      url: '/cart/preview',
      method: 'GET',
      dataType: 'json',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      success: function(response) {
        updateCartPreview(response);
      },
      error: function(xhr, status, error) {
        console.error('Failed to load cart preview:', error);
        // Fallback to basic cart display
        $('#cart-preview-items').html(`
          <div class="text-center py-3 text-muted">
            <i class="fas fa-exclamation-triangle"></i>
            <p class="mb-0 small">Unable to load cart</p>
          </div>
        `);
      }
    });
  }
  
  // Update cart preview with data
  function updateCartPreview(cartData) {
    const itemsCount = cartData.items_count || 0;
    const total = cartData.total || 0;
    const items = cartData.items || [];
    
    // Update badge
    const $badge = $('#cart-badge');
    if (itemsCount > 0) {
      $badge.text(itemsCount).removeClass('d-none');
    } else {
      $badge.addClass('d-none');
    }
    
    // Update items count
    $('#cart-items-count').text(itemsCount);
    
    // Update total
    $('#cart-preview-total').text('$' + parseFloat(total).toFixed(2));
    
    // Update items list
    const $itemsContainer = $('#cart-preview-items');
    
    if (items.length === 0) {
      $itemsContainer.html(`
        <div class="text-center py-4 text-muted">
          <i class="fas fa-shopping-cart mb-2" style="font-size: 2rem; opacity: 0.3;"></i>
          <p class="mb-0">Your cart is empty</p>
          <small>Add some products to get started</small>
        </div>
      `);
    } else {
      let itemsHtml = '';
      items.forEach(function(item) {
        itemsHtml += `
          <div class="cart-preview-item d-flex align-items-center p-2 border-bottom">
            <img src="${item.image_url}" alt="${item.name}" 
                 class="cart-preview-image me-2" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
            <div class="flex-grow-1 me-2">
              <h6 class="mb-0 small">${truncateText(item.name, 30)}</h6>
              <small class="text-muted">
                ${item.quantity} × $${parseFloat(item.price).toFixed(2)}
              </small>
            </div>
            <div class="text-end">
              <strong class="small">$${parseFloat(item.subtotal).toFixed(2)}</strong>
              <button class="btn btn-sm btn-outline-danger ms-1 remove-from-preview" 
                      data-product-id="${item.product_id}" title="Remove">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        `;
      });
      $itemsContainer.html(itemsHtml);
    }
  }
  
  // Truncate text helper
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }
  
  // Handle remove from cart in preview
  $(document).on('click', '.remove-from-preview', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const productId = $(this).data('product-id');
    const $button = $(this);
    const originalHtml = $button.html();
    
    // Check if button is already processing
    if ($button.prop('disabled')) {
      return false;
    }
    
    // Show loading state with standardized spinner
    $button.html('<span class="spinner-border spinner-border-sm"></span>').prop('disabled', true);
    
    $.ajax({
      url: '/cart/remove/' + productId,
      method: 'DELETE',
      dataType: 'json',
      data: { remove_all: true },
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      success: function(response) {
        // Reload cart preview
        loadCartPreview();
        
        // Show success message
        showCartNotification('success', 'Item removed from cart');
        
        // Update main cart page if we're on it
        if (window.location.pathname === '/cart') {
          location.reload();
        }
      },
      error: function(xhr, status, error) {
        console.error('Failed to remove item:', error);
        $button.html(originalHtml).prop('disabled', false);
        showCartNotification('danger', 'Failed to remove item');
      }
    });
  });
  
  // Show cart notification
  function showCartNotification(type, message) {
    const bgColor = type === 'success' ? '#28a745' : '#dc3545';
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    
    const notificationHtml = `
      <div class="cart-notification-overlay" style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 16px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        max-width: 300px;
        font-size: 13px;
        font-weight: 500;
        display: none;
      ">
        <i class="fas ${iconClass} me-2"></i>${message}
      </div>
    `;
    
    $('.cart-notification-overlay').remove();
    $('body').append(notificationHtml);
    $('.cart-notification-overlay').fadeIn(300);
    
    setTimeout(function() {
      $('.cart-notification-overlay').fadeOut(300, function() {
        $(this).remove();
      });
    }, 2000);
  }
  
  // Auto-refresh cart preview when dropdown is opened
  $(document).on('show.bs.dropdown', '#cartDropdown', function() {
    loadCartPreview();
  });
  
  // Initialize cart preview if user is logged in
  if ($('body').data('logged-in') || $('.navbar-nav a[href*="cart"]').length > 0) {
    createCartPreview();
    loadCartPreview();
  }
  
  // Listen for cart updates from other parts of the app
  $(document).on('cart:updated', function(event, cartData) {
    updateCartPreview(cartData);
  });
  
  // Update cart preview when items are added via AJAX
  const originalUpdateCartCount = window.updateCartCount;
  if (typeof originalUpdateCartCount === 'function') {
    window.updateCartCount = function(count) {
      originalUpdateCartCount(count);
      loadCartPreview();
    };
  }
});