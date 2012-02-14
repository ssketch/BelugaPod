class BelugaSocket < ActiveRecord::Base
  set_table_name :empty_table

  def self.exchange input
    begin
      self.sock.puts input
      self.sock.gets
    rescue
      # if there was an error, it's probably because the socket
      #  got messed up.  try closing it and reopening (note
      #  that the app module takes care of reopening the socket).
      #
      # This will still fail if the server is not running at all.
      self.sock.close

      self.sock.puts input
      self.sock.gets
    end
  end

  def self.sock
    unless @sock
      @sock = TCPsocket.open('127.0.0.1', 1234)
      @sock.gets
    end
    @sock
  end

  def self.close
    self.sock.close
  end

end
