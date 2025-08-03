class AddEcommerceFieldsToProducts < ActiveRecord::Migration[7.1]
  def change
    add_column :products, :category, :string
    add_column :products, :brand, :string
    add_column :products, :sku, :string
    add_column :products, :stock_quantity, :integer
    add_column :products, :rating, :decimal
    add_column :products, :review_count, :integer
    add_column :products, :tags, :text
    add_column :products, :original_price, :decimal
    add_column :products, :discount_percentage, :decimal
    add_column :products, :is_featured, :boolean
    add_column :products, :is_available, :boolean
    add_column :products, :weight, :decimal
    add_column :products, :dimensions, :string
    add_column :products, :color, :string
    add_column :products, :size, :string
    add_column :products, :material, :string
  end
end
