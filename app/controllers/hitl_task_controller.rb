class HitlTaskController < ApplicationController
  
  class Array
    def shuffle
	  sort_by { rand }
    end
  end
  
  def consent
    @subject = Time.new().to_i.to_s + "_" + "%04d" % rand(1000)
	@auth_code = rand(100000000).to_s(base = 16)
  end

  def instructions
    @subject = params[:subject]
	@auth_code = params[:auth_code]
  end

  def tutorial
    @subject = params[:subject]
	@auth_code = params[:auth_code]
	
	@waypoint = Waypoint.new(:id => 0, :x => 0, :y => 0, :z => 1.65)
  end

  def task
	@subject = params[:subject]
	@auth_code = params[:auth_code]
	
	@waypoint = Waypoint.new(:id => 0, :x => 0, :y => 0, :z => 1.65)
  end

  def feedback
    @subject = params[:subject]
	@auth_code = params[:auth_code]
  end

  def thanks
    @subject = params[:subject]
    @auth_code = params[:auth_code]
	@feedback = params[:auth_code]
	
	fileName = "#{@subject}.csv"
    data_file = File.new(fileName, 'a')
    data_file.puts feedback
    data_file.close
  end

end
