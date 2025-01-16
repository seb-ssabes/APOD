require 'json'
require 'open-uri'


class HomeController < ApplicationController
  def index
    api_key = Rails.application.credentials.dig(:APOD, :api_key)
    date = params[:date] || Date.today.to_s

    url = "https://api.nasa.gov/planetary/apod?api_key=#{api_key}&date=#{date}"

    response = URI.open(url).read
    @apod_data = JSON.parse(response)

    if !@apod_data['explanation'].downcase.include?("explanation")
      @apod_data['explanation'] = @apod_data['explanation'].split(/ {3,}/).first
    end

    Rails.logger.info "APOD Copyright Field: #{@apod_data['copyright'] || 'Missing'}"
    Rails.logger.info "APOD Data: #{@apod_data.inspect}"
  end
end
