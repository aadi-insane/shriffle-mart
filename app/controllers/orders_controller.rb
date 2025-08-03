class OrdersController < ApplicationController
  include CartHelper
  before_action :require_login
  before_action :require_cart_items, only: [:new, :create]
  
  def new
    clean_cart # Remove any invalid product IDs
    @order = Order.new
    @cart_items = cart_items_with_details
    @total = calculate_total
    @saved_addresses = current_user.addresses.order(is_default: :desc, created_at: :desc)
  end
  
  def create
    @order = current_user.orders.build(order_params)
    @order.total = calculate_total
    
    # Validate address selection
    if params[:selected_address_id].blank? || params[:selected_address_id].empty?
      flash[:alert] = "Please select a delivery address."
      @cart_items = cart_items_with_details
      @total = calculate_total
      @saved_addresses = current_user.addresses.order(is_default: :desc, created_at: :desc)
      render :new and return
    end
    
    # Handle address selection
    if params[:selected_address_id].present? && params[:selected_address_id] != "new"
      # Use existing address
      begin
        address = current_user.addresses.find(params[:selected_address_id])
        @order.address = address.full_address
      rescue ActiveRecord::RecordNotFound
        flash[:alert] = "Selected address not found. Please choose a valid address."
        @cart_items = cart_items_with_details
        @total = calculate_total
        @saved_addresses = current_user.addresses.order(is_default: :desc, created_at: :desc)
        render :new and return
      end
    elsif params[:selected_address_id] == "new"
      # Validate new address fields
      required_fields = [:new_address_line_1, :new_address_city, :new_address_state, :new_address_postal_code, :new_address_country]
      missing_fields = required_fields.select { |field| params[field].blank? }
      
      if missing_fields.any?
        field_names = missing_fields.map { |field| field.to_s.humanize.gsub('New address ', '') }
        flash[:alert] = "Please fill in all required address fields: #{field_names.join(', ')}"
        @cart_items = cart_items_with_details
        @total = calculate_total
        @saved_addresses = current_user.addresses.order(is_default: :desc, created_at: :desc)
        render :new and return
      end
      
      # Create address string from form data
      address_parts = [
        params[:new_address_line_1],
        params[:new_address_line_2],
        params[:new_address_city],
        params[:new_address_state],
        params[:new_address_postal_code],
        params[:new_address_country]
      ].compact.reject(&:blank?)
      
      @order.address = address_parts.join(', ')
      
      # Save new address if requested
      if params[:save_new_address] == "true"
        new_address = current_user.addresses.build(
          name: params[:new_address_name].present? ? params[:new_address_name] : "Address #{current_user.addresses.count + 1}",
          address_line_1: params[:new_address_line_1],
          address_line_2: params[:new_address_line_2],
          city: params[:new_address_city],
          state: params[:new_address_state],
          postal_code: params[:new_address_postal_code],
          country: params[:new_address_country],
          is_default: current_user.addresses.empty? # Set as default if it's the first address
        )
        
        unless new_address.save
          flash[:alert] = "Error saving address: #{new_address.errors.full_messages.join(', ')}"
          @cart_items = cart_items_with_details
          @total = calculate_total
          @saved_addresses = current_user.addresses.order(is_default: :desc, created_at: :desc)
          render :new and return
        end
      end
    end
    
    if @order.save
      create_order_items
      session[:cart] = {}
      flash[:notice] = "Order placed successfully!"
      redirect_to order_path(@order)
    else
      @cart_items = cart_items_with_details
      @total = calculate_total
      @saved_addresses = current_user.addresses.order(is_default: :desc, created_at: :desc)
      render :new
    end
  end
  
  def show
    @order = current_user.orders.find(params[:id])
  end
  
  private
  
  def order_params
    params.require(:order).permit(:name, :email, :address)
  end
  
  def require_cart_items
    if cart.empty?
      flash[:alert] = "Your cart is empty"
      redirect_to cart_path
    end
  end
  
  def create_order_items
    cart.each do |product_id, quantity|
      product = Product.find(product_id)
      @order.order_items.create!(
        product: product,
        quantity: quantity,
        price: product.price
      )
    end
  end
end
