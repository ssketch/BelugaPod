class Kinematic < ActiveRecord::Base
  set_table_name :empty_table
  
  attr_accessor :id, :speed, :omega, :zdot, :max_speed, :max_omega, :max_zdot
  attr_accessible :id, :speed, :omega, :zdot, :max_speed, :max_omega, :max_zdot

  validates_presence_of :id
  validates_presence_of :speed
  validates_presence_of :omega
  validates_presence_of :zdot

  def self.all
    r = BelugaSocket.exchange "get control *"
    d = r.split

    mode = d[0]

    return [] unless mode == "kinematics"
    
    d = d[1..-1].collect{ |d| d.to_f }
    out = []
    i = -1;
    d.each_slice(3){ |s| out << Kinematic.new(:id => (i += 1),
                                              :speed => s[0],
                                              :omega => s[1],
                                              :zdot => s[2])}
    out
  end
  
  def self.find id
    id = id.to_i
    return nil unless (0..3).include?(id)

    r = BelugaSocket.exchange "get control #{id}"
    d = r.split
    mode = d[0]

    return nil unless mode == "kinematics"
    
    d = d[1..-1].collect{ |d| d.to_f }
    return Kinematic.new(:id => id, :x => d[0], :y => d[1], :z => d[2])
  end

  def to_s
    "#{speed} #{omega} #{zdot}"
  end

  def save
    if id
      BelugaSocket.exchange "set control kinematics #{id} #{speed} #{omega} #{zdot}"
      true
    else
      false
    end
  end
  
  
end
