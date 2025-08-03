class AddressesController < ApplicationController
  before_action :require_login
  before_action :find_address, only: [:update, :destroy, :set_default]
  
  def create
    @address = current_user.addresses.build(address_params)
    
    if @address.save
      flash[:notice] = "Address added successfully!"
    else
      flash[:alert] = "Error adding address: #{@address.errors.full_messages.join(', ')}"
    end
    
    redirect_to dashboard_addresses_path
  end

  def update
    if @address.update(address_params)
      flash[:notice] = "Address updated successfully!"
    else
      flash[:alert] = "Error updating address: #{@address.errors.full_messages.join(', ')}"
    end
    
    redirect_to dashboard_addresses_path
  end

  def destroy
    @address.destroy
    flash[:notice] = "Address deleted successfully!"
    redirect_to dashboard_addresses_path
  end

  def set_default
    @address.update(is_default: true)
    flash[:notice] = "Default address updated!"
    redirect_to dashboard_addresses_path
  end
  
  private
  
  def find_address
    @address = current_user.addresses.find(params[:id])
  end
  
  def address_params
    params.require(:address).permit(:name, :address_line_1, :address_line_2, :city, :state, :postal_code, :country, :is_default)
  end
end
