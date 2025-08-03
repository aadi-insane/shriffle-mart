// ShriffleMart Product Search and Filter Functionality

// Function to initialize product filtering
function initializeProductFilters() {
  console.log('Product filters functionality loaded');
  
  // Remove existing event listeners to prevent duplicates
  $('#product-search').off('input');
  $('#category-filter, #brand-filter, #price-range').off('change');
  $('#sort-filter').off('change');
  $('#clear-filters').off('click');
  $('.quick-filter').off('click');
  
  // Initialize search and filter functionality
  setupSearchAndFilters();
  setupQuickFilters();
  
  // Initialize filter count on page load
  updateFilterCount();
}

// Initialize on document ready (for direct page loads)
$(document).ready(function() {
  initializeProductFilters();
});

// Initialize on Turbo navigation (for SPA-style navigation)
document.addEventListener('turbo:load', function() {
  initializeProductFilters();
});

// Also listen for turbo:render in case of form submissions
document.addEventListener('turbo:render', function() {
  initializeProductFilters();
});

function setupSearchAndFilters() {
  // Enhanced Product search with debouncing
  let searchTimeout;
  
  $('#product-search').on('input', function() {
    clearTimeout(searchTimeout);
    const searchTerm = $(this).val();
    
    console.log('Search input:', searchTerm); // Debug log
    
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
    console.log('Filter changed:', $(this).attr('id'), '=', $(this).val()); // Debug log
    filterProducts();
  });
  
  // Sort dropdown
  $('#sort-filter').on('change', function() {
    console.log('Sort changed:', $(this).val()); // Debug log
    sortProducts();
  });
  
  // Clear all filters
  $('#clear-filters').on('click', function() {
    console.log('Clearing all filters'); // Debug log
    $('#product-search').val('');
    $('#category-filter').val('');
    $('#brand-filter').val('');
    $('#price-range').val('');
    $('#sort-filter').val('name');
    $('.quick-filter').removeClass('active');
    filterProducts();
    updateFilterCount();
  });
}

function setupQuickFilters() {
  // Quick filter buttons (these are working fine, just re-initializing)
  $('.quick-filter').on('click', function() {
    const filterType = $(this).data('filter');
    const isActive = $(this).hasClass('active');
    
    console.log('Quick filter clicked:', filterType, 'Active:', isActive); // Debug log
    
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
}

function filterProducts() {
  console.log('Filtering products...'); // Debug log
  
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
  }); // Debug log
  
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
  
  console.log('Visible products:', visibleCount); // Debug log
  
  // Update results count
  $('#results-count').text(visibleCount);
  
  // Show/hide empty state
  if (visibleCount === 0) {
    $('#no-products').removeClass('d-none');
    $('#products-container').removeClass('d-none'); // Keep container visible
  } else {
    $('#no-products').addClass('d-none');
    $('#products-container').removeClass('d-none');
  }
  
  updateFilterCount();
}

function sortProducts() {
  console.log('Sorting products...'); // Debug log
  
  var sortBy = $('#sort-filter').val();
  var $container = $('#products-container');
  var $items = $('.product-item:visible').detach(); // Only sort visible items
  
  console.log('Sorting by:', sortBy, 'Items to sort:', $items.length); // Debug log
  
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
          // If you have created_at data, use it. Otherwise, sort by name
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
    
    console.log('Sorting complete'); // Debug log
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
  
  console.log('Active filters count:', activeFilters); // Debug log
}

// Quick filter functions (keeping the existing working functionality)
function applyQuickFilter(filterType) {
  console.log('Applying quick filter:', filterType); // Debug log
  
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
      // Set price range to under $50 (combining under-25 and 25-50)
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