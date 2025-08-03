module CartHelper
  extend ActiveSupport::Concern
  
  private
  
  def clean_cart
    # Remove any product IDs that no longer exist in the database
    invalid_ids = []
    
    cart.each do |product_id, quantity|
      begin
        Product.find(product_id)
      rescue ActiveRecord::RecordNotFound
        invalid_ids << product_id
      end
    end
    
    # Remove invalid product IDs from cart
    invalid_ids.each { |id| cart.delete(id) }
    
    # Show message if any items were removed
    if invalid_ids.any?
      flash[:alert] = "Some items in your cart are no longer available and have been removed."
    end
  end
  
  def cart_items_with_details
    cart.map do |product_id, quantity|
      begin
        product = Product.find(product_id)
        {
          product: product,
          quantity: quantity,
          subtotal: product.price * quantity
        }
      rescue ActiveRecord::RecordNotFound
        # Skip invalid products (they should be cleaned by clean_cart method)
        nil
      end
    end.compact
  end
  
  def calculate_total
    cart_items_with_details.sum { |item| item[:subtotal] }
  end
end