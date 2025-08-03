class DashboardController < ApplicationController
  before_action :require_login
  
  def index
    @recent_orders = current_user.orders.order(created_at: :desc).limit(5)
    @total_orders = current_user.orders.count
    @addresses_count = current_user.addresses.count
  end

  def profile
    @user = current_user
  end
  
  def update_profile
    @user = current_user
    if @user.update(user_params)
      flash[:notice] = "Profile updated successfully!"
      redirect_to dashboard_profile_path
    else
      render :profile
    end
  end

  def orders
    @orders = current_user.orders.order(created_at: :desc).includes(:order_items, :products)
  end

  def addresses
    @addresses = current_user.addresses.order(is_default: :desc, created_at: :desc)
    @new_address = Address.new
  end
  
  private
  
  def user_params
    params.require(:user).permit(:name, :email)
  end
end
