class Order < ApplicationRecord
  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :products, through: :order_items
  
  validates :name, :email, :address, presence: true
  validates :total, presence: true, numericality: { greater_than: 0 }
end
