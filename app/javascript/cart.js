// ShriffleMart Cart and Product Filter JavaScript Functionality

// Function to initialize all functionality
function initializeShriffleMart() {
  console.log('ShriffleMart functionality loaded');
  
  // Remove existing event listeners to prevent duplicates
  $('.add-to-cart-btn').off('click');
  $('.quantity-increase, .quantity-decrease').off('click');
  $('#product-search').off('input');
  $('#category-filter, #brand-filter, #price-range').off('change');
  $('#sort-filter').off('change');
  $('#clear-filters').off('click');
  $('.quick-filter').off('click');
  $('form').off('submit'); // Remove the general form handler that causes duplicate spinners
  
  // Initialize all functionality
  initializeCartFunctionality();
  initializeProductFilters();
}

// Initialize on document ready (for direct page loads)
$(document).ready(function() {
  initializeShriffleMart();
});

// Initialize on Turbo navigation (for SPA-style navigation)
document.addEventListener('turbo:load', function() {
  initializeShriffleMart();
});

// Also listen for turbo:render in case of form submissions
document.addEventListener('turbo:render', function() {
  initializeShriffleMart();
});

function initializeCartFunctionality() {
  // AJAX Add to Cart functionality
  $(document).on('click', '.add-to-cart-btn', function(e) {
    e.preventDefault();
    
    var button = $(this);
    var productId = button.data('product-id');
    var originalText = button.html();
    
    // Check if button is already processing to prevent double clicks
    if (button.hasClass('btn-loading')) {
      return false;
    }
    
    // Disable button and show loading state
    button.prop('disabled', true)
          .addClass('btn-loading')
          .html('<span class="spinner-border spinner-border-sm me-2"></span>Adding...');
    
    // Perform AJAX request
    $.ajax({
      url: '/cart/add/' + productId,
      method: 'POST',
      dataType: 'json',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      success: function(response) {
        // Update cart count in navbar
        updateCartCount(response.cart_count);
        
        // Show success message
        showFlashMessage('success', response.message);
        
        // Add success animation to button
        button.addClass('success-animation');
        
        // Reset button after animation
        setTimeout(function() {
          button.prop('disabled', false)
                .removeClass('btn-loading success-animation')
                .html(originalText);
        }, 600);
      },
      error: function(xhr, status, error) {
        console.error('Cart error:', error);
        showFlashMessage('danger', 'Error adding item to cart. Please try again.');
        
        // Reset button
        button.prop('disabled', false)
              .removeClass('btn-loading')
              .html(originalText);
      }
    });
  });
  
  // Quantity controls for cart page
  $(document).on('click', '.quantity-increase', function(e) {
    e.preventDefault();
    var productId = $(this).data('product-id');
    updateQuantity(productId, 'increase');
  });
  
  $(document).on('click', '.quantity-decrease', function(e) {
    e.preventDefault();
    var productId = $(this).data('product-id');
    updateQuantity(productId, 'decrease');
  });
  
  // Product card hover effects
  $('.product-card').hover(
    function() {
      $(this).find('.card-img-top').addClass('hover-zoom');
    },
    function() {
      $(this).find('.card-img-top').removeClass('hover-zoom');
    }
  );
  
  // Initialize tooltips if Bootstrap is available
  if (typeof bootstrap !== 'undefined') {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
  
  // Auto-hide flash messages
  setTimeout(function() {
    $('.alert').fadeOut(500);
  }, 5000);
}

function initializeProductFilters() {
  console.log('Initializing product filters...');
  
  // Enhanced Product search with debouncing
  let searchTimeout;
  
  $('#product-search').on('input', function() {
    clearTimeout(searchTimeout);
    const searchTerm = $(this).val();
    
    console.log('Search input:', searchTerm);
    
    // Show loading state
    $('#search-loading').removeClass('d-none');
    
    // Debounce search to avoid excessive filtering
    searchTimeout = setTimeout(function() {
      filterProducts();
      $('#search-loading').addClass('d-none');
    }, 300);
  });
  
  // Filter dropdowns
  $('#category-filter, #brand-filter, #price-range').on('change', function() {
    console.log('Filter changed:', $(this).attr('id'), '=', $(this).val());
    filterProducts();
  });
  
  // Sort dropdown
  $('#sort-filter').on('change', function() {
    console.log('Sort changed:', $(this).val());
    sortProducts();
  });
  
  // Clear all filters
  $('#clear-filters').on('click', function() {
    console.log('Clearing all filters');
    $('#product-search').val('');
    $('#category-filter').val('');
    $('#brand-filter').val('');
    $('#price-range').val('');
    $('#sort-filter').val('name');
    $('.quick-filter').removeClass('active');
    filterProducts();
    updateFilterCount();
  });
  
  // Quick filter buttons
  $('.quick-filter').on('click', function() {
    const filterType = $(this).data('filter');
    const isActive = $(this).hasClass('active');
    
    console.log('Quick filter clicked:', filterType, 'Active:', isActive);
    
    // Remove active state from all quick filters
    $('.quick-filter').removeClass('active');
    
    if (!isActive) {
      $(this).addClass('active');
      applyQuickFilter(filterType);
    } else {
      // If clicking the same filter, clear it
      clearQuickFilters();
    }
  });
  
  // Initialize filter count on page load
  updateFilterCount();
}

function filterProducts() {
  console.log('Filtering products...');
  
  var searchTerm = $('#product-search').val().toLowerCase();
  var selectedCategory = $('#category-filter').val();
  var selectedBrand = $('#brand-filter').val();
  var priceRange = $('#price-range').val();
  var visibleCount = 0;
  
  console.log('Filter criteria:', {
    search: searchTerm,
    category: selectedCategory,
    brand: selectedBrand,
    price: priceRange
  });
  
  $('.product-item').each(function() {
    var $item = $(this);
    var productName = ($item.data('name') || '').toString().toLowerCase();
    var productBrand = ($item.data('brand') || '').toString().toLowerCase();
    var productCategory = ($item.data('category') || '').toString();
    var productPrice = parseFloat($item.data('price')) || 0;
    
    // Search matching (name, brand, or description)
    var matchesSearch = searchTerm === '' || 
                       productName.includes(searchTerm) || 
                       productBrand.includes(searchTerm);
    
    // Category matching
    var matchesCategory = selectedCategory === '' || 
                         productCategory === selectedCategory;
    
    // Brand matching
    var matchesBrand = selectedBrand === '' || 
                      productBrand === selectedBrand;
    
    // Price range matching
    var matchesPrice = true;
    if (priceRange) {
      switch(priceRange) {
        case 'under-25':
          matchesPrice = productPrice < 25;
          break;
        case '25-50':
          matchesPrice = productPrice >= 25 && productPrice <= 50;
          break;
        case '50-100':
          matchesPrice = productPrice >= 50 && productPrice <= 100;
          break;
        case 'over-100':
          matchesPrice = productPrice > 100;
          break;
      }
    }
    
    // Show/hide product based on all criteria
    if (matchesSearch && matchesCategory && matchesBrand && matchesPrice) {
      $item.show().removeClass('d-none');
      visibleCount++;
    } else {
      $item.hide().addClass('d-none');
    }
  });
  
  console.log('Visible products:', visibleCount);
  
  // Update results count
  $('#results-count').text(visibleCount);
  
  // Show/hide empty state
  if (visibleCount === 0) {
    $('#no-products').removeClass('d-none');
  } else {
    $('#no-products').addClass('d-none');
  }
  
  updateFilterCount();
}

function sortProducts() {
  console.log('Sorting products...');
  
  var sortBy = $('#sort-filter').val();
  var $container = $('#products-container');
  var $items = $('.product-item:visible').detach();
  
  console.log('Sorting by:', sortBy, 'Items to sort:', $items.length);
  
  // Show loading state
  var loadingHtml = '<div class="col-12 text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Sorting...</span></div></div>';
  $container.append(loadingHtml);
  
  setTimeout(function() {
    // Remove loading indicator
    $container.find('.spinner-border').parent().parent().remove();
    
    $items.sort(function(a, b) {
      var $a = $(a);
      var $b = $(b);
      
      switch(sortBy) {
        case 'price-low':
          return parseFloat($a.data('price')) - parseFloat($b.data('price'));
        case 'price-high':
          return parseFloat($b.data('price')) - parseFloat($a.data('price'));
        case 'rating':
          return parseFloat($b.data('rating') || 0) - parseFloat($a.data('rating') || 0);
        case 'newest':
          return ($b.data('created') || $b.data('name')).localeCompare($a.data('created') || $a.data('name'));
        case 'name':
        default:
          return ($a.data('name') || '').localeCompare($b.data('name') || '');
      }
    });
    
    // Re-append sorted items
    $items.each(function(index) {
      $(this).css('animation-delay', (index * 0.05) + 's');
      $(this).addClass('fade-in');
      $container.append(this);
    });
    
    // Remove animation class after animation completes
    setTimeout(function() {
      $items.removeClass('fade-in');
    }, 1000);
    
    console.log('Sorting complete');
  }, 300);
}

function updateFilterCount() {
  var activeFilters = 0;
  if ($('#product-search').val()) activeFilters++;
  if ($('#category-filter').val()) activeFilters++;
  if ($('#brand-filter').val()) activeFilters++;
  if ($('#price-range').val()) activeFilters++;
  
  var $filterBadge = $('#active-filters-count');
  if (activeFilters > 0) {
    $filterBadge.text(activeFilters).removeClass('d-none');
    $('#clear-filters').removeClass('d-none');
  } else {
    $filterBadge.addClass('d-none');
    $('#clear-filters').addClass('d-none');
  }
  
  console.log('Active filters count:', activeFilters);
}

// Quick filter functions
function applyQuickFilter(filterType) {
  console.log('Applying quick filter:', filterType);
  
  // Clear other filters first
  $('#product-search').val('');
  $('#category-filter').val('');
  $('#brand-filter').val('');
  $('#price-range').val('');
  
  switch(filterType) {
    case 'featured':
      filterFeaturedProducts();
      break;
    case 'on-sale':
      filterSaleProducts();
      break;
    case 'high-rated':
      filterHighRatedProducts();
      break;
    case 'under-50':
      filterUnder50Products();
      break;
  }
  updateFilterCount();
}

function filterFeaturedProducts() {
  var visibleCount = 0;
  $('.product-item').each(function() {
    var $item = $(this);
    var hasFeaturedBadge = $item.find('.badge:contains("Featured")').length > 0;
    
    if (hasFeaturedBadge) {
      $item.show().removeClass('d-none');
      visibleCount++;
    } else {
      $item.hide().addClass('d-none');
    }
  });
  
  updateResultsDisplay(visibleCount);
}

function filterSaleProducts() {
  var visibleCount = 0;
  $('.product-item').each(function() {
    var $item = $(this);
    var hasDiscountBadge = $item.find('.badge:contains("OFF")').length > 0;
    
    if (hasDiscountBadge) {
      $item.show().removeClass('d-none');
      visibleCount++;
    } else {
      $item.hide().addClass('d-none');
    }
  });
  
  updateResultsDisplay(visibleCount);
}

function filterHighRatedProducts() {
  var visibleCount = 0;
  $('.product-item').each(function() {
    var $item = $(this);
    var rating = parseFloat($item.data('rating')) || 0;
    
    if (rating >= 4.0) {
      $item.show().removeClass('d-none');
      visibleCount++;
    } else {
      $item.hide().addClass('d-none');
    }
  });
  
  updateResultsDisplay(visibleCount);
}

function filterUnder50Products() {
  var visibleCount = 0;
  $('.product-item').each(function() {
    var $item = $(this);
    var price = parseFloat($item.data('price')) || 0;
    
    if (price < 50) {
      $item.show().removeClass('d-none');
      visibleCount++;
    } else {
      $item.hide().addClass('d-none');
    }
  });
  
  updateResultsDisplay(visibleCount);
}

function clearQuickFilters() {
  $('.product-item').show().removeClass('d-none');
  var totalCount = $('.product-item').length;
  updateResultsDisplay(totalCount);
}

function updateResultsDisplay(visibleCount) {
  $('#results-count').text(visibleCount);
  
  if (visibleCount === 0) {
    $('#no-products').removeClass('d-none');
  } else {
    $('#no-products').addClass('d-none');
  }
}

// Cart helper functions
function updateCartCount(count) {
  var cartLink = $('.navbar-nav a[href*="cart"]');
  cartLink.html('Cart (' + count + ')');
  
  // Add animation to cart link
  cartLink.addClass('success-animation');
  setTimeout(function() {
    cartLink.removeClass('success-animation');
  }, 600);
}

function updateQuantity(productId, action) {
  var quantityElement = $('.quantity-' + productId);
  var currentQuantity = parseInt(quantityElement.text());
  
  console.log('Updating quantity for product:', productId, 'action:', action);
  
  $.ajax({
    url: '/cart/update_quantity/' + productId,
    method: 'PATCH',
    dataType: 'json',
    data: {
      quantity_action: action
    },
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    success: function(response) {
      console.log('AJAX response:', response);
      
      if (response.success) {
        console.log('Quantity received:', response.quantity);
        
        // Update quantity display
        quantityElement.text(response.quantity);
        
        // Update subtotal
        var subtotal = typeof response.subtotal === 'string' ? parseFloat(response.subtotal) : response.subtotal;
        $('.subtotal-' + productId).text('$' + subtotal.toFixed(2));
        
        // Update total
        var total = typeof response.total === 'string' ? parseFloat(response.total) : response.total;
        $('.cart-total').text('$' + total.toFixed(2));
        
        // Update cart count
        updateCartCount(response.cart_count);
        
        // Remove row if quantity is 0
        if (response.quantity === 0) {
          console.log('Quantity is 0, removing item with product ID:', productId);
          
          var itemToRemove = $('.cart-item-' + productId);
          console.log('Selector .cart-item-' + productId + ' found:', itemToRemove.length, 'elements');
          
          if (itemToRemove.length === 0) {
            itemToRemove = $('[class*="cart-item-' + productId + '"]');
            console.log('Alternative selector found:', itemToRemove.length, 'elements');
          }
          
          if (itemToRemove.length > 0) {
            console.log('Removing element:', itemToRemove[0]);
            itemToRemove.fadeOut(300, function() {
              $(this).remove();
              console.log('Item removed from DOM');
              
              setTimeout(function() {
                var remainingItems = $('.cart-item').length;
                console.log('Remaining cart items:', remainingItems);
                if (remainingItems === 0) {
                  console.log('Cart is empty, reloading page');
                  location.reload();
                }
              }, 100);
            });
          } else {
            console.log('Item not found in DOM with any selector, reloading page');
            location.reload();
          }
        } else {
          console.log('Quantity is not 0, continuing normally');
        }
      } else {
        console.log('Response success is false');
      }
    },
    error: function(xhr, status, error) {
      console.error('Quantity update error:', error);
      showFlashMessage('danger', 'Error updating quantity');
    }
  });
}

function showFlashMessage(type, message) {
  var alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
  var iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
  var bgColor = type === 'success' ? '#28a745' : '#dc3545';
  
  var notificationHtml = '<div class="cart-notification-overlay" style="' +
                        'position: fixed; ' +
                        'top: 20px; ' +
                        'right: 20px; ' +
                        'background: ' + bgColor + '; ' +
                        'color: white; ' +
                        'padding: 15px 20px; ' +
                        'border-radius: 8px; ' +
                        'box-shadow: 0 4px 12px rgba(0,0,0,0.3); ' +
                        'z-index: 9999; ' +
                        'max-width: 350px; ' +
                        'font-size: 14px; ' +
                        'font-weight: 500; ' +
                        'display: none; ' +
                        'animation: slideInRight 0.3s ease-out;' +
                        '">' +
                        '<i class="fas ' + iconClass + ' me-2"></i>' +
                        message +
                        '</div>';
  
  $('.cart-notification-overlay').remove();
  $('body').append(notificationHtml);
  $('.cart-notification-overlay').fadeIn(300);
  
  setTimeout(function() {
    $('.cart-notification-overlay').fadeOut(300, function() {
      $(this).remove();
    });
  }, 2000);
}