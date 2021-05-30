
// Sometimes, we need to rate limit an API endpoint such
// that no one school can crowd out the others by making
// too many requests within a short period of time.

// Implement such a rate-limiter, limiting a school to
// 5 calls within **any** 2 second window. Pseudocode follows below.

class API {
  limiter: Limiter;

  constructor() {
    this.limiter = new Limiter();
  }

  method(school: string): string {
    if (this.limiter.limited(school)) {
      return "limited";
    }

    this.limiter.limit(school);
    return "method";
  }
}

class Limiter {
  limited(school: string): boolean {
    return false;
  }
  limit(school: string): void {}
}

const lmt = new Limiter();
lmt.limited("school"); // returns false
for (let i = 0; i < 5; i++) {
  lmt.limit("school");
}
lmt.limited("school"); // returns true
// wait two seconds...
lmt.limited("school"); // returns false
