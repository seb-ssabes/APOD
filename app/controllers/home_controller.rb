require 'json'
require 'open-uri'


class HomeController < ApplicationController
  def index
    api_key = Rails.application.credentials.dig(:APOD, :api_key)

    url = "https://api.nasa.gov/planetary/apod?api_key=#{api_key}"

    response = URI.open(url).read
    @apod_data = JSON.parse(response)
  end
end
