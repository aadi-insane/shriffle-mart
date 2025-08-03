Rails.application.routes.draw do
  # Set root path to products homepage
  root 'products#index'
  
  # Authentication routes
  get '/register', to: 'users#new'
  post '/register', to: 'users#create'
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  
  # User routes (for form_with model: @user)
  resources :users, only: [:new, :create]
  
  # Product routes
  resources :products, only: [:index, :show]
  
  # Cart routes
  get '/cart', to: 'cart#show'
  post '/cart/add/:id', to: 'cart#add_item', as: 'add_to_cart'
  delete '/cart/remove/:id', to: 'cart#remove_item', as: 'remove_from_cart'
  patch '/cart/update_quantity/:id', to: 'cart#update_quantity', as: 'update_cart_quantity'
  delete '/cart/clear', to: 'cart#clear', as: 'clear_cart'
  
  # Order routes
  resources :orders, only: [:new, :create, :show]
  
  # Dashboard routes
  get '/dashboard', to: 'dashboard#index', as: 'dashboard_index'
  get '/dashboard/profile', to: 'dashboard#profile', as: 'dashboard_profile'
  patch '/dashboard/profile', to: 'dashboard#update_profile', as: 'dashboard_update_profile'
  get '/dashboard/orders', to: 'dashboard#orders', as: 'dashboard_orders'
  get '/dashboard/addresses', to: 'dashboard#addresses', as: 'dashboard_addresses'
  
  # Address routes
  resources :addresses, only: [:create, :update, :destroy] do
    member do
      patch :set_default
    end
  end
  
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end
