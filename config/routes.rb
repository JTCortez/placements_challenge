Rails.application.routes.draw do
  get 'invoice/index'
  get 'invoice/example'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'invoice#index'
end
