class Address < ApplicationRecord
  belongs_to :user
  
  validates :name, :address_line_1, :city, :state, :postal_code, :country, presence: true
  
  before_save :ensure_only_one_default
  
  def full_address
    [address_line_1, address_line_2, city, state, postal_code, country].compact.join(', ')
  end
  
  private
  
  def ensure_only_one_default
    if is_default?
      user.addresses.where.not(id: id).update_all(is_default: false)
    end
  end
end
