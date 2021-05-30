
// Sometimes, we need to rate limit an API endpoint such
// that no one school can crowd out the others by making
// too many requests within a short period of time.

// Implement such a rate-limiter, limiting a school to
// 5 calls within **any** 2 second window. Pseudocode follows below.

// interface
interface RateLimiter {
  boolean limited(String school);
  void limit(String school);
}

// example usage
class API {
  RateLimiter limiter;
  constructor() {
    limiter = new RateLimiter();
  }

  String someApiEndpoint(String school) {
    if (this.limiter.limited(school)) {
      return "rate limited";
    }

    this.limiter.limit(school);
    return "resource";
  }
}

// demo
API api = new API();
for (int i = 0; i < 5; i++) {
  api.someApiEndpoint("school_a"); // returns "resource"
}
api.someApiEndpoint("school_a") // returns "rate limited"
// wait two seconds
api.someApiEndpoint("school_a") // returns "resource"

