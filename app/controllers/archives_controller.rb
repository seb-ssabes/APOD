require 'open-uri'
require 'json'

class ArchivesController < ApplicationController
  before_action :fetch_year_data
  def index
    per_page = 30
    page = (params[:page] || 1).to_i
    @paginated_data = @apod_data[((page - 1) * per_page)...(page * per_page)]
    @total_pages = (@apod_data.size / per_page.to_f).ceil
  end

  private

  def fetch_year_data
    api_key = Rails.application.credentials.dig(:APOD, :api_key)
    start_date = Date.new(2024, 11, 4)
    end_date = Date.today

    url = "https://api.nasa.gov/planetary/apod?api_key=#{api_key}&end_date=#{end_date}&start_date=#{start_date}"
    response = URI.open(url).read
    @apod_data = JSON.parse(response).reverse
  end
end
