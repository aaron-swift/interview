class API
	def initialize
		@limiter = Limiter.new
	end

	sig { params(school: String).returns(String) }
	def some_api_endpoint(school)
		if @limiter.limited?(school)
			return “limited”
		else
			@limiter.limit!(school)
			return “resource”
		end
	end
end

class Limiter 
	sig { params(school: String).returns(Boolean) }
	def limited?; end

	sig { params(school: String).void }
	def limit!; end
end

lmt = Limiter.new
lmt.limited?(“school”) # should return false
5.times { lmt.limit!(“school”) }
lmt.limited?(“school”) # should return true
# wait two seconds…
lmt.limited?(“school”) # should return false
