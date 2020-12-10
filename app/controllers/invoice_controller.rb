class InvoiceController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json { render json: placements_teaser_data }
    end
  end

  def example
    render plain: JSON.pretty_generate(
      JSON.parse(placements_teaser_data)[0..2]
    )
  end

private

  def placements_teaser_data
    File.read(
      Rails.root.join(
        'public', 'placements_teaser_data.json',
      )
    )
  end
end
