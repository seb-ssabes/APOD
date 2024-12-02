Rails.application.routes.draw do
  root 'home#index'
  get "/apod/:date", to: "home#index", as: :apod_date

  get "/archives/index", to: "archives#index"
end
