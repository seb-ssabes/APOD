require 'open-uri'
require 'json'

class SearchController < ApplicationController
  def index

  end

  def api_search
    query = params[:query].downcase

    # @apod_data = fetch_data

    is_date = false
    date_query = nil

    begin
      date_query = Date.parse(query).strftime('%Y-%m-%d')
      is_date = true
    rescue ArgumentError
    end

    if is_date
      apod_data = fetch_data(date_query)
      filtered_results = apod_data ? [apod_data] : []
    else
      filtered_results = @apod_data.select do |item|
        item['title'].to_s.include?(query) ||
        item['explanation'].to_s.include?(query) ||
        item['copyright'].to_s.include?(query)
      end
    end

    render json: {
      filtered_results: filtered_results,
      total_matches: filtered_results.size,
    }

  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end

  private

  def fetch_data(date = nil)
    api_key = Rails.application.credentials.dig(:APOD, :api_key)

    if date
      url = "https://api.nasa.gov/planetary/apod?api_key=#{api_key}&date=#{date}"
    else
      url = "https://api.nasa.gov/planetary/apod?api_key=#{api_key}&count=30"
    end

    response = URI.open(url).read
    JSON.parse(response)
  end
end
