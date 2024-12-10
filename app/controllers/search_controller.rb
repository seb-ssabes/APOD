require 'open-uri'
require 'json'

class SearchController < ApplicationController
  def index

  end

  def api_search
    query = params[:query].downcase

    @apod_data = fetch_data

    filtered_results = @apod_data.select do |item|
      item['title'].to_s.include?(query) || item['explanation'].to_s.include?(query) || item['copyright'].to_s.include?(query)
    end

    render json: {
      filtered_results: filtered_results,
      total_matches: filtered_results.size,
    }

  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end

  private

  def fetch_data
    api_key = Rails.application.credentials.dig(:APOD, :api_key)
    url = "https://api.nasa.gov/planetary/apod?api_key=#{api_key}&count=30"

    response = URI.open(url).read
    JSON.parse(response)
  end
end
