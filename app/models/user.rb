class User < ApplicationRecord
  has_secure_password
  has_many :orders, dependent: :destroy
  has_many :addresses, dependent: :destroy
  
  validates :name, presence: true, length: { minimum: 2 }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
  
  def default_address
    addresses.find_by(is_default: true) || addresses.first
  end
end
