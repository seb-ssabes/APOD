require 'open-uri'
require 'json'

class SearchController < ApplicationController
  def index

  end

  def api_search
    query = params[:query].downcase
    @apod_data = fetch_data

    filtered_results = @apod_data.select do |item|
      item['title'].include?(query) || item['explanation'].include?(query) || item['copyright'].include?(query)
    end

    render json: filtered_results.first(5)
  end

  private

  def fetch_data
    api_key = Rails.application.credentials.dig(:APOD, :api_key)
    url = "https://api.nasa.gov/planetary/apod?api_key=#{api_key}&count=20"

    response = URI.open(url).read
    JSON.parse(response)
  end
end
