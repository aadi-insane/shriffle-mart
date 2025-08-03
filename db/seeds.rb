# ShriffleMart Database Seeding with Luminati.io eCommerce Data
# This file imports real eCommerce data from Luminati.io CSV samples

require 'csv'

puts "🚀 Starting ShriffleMart database seeding with Luminati.io data..."

# Clear existing data (in correct order to avoid foreign key constraints)
puts "🧹 Clearing existing data..."
OrderItem.destroy_all
Order.destroy_all
Product.destroy_all

# Path to Luminati.io CSV files
csv_directory = Rails.root.join('..', 'eCommerce-dataset-samples')

# Check if CSV directory exists
unless Dir.exist?(csv_directory)
  puts "❌ Error: Luminati.io CSV directory not found at #{csv_directory}"
  puts "Please ensure the eCommerce-dataset-samples repository is cloned in the parent directory."
  exit 1
end

# Available CSV files to import
csv_files = [
  { file: 'amazon-products.csv', name: 'Amazon Products', limit: 50 },
  { file: 'walmart-products.csv', name: 'Walmart Products', limit: 30 },
  { file: 'shopee-products.csv', name: 'Shopee Products', limit: 20 }
]

total_imported = 0
total_errors = []

# Import products from each CSV file
csv_files.each do |csv_info|
  csv_path = File.join(csv_directory, csv_info[:file])
  
  unless File.exist?(csv_path)
    puts "⚠️  Skipping #{csv_info[:name]} - file not found: #{csv_path}"
    next
  end
  
  puts "\n📦 Importing #{csv_info[:name]} from #{csv_info[:file]}..."
  puts "   Limiting to #{csv_info[:limit]} products for demo purposes"
  
  begin
    imported_count = 0
    errors = []
    
    # Read and process CSV with limit
    CSV.foreach(csv_path, headers: true, header_converters: :symbol) do |row|
      break if imported_count >= csv_info[:limit]
      
      # Skip rows with missing essential data
      next if row[:title].blank? && row[:product_name].blank?
      next if row[:final_price].blank? && row[:price].blank?
      
      begin
        # Use our CSV import service to map the data
        service = CsvImportService.new
        product_data = service.send(:map_csv_row_to_product, row)
        
        # Skip if no valid data extracted
        next if product_data[:name].blank? || product_data[:price].blank?
        
        # Create or find product by SKU
        if product_data[:sku].present?
          product = Product.find_or_initialize_by(sku: product_data[:sku])
        else
          product = Product.new
        end
        
        # Assign attributes
        product.assign_attributes(product_data)
        
        # Ensure required fields have values
        product.name = product.name.truncate(255) if product.name.present?
        product.description = product.description.truncate(1000) if product.description.present?
        product.is_available = true if product.is_available.nil?
        
        # Set some products as featured (randomly)
        product.is_featured = [true, false].sample if product.is_featured.nil?
        
        if product.save
          imported_count += 1
          print "."
        else
          errors << "Row #{$.}: #{product.errors.full_messages.join(', ')}"
        end
        
      rescue => e
        errors << "Row #{$.}: #{e.message}"
      end
    end
    
    puts "\n✅ Successfully imported #{imported_count} products from #{csv_info[:name]}"
    total_imported += imported_count
    total_errors.concat(errors)
    
    if errors.any?
      puts "⚠️  #{errors.count} errors occurred during import"
      errors.first(3).each { |error| puts "   - #{error}" }
      puts "   ... and #{errors.count - 3} more errors" if errors.count > 3
    end
    
  rescue => e
    puts "❌ Error importing #{csv_info[:name]}: #{e.message}"
    total_errors << "#{csv_info[:name]}: #{e.message}"
  end
end

# Create sample users if none exist
if User.count == 0
  puts "\n👥 Creating sample users..."
  
  sample_users = [
    {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      password_confirmation: "password123"
    },
    {
      name: "Jane Smith", 
      email: "jane@example.com",
      password: "password123",
      password_confirmation: "password123"
    },
    {
      name: "Admin User",
      email: "admin@shrifflemart.com",
      password: "admin123",
      password_confirmation: "admin123"
    },
    {
      name: "Aditya Aerpule",
      email: "aditya@example.com", 
      password: "password123",
      password_confirmation: "password123"
    }
  ]
  
  sample_users.each do |user_data|
    User.create!(user_data)
  end
  
  puts "✅ Created #{User.count} sample users"
end

# Display final statistics
puts "\n" + "="*60
puts "🎉 DATABASE SEEDING COMPLETED!"
puts "="*60

puts "\n📊 IMPORT SUMMARY:"
puts "   Total products imported: #{total_imported}"
puts "   Total errors: #{total_errors.count}"
puts "   Success rate: #{((total_imported.to_f / (total_imported + total_errors.count)) * 100).round(1)}%"

puts "\n📈 PRODUCT STATISTICS:"
puts "   Total products in database: #{Product.count}"
puts "   Available products: #{Product.available.count}"
puts "   Featured products: #{Product.featured.count}"
puts "   Products in stock: #{Product.in_stock.count}"

if Product.any?
  puts "   Average price: $#{Product.average(:price).round(2)}"
  puts "   Price range: $#{Product.minimum(:price).round(2)} - $#{Product.maximum(:price).round(2)}"
  
  categories = Product.distinct.pluck(:category).compact
  puts "   Categories (#{categories.count}): #{categories.first(5).join(', ')}#{categories.count > 5 ? '...' : ''}"
  
  brands = Product.distinct.pluck(:brand).compact
  puts "   Brands (#{brands.count}): #{brands.first(5).join(', ')}#{brands.count > 5 ? '...' : ''}"
end

puts "\n👥 USER ACCOUNTS:"
puts "   Total users: #{User.count}"
User.all.each do |user|
  puts "   - #{user.name} (#{user.email})"
end

puts "\n🚀 READY TO GO!"
puts "   Start the server with: rails server"
puts "   Visit: http://localhost:3000"
puts "   Login with any user above using password: password123 (or admin123 for admin)"

if total_errors.any?
  puts "\n⚠️  IMPORT WARNINGS:"
  puts "   #{total_errors.count} errors occurred during import"
  puts "   Check the errors above for details"
end

puts "\n💡 TIP: The application now contains real eCommerce data from:"
puts "   • Amazon products with ratings, reviews, and detailed information"
puts "   • Walmart products with specifications and availability"
puts "   • Shopee products with various categories and brands"
puts "\n   This provides a realistic shopping experience for testing!"
puts "="*60