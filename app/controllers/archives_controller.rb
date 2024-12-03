require 'open-uri'
require 'json'

class ArchivesController < ApplicationController
  def index
    per_page = 30
    page = params[:page].present? ? params[:page].to_i : 0

    if page == 0
      end_date = Date.today
      start_date = end_date - (per_page - 1)
    else
      end_date = Date.today - (page * per_page)
      start_date = end_date - (per_page - 1)
    end

    @apod_data = fetch_range_data(start_date.to_s, end_date.to_s)
  end

  private

  def fetch_range_data(start_date, end_date)
    api_key = Rails.application.credentials.dig(:APOD, :api_key)

    url = "https://api.nasa.gov/planetary/apod?api_key=#{api_key}&start_date=#{start_date}&end_date=#{end_date}"
    Rails.logger.info "Fetching URL: #{url}"
    response = URI.open(url).read
    @apod_data = JSON.parse(response).reverse
  end
end
