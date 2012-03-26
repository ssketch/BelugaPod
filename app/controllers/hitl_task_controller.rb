class HitlTaskController < ApplicationController
  
  def consent
    @subject = Time.new().to_i.to_s + "_" + "%04d" % rand(1000)
	@auth_code = rand(100000000).to_s(base = 16)
  end

  def instructions
    @subject = params[:subject]
	
	@auth_code = nil
	@block = nil
	@timingOrder = nil
	@surfaceOrder = nil
	@dynamicsOrder = nil
  end

  def tutorial
    @waypoint = Waypoint.new(:id => 0, :x => 0, :y => 0, :z => 0)
  end

  def task
    @waypoint = Waypoint.new(:id => 0, :x => 0, :y => 0, :z => 0)
  end

  def feedback
  end

  def thanks
  end

end
