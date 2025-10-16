require 'json'
require 'open-uri'

class HomeController < ApplicationController
  def index
    api_key = Rails.application.credentials.dig(:APOD, :api_key)
    date = params[:date] || Date.today.to_s

    url = "https://api.nasa.gov/planetary/apod?api_key=#{api_key}&date=#{date}"

    begin
      response = URI.open(url, read_timeout: 10).read
      @apod_data = JSON.parse(response)

      if !@apod_data['explanation'].downcase.include?("explanation")
        @apod_data['explanation'] = @apod_data['explanation'].split(/ {4,}/).first
      end

      Rails.logger.info "APOD Data: #{@apod_data.inspect}"

    rescue StandardError => e
      Rails.logger.error "NASA APOD API error: #{e.message}"

      # Show a clear message to the user
      flash.now[:alert] = "⚠️ NASA APOD API is not responding.
      Due to the lapse in federal government funding, NASA is not updating this website.
      We sincerely regret this inconvenience."

      # Instead of continuing to render the normal APOD page,
      # render a simple 'api_down' page and stop here.
      render 'api_down', status: :service_unavailable
      return
    end
  end
end

