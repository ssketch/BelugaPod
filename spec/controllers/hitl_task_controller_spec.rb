require 'spec_helper'

describe HitlTaskController do

  describe "GET 'consent'" do
    it "returns http success" do
      get 'consent'
      response.should be_success
    end
  end

  describe "GET 'instructions'" do
    it "returns http success" do
      get 'instructions'
      response.should be_success
    end
  end

  describe "GET 'tutorial'" do
    it "returns http success" do
      get 'tutorial'
      response.should be_success
    end
  end

  describe "GET 'task'" do
    it "returns http success" do
      get 'task'
      response.should be_success
    end
  end

  describe "GET 'feedback'" do
    it "returns http success" do
      get 'feedback'
      response.should be_success
    end
  end

  describe "GET 'thanks'" do
    it "returns http success" do
      get 'thanks'
      response.should be_success
    end
  end

end
