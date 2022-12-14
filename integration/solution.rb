###########
# Integration: Oh No-VID!
###########
# The front office has just sent word of a COVID exposure on campus!
# Little Joseph Smith started feeling ill this morning and has since
# tested positive for the virus. We need to immediately prepare a list
# of students to dismiss to prevent further contagion. It's up to you,
# dear programmer, to save the day!
#
# For our purposes, we consider all the siblings of Joseph Smith as
# likely to be infected as well. We need to find the names of all students
# that share any class (called a "group" by the SIS) with any of the 
# Smith children. Write a script that calculates and prints these names. 
##########
# Unfortunately, our SIS backend is pretty primitive and supports only
# a few API methods:
#
# ROOT = https://august-interview.herokuapp.com/
#
# GET /students.json?first_name=<String>&last_name=<String>
# Returns students with a given first name and last name.
#
# GET /students.json?id=<String>
# Returns students with a given id. Ids are unique. 
#
# GET /groups.json?student=<String>
# Returns the groups (ie "classes") enrolled by the student with a given id
#
# A student has the following shape:
# {
#   'id' => {
#     '$oid' => '60ac2e5ef6f40719fae44a0c'
#   },
#   'first_name' => 'Joseph',
#   'last_name' => 'Smith',
#   'sibling_ids' => [
#     { '$oid' => '60ac2e5ef6f40719fae44a0d' },
#     { '$oid' => '60ac2e5ef6f40719fae44a0e' }
#   ],
# }
#
# A group (or class) looks like this:
# {
#   "_id": {
#     "$oid": '60ac32ff71c27e0004f6e964'
#   },
#   "name": 'Year 2008 - Group 0',
#   "student_ids": [
#     { "$oid": '60ac32f071c27e0004f6e8ae' },
#     { "$oid": '60ac32f071c27e0004f6e8b5' },
#     { "$oid": '60ac32f071c27e0004f6e8b9' },
#     { "$oid": '60ac32f071c27e0004f6e8ba' },
#   ],
#   "updated_at": '2021-05-24T23:13:03.503Z'
# }

require 'http'
require 'json'

ROOT_URL = "https://august-interview.herokuapp.com/"

patient_zero = JSON.parse(HTTP.get("#{ROOT_URL}/students.json?first_name=Joseph&last_name=Smith").body)[0]
puts "Patient zero", patient_zero
affected_population = [patient_zero['id']] + patient_zero['sibling_ids']
puts "Affected population", affected_population
implicated_classes = affected_population.flat_map do |member|
  JSON.parse(HTTP.get("#{ROOT_URL}/groups.json?student=#{member['$oid']}").body)
end.uniq
puts "Classes are implicated", implicated_classes.map {|ic| ic['name']}

implicated_classes.each do |cls|
  puts "Class #{cls['name']} has #{cls['student_ids'].length} students"
  puts cls['student_ids']
  affected_population += cls['student_ids'] 
end
affected_population.uniq!
affected_students = affected_population.map do |student_id|
  JSON.parse(HTTP.get("#{ROOT_URL}/students.json?id=#{student_id['$oid']}").body)[0]
end

final_names = affected_students.map do |student|
  student['first_name'] + ' ' + student['last_name']
end
puts "#{final_names.length} students in total", final_names

