require 'open-uri'
require 'json'

class SearchController < ApplicationController
  def index

  end

  def api_search
    query = params[:query].downcase
    date = params[:date]

    apod_data = fetch_data(date)

    if date.present?
      filtered_results = apod_data
    else
      filtered_results = filter_data(apod_data, query)
    end

    limited_results = filtered_results.take(60)

    render json: {
      filtered_results: limited_results,
      total_matches: filtered_results.size,
    }

  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end

  private

  def fetch_data(date = nil, limit = 60)
    api_key = Rails.application.credentials.dig(:APOD, :api_key)

    if date
      url = "https://api.nasa.gov/planetary/apod?api_key=#{api_key}&date=#{date}"
    else
      url = "https://api.nasa.gov/planetary/apod?api_key=#{api_key}&count=#{limit}"
    end

    response = URI.open(url).read
    JSON.parse(response)
  end

  def filter_data(apod_data, query)
    query = query.downcase

    apod_data = [apod_data] unless apod_data.is_a?(Array)

    apod_data.select do |item|
      item['title'].to_s.downcase.include?(query) ||
      item['explanation'].to_s.downcase.include?(query) ||
      item['copyright'].to_s.downcase.include?(query)
    end
  end
end
