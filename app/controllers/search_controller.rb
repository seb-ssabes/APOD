require 'open-uri'
require 'json'

class SearchController < ApplicationController
  def index

  end



  def api_search
    query = params[:query].to_s.strip.downcase

    if valid_date_format?(query)
      apod_data = fetch_data(query)
      filtered_results = apod_data ? [apod_data] : []
    else
      apod_data = fetch_data(nil, 50)
      filtered_results = filter_data(apod_data, query)
    end

    limited_results = filtered_results.take(50)

    render json: {
      filtered_results: limited_results,
      total_matches: filtered_results.size,
    }

  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end

  private

  def fetch_data(date = nil, limit = 50)
    api_key = Rails.application.credentials.dig(:APOD, :api_key)

    if date
      url = "https://api.nasa.gov/planetary/apod?api_key=#{api_key}&date=#{date}"
    else
      url = "https://api.nasa.gov/planetary/apod?api_key=#{api_key}&count=#{limit}"
    end

    Rails.logger.debug "Requesting URL: #{url}"

    begin
      response = URI.open(url).read
      JSON.parse(response)
    rescue OpenURI::HTTPError => e
      Rails.logger.error "NASA API Error: #{e.message}"
      return []
    end
  end

  def filter_data(apod_data, query)
    query = query.to_s.downcase

    apod_data = [apod_data] unless apod_data.is_a?(Array)

    apod_data.select do |item|
      item['title'].to_s.downcase.include?(query) ||
      item['explanation'].to_s.downcase.include?(query) ||
      item['copyright'].to_s.downcase.include?(query)
    end
  end

  def valid_date_format?(query)
    query.match?(/\A\d{4}-\d{2}-\d{2}\z/)
  end
end
