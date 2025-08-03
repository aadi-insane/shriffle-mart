# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"

# Pin custom JavaScript files
pin "cart", to: "cart.js"
pin "cart_preview", to: "cart_preview.js"
pin "checkout", to: "checkout.js"