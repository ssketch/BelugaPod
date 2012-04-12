class HitlTaskController < ApplicationController
  
  def consent
    @subject = Time.new().to_i.to_s + "_" + "%04d" % rand(1000)
  end

  def instructions
    @subject = params[:subject]
  end

  def tutorial
    @subject = params[:subject]
	@waypoint = Waypoint.new(:id => 0, :x => 0, :y => 0, :z => 1.8)  # 1.8 m = webcam height
	@param = Param.new(:string => 7500)								 # between fast and slow timings
  end

  def task
	@subject = params[:subject]
	@waypoint = Waypoint.new(:id => 0, :x => 0, :y => 0, :z => 1.8)
	@param = Param.new(:string => 0)								 # timing will be set in javascript
  end
  
  def task_infmodel
	@subject = params[:subject]
	@surface = params[:nextSurface]
	@waypoint = Waypoint.new(:id => 0, :x => 0, :y => 0, :z => 1.8)
	@param = Param.new(:string => 5000)								 # fast timing
  end

  def processData
	@subject = params[:subject]
	@block = params[:block].to_i
	@timing = params[:timing].to_i
	@surface = params[:surface].to_i
	@trial = params[:trial].to_i
	@waypointX = params[:waypointX].to_i
	@waypointY = params[:waypointY].to_i
	@reward = params[:reward].to_i
	
    @data = [@subject, @block, @timing, @surface, @trial, @waypointX, @waypointY, @reward]
	
	fileName = "#{@subject}.csv"
	data_file = File.new(fileName, 'a')
	data_file.puts @data.join(',')
	data_file.close
  end

  def feedback
    @subject = params[:subject]
  end

  def thanks
    @subject = params[:subject]
	@feedback = params[:feedback]
	
	fileName = "#{@subject}.csv"
    data_file = File.new(fileName, 'a')
    data_file.puts @feedback
    data_file.close
  end

end
