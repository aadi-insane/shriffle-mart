class CartController < ApplicationController
  include CartHelper
  before_action :require_login
  
  def show
    clean_cart # Remove any invalid product IDs
    @cart_items = cart_items_with_details
    @total = calculate_total
  end
  
  def add_item
    product = Product.find(params[:id])
    cart[product.id.to_s] = (cart[product.id.to_s] || 0) + 1
    
    respond_to do |format|
      format.html do
        flash[:notice] = "#{product.name} added to cart!"
        redirect_back(fallback_location: products_path)
      end
      format.json do
        render json: { 
          success: true, 
          message: "#{product.name} added to cart!",
          cart_count: cart_count 
        }
      end
    end
  end
  
  def remove_item
    product = Product.find(params[:id])
    
    if params[:remove_all] == "true"
      # Remove all quantities of this product
      cart.delete(product.id.to_s)
      flash[:notice] = "All #{product.name} removed from cart"
    else
      # Remove just one quantity
      if cart[product.id.to_s] && cart[product.id.to_s] > 1
        cart[product.id.to_s] -= 1
        flash[:notice] = "One #{product.name} removed from cart"
      else
        cart.delete(product.id.to_s)
        flash[:notice] = "#{product.name} removed from cart"
      end
    end
    
    redirect_to cart_path
  end
  
  def update_quantity
    product = Product.find(params[:id])
    quantity_action = params[:quantity_action] # Use a different parameter name to avoid Rails conflict
    
    case quantity_action
    when 'increase'
      cart[product.id.to_s] = (cart[product.id.to_s] || 0) + 1
    when 'decrease'
      if cart[product.id.to_s] && cart[product.id.to_s] > 1
        cart[product.id.to_s] -= 1
      else
        cart.delete(product.id.to_s)
      end
    end
    
    quantity = cart[product.id.to_s] || 0
    subtotal = quantity * product.price.to_f
    total = calculate_total
    
    respond_to do |format|
      format.json do
        render json: {
          success: true,
          quantity: quantity,
          subtotal: subtotal.to_f,
          total: total.to_f,
          cart_count: cart_count
        }
      end
    end
  end
  
  def clear
    session[:cart] = {}
    flash[:notice] = "Cart cleared"
    redirect_to cart_path
  end
end
