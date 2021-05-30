
###########
# Pair programming: The Time-Traveling Key-Value Store
###########
# For certain data likely to change -- like quantity of a medication --
# we often need to be able to answer what the value was at any given
# point in time.
#
# Construct a data store, called a time-traveling key-value store
# (or TTKV) that satisfies this requirement.
##########

class TTKV
  # sig {params(key: String, timestamp: T.nilable(Integer))).returns(T.any)}
  def get(key, timestamp = nil); end

  # sig {params(key, value: T.any).void}
  def put (key, value); end
end

ttkv = TTKV.new

ttkv.put("a", 1) # Time.now.to_i => 4500
ttkv.put("a", 5) # Time.now.to_i => 7000
ttkv.put("a", 7) # Time.now.to_i => 9000

ttkv.get("a") # 7
ttkv.get("a", 7500) # 5
ttkv.get("a", 5000) $ 1
ttkv.get("a", 2000) # nil
ttkv.get("b") # nil