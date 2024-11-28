Rails.application.routes.draw do
  root 'home#index'
  get "/apod/:date", to: "home#index", as: :apod_date
end
