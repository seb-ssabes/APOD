Rails.application.routes.draw do
  root 'home#index'

  get "/apod/:date", to: "home#index", as: :apod_date

  get "/archives", to: "archives#index"

  get "/search", to: "search#index"
  get "/search/api_search", to: "search#api_search"
end
