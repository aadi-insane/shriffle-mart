class Product < ApplicationRecord
  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :description, presence: true
  validates :sku, uniqueness: true, allow_blank: true
  validates :stock_quantity, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :rating, numericality: { in: 0..5 }, allow_nil: true
  validates :review_count, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  
  # Scopes for filtering
  scope :available, -> { where(is_available: true) }
  scope :featured, -> { where(is_featured: true) }
  scope :in_stock, -> { where('stock_quantity > 0') }
  scope :by_category, ->(category) { where(category: category) if category.present? }
  scope :by_brand, ->(brand) { where(brand: brand) if brand.present? }
  scope :with_rating_above, ->(rating) { where('rating >= ?', rating) if rating.present? }
  
  def formatted_price
    "$#{price.to_f}"
  end
  
  def formatted_original_price
    return nil unless original_price.present?
    "$#{original_price.to_f}"
  end
  
  def discounted_price
    return price unless original_price.present? && discount_percentage.present?
    original_price * (1 - discount_percentage / 100)
  end
  
  def has_discount?
    original_price.present? && discount_percentage.present? && discount_percentage > 0
  end
  
  def savings_amount
    return 0 unless has_discount?
    original_price - discounted_price
  end
  
  def formatted_savings
    "$#{savings_amount.to_f}"
  end
  
  def in_stock?
    stock_quantity.present? && stock_quantity > 0
  end
  
  def low_stock?
    stock_quantity.present? && stock_quantity <= 5 && stock_quantity > 0
  end
  
  def out_of_stock?
    !in_stock?
  end
  
  def rating_stars
    return 0 unless rating.present?
    rating.round(1)
  end
  
  def tags_array
    return [] unless tags.present?
    tags.split(',').map(&:strip)
  end
  
  def primary_image
    image_url.present? ? image_url : "https://via.placeholder.com/300x200?text=#{name.gsub(' ', '+')}"
  end
  
  def category_display
    category.present? ? category.titleize : 'General'
  end
  
  def brand_display
    brand.present? ? brand : 'Generic'
  end
end
