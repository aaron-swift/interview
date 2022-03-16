#!/usr/bin/python
# -*- coding: utf-8 -*-

# Sometimes, we need to rate limit an API endpoint such
# that no one school can crowd out the others by making
# too many requests within a short period of time.

# Implement such a rate-limiter, limiting a school to
# 5 calls within **any** 2 second window. Pseudocode follows below.

class API:
    def __init__(self):
        self.limiter = Limiter()

    def some_api_endpoint(self, school):
        if self.limiter.is_limited(school):
            return 'limited'
        else:
            self.limiter.limit(school)
            return 'resoource'


class Limiter:
    def is_limited(self, school):
        pass

    def limit(self, school):
        pass


lmt = Limiter()
lmt.is_limited('school')  # should return false

for i in range(5):
    lmt.limit('school')
lmt.is_limited('school')  # should return true

# wait two seconds...
lmt.is_limited('school') # should return false
